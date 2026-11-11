// Dados mockados e inicialização de gráficos para panorama.html e jornada.html
Chart.defaults.color = '#aeb7bf';
Chart.defaults.font.family = 'Alegreya Sans, Inter, sans-serif';
Chart.defaults.font.size = 11;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;
Chart.defaults.plugins.legend.labels.padding = 16;

const gold = '#d6ad62', blue = '#4e8cc8', red = '#b85b52';
const green = '#6c9d79', purple = '#8d78b9', slate = '#87939e';
const gridColor = 'rgba(183,193,201,.10)';
const baseOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' }, tooltip: { backgroundColor: '#10161d', borderColor: 'rgba(214,173,98,.35)', borderWidth: 1, titleColor: '#f0d18c', bodyColor: '#e8e3d8', padding: 11 } }
};

function doughnut(id, labels, data, colors) {
  const el = document.getElementById(id);
  if (!el) return null;
  return new Chart(el, { type:'doughnut', data:{ labels, datasets:[{data, backgroundColor:colors, borderColor:'#171e26', borderWidth:3, hoverOffset:7}] },
    options:{...baseOptions, cutout:'65%'} });
}

function bars(id, labels, data, color, horizontal=false) {
  const el = document.getElementById(id);
  if (!el) return null;
  return new Chart(el, { type:'bar', data:{ labels, datasets:[{data, backgroundColor:color, borderRadius:4, maxBarThickness:30}] },
    options:{...baseOptions, indexAxis: horizontal?'y':'x', plugins:{...baseOptions.plugins, legend:{display:false}},
      scales:{ x:{grid:{display:!horizontal, color:gridColor}, ticks:{color:'#aeb7bf'}, border:{display:false}},
               y:{grid:{display:horizontal, color:gridColor}, ticks:{color:'#aeb7bf'}, border:{display:false}, beginAtZero:true} } } });
}

// Valores mockados utilizados por ambas dashboards
const sample = {
  panorama: {
    total: 1284,
    faccao: { labels:['Horda','Aliança'], data:[54,46] },
    classes: { labels:['Caçador','Paladino','Mago','Guerreiro','Druida','Bruxo','Outras'], data:[22,17,16,14,12,10,9] },
    role: { labels:['DPS','Tank','Healer'], data:[60,22,18] },
    versao: { labels:['Retail','Classic','Ambos'], data:[58,27,15] }
  },
  jornada: {
    anos: { labels:['<1','1–3','4–6','7–10','>10'], data:[10,22,26,28,14] },
    personagens: { labels:['1–3','4–6','7–10','>10'], data:[30,35,23,12] },
    frequencia: { labels:['Todos os dias','4–6 dias/semana','2–3 dias/semana','1 dia/semana','Poucas vezes/mês','Raramente'], data:[36,22,18,12,8,4] },
    pve: { labels:['Masmorras','Raids','Mítica+','Mundo aberto','Coleções','Imersões'], data:[30,25,18,12,9,6] }
  }
};

