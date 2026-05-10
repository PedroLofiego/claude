/*
 * MOCKED DATA — substituir por APIs reais quando disponíveis.
 *
 * Sugestões de integração futura:
 *   - flights.byOrigin: Skyscanner, Kiwi, Amadeus Flight Offers Search
 *   - daily.* (lodging, food, transport, activities, misc):
 *       Numbeo Cost-of-Living API, Booking.com, GetYourGuide, Rome2Rio
 *   - currency / câmbio em tempo real: Open Exchange Rates, Frankfurter API
 *   - clima e melhor época: OpenWeather, WeatherAPI
 *
 * Todos os valores estão em BRL (R$) e refletem médias estimadas para 2026.
 * Os preços de voo são round-trip por pessoa, classe econômica.
 *
 * IMPORTANTE: os valores abaixo já estão calibrados para ALTA TEMPORADA
 * de fim de ano (Natal/Réveillon — meados de dez. ao início de jan.).
 * Fora desse período, espere desconto de 20-35%.
 */

export const TRIP_WINDOW = {
  label: "22-25 dez 2026 → 6-9 jan 2027",
  startRange: "22-25 dezembro",
  endRange: "6-9 janeiro",
  season: "Alta temporada — Natal e Réveillon (preços +25 a +40% vs. baixa)",
};

export const ORIGIN_CITIES = [
  { code: "GRU", label: "São Paulo (GRU)" },
  { code: "GIG", label: "Rio de Janeiro (GIG)" },
  { code: "BSB", label: "Brasília (BSB)" },
  { code: "CNF", label: "Belo Horizonte (CNF)" },
  { code: "POA", label: "Porto Alegre (POA)" },
  { code: "REC", label: "Recife (REC)" },
  { code: "FOR", label: "Fortaleza (FOR)" },
  { code: "SSA", label: "Salvador — Aeroporto Internacional (SSA)" },
  { code: "CWB", label: "Curitiba (CWB)" },
];

// Multiplicador aplicado sobre o preço de voo da base (GRU).
// TODO: substituir por busca real de tarifas por origem.
const ORIGIN_FLIGHT_MULTIPLIER = {
  GRU: 1.0,
  GIG: 1.03,
  BSB: 1.06,
  CNF: 1.08,
  POA: 1.05,
  REC: 1.12,
  FOR: 1.1,
  SSA: 1.12,
  CWB: 1.07,
};

export function flightFromOrigin(originCode, baseFlightBRL) {
  const mult = ORIGIN_FLIGHT_MULTIPLIER[originCode] ?? 1.1;
  return Math.round(baseFlightBRL * mult);
}

/**
 * @typedef {"economic"|"comfortable"|"premium"} Tier
 *
 * Cada destino traz custo diário por pessoa (BRL) por categoria,
 * em três cenários: econômico, confortável e premium.
 *
 * Campos extras úteis no contexto da viagem (Dez/Jan):
 *   - tempC: { low, high } — média da mínima/máxima em ºC no período
 *   - winterNote: aviso prático sobre o clima no fim do ano
 *   - vibe: tags ("nightlife", "ski", "natal", "reveillon", "praia")
 *   - flightHours: tempo aproximado de voo do Brasil (Sul/Sudeste)
 */
