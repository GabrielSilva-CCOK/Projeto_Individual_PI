/* dashboard.js — dados, indicadores e gráficos das duas dashboards do formulário de opinião
   (Panorama de Azeroth e Opinião dos Jogadores). Substitui o antigo sample-data.js.

   Cada gráfico mostra o resultado de UMA pergunta do formulário, sem cruzamentos nem filtros.

   Fonte dos dados, nesta ordem:
     1. CONFIG.API_URL (JSON: array de objetos com as colunas abaixo), se preenchida;
     2. CONFIG.CSV_URL (respostas.csv na mesma pasta), se o site rodar em servidor HTTP;
     3. CSV carregado manualmente ou dados de demonstração (guardados só na sessão do navegador).

    Colunas esperadas (CSV ou JSON):
      data;faccao;versao;classe;role;satisfacao;recomendacao;atrativo;melhoria;guilda
*/
(function () {
  'use strict';

  /* ===================== Configuração ===================== */
  const CONFIG = {
    API_URL: '',               // ex.: '/api/respostas'
    CSV_URL: 'respostas.csv',
    AMOSTRA_MINIMA: 30         // abaixo disso a amostra é sinalizada como pequena
  };

  /* Domínios das perguntas (os textos das opções do formulário devem ser exatamente estes) */
  const DOM = {
    classes: ['Guerreiro', 'Paladino', 'Caçador', 'Ladino', 'Sacerdote', 'Cavaleiro da Morte', 'Xamã',
      'Mago', 'Bruxo', 'Monge', 'Druida', 'Caçador de Demônios', 'Evocador'],
    faccoes: ['Horda', 'Aliança', 'Sem preferência'],
    versoes: ['Retail', 'Classic', 'Ambas'],
    anos: ['<1', '1–3', '4–6', '7–10', '>10'],
    roles: ['Tank', 'Healer', 'DPS'],
    atrativo: ['Masmorras', 'Raids', 'Mítica+', 'Mundo aberto', 'Coleções', 'PvP', 'Amigos e guilda'],
    melhoria: ['Custos', 'Tempo exigido', 'Balanceamento', 'Comunidade tóxica', 'Falta de novidades', 'Bugs e desempenho', 'Nada a melhorar'],
    guilda: ['Sim', 'Não', 'Já participei']
  };

  /* ===================== Utilidades ===================== */
  const fmt = (v, d = 0) => v.toLocaleString('pt-BR', { maximumFractionDigits: d });
  const fmtP = (a, b) => (b ? fmt(a / b * 100, 0) + '%' : '—');
  const soma = a => a.reduce((x, y) => x + y, 0);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const contar = (d, k, dom) => dom.map(v => d.reduce((a, r) => a + (r[k] === v ? 1 : 0), 0));
  const valores = (d, k) => d.map(r => r[k]).filter(x => x !== null);
  /* margem de erro (95%) de uma proporção, em pontos percentuais, no pior caso (p = 50%) */
  const ep95 = n => (n ? 1.96 * Math.sqrt(0.25 / n) * 100 : 0);
  /* a diferença entre duas categorias da MESMA amostra é maior que o acaso? */
  const diffSig = (a, b, n) => {
    if (!n) return false;
    const p1 = a / n, p2 = b / n;
    const se = Math.sqrt(Math.max(p1 + p2 - (p1 - p2) ** 2, 0) / n);
    return se > 0 ? Math.abs(p1 - p2) > 1.96 * se : p1 !== p2;
  };
  /* índices de ordenação (maior primeiro) de uma lista de contagens */
  const ranking = cont => cont.map((_, i) => i).sort((a, b) => cont[b] - cont[a]);

  /* ===================== Normalização das respostas ===================== */
  const semAcento = s => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
  const mapa = (lista, extras) => {
    const m = new Map(lista.map(v => [semAcento(v), v]));
    Object.keys(extras || {}).forEach(k => m.set(semAcento(k), extras[k]));
    return s => { const v = m.get(semAcento(s)); return v === undefined ? null : v; };
  };
  const normFaccao = mapa(DOM.faccoes, { Nenhuma: 'Sem preferência', Neutro: 'Sem preferência', Neutra: 'Sem preferência' });
  const normVersao = mapa(DOM.versoes, { 'WoW Retail': 'Retail', 'WoW Classic': 'Classic', 'Retail e Classic': 'Ambas' });
  const normClasse = mapa(DOM.classes, { 'Death Knight': 'Cavaleiro da Morte', DK: 'Cavaleiro da Morte', Evoker: 'Evocador' });
  const normRole = mapa(DOM.roles);
  const normAtrativo = mapa(DOM.atrativo);
  const normAnos = mapa(DOM.anos);
  const normMelhoria = mapa(DOM.melhoria);
  const normGuilda = mapa(DOM.guilda, { 'Ja participei': 'Já participei', 'Ja': 'Sim' });
  const inteiro = (v, min, max) => {
    if (v === null || v === undefined || String(v).trim() === '') return null;
    const x = Number(String(v).replace(',', '.'));
    if (!Number.isFinite(x)) return null;
    const i = Math.floor(x);
    return i >= min && i <= max ? i : null;
  };
  const parseData = v => {
    if (!v) return null;
    const m = String(v).match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    const d = m ? new Date(+m[3], +m[2] - 1, +m[1]) : new Date(v);
    return isNaN(d) ? null : d;
  };
  function normalizar(r) {
    return {
      data: parseData(r.data),
      faccao: normFaccao(r.faccao),
      versao: normVersao(r.versao),
      classe: normClasse(r.classe),
      role: normRole(r.role),
      satisfacao: inteiro(r.satisfacao, 1, 5),
      recomendacao: inteiro(r.recomendacao, 0, 10),
      atrativo: normAtrativo(r.atrativo),
      melhoria: normMelhoria(r.melhoria),
      guilda: normGuilda(r.guilda),
      anos: normAnos(r.anos)
    };
  }

  /* ===================== CSV ===================== */
  function parseCSV(txt) {
    txt = txt.replace(/^﻿/, '');
    const primeira = txt.split(/\r?\n/, 1)[0];
    const sep = (primeira.match(/;/g) || []).length > (primeira.match(/,/g) || []).length ? ';' : ',';
    const rows = []; let row = [], cel = '', aspas = false;
    const fim = () => { row.push(cel); cel = ''; if (row.some(x => x.trim() !== '')) rows.push(row); row = []; };
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];
      if (aspas) {
        if (c === '"') { if (txt[i + 1] === '"') { cel += '"'; i++; } else aspas = false; } else cel += c;
      } else if (c === '"') aspas = true;
      else if (c === sep) { row.push(cel); cel = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && txt[i + 1] === '\n') i++; fim(); }
      else cel += c;
    }
    if (cel !== '' || row.length) fim();
    if (!rows.length) return [];
    const cab = rows.shift().map(h => semAcento(h).replace(/\s+/g, '_'));
    return rows.map(r => Object.fromEntries(cab.map((h, i) => [h, r[i] === undefined ? '' : r[i]])));
  }
  function validarCSV(rows) {
    const esperadas = ['faccao', 'versao', 'classe', 'role', 'satisfacao', 'recomendacao', 'atrativo', 'melhoria', 'guilda', 'anos'];
    if (!rows.length || !esperadas.some(k => k in rows[0])) {
      throw new Error('CSV sem as colunas esperadas — veja "Como ler".');
    }
  }

  /* ===================== Dados de demonstração (NÃO são respostas reais) ===================== */
  function gerarDemo(n) {
    let s = 20261120;
    const rnd = () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const pick = (l, p) => { let x = rnd() * soma(p); for (let i = 0; i < l.length; i++) { x -= p[i]; if (x < 0) return l[i]; } return l[l.length - 1]; };
    const agora = Date.now();
    return Array.from({ length: n || 180 }, () => ({
      data: new Date(agora - rnd() * 60 * 864e5).toISOString(),
      faccao: pick(DOM.faccoes, [48, 42, 10]),
      versao: pick(DOM.versoes, [55, 30, 15]),
      classe: pick(DOM.classes, [9, 8, 8, 6, 6, 9, 7, 8, 6, 5, 7, 6, 4]),
      role: pick(DOM.roles, [20, 22, 58]),
      satisfacao: pick([1, 2, 3, 4, 5], [4, 9, 20, 38, 29]),
      recomendacao: pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [2, 1, 2, 3, 3, 6, 8, 14, 20, 19, 22]),
      atrativo: pick(DOM.atrativo, [30, 22, 18, 12, 10, 8, 5]),
      guilda: pick(DOM.guilda, [54, 36, 10]),
      anos: pick(DOM.anos, [10,22,26,28,14]),
      melhoria: pick(DOM.melhoria, [16, 18, 20, 14, 16, 12, 4])
    }));
  }

  /* ===================== Estado e armazenamento ===================== */
  const CHAVE = 'dash_dados';
  let TODOS = [], FONTE = null;
  const el = id => document.getElementById(id);
  const guardar = (fonte, rows) => { try { sessionStorage.setItem(CHAVE, JSON.stringify({ fonte, rows })); } catch (e) { /* sem storage */ } };
  const ler = () => { try { return JSON.parse(sessionStorage.getItem(CHAVE)); } catch (e) { return null; } };
  const definir = (fonte, rows) => { FONTE = fonte; TODOS = rows.map(normalizar); };

  async function buscarRemoto() {
    try {
      if (CONFIG.API_URL) {
        const r = await fetch(CONFIG.API_URL, { credentials: 'same-origin' });
        if (!r.ok) throw new Error('http');
        return { fonte: { nome: 'API', demo: false }, rows: await r.json() };
      }
      const r = await fetch(CONFIG.CSV_URL, { cache: 'no-store' });
      if (!r.ok) throw new Error('http');
      return { fonte: { nome: 'respostas.csv', demo: false }, rows: parseCSV(await r.text()) };
    } catch (e) { return null; }
  }

  /* ===================== Gráficos ===================== */
  const instancias = {};
  let C = {};
  function cores() {
    const css = getComputedStyle(document.documentElement);
    const v = n => css.getPropertyValue(n).trim();
    C = {
      ink: v('--ink'), ink2: v('--ink-2'), muted: v('--muted'), gold: v('--gold'), line: v('--line'), track: v('--track'),
      horde: v('--horde'), alliance: v('--alliance'), retail: v('--retail'), classic: v('--classic'), goldDim: v('--gold-dim'),
      tank: v('--tank'), healer: v('--healer'), dps: v('--dps'), good: v('--good'), warn: v('--warn'), bad: v('--bad')
    };
    return C;
  }
  const FONTE_FAMILIA = () => getComputedStyle(document.body).fontFamily;

  /* escreve "% (n)" na ponta de cada barra */
  function pluginPontas(horiz, textos) {
    return {
      id: 'pontas',
      afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = '700 11px ' + FONTE_FAMILIA();
        ctx.fillStyle = C.ink2;
        ctx.textAlign = horiz ? 'left' : 'center';
        ctx.textBaseline = horiz ? 'middle' : 'bottom';
        chart.getDatasetMeta(0).data.forEach((b, i) => ctx.fillText(textos[i], horiz ? b.x + 6 : b.x, horiz ? b.y : b.y - 6));
        ctx.restore();
      }
    };
  }

  /* Um gráfico = uma pergunta. Barras mostram a % de respondentes de cada opção. */
  function barras(id, o) {
    const horiz = (o.eixo || 'y') === 'y';
    if (instancias[id]) instancias[id].destroy();
    const total = soma(o.valores);
    const pct = o.valores.map(v => (total ? v / total * 100 : 0));
    const textos = o.valores.map((v, i) => fmt(pct[i], 0) + '%');
    instancias[id] = new Chart(el(id), {
      type: 'bar',
      data: { labels: o.rotulos, datasets: [{ label: 'Respondentes', data: pct, n: o.valores, backgroundColor: o.cores, borderWidth: 0, maxBarThickness: 38 }] },
      plugins: [pluginPontas(horiz, textos)],
      options: {
        indexAxis: horiz ? 'y' : 'x', responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
        layout: { padding: horiz ? { right: 70 } : { top: 20 } },
        scales: {
          [horiz ? 'y' : 'x']: {
            grid: { display: false }, border: { color: C.line }, ticks: { color: C.ink, font: { size: 12 } },
            title: { display: !!o.tituloEixo, text: o.tituloEixo || '', color: C.muted }
          },
          [horiz ? 'x' : 'y']: {
            beginAtZero: true, grid: { color: C.track }, border: { display: false },
            ticks: { color: C.ink2, callback: v => v + '%' }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => fmt(c.parsed[horiz ? 'x' : 'y'], 1) + '% · ' + c.dataset.n[c.dataIndex] + ' resposta(s)' } }
        }
      }
    });
  }

  /* ===================== KPIs ===================== */
  function kpi(i, k) {
    const v = el('k' + i + 'v');
    v.innerHTML = '<span class="vt">' + esc(k.valor) + '</span>' + (k.sub ? ' <small>' + esc(k.sub) + '</small>' : '');
    v.title = (k.valor + ' ' + (k.sub || '')).trim();
    el('k' + i + 's').textContent = k.nota || '';
    const c = el('k' + i + 'c');
    c.textContent = k.chip || '';
    c.className = 'chip' + (k.cls ? ' ' + k.cls : '');
    c.parentElement.title = ((k.chip || '') + ' ' + (k.nota || '')).trim();
  }
  const limparKpis = () => [1, 2, 3, 4].forEach(i => kpi(i, { valor: '—' }));
  const sub = (id, txt) => { el(id).textContent = txt; };

  /* KPI "opção mais votada" de uma pergunta de escolha única */
  function kpiTopo(i, d, campo, dom) {
    const c = contar(d, campo, dom), n = soma(c);
    if (!n) return kpi(i, { valor: '—' });
    const o = ranking(c);
    kpi(i, {
      valor: dom[o[0]], sub: fmtP(c[o[0]], n),
      nota: '2º ' + dom[o[1]] + ' ' + fmtP(c[o[1]], n),
      chip: 'n=' + n
    });
  }

  /* ===================== Página: Panorama de Azeroth ===================== */
  function panorama(d) {
    const MIN = CONFIG.AMOSTRA_MINIMA, n = d.length;

    /* KPI 1 — tamanho da amostra e margem de erro */
    const ultima = d.reduce((m, r) => (r.data && (!m || r.data > m) ? r.data : m), null);
    kpi(1, {
      valor: fmt(n), sub: n === 1 ? 'resposta' : 'respostas',
      nota: ultima ? 'Última resposta: ' + ultima.toLocaleDateString('pt-BR') : 'Sem data de resposta',
      chip: n < MIN ? 'Amostra pequena' : '±' + fmt(ep95(n)) + ' p.p.', cls: n < MIN ? 'warn' : ''
    });

    /* KPI 2 — Conteúdo preferido (atrativo) */
    kpiTopo(2, d, 'atrativo', DOM.atrativo);

    /* KPI 3 — jogadores em guildas: número exato e % em relação ao total de respostas */
    const cg = contar(d, 'guilda', DOM.guilda), ng = soma(cg);
    if (ng) {
      const idxSim = DOM.guilda.indexOf('Sim');
      const simCount = idxSim !== -1 ? cg[idxSim] : 0;
      kpi(3, {
        valor: fmt(simCount), sub: fmtP(simCount, n) + ' do total',
        nota: 'respostas válidas: ' + ng, chip: 'n=' + ng
      });
    } else kpi(3, { valor: '—' });

    /* classe favorita e concentração (mantido nos gráficos) */
    const cc = contar(d, 'classe', DOM.classes), nc = soma(cc), ordC = ranking(cc);

    /* KPI 4 — versão mais jogada */
    /* KPI 4 — taxa de veteranos (>10 anos de experiência) */
    const ca = contar(d, 'anos', DOM.anos), na = soma(ca);
    if (na) {
      const vetIdx = DOM.anos.indexOf('>10');
      const vetCount = vetIdx !== -1 ? ca[vetIdx] : 0;
      kpi(4, {
        valor: fmtP(vetCount, n), sub: '>10 anos (veteranos)',
        nota: 'respostas válidas: ' + na, chip: 'n=' + na
      });
    } else kpi(4, { valor: '—' });

    /* Gráficos — um por pergunta */
    barras('c-cls', { rotulos: ordC.map(i => DOM.classes[i]), valores: ordC.map(i => cc[i]), cores: C.gold });
    sub('cls-sub', 'Qual é sua classe favorita · n=' + nc);
    barras('c-fac', { rotulos: DOM.faccoes, valores: cf, cores: [C.horde, C.alliance, C.muted] });
    sub('s-fac', 'Qual é sua facção favorita · n=' + nf);
    barras('c-ver', { rotulos: DOM.versoes, valores: cv, cores: [C.retail, C.classic, C.goldDim] });
    sub('s-ver', 'Qual versão do jogo você joga · n=' + nv);
    const cr = contar(d, 'role', DOM.roles);
    barras('c-rol', { rotulos: DOM.roles, valores: cr, cores: [C.tank, C.healer, C.dps] });
    sub('s-rol', 'Qual é a sua role favorita · n=' + soma(cr));
  }

  /* ===================== Página: Opinião dos Jogadores ===================== */
  function opiniao(d) {
    /* KPI 1 — satisfação média (escala 1 a 5) */
    const sat = valores(d, 'satisfacao');
    if (sat.length) {
      kpi(1, {
        valor: fmt(soma(sat) / sat.length, 1), sub: 'de 5',
        nota: fmtP(sat.filter(x => x >= 4).length, sat.length) + ' satisfeitos (nota 4 ou 5)', chip: 'n=' + sat.length
      });
    } else kpi(1, { valor: '—' });

    /* KPI 2 — NPS (nota de recomendação 0 a 10) */
    const rec = valores(d, 'recomendacao');
    if (rec.length) {
      const prom = rec.filter(x => x >= 9).length, det = rec.filter(x => x <= 6).length;
      const nps = (prom - det) / rec.length * 100;
      kpi(2, {
        valor: (nps > 0 ? '+' : '') + fmt(nps, 0), sub: 'NPS',
        nota: 'Promotores ' + fmtP(prom, rec.length) + ' · Detratores ' + fmtP(det, rec.length), chip: 'n=' + rec.length
      });
    } else kpi(2, { valor: '—' });

    /* KPI 3 e 4 — opção mais votada */
    kpiTopo(3, d, 'atrativo', DOM.atrativo);
    kpiTopo(4, d, 'melhoria', DOM.melhoria);

    /* Gráfico — satisfação (ordinal: mantém a ordem natural) */
    const cs = [1, 2, 3, 4, 5].map(k => sat.filter(x => x === k).length);
    barras('c-sat', {
      eixo: 'x', rotulos: ['1', '2', '3', '4', '5'], valores: cs, cores: [C.bad, C.bad, C.warn, C.good, C.good],
      tituloEixo: 'nota (1 = muito insatisfeito, 5 = muito satisfeito)'
    });
    sub('s-sat', 'Quão satisfeito você está com o WoW hoje · n=' + sat.length);

    /* Gráfico — recomendação (cores = grupos do NPS) */
    const cn = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => rec.filter(x => x === k).length);
    barras('c-nps', {
      eixo: 'x', rotulos: cn.map((_, k) => String(k)), valores: cn,
      cores: cn.map((_, k) => (k <= 6 ? C.bad : k <= 8 ? C.warn : C.good)), tituloEixo: 'chance de recomendar (0 a 10)'
    });
    sub('s-nps', 'Detratores 0–6 · Neutros 7–8 · Promotores 9–10 · n=' + rec.length);

    /* Gráficos — rankings (opções sem ordem natural: da mais votada para a menos) */
    [['c-atr', 's-atr', 'atrativo', 'O que mais prende você no jogo'], ['c-mel', 's-mel', 'melhoria', 'O que mais precisa melhorar']].forEach(([cv, sid, campo, txt]) => {
      const c = contar(d, campo, DOM[campo]), o = ranking(c);
      barras(cv, { rotulos: o.map(i => DOM[campo][i]), valores: o.map(i => c[i]), cores: C.gold });
      sub(sid, txt + ' · n=' + soma(c));
    });
  }

  const PAGINAS = { panorama, opiniao };

  /* ===================== Render e eventos ===================== */
  function atualizarFonte() {
    const e = el('fonte');
    if (!e) return;
    e.className = 'stat' + (FONTE && FONTE.demo ? ' demo' : '');
    e.textContent = FONTE ? (FONTE.demo ? '⚠ Dados de demonstração — não são respostas reais' : 'Fonte: ' + FONTE.nome) : '';
  }
  function erroFonte(msg) { const e = el('fonte'); if (e) { e.className = 'stat err'; e.textContent = msg; } }

  function render() {
    atualizarFonte();
    if (!TODOS.length) {
      limparKpis();
      el('vazio').hidden = false;
      return;
    }
    el('vazio').hidden = true;
    cores();
    PAGINAS[document.body.dataset.page](TODOS);
  }

  async function iniciar() {
    if (typeof Chart === 'undefined') { erroFonte('Não foi possível carregar a biblioteca de gráficos (Chart.js).'); return; }
    Chart.defaults.font.family = FONTE_FAMILIA();
    Chart.defaults.color = '#c0b498';
    Chart.defaults.devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    el('csv').addEventListener('change', async ev => {
      const f = ev.target.files[0];
      if (!f) return;
      try {
        const rows = parseCSV(await f.text());
        validarCSV(rows);
        const fonte = { nome: f.name, demo: false };
        definir(fonte, rows); guardar(fonte, rows); render();
      } catch (e) { erroFonte(e.message); }
      ev.target.value = '';
    });
    el('demo').addEventListener('click', () => {
      const rows = gerarDemo(180), fonte = { nome: 'demonstração', demo: true };
      definir(fonte, rows); guardar(fonte, rows); render();
    });

    const origem = (await buscarRemoto()) || ler();
    if (origem) definir(origem.fonte, origem.rows);
    render();
  }

  /* ===================== Cabeçalho do site e login ===================== */
  window.deslogar = function () { sessionStorage.clear(); window.location.href = '../index.html'; };
  window.VerificarLogado = function () {
    const logado = !!sessionStorage.ID_USUARIO;
    const links = '<div class="links">' +
      '<a href="../index.html">Pagina Inicial</a><a href="../jornada.html">Minha jornada</a>' +
      '<a href="../historia.html">Historia</a><a href="../conteudo.html">Conteúdo</a><a href="../classes.html">Classes</a></div>';
    const logo = '<a class="logo" href="../index.html"><img width="100" src="../assets/logo.png" alt="Tales of Azeroth"></a>';
    const acoes = logado
      ? '<button class="primary" onclick="window.location.href=\'panorama.html\'">Dashboard</button><button onclick="deslogar()">Sair</button>'
      : '<button onclick="window.location.href=\'../cadastro/login.html\'">Entrar</button><button class="primary" onclick="window.location.href=\'../cadastro/cadastro.html\'">Criar conta</button>';
    el('Header').innerHTML = '<nav class="wrap">' + logo + links + '<div class="actions">' + acoes + '</div></nav>';
    if (!logado) {
      if (confirm('Você precisa estar logado para acessar a dashboard. Deseja entrar agora?')) window.location.href = '../cadastro/login.html';
      else window.location.href = '../index.html';
    }
  };

  iniciar();
})();
