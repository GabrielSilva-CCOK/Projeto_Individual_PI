// Dados fictícios para demonstração. Substitua pelos dados reais do formulário.
const dashboardData = {
  registeredUsers: 240,
  responses: 156,
  preferredContent: [
    { label: 'Lore e história', votes: 52 },
    { label: 'Guias e dicas', votes: 38 },
    { label: 'Notícias', votes: 29 },
    { label: 'Comunidade', votes: 21 },
    { label: 'Eventos', votes: 16 }
  ],
  guild: { yes: 118, no: 38 },
  veteranPlayers: 61, // jogadores com 10 anos ou mais de experiência
  classes: [
    { label: 'Paladino', votes: 24 }, { label: 'Mago', votes: 20 },
    { label: 'Caçador', votes: 18 }, { label: 'Druida', votes: 17 },
    { label: 'Guerreiro', votes: 16 }, { label: 'Sacerdote', votes: 15 },
    { label: 'Bruxo', votes: 13 }, { label: 'Ladino', votes: 12 },
    { label: 'Xamã', votes: 11 }, { label: 'Monge', votes: 5 },
    { label: 'Evocador', votes: 5 }
  ],
  faction: { labels: ['Aliança', 'Horda'], values: [83, 73] },
  role: { labels: ['DPS', 'Tank', 'Healer'], values: [91, 36, 29] },
  version: { labels: ['Retail', 'Classic', 'Ambas'], values: [68, 47, 41] }
};
