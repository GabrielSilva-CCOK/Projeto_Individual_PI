(() => {
  const data = dashboardData;
  const total = data.responses || 0;
  const pct = (n, d) => d ? Math.round(n / d * 100) : 0;
  const fmt = n => `${n.toLocaleString('pt-BR')}`;
  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  const setBar = (id, percent) => { const el = document.getElementById(id); if (el) el.style.width = `${Math.max(0, Math.min(100, percent))}%`; };

  const responsePct = pct(total, data.registeredUsers);
  const topContent = [...data.preferredContent].sort((a,b) => b.votes-a.votes)[0] || {label:'—',votes:0};
  const guildPct = pct(data.guild.yes, total);
  const veteranPct = pct(data.veteranPlayers, total);
  setText('responses', fmt(total)); setText('responseRate', `${responsePct}%`); setBar('responseBar', responsePct);
  setText('topContent', topContent.label); setText('topContentRate', `${pct(topContent.votes,total)}%`); setBar('contentBar', pct(topContent.votes,total));
  setText('guildRate', `${guildPct}%`); setText('guildCount', fmt(data.guild.yes)); setBar('guildBar', guildPct);
  setText('veteranRate', `${veteranPct}%`); setBar('veteranBar', veteranPct);
  setText('classTotal', `${data.classes.reduce((sum,c)=>sum+c.votes,0)} votos`);

  Chart.defaults.color = '#aeb9c8'; Chart.defaults.font.family = 'Inter, Arial, sans-serif'; Chart.defaults.font.size = 10;
  const tooltip = { backgroundColor:'#07111d', borderColor:'rgba(213,179,106,.4)', borderWidth:1, titleColor:'#f1d28a', bodyColor:'#e6e0d4', padding:10 };
  new Chart(document.getElementById('classesChart'), { type:'bar', data:{labels:data.classes.map(x=>x.label), datasets:[{data:data.classes.map(x=>x.votes),backgroundColor:'rgba(190,151,75,.8)',borderColor:'#d5b36a',borderWidth:1,borderRadius:3,maxBarThickness:24}]}, options:{maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false},tooltip:{...tooltip,callbacks:{label:c=>` ${c.raw} votos`}}},scales:{x:{beginAtZero:true,grid:{color:'rgba(145,165,185,.12)'},ticks:{precision:0}},y:{grid:{display:false},ticks:{color:'#d1c5ad'}}}}});
  const gold='#d5b36a', blue='#559fd0', red='#b76859', purple='#9179bd', teal='#68aaa1';
  function doughnut(canvasId, chartData, colors, footId){
    const sum=chartData.values.reduce((a,b)=>a+b,0);
    new Chart(document.getElementById(canvasId),{type:'doughnut',data:{labels:chartData.labels,datasets:[{data:chartData.values,backgroundColor:colors,borderColor:'#101b2b',borderWidth:3,hoverOffset:5}]},options:{maintainAspectRatio:false,cutout:'64%',plugins:{legend:{position:'bottom',labels:{color:'#c4cbd4',padding:12,usePointStyle:true,pointStyle:'circle',boxWidth:7}},tooltip:{...tooltip,callbacks:{label:c=>` ${c.label}: ${c.raw} (${Math.round(c.raw/sum*100)}%)`}}}}});
    const el=document.getElementById(footId); if(el) el.textContent=`${sum} respostas · ${chartData.labels.map((l,i)=>`${l} ${Math.round(chartData.values[i]/sum*100)}%`).join('  /  ')}`;
  }
  doughnut('factionChart',data.faction,[blue,red],'factionFoot');
  doughnut('roleChart',data.role,[gold,blue,teal],'roleFoot');
  doughnut('versionChart',data.version,[gold,purple,blue],'versionFoot');
})();
