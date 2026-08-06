/* Cinefly — Catálogo de conteúdo (mock) */
const CINEFLY_CATALOG = [
  {
    id: 'm1',
    title: 'Horizonte Noturno',
    type: 'filme',
    year: 2024,
    rating: 8.7,
    duration: '2h 18min',
    genres: ['ficção', 'thriller'],
    synopsis: 'Um piloto de drones descobre uma conspiração global enquanto rastreia sinais misteriosos no céu noturno.',
    poster: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=80',
    featured: true,
    trending: true,
    rank: 1
  },
  {
    id: 's1',
    title: 'Código Aurora',
    type: 'série',
    year: 2025,
    rating: 9.1,
    duration: '3 temporadas',
    genres: ['drama', 'sci-fi'],
    synopsis: 'Cientistas de uma estação orbital enfrentam um fenômeno que reescreve a realidade a cada amanhecer.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1538115081112-32c7d8401807?w=1400&q=80',
    featured: true,
    trending: true,
    rank: 2
  },
  {
    id: 'd1',
    title: 'Planeta Vivo',
    type: 'documentário',
    year: 2023,
    rating: 8.9,
    duration: '1h 42min',
    genres: ['natureza', 'ciência'],
    synopsis: 'Uma jornada visual pelas últimas fronteiras selvagens da Terra, narrada com sensibilidade e espetáculo.',
    poster: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80',
    trending: true,
    rank: 3
  },
  {
    id: 'm2',
    title: 'Luzes de Marfim',
    type: 'filme',
    year: 2024,
    rating: 8.2,
    duration: '1h 56min',
    genres: ['drama', 'romance'],
    synopsis: 'Em uma cidade costeira, duas gerações se reencontram através de um cinema abandonado.',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&q=80',
    trending: true,
    rank: 4
  },
  {
    id: 's2',
    title: 'Sombras do Vale',
    type: 'série',
    year: 2024,
    rating: 8.5,
    duration: '2 temporadas',
    genres: ['suspense', 'crime'],
    synopsis: 'Uma detetive rural investiga desaparecimentos ligados a lendas locais e segredos de família.',
    poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1755386228574-d431a8699f91?w=1400&q=80',
    trending: true,
    rank: 5
  },
  {
    id: 'm3',
    title: 'Velocidade Zero',
    type: 'filme',
    year: 2025,
    rating: 7.9,
    duration: '2h 05min',
    genres: ['ação', 'aventura'],
    synopsis: 'Quando o tempo congela em uma metrópole, um mensageiro precisa atravessar a cidade em 60 minutos reais.',
    poster: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1771383437526-202908ad2639?w=1400&q=80',
    trending: true,
    rank: 6
  },
  {
    id: 'd2',
    title: 'Arquitetos do Som',
    type: 'documentário',
    year: 2024,
    rating: 8.4,
    duration: '1h 28min',
    genres: ['música', 'arte'],
    synopsis: 'Bastidores de compositores que criam trilhas sonoras icônicas para o cinema contemporâneo.',
    poster: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=80'
  },
  {
    id: 's3',
    title: 'Estação Polar',
    type: 'série',
    year: 2023,
    rating: 8.8,
    duration: '1 temporada',
    genres: ['thriller', 'mistério'],
    synopsis: 'Uma equipe isolada no Ártico encontra um sinal de rádio que não deveria existir.',
    poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80'
  },
  {
    id: 'm4',
    title: 'O Último Frame',
    type: 'filme',
    year: 2022,
    rating: 9.0,
    duration: '2h 12min',
    genres: ['drama', 'mistério'],
    synopsis: 'Um editor de cinema reconstitui a vida de um diretor desaparecido através de bobinas inéditas.',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1400&q=80'
  },
  {
    id: 'd3',
    title: 'Cidades Invisíveis',
    type: 'documentário',
    year: 2025,
    rating: 8.1,
    duration: '1h 35min',
    genres: ['sociedade', 'urbano'],
    synopsis: 'Retratos íntimos de comunidades que reinventam o cotidiano nas megacidades do século XXI.',
    poster: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1400&q=80'
  },
  {
    id: 'm5',
    title: 'Asas de Cristal',
    type: 'filme',
    year: 2024,
    rating: 7.6,
    duration: '1h 48min',
    genres: ['fantasia', 'aventura'],
    synopsis: 'Uma jovem aviadora descobre um arquipélago flutuante onde o tempo flui ao contrário.',
    poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80'
  },
  {
    id: 's4',
    title: 'Frequência 7',
    type: 'série',
    year: 2025,
    rating: 8.3,
    duration: '1 temporada',
    genres: ['sci-fi', 'drama'],
    synopsis: 'Sete estranhos acordam sintonizados na mesma frequência mental — e alguém está ouvindo.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1400&q=80'
  },
  {
    id: 'm6',
    title: 'Noite em São Luís',
    type: 'filme',
    year: 2023,
    rating: 8.0,
    duration: '1h 52min',
    genres: ['drama', 'crime'],
    synopsis: 'Um taxista noturno se envolve em uma trama de corrupção após uma corrida fatal.',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1400&q=80'
  },
  {
    id: 'd4',
    title: 'Oceano Profundo',
    type: 'documentário',
    year: 2024,
    rating: 9.2,
    duration: '1h 50min',
    genres: ['natureza', 'ciência'],
    synopsis: 'Expedição às fossas abissais revela criaturas e ecossistemas nunca filmados antes.',
    poster: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1400&q=80'
  },
  {
    id: 's5',
    title: 'Hotel Eterno',
    type: 'série',
    year: 2022,
    rating: 8.6,
    duration: '2 temporadas',
    genres: ['fantasia', 'drama'],
    synopsis: 'Hóspedes de um hotel boutique descobrem que cada andar corresponde a uma década diferente.',
    poster: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&q=80'
  },
  {
    id: 'm7',
    title: 'Rota 88',
    type: 'filme',
    year: 2025,
    rating: 7.8,
    duration: '2h 01min',
    genres: ['ação', 'thriller'],
    synopsis: 'Uma corrida clandestina atravessa o país — o prêmio é liberdade, o custo é tudo.',
    poster: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=600&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80'
  }
];