// Inicializa gráficos do panorama
function initPanorama() {
  const k1 = document.getElementById('k1v');
  const k2 = document.getElementById('k2v');
  const k3 = document.getElementById('k3v');
  const k4 = document.getElementById('k4v');
  // Total de jogadores com classificação básica
  const total = sample.panorama.total;
  if (k1) {
    k1.textContent = total.toLocaleString();
    const k1c = document.getElementById('k1c');
    const k1s = document.getElementById('k1s');
    const k1sub = document.getElementById('k1sub');
    if (k1sub) k1sub.textContent = 'participantes';
    if (k1c) {
      if (total >= 2000) { k1c.className = 'chip good'; k1c.textContent = 'Muito alto' }
      else if (total >= 1000) { k1c.className = 'chip good'; k1c.textContent = 'Saudável' }
      else if (total >= 500) { k1c.className = 'chip warn'; k1c.textContent = 'Moderado' }
      else { k1c.className = 'chip bad'; k1c.textContent = 'Baixo' }
    }
    if (k1s) k1s.textContent = '68% dos usuarios cadastrados'
  }

  // Facção dominante
  const facIdx = sample.panorama.faccao.data.indexOf(Math.max(...sample.panorama.faccao.data));
  const facLabel = sample.panorama.faccao.labels[facIdx];
  const facPct = sample.panorama.faccao.data[facIdx];
  if (k2) {
    k2.textContent = facLabel + ' · ' + facPct + '%';
    const k2c = document.getElementById('k2c');
    const k2s = document.getElementById('k2s');
    const k2sub = document.getElementById('k2sub');
    if (k2sub) k2sub.textContent = 'participação';
    if (k2c) {
      if (facPct >= 60) { k2c.className='chip bad'; k2c.textContent='Desequilíbrio' }
      else if (facPct >= 53) { k2c.className='chip warn'; k2c.textContent='Leve vantagem' }
      else { k2c.className='chip good'; k2c.textContent='Equilíbrio' }
    }
    if (k2s) k2s.textContent = ''
  }

  // Classe dominante
  if (k3) {
    k3.textContent = sample.panorama.classes.labels[0] + ' · ' + sample.panorama.classes.data[0] + '%';
    const k3c = document.getElementById('k3c');
    const k3s = document.getElementById('k3s');
    const k3sub = document.getElementById('k3sub');
    if (k3sub) k3sub.textContent = 'preferência';
    if (k3c) {
      const top = sample.panorama.classes.data[0];
      if (top >= 35) { k3c.className='chip bad'; k3c.textContent='Concentração' }
      else if (top >= 25) { k3c.className='chip warn'; k3c.textContent='Popular' }
      else { k3c.className='chip good'; k3c.textContent='Diverso' }
    }
    if (k3s) k3s.textContent = '8% a mais que mago'
  }

  // Equilíbrio entre facções (diferença percentual)
  if (k4) {
    const diff = Math.abs(sample.panorama.faccao.data[0] - sample.panorama.faccao.data[1]);
    k4.textContent = diff + '%';
    const k4c = document.getElementById('k4c');
    const k4s = document.getElementById('k4s');
    const k4sub = document.getElementById('k4sub');
    if (k4sub) k4sub.textContent = 'diferença';
    if (k4c) {
      if (diff <= 5) { k4c.className='chip good'; k4c.textContent='Balanceado' }
      else if (diff <= 15) { k4c.className='chip warn'; k4c.textContent='Leve diverg.' }
      else { k4c.className='chip bad'; k4c.textContent='Desbalanceado' }
    }
    if (k4s) k4s.textContent = 'Proporção entre Horda e Aliança.'
  }

  doughnut('c-fac', sample.panorama.faccao.labels, sample.panorama.faccao.data, [red, blue]);
  bars('c-cls', sample.panorama.classes.labels, sample.panorama.classes.data, gold, true);
  doughnut('c-rol', sample.panorama.role.labels, sample.panorama.role.data, [red, blue, green]);
  doughnut('c-ver', sample.panorama.versao.labels, sample.panorama.versao.data, [gold, blue, slate]);
}

