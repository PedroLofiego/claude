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
 */

export const ORIGIN_CITIES = [
  { code: "GRU", label: "São Paulo (GRU)" },
  { code: "GIG", label: "Rio de Janeiro (GIG)" },
  { code: "BSB", label: "Brasília (BSB)" },
  { code: "CNF", label: "Belo Horizonte (CNF)" },
  { code: "POA", label: "Porto Alegre (POA)" },
  { code: "REC", label: "Recife (REC)" },
  { code: "FOR", label: "Fortaleza (FOR)" },
  { code: "SSA", label: "Salvador (SSA)" },
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
    highlights: [
      "Bairros históricos como Alfama e Baixa",
      "Bondinho 28 e miradouros icônicos",
      "Bate-volta para Sintra e Cascais",
      "Gastronomia acessível e excelentes vinhos",
    ],
    flightBaseBRL: 4500,
    daily: {
      economic:    { lodging: 200, food: 120, transport: 30,  activities: 80,  misc: 50 },
      comfortable: { lodging: 450, food: 250, transport: 60,  activities: 150, misc: 100 },
      premium:     { lodging: 1200, food: 500, transport: 150, activities: 350, misc: 200 },
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
    highlights: [
      "Torre Eiffel, Louvre e Notre-Dame",
      "Cafés, padarias e gastronomia clássica",
      "Bate-volta para Versalhes",
      "Bairros charmosos: Montmartre e Marais",
    ],
    flightBaseBRL: 5500,
    daily: {
      economic:    { lodging: 350, food: 150, transport: 40,  activities: 100, misc: 60 },
      comfortable: { lodging: 700, food: 300, transport: 80,  activities: 200, misc: 120 },
      premium:     { lodging: 1800, food: 600, transport: 200, activities: 500, misc: 250 },
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
    highlights: [
      "Coliseu, Fórum e Vaticano",
      "Pizza, pasta e gelato em toda esquina",
      "Bate-volta para Florença e Pompeia",
      "Trastevere para vida noturna autêntica",
    ],
    flightBaseBRL: 5000,
    daily: {
      economic:    { lodging: 250, food: 130, transport: 30,  activities: 90,  misc: 50 },
      comfortable: { lodging: 550, food: 270, transport: 70,  activities: 170, misc: 110 },
      premium:     { lodging: 1400, food: 550, transport: 180, activities: 400, misc: 220 },
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
    highlights: [
      "Sagrada Família e arquitetura de Gaudí",
      "Praias urbanas e Las Ramblas",
      "Tapas, vermut e mercados centenários",
      "Bate-volta para Montserrat e Girona",
    ],
    flightBaseBRL: 5000,
    daily: {
      economic:    { lodging: 280, food: 140, transport: 35,  activities: 90,  misc: 55 },
      comfortable: { lodging: 600, food: 280, transport: 75,  activities: 180, misc: 115 },
      premium:     { lodging: 1500, food: 560, transport: 170, activities: 420, misc: 230 },
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
    highlights: [
      "Shibuya, Shinjuku e bairros temáticos",
      "Templos de Asakusa e Meiji",
      "Cerejeiras (sakura) na primavera",
      "Bate-volta para Kyoto e Hakone",
    ],
    flightBaseBRL: 7500,
    daily: {
      economic:    { lodging: 220, food: 120, transport: 50,  activities: 80,  misc: 50 },
      comfortable: { lodging: 700, food: 320, transport: 100, activities: 200, misc: 130 },
      premium:     { lodging: 1800, food: 700, transport: 250, activities: 500, misc: 280 },
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
    highlights: [
      "Templos do Grand Palace e Wat Pho",
      "Comida de rua espetacular e barata",
      "Mercados flutuantes e massagens",
      "Bate-volta para Ayutthaya",
    ],
    flightBaseBRL: 6500,
    daily: {
      economic:    { lodging: 100, food: 60,  transport: 20,  activities: 50,  misc: 30 },
      comfortable: { lodging: 300, food: 150, transport: 50,  activities: 120, misc: 70 },
      premium:     { lodging: 900, food: 350, transport: 150, activities: 300, misc: 180 },
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
    highlights: [
      "Hagia Sophia, Mesquita Azul e Topkapi",
      "Grande Bazar e Mercado de Especiarias",
      "Cruzeiro pelo Bósforo",
      "Capadócia (extensão de viagem)",
    ],
    flightBaseBRL: 5500,
    daily: {
      economic:    { lodging: 180, food: 80,  transport: 25,  activities: 70,  misc: 40 },
      comfortable: { lodging: 450, food: 200, transport: 60,  activities: 150, misc: 100 },
      premium:     { lodging: 1200, food: 450, transport: 150, activities: 350, misc: 200 },
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
    highlights: [
      "Burj Khalifa e Dubai Mall",
      "Safari pelo deserto e Old Dubai",
      "Praias e arquitetura futurista",
      "Bate-volta para Abu Dhabi",
    ],
    flightBaseBRL: 6500,
    daily: {
      economic:    { lodging: 350, food: 150, transport: 40,  activities: 100, misc: 70 },
      comfortable: { lodging: 800, food: 350, transport: 100, activities: 250, misc: 150 },
      premium:     { lodging: 2200, food: 800, transport: 250, activities: 600, misc: 300 },
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
