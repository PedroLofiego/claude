/*
 * MOCKED — substituir por API de roteiros (ex.: GetYourGuide, Triposo)
 * ou geração via LLM em produção.
 *
 * Cada destino possui um pool de "dias temáticos". O builder repete/intercala
 * os dias para preencher a quantidade total da viagem informada pelo usuário.
 */

const POOLS = {
  lisboa: [
    { theme: "Centro Histórico", items: ["Praça do Comércio", "Sé de Lisboa", "Bondinho 28", "Jantar em Alfama com fado"] },
    { theme: "Belém", items: ["Mosteiro dos Jerónimos", "Torre de Belém", "Pastéis de Belém", "Padrão dos Descobrimentos"] },
    { theme: "Sintra", items: ["Palácio da Pena", "Quinta da Regaleira", "Cabo da Roca", "Jantar em Cascais"] },
    { theme: "Bairros & Miradouros", items: ["Bairro Alto", "Miradouro de Santa Catarina", "LX Factory", "Time Out Market"] },
    { theme: "Bate-volta a Évora", items: ["Capela dos Ossos", "Templo Romano", "Vinícola no Alentejo"] },
  ],
  paris: [
    { theme: "Clássicos", items: ["Torre Eiffel", "Champ de Mars", "Cruzeiro pelo Sena", "Jantar no Marais"] },
    { theme: "Arte", items: ["Louvre (manhã)", "Tuileries", "Musée d'Orsay", "Ópera Garnier"] },
    { theme: "Montmartre", items: ["Sacré-Cœur", "Place du Tertre", "Moulin Rouge (foto)", "Bistrô local"] },
    { theme: "Versalhes", items: ["Palácio de Versalhes", "Jardins reais", "Trianon", "Volta a Paris ao pôr do sol"] },
    { theme: "Saint-Germain & Latin", items: ["Notre-Dame (exterior)", "Sainte-Chapelle", "Jardim de Luxemburgo", "Café de Flore"] },
  ],
  roma: [
    { theme: "Roma Antiga", items: ["Coliseu", "Fórum Romano", "Palatino", "Jantar em Monti"] },
    { theme: "Vaticano", items: ["Museus Vaticanos", "Capela Sistina", "Basílica de São Pedro", "Castel Sant'Angelo"] },
    { theme: "Centro Barroco", items: ["Fontana di Trevi", "Panteão", "Piazza Navona", "Gelato artesanal"] },
    { theme: "Trastevere", items: ["Caminhada por Trastevere", "Santa Maria", "Jantar com cacio e pepe"] },
    { theme: "Bate-volta a Florença", items: ["Trem Frecciarossa", "Duomo", "Ponte Vecchio", "Galeria Uffizi"] },
  ],
  barcelona: [
    { theme: "Gaudí Essencial", items: ["Sagrada Família", "Park Güell", "Casa Batlló", "Jantar em Gràcia"] },
    { theme: "Bairro Gótico", items: ["Catedral", "Plaça Reial", "El Born", "Tapas em La Boqueria"] },
    { theme: "Praia & Modern", items: ["Barceloneta", "Port Olímpic", "Passeio de bike", "Bunkers del Carmel ao pôr do sol"] },
    { theme: "Montjuïc", items: ["Castelo de Montjuïc", "Fundació Miró", "Fonte Mágica"] },
    { theme: "Bate-volta a Montserrat", items: ["Mosteiro", "Trilha", "Vinícola no Penedès"] },
  ],
  toquio: [
    { theme: "Shibuya & Shinjuku", items: ["Cruzamento de Shibuya", "Harajuku", "Omotesando", "Vista do Tokyo Government Building"] },
    { theme: "Tradicional", items: ["Templo Senso-ji (Asakusa)", "Nakamise-dori", "Ueno Park", "Akihabara à noite"] },
    { theme: "Modernidade & Baía", items: ["Odaiba", "TeamLab Planets", "Tsukiji Outer Market", "Ginza"] },
    { theme: "Bate-volta a Kamakura", items: ["Grande Buda", "Templo Hase-dera", "Praia de Yuigahama"] },
    { theme: "Bate-volta a Hakone", items: ["Lago Ashi", "Onsen tradicional", "Vista do Monte Fuji"] },
    { theme: "Kyoto Express", items: ["Shinkansen", "Fushimi Inari", "Bambuzal de Arashiyama", "Gion à noite"] },
  ],
  bangkok: [
    { theme: "Templos & Rio", items: ["Grand Palace", "Wat Pho", "Wat Arun", "Jantar à beira do Chao Phraya"] },
    { theme: "Mercados", items: ["Chatuchak (fim de semana)", "Mercado flutuante de Damnoen Saduak", "Rua Khao San"] },
    { theme: "Wellness & Cultura", items: ["Massagem tailandesa tradicional", "Jim Thompson House", "Aula de culinária"] },
    { theme: "Ayutthaya", items: ["Templos em ruínas", "Passeio de elefante ético", "Almoço típico"] },
    { theme: "Vida Moderna", items: ["Siam/Asok malls", "Sky bar no Lebua", "Chinatown à noite"] },
  ],
  istambul: [
    { theme: "Sultanahmet", items: ["Hagia Sophia", "Mesquita Azul", "Cisterna da Basílica", "Topkapi"] },
    { theme: "Bazares & Bósforo", items: ["Grande Bazar", "Mercado de Especiarias", "Cruzeiro pelo Bósforo", "Jantar em Karaköy"] },
    { theme: "Lado Asiático", items: ["Travessia de balsa para Kadıköy", "Mercado local", "Café no Moda", "Pôr do sol em Üsküdar"] },
    { theme: "Beyoğlu", items: ["Avenida Istiklal", "Torre de Gálata", "Bondinho histórico", "Meyhane à noite"] },
    { theme: "Capadócia (extensão)", items: ["Voo doméstico", "Passeio de balão", "Vale de Göreme", "Hotel-caverna"] },
  ],
  dubai: [
    { theme: "Moderno", items: ["Burj Khalifa (At The Top)", "Dubai Mall", "Fonte de Dubai", "Jantar com vista"] },
    { theme: "Old Dubai", items: ["Al Fahidi", "Souk do Ouro", "Souk de Especiarias", "Travessia de abra"] },
    { theme: "Deserto", items: ["Safari 4x4", "Sandboard", "Jantar beduíno", "Show com fogos e dança"] },
    { theme: "Praia & Marina", items: ["JBR Beach", "Dubai Marina Walk", "Atlantis (Palm Jumeirah)", "Pôr do sol em Bluewaters"] },
    { theme: "Abu Dhabi", items: ["Mesquita Sheikh Zayed", "Louvre Abu Dhabi", "Corniche", "Ferrari World (opcional)"] },
  ],
};

export function buildItinerary(destinationId, days) {
  const pool = POOLS[destinationId] ?? [];
  if (pool.length === 0 || days <= 0) return [];
  const out = [];
  for (let i = 0; i < days; i++) {
    const base = pool[i % pool.length];
    out.push({
      day: i + 1,
      theme: base.theme,
      items: base.items,
    });
  }
  return out;
}