// Inicializa gráficos da jornada
function initJornada() {
  const k1 = document.getElementById('k1v');
  const k2 = document.getElementById('k2v');
  const k3 = document.getElementById('k3v');
  const k4 = document.getElementById('k4v');
  // Média de anos (estimativa a partir da distribuição)
  const anosMid = [0.5,2,5,8.5,12];
  const anosData = sample.jornada.anos.data;
  const totalPct = anosData.reduce((s,v)=>s+v,0)||1;
  const avgYears = anosData.reduce((s,v,i)=>s + v * anosMid[i],0)/totalPct;
  if (k1) {
    k1.textContent = avgYears.toFixed(1) + ' anos';
    const k1c = document.getElementById('k1c');
    const k1s = document.getElementById('k1s');
    const k1sub = document.getElementById('k1sub');
    if (k1sub) k1sub.textContent = 'média ponderada';
    if (k1c) { if (avgYears >= 7) { k1c.className='chip good'; k1c.textContent='Veteranos' } else if (avgYears >=3) { k1c.className='chip warn'; k1c.textContent='Experientes' } else { k1c.className='chip bad'; k1c.textContent='Novatos' } }
    if (k1s) k1s.textContent = ''
  }

  // Média de personagens por jogador
  const charMid = [2,5,8.5,12];
  const charsData = sample.jornada.personagens.data;
  const avgChars = charsData.reduce((s,v,i)=>s + v * charMid[i],0)/Math.max(charsData.reduce((s,v)=>s+v,0),1);
  if (k2) {
    k2.textContent = avgChars.toFixed(1) + ' personagens';
    const k2c = document.getElementById('k2c');
    const k2s = document.getElementById('k2s');
    const k2sub = document.getElementById('k2sub');
    if (k2sub) k2sub.textContent = 'média';
    if (k2c) { if (avgChars >= 6) { k2c.className='chip good'; k2c.textContent='Muito ativo' } else if (avgChars >=4) { k2c.className='chip warn'; k2c.textContent='Ativo' } else { k2c.className='chip bad'; k2c.textContent='Leve' } }
    if (k2s) k2s.textContent = ''
  }

  // Índice de atividade (score de 0 a 100)
  const freqWeights = [100,85,60,40,15,5]; // mapeia os rótulos da amostra
  const freqData = sample.jornada.frequencia.data;
  const activity = Math.round(freqData.reduce((s,v,i)=>s + v * freqWeights[i],0)/Math.max(freqData.reduce((s,v)=>s+v,0),1));
  if (k3) {
    k3.textContent = activity + '%';
    const k3c = document.getElementById('k3c');
    const k3s = document.getElementById('k3s');
    const k3sub = document.getElementById('k3sub');
    if (k3sub) k3sub.textContent = 'atividade estimada';
    if (k3c) { if (activity >= 75) { k3c.className='chip good'; k3c.textContent='Alto' } else if (activity >=45) { k3c.className='chip warn'; k3c.textContent='Moderado' } else { k3c.className='chip bad'; k3c.textContent='Baixo' } }
    if (k3s) k3s.textContent = '19% a mais que o mês anterior'
  }

  // Taxa de veteranos (>10 anos)
  const veteransPct = sample.jornada.anos.data[4] || 0;
  if (k4) {
    k4.textContent = veteransPct + '%';
    const k4c = document.getElementById('k4c');
    const k4s = document.getElementById('k4s');
    const k4sub = document.getElementById('k4sub');
    if (k4sub) k4sub.textContent = '>10 anos';
    if (k4c) { if (veteransPct >= 25) { k4c.className='chip good'; k4c.textContent='Alta' } else if (veteransPct >=12) { k4c.className='chip warn'; k4c.textContent='Média' } else { k4c.className='chip bad'; k4c.textContent='Baixa' } }
    if (k4s) k4s.textContent = 'Jogadores com 10 anos ou mais de jogo'
  }

  bars('c-anos', sample.jornada.anos.labels, sample.jornada.anos.data, gold);
  bars('c-chars', sample.jornada.personagens.labels, sample.jornada.personagens.data, purple);
  bars('c-freq', sample.jornada.frequencia.labels, sample.jornada.frequencia.data, blue);
  bars('c-pve', sample.jornada.pve.labels, sample.jornada.pve.data, green);

  // Remove a mensagem de vazio se houver gráficos
  const vazio = document.getElementById('vazio');
  if (vazio) vazio.style.display = 'none';
}

// Nota no topo
const nota = document.getElementById('notaTxt');
if (nota) nota.textContent = 'Dados fictícios — demonstração';

// Detecta quais gráficos existem e inicializa o que for necessário
document.addEventListener('DOMContentLoaded', ()=>{
  // panorama
  if (document.getElementById('c-cls') || document.getElementById('c-fac') || document.getElementById('c-ver') || document.getElementById('c-rol')) initPanorama();
  // jornada
  if (document.getElementById('c-freq') || document.getElementById('c-pve') || document.getElementById('c-anos') || document.getElementById('c-chars')) initJornada();
});