const CATEGORIES = [
  { id: 'todos', label: 'Tudo', emoji: '✨' },
  { id: 'filme', label: 'Filmes', emoji: '🎬' },
  { id: 'série', label: 'Séries', emoji: '📺' },
  { id: 'documentário', label: 'Documentários', emoji: '🎞️' },
  { id: 'ação', label: 'Ação', emoji: '💥' },
  { id: 'drama', label: 'Drama', emoji: '🎭' },
  { id: 'sci-fi', label: 'Sci-Fi', emoji: '🚀' },
  { id: 'thriller', label: 'Thriller', emoji: '🔦' },
  { id: 'natureza', label: 'Natureza', emoji: '🌍' }
];

function getById(id) {
  return CINEFLY_CATALOG.find((item) => item.id === id);
}

function getFeatured() {
  return CINEFLY_CATALOG.filter((item) => item.featured);
}

function getTrending() {
  return CINEFLY_CATALOG.filter((item) => item.trending).sort((a, b) => (a.rank || 99) - (b.rank || 99));
}

function getByType(type) {
  return CINEFLY_CATALOG.filter((item) => item.type === type);
}

function getByGenre(genre) {
  return CINEFLY_CATALOG.filter((item) => item.genres.includes(genre));
}

function searchCatalog(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CINEFLY_CATALOG.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.type.includes(q) ||
      item.genres.some((g) => g.includes(q)) ||
      item.synopsis.toLowerCase().includes(q)
  );
}

function filterCatalog(categoryId) {
  if (!categoryId || categoryId === 'todos') return [...CINEFLY_CATALOG];
  if (['filme', 'série', 'documentário'].includes(categoryId)) return getByType(categoryId);
  return getByGenre(categoryId);
}