export const DESTINATIONS = [
  {
    id: "lisboa",
    city: "Lisboa",
    country: "Portugal",
    region: "Europa",
    emoji: "🇵🇹",
    image:
      "https://images.unsplash.com/photo-1588535537401-e7f72bd34eed?auto=format&fit=crop&w=1200&q=70",
    currency: "EUR",
    languages: ["Português"],
    visaRequired: false,
    flightHours: 9,
    safetyScore: 4.6,
    bestMonths: ["Abr", "Mai", "Jun", "Set", "Out"],
    tempC: { low: 9, high: 15 },
    winterNote: "Inverno mais ameno da Europa. Chuva eventual; agasalho leve resolve.",
    vibe: ["nightlife", "natal", "reveillon", "comida"],
    highlights: [
      "Pink Street e Cais do Sodré: bares e clubs",
      "Mercados de Natal e iluminação no centro",
      "Réveillon com fogos no Terreiro do Paço (gratuito)",
      "Surf em Cascais (sim, mesmo em janeiro)",
    ],
    flightBaseBRL: 5800,
    daily: {
      economic:    { lodging: 240, food: 140, transport: 35,  activities: 90,  misc: 60 },
      comfortable: { lodging: 540, food: 290, transport: 70,  activities: 170, misc: 110 },
      premium:     { lodging: 1400, food: 580, transport: 170, activities: 380, misc: 220 },
    },
  },
  {
    id: "paris",
    city: "Paris",
    country: "França",
    region: "Europa",
    emoji: "🇫🇷",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=70",
    currency: "EUR",
    languages: ["Francês", "Inglês"],
    visaRequired: false,
    flightHours: 11,
    safetyScore: 4.1,
    bestMonths: ["Mai", "Jun", "Set", "Out"],
    tempC: { low: 3, high: 8 },
    winterNote: "Frio (3-8 ºC), pouca neve mas chuva fina. Casaco impermeável + camadas.",
    vibe: ["natal", "reveillon", "arte", "nightlife"],
    highlights: [
      "Mercados de Natal (Tuileries, La Défense, Notre-Dame)",
      "Patinação no gelo: Hôtel de Ville e Grand Palais",
      "Réveillon nos Champs-Élysées + show no Arco do Triunfo",
      "Bar crawl no Marais e jazz na Rive Gauche",
    ],
    flightBaseBRL: 7500,
    daily: {
      economic:    { lodging: 420, food: 180, transport: 50,  activities: 110, misc: 70 },
      comfortable: { lodging: 850, food: 360, transport: 90,  activities: 230, misc: 140 },
      premium:     { lodging: 2200, food: 720, transport: 220, activities: 560, misc: 290 },
    },
  },
  {
    id: "roma",
    city: "Roma",
    country: "Itália",
    region: "Europa",
    emoji: "🇮🇹",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=70",
    currency: "EUR",
    languages: ["Italiano", "Inglês"],
    visaRequired: false,
    flightHours: 11,
    safetyScore: 4.3,
    bestMonths: ["Abr", "Mai", "Set", "Out"],
    tempC: { low: 5, high: 12 },
    winterNote: "Frio leve e ensolarado. Filas menores nos pontos turísticos.",
    vibe: ["arte", "comida", "natal", "reveillon"],
    highlights: [
      "Coliseu e Vaticano sem fila (baixa de turistas)",
      "Trastevere bar crawl à noite",
      "Réveillon no Circo Massimo com show grátis",
      "Bate-volta para Nápoles: pizzaria de origem",
    ],
    flightBaseBRL: 6500,
    daily: {
      economic:    { lodging: 290, food: 150, transport: 35,  activities: 100, misc: 60 },
      comfortable: { lodging: 650, food: 310, transport: 80,  activities: 195, misc: 125 },
      premium:     { lodging: 1650, food: 640, transport: 200, activities: 460, misc: 250 },
    },
  },
  {
    id: "barcelona",
    city: "Barcelona",
    country: "Espanha",
    region: "Europa",
    emoji: "🇪🇸",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=70",
    currency: "EUR",
    languages: ["Espanhol", "Catalão", "Inglês"],
    visaRequired: false,
    flightHours: 10,
    safetyScore: 4.2,
    bestMonths: ["Mai", "Jun", "Set", "Out"],
    tempC: { low: 7, high: 14 },
    winterNote: "Inverno mediterrâneo; sol durante o dia, frio leve à noite.",
    vibe: ["nightlife", "ski", "praia", "reveillon"],
    highlights: [
      "Razzmatazz e Apolo: noites lendárias",
      "Bate-volta de ski para Andorra (3h de ônibus)",
      "Réveillon na Plaça d'Espanya com 12 uvas",
      "Brunch culture em Gràcia",
    ],
    flightBaseBRL: 6500,
    daily: {
      economic:    { lodging: 330, food: 160, transport: 40,  activities: 105, misc: 65 },
      comfortable: { lodging: 720, food: 320, transport: 85,  activities: 210, misc: 130 },
      premium:     { lodging: 1750, food: 660, transport: 200, activities: 480, misc: 260 },
    },
  },
  {
    id: "toquio",
    city: "Tóquio",
    country: "Japão",
    region: "Ásia",
    emoji: "🇯🇵",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=70",
    currency: "JPY",
    languages: ["Japonês"],
    visaRequired: false,
    flightHours: 24,
    safetyScore: 4.9,
    bestMonths: ["Mar", "Abr", "Out", "Nov"],
    tempC: { low: 2, high: 10 },
    winterNote: "Frio seco e ensolarado. Quase nunca neva no centro; ideal para passeios urbanos.",
    vibe: ["nightlife", "ski", "natal", "geek"],
    highlights: [
      "Iluminações de Natal: Roppongi, Marunouchi, Shibuya",
      "Karaokê em Shinjuku até de manhã",
      "Day trip de ski em Yuzawa (1h40 de Shinkansen)",
      "Hatsumōde — primeira visita ao templo no Ano Novo",
    ],
    flightBaseBRL: 9500,
    daily: {
      economic:    { lodging: 260, food: 150, transport: 60,  activities: 100, misc: 60 },
      comfortable: { lodging: 800, food: 360, transport: 110, activities: 230, misc: 150 },
      premium:     { lodging: 2100, food: 800, transport: 280, activities: 580, misc: 320 },
    },
  },
  {
    id: "seul",
    city: "Seul",
    country: "Coreia do Sul",
    region: "Ásia",
    emoji: "🇰🇷",
    image:
      "https://images.unsplash.com/photo-1538485399081-7c8970e02f1c?auto=format&fit=crop&w=1200&q=70",
    currency: "KRW",
    languages: ["Coreano", "Inglês básico"],
    visaRequired: false,
    flightHours: 27,
    safetyScore: 4.8,
    bestMonths: ["Abr", "Mai", "Out"],
    tempC: { low: -6, high: 2 },
    winterNote: "Frio intenso e seco. Pode nevar. Indispensável: casaco térmico, gorro, luvas.",
    vibe: ["nightlife", "ski", "kpop", "reveillon"],
    highlights: [
      "Aula de dança K-pop em Hongdae",
      "Vivaldi Park: ski day trip (~1h de Seul)",
      "Noraebang (karaokê privativo) e chimaek no Han River",
      "Réveillon na cerimônia do Sino de Bosingak",
    ],
    flightBaseBRL: 9500,
    daily: {
      economic:    { lodging: 220, food: 130, transport: 40,  activities: 90,  misc: 60 },
      comfortable: { lodging: 620, food: 290, transport: 90,  activities: 200, misc: 130 },
      premium:     { lodging: 1700, food: 650, transport: 220, activities: 500, misc: 270 },
    },
  },
  {
    id: "praga",
    city: "Praga",
    country: "República Tcheca",
    region: "Europa",
    emoji: "🇨🇿",
    image:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=70",
    currency: "CZK",
    languages: ["Tcheco", "Inglês"],
    visaRequired: false,
    flightHours: 13,
    safetyScore: 4.6,
    bestMonths: ["Mai", "Jun", "Set"],
    tempC: { low: -3, high: 3 },
    winterNote: "Frio com chance real de neve. Cidade vira cenário de filme em dezembro.",
    vibe: ["natal", "nightlife", "ski", "barata"],
    highlights: [
      "Mercados de Natal na Staroměstské + trdelník com Nutella",
      "Pub crawl Prague (um dos mais famosos da Europa)",
      "Beer spa: banho em cuba de cerveja IPA",
      "Réveillon com fogos no Letná Park",
    ],
    flightBaseBRL: 6500,
    daily: {
      economic:    { lodging: 200, food: 120, transport: 25,  activities: 80,  misc: 50 },
      comfortable: { lodging: 480, food: 240, transport: 60,  activities: 160, misc: 100 },
      premium:     { lodging: 1300, food: 520, transport: 160, activities: 380, misc: 210 },
    },
  },
  {
    id: "berlim",
    city: "Berlim",
    country: "Alemanha",
    region: "Europa",
    emoji: "🇩🇪",
    image:
      "https://images.unsplash.com/photo-1587330979470-3016b6702d89?auto=format&fit=crop&w=1200&q=70",
    currency: "EUR",
    languages: ["Alemão", "Inglês"],
    visaRequired: false,
    flightHours: 12,
    safetyScore: 4.4,
    bestMonths: ["Mai", "Jun", "Set"],
    tempC: { low: -1, high: 4 },
    winterNote: "Frio úmido. 60+ mercados de Natal espalhados pela cidade.",
    vibe: ["nightlife", "natal", "reveillon", "alternativo"],
    highlights: [
      "Tentativa lendária de entrar no Berghain (techno)",
      "Mercados de Natal: Gendarmenmarkt e Charlottenburg",
      "Réveillon no Portão de Brandemburgo (maior festa free da Europa)",
      "East Side Gallery + Berlin Underworlds tour",
    ],
    flightBaseBRL: 6500,
    daily: {
      economic:    { lodging: 300, food: 150, transport: 35,  activities: 95,  misc: 60 },
      comfortable: { lodging: 660, food: 290, transport: 75,  activities: 195, misc: 120 },
      premium:     { lodging: 1700, food: 600, transport: 190, activities: 460, misc: 240 },
    },
  },
  {
    id: "amsterda",
    city: "Amsterdã",
    country: "Holanda",
    region: "Europa",
    emoji: "🇳🇱",
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96c5017?auto=format&fit=crop&w=1200&q=70",
    currency: "EUR",
    languages: ["Holandês", "Inglês"],
    visaRequired: false,
    flightHours: 11,
    safetyScore: 4.5,
    bestMonths: ["Abr", "Mai", "Set"],
    tempC: { low: 1, high: 7 },
    winterNote: "Frio e ventoso, com chance de canais congelados. Light Festival rola até janeiro.",
    vibe: ["natal", "nightlife", "arte", "reveillon"],
    highlights: [
      "Amsterdam Light Festival: passeio de barco com instalações",
      "Patinação no gelo na Museumplein",
      "Coffee shop culture e Red Light District à noite",
      "Réveillon na Dam Square com fogos por toda a cidade",
    ],
    flightBaseBRL: 6500,
    daily: {
      economic:    { lodging: 380, food: 180, transport: 45,  activities: 110, misc: 70 },
      comfortable: { lodging: 780, food: 340, transport: 90,  activities: 220, misc: 140 },
      premium:     { lodging: 1900, food: 680, transport: 220, activities: 510, misc: 270 },
    },
  },
  {
    id: "atenas",
    city: "Atenas",
    country: "Grécia",
    region: "Europa",
    emoji: "🇬🇷",
    image:
      "https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&w=1200&q=70",
    currency: "EUR",
    languages: ["Grego", "Inglês"],
    visaRequired: false,
    flightHours: 13,
    safetyScore: 4.2,
    bestMonths: ["Abr", "Mai", "Set", "Out"],
    tempC: { low: 6, high: 13 },
    winterNote: "Inverno ameno; Acrópole sem multidões. Mar gelado, mas dá pra ir até Hidra.",
    vibe: ["arte", "comida", "natal", "história"],
    highlights: [
      "Acrópole no inverno: praticamente vazia",
      "Bairro de Exarchia: alternativo, bares e arte de rua",
      "Réveillon na Praça Syntagma com fogos",
      "Bate-volta para Hidra (sem carros) ou Delfos",
    ],
    flightBaseBRL: 6800,
    daily: {
      economic:    { lodging: 220, food: 120, transport: 30,  activities: 80,  misc: 50 },
      comfortable: { lodging: 520, food: 250, transport: 65,  activities: 170, misc: 110 },
      premium:     { lodging: 1400, food: 520, transport: 170, activities: 400, misc: 230 },
    },
  },
  {
    id: "reykjavik",
    city: "Reykjavík",
    country: "Islândia",
    region: "Europa",
    emoji: "🇮🇸",
    image:
      "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?auto=format&fit=crop&w=1200&q=70",
    currency: "ISK",
    languages: ["Islandês", "Inglês"],
    visaRequired: false,
    flightHours: 16,
    safetyScore: 4.9,
    bestMonths: ["Jun", "Jul", "Ago", "Set"],
    tempC: { low: -2, high: 3 },
    winterNote: "Dia super curto (~4h de luz), MAS é a melhor janela para aurora boreal.",
    vibe: ["aurora", "aventura", "ski", "reveillon"],
    highlights: [
      "Caça à aurora boreal (alta probabilidade em dez/jan)",
      "Blue Lagoon e banhos termais geotermais",
      "Snowmobile sobre a geleira Langjökull",
      "Réveillon islandês: fogueiras de bairro + fogos lendários",
    ],
    flightBaseBRL: 8500,
    daily: {
      economic:    { lodging: 480, food: 220, transport: 60,  activities: 200, misc: 90 },
      comfortable: { lodging: 1100, food: 420, transport: 140, activities: 380, misc: 180 },
      premium:     { lodging: 2400, food: 800, transport: 320, activities: 800, misc: 350 },
    },
  },
  {
    id: "bangkok",
    city: "Bangkok",
    country: "Tailândia",
    region: "Ásia",
    emoji: "🇹🇭",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=70",
    currency: "THB",
    languages: ["Tailandês", "Inglês"],
    visaRequired: false,
    flightHours: 26,
    safetyScore: 4.0,
    bestMonths: ["Nov", "Dez", "Jan", "Fev"],
    tempC: { low: 22, high: 32 },
    winterNote: "Estação seca e mais fresca: melhor época do ano. Roupas leves.",
    vibe: ["nightlife", "praia", "reveillon", "comida"],
    highlights: [
      "Sky bars (Lebua e Mahanakhon) e Khao San Road",
      "Aula de Muay Thai e cooking class de pad thai",
      "Réveillon no Asiatique com fogos no rio",
      "Extensão fácil para Phuket ou Krabi",
    ],
    flightBaseBRL: 7500,
    daily: {
      economic:    { lodging: 110, food: 70,  transport: 25,  activities: 60,  misc: 35 },
      comfortable: { lodging: 340, food: 170, transport: 60,  activities: 140, misc: 80 },
      premium:     { lodging: 1000, food: 400, transport: 170, activities: 340, misc: 200 },
    },
  },
  {
    id: "istambul",
    city: "Istambul",
    country: "Turquia",
    region: "Eurásia",
    emoji: "🇹🇷",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=70",
    currency: "TRY",
    languages: ["Turco", "Inglês"],
    visaRequired: false,
    flightHours: 13,
    safetyScore: 4.0,
    bestMonths: ["Abr", "Mai", "Set", "Out"],
    tempC: { low: 4, high: 10 },
    winterNote: "Frio com chance de neve. Hammams ficam ainda mais convidativos.",
    vibe: ["nightlife", "comida", "natal"],
    highlights: [
      "Hammam tradicional em Çemberlitaş",
      "Cena techno em Galata: clubs como Mini Müzikhol",
      "Cruzeiro pelo Bósforo ao pôr do sol",
      "Extensão para Capadócia: balão sobre paisagem nevada",
    ],
    flightBaseBRL: 6500,
    daily: {
      economic:    { lodging: 200, food: 95,  transport: 30,  activities: 80,  misc: 45 },
      comfortable: { lodging: 500, food: 230, transport: 70,  activities: 170, misc: 110 },
      premium:     { lodging: 1350, food: 510, transport: 170, activities: 400, misc: 220 },
    },
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "Emirados Árabes",
    region: "Ásia",
    emoji: "🇦🇪",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=70",
    currency: "AED",
    languages: ["Árabe", "Inglês"],
    visaRequired: false,
    flightHours: 15,
    safetyScore: 4.8,
    bestMonths: ["Nov", "Dez", "Jan", "Fev", "Mar"],
    tempC: { low: 16, high: 25 },
    winterNote: "Pico da temporada: clima perfeito (16-25 ºC) e mar morno.",
    vibe: ["nightlife", "praia", "reveillon", "luxo"],
    highlights: [
      "Réveillon no Burj Khalifa: um dos maiores shows pirotécnicos do mundo",
      "Skydive sobre a Palm Jumeirah",
      "Desert glamping com dune bashing",
      "Beach clubs (Cove Beach, Drift) e Ski Dubai indoor",
    ],
    flightBaseBRL: 8500,
    daily: {
      economic:    { lodging: 420, food: 180, transport: 50,  activities: 120, misc: 90 },
      comfortable: { lodging: 950, food: 400, transport: 110, activities: 290, misc: 170 },
      premium:     { lodging: 2600, food: 900, transport: 280, activities: 680, misc: 340 },
    },
  },
];

export const TIERS = [
  { id: "economic",    label: "Econômico",   description: "Hostels/apto compartilhado, comida local, transporte público." },
  { id: "comfortable", label: "Confortável", description: "Hotel 3-4★, mistura de restaurantes, alguns táxis e tours." },
  { id: "premium",     label: "Premium",     description: "Hotel 4-5★, alta gastronomia, transfers privativos." },
];

export const CATEGORIES = [
  { id: "lodging",    label: "Hospedagem", icon: "🏨" },
  { id: "food",       label: "Alimentação", icon: "🍽️" },
  { id: "transport",  label: "Transporte local", icon: "🚇" },
  { id: "activities", label: "Passeios e ingressos", icon: "🎟️" },
  { id: "misc",       label: "Extras (chip, lavanderia, lembranças)", icon: "🛍️" },
];
