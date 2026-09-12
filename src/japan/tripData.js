/*
 * ============================================================
 * SOURCE OF TRUTH — Roteiro Japão, dezembro 2026 (Pedro & Gio)
 * ============================================================
 * Seções 1-5 do documento: dados fixos (voos, hospedagens
 * confirmadas, perfis, conflitos resolvidos, logística).
 * Seções 6-8: roteiro-base + catálogo de passeios selecionáveis.
 * Seções 9-12: pendências, itens práticos, orçamento, checklist.
 */

// Câmbio de referência do documento: 1 BRL ≈ ¥30,7
export const JPY_PER_BRL = 30.7;
export const brl = (yenValue) => Math.round(yenValue / JPY_PER_BRL);

// ===== 1. VISÃO GERAL =====
export const TRIP = {
  arriveISO: "2026-12-09",
  departISO: "2026-12-22",
  arriveLabel: "Qua 09/12/2026, 11:45 — Narita (NRT)",
  departLabel: "Ter 22/12/2026, 13:35 — Narita (NRT)",
  days: 14,
  nights: 13,
  people: 2,
  travelers: ["Pedro", "Gio"],
  airportWarning:
    "O aeroporto de saída é NARITA, não Haneda. O voo de volta e a cápsula do dia 21 estão os dois em Narita — qualquer rota que termine em Haneda quebra as duas reservas.",
};

export const CITY_BLOCKS = [
  { id: "toquio", label: "Tóquio", emoji: "🗼", nights: 5, range: "09 → 14/12", lat: 35.6812, lng: 139.7671 },
  { id: "kyoto", label: "Kyoto", emoji: "🎎", nights: 3, range: "14 → 17/12", lat: 35.0116, lng: 135.7681 },
  { id: "osaka", label: "Osaka", emoji: "🐙", nights: 4, range: "17 → 21/12", lat: 34.6937, lng: 135.5023 },
  { id: "narita", label: "Narita (cápsula)", emoji: "🛏️", nights: 1, range: "21 → 22/12", lat: 35.7719, lng: 140.3929 },
];

// ===== 2. HOSPEDAGENS =====
export const STAYS = [
  {
    id: "comfort-tokyo",
    city: "toquio",
    status: "confirmada",
    name: "Comfort Hotel Tokyo Higashi Nihombashi",
    checkIn: "09/12",
    checkOut: "14/12",
    nights: 5,
    lat: 35.6925,
    lng: 139.7847,
    room: "2 adultos, 1 cama de casal",
    area: "Nihonbashi/Kanda — poucos minutos da Estação de Kanda e da Estação de Tóquio (embarque do shinkansen do dia 14)",
    totalBRL: 2824,
    perNightBRL: 565,
    cancel: "Cancelamento grátis",
    notes: [],
  },
  {
    id: "kyoto-pending",
    city: "kyoto",
    status: "pendente",
    name: "Hotel em Kyoto",
    checkIn: "14/12",
    checkOut: "17/12",
    nights: 3,
    lat: 35.0116,
    lng: 135.7681,
    area: "A definir — ver sugestões de bairro no mapa",
    totalBRL: null,
    notes: ["Ainda não reservado."],
  },
  {
    id: "osaka-pending",
    city: "osaka",
    status: "pendente",
    name: "Hotel em Osaka",
    checkIn: "17/12",
    checkOut: "21/12",
    nights: 4,
    lat: 34.6687,
    lng: 135.5013,
    area: "A definir — ver sugestões de bairro no mapa",
    totalBRL: null,
    notes: ["Ainda não reservado."],
  },
  {
    id: "9h-narita",
    city: "narita",
    status: "confirmada",
    name: "9h nine hours Narita Airport",
    checkIn: "21/12",
    checkOut: "22/12 (10:00)",
    nights: 1,
    lat: 35.7719,
    lng: 140.3877,
    room: "2 cápsulas (reserva por pessoa — não existe 'quarto casal')",
    area: "Terminal 2, subsolo (B1), perto do estacionamento P2",
    totalBRL: 427,
    totalYen: 13110,
    plan: "Standard Plan (pernoite — não confundir com o 'Day Use Plan')",
    cancel: "Grátis até 20/12; 100% da tarifa a partir do dia 21",
    notes: [
      "Separação por andar: homens e mulheres ficam em pisos diferentes.",
      "Sinalização ruim no B1 — reservar tempo extra pra achar.",
      "Check-in das 14:00 até de madrugada — compatível com chegada tarde vinda de Osaka.",
    ],
  },
];

// ===== 3. PERFIS E PREFERÊNCIAS =====
export const PREFERENCES = [
  { cat: "Comida de rua e mercados", pedro: 2, gio: 1, convergence: "alta", note: "Prioridade nº1 combinada" },
  { cat: "Compras", pedro: 3, gio: 2, convergence: "alta", note: "Prioridade nº2 combinada" },
  { cat: "Templos, santuários e jardins", pedro: 4, gio: 3, convergence: "media", note: "" },
  { cat: "Museus e arquitetura", pedro: 7, gio: 4, convergence: "divergente", note: "Gio se importa mais" },
  { cat: "Parque temático", pedro: 4, gio: 7, convergence: "divergente", note: "Pedro se importa mais" },
  { cat: "Experiência cultural (quimono, chá)", pedro: 8, gio: 5, convergence: "baixa", note: "Baixa para ambos" },
  { cat: "Bares e vida noturna", pedro: 5, gio: 6, convergence: "media", note: "Média-baixa para ambos" },
  { cat: "Natureza, trilhas e caminhada", pedro: 1, gio: 8, convergence: "conflito", note: "Conflito direto — resolvido por split" },
];

export const PACE = [
  "Ambos toparam acordar 6h30 para pegar lugar vazio",
  "Ambos preferem 8–10h na rua, 2–3 lugares por dia, sem correria",
  "Pedro rende de manhã e à tarde; Gio rende à tarde",
  "Ambos aguentam mais de 15 mil passos/dia",
];

export const PERSON_PROFILES = [
  {
    id: "pedro",
    name: "Pedro",
    emoji: "🧑",
    color: "#6366f1",
    wants: [
      "Kobe",
      "Cerimônia do chá / Uji",
      "Subir o Fushimi Inari inteiro",
      "Noite de bar em Dotonbori",
      "Iluminações de Natal",
      "DisneySea",
      "Onsen (tem tatuagem)",
    ],
    cuts: ["Nara"],
    veto: '"Templos religiosos" — esclarecido depois: não é veto total, é veto a maratona de templo. Um ou dois entram.',
  },
  {
    id: "gio",
    name: "Gio",
    emoji: "👩",
    color: "#f43f5e",
    wants: [
      "Castelo de Himeji",
      "Aquário Kaiyukan",
      "Noite de bar em Dotonbori",
      "Iluminações de Natal (mas corta fácil)",
      "teamLab",
      "Restaurantes virais do TikTok",
      "Templos de Kyoto (desejo mais forte do questionário)",
    ],
    cuts: ["Iluminações de Natal"],
    veto: 'Trilha — "vai tá muito frio"',
  },
];

export const CONFLICTS = [
  {
    conflict: "Pedro quer subir o Fushimi Inari inteiro; Gio recusa trilha",
    resolution:
      "Split: Pedro sobe sozinho (2–3h), Gio vê só os portais de baixo (15–20 min) e segue para outro programa; reencontro no almoço",
    status: "resolvido",
  },
  {
    conflict: "Pedro vetou templo; Gio quer templos de Kyoto",
    resolution: "Resolvido pelo próprio Pedro: 1–2 templos entram, sem virar o foco da viagem",
    status: "resolvido",
  },
  {
    conflict:
      "Pedro quer onsen; tem tatuagem (barrada na maioria dos banhos públicos); além disso são irmãos, e num onsen comum ficariam em alas separadas de qualquer forma",
    resolution: "Banho privativo reservado (kashikiri-buro) em Arima — resolve os dois problemas ao mesmo tempo",
    status: "resolvido",
  },
  {
    conflict: "Pedro quer DisneySea; consome um dia inteiro dos 4,5 dias de Tóquio",
    resolution: "Duas versões de roteiro de Tóquio foram montadas — decisão ainda em aberto",
    status: "aberto",
  },
  {
    conflict: "Nenhum dos dois marcou Nara nem Universal Studios",
    resolution: "Cortados do roteiro-base, mantidos como opção no catálogo",
    status: "resolvido",
  },
];

// ===== 4. DECISÕES JÁ TOMADAS =====
export const SETTLED = [
  "Ordem no Kansai: Kyoto primeiro, Osaka depois",
  "Divisão de noites: Kyoto 3 / Osaka 4",
  "Não comprar JR Pass — o trajeto sai mais barato em passagens avulsas",
  "Usar Suica/ICOCA (mesmo cartão funciona nas duas regiões)",
  "teamLab: visitar a unidade de Kyoto (Biovortex), não a de Tóquio, para não duplicar",
  "Onsen: banho privativo, não banho público",
];

// ===== 5. LOGÍSTICA ENTRE CIDADES =====
export const LOGISTICS = [
  { from: "Narita", to: "Tóquio (Ueno)", mode: "Skyliner", time: "41 min", yen: "¥2.580", yenMid: 2580 },
  { from: "Narita", to: "Tóquio (Asakusa/Nihonbashi/Shimbashi)", mode: "Access Express (sem baldeação)", time: "~55 min", yen: "¥1.380", yenMid: 1380 },
  { from: "Tóquio", to: "Kyoto", mode: "Shinkansen Tokaido", time: "~2h15", yen: "~¥14.000", yenMid: 14000 },
  { from: "Kyoto", to: "Osaka", mode: "Trem local/rápido", time: "~30 min", yen: "¥580", yenMid: 580 },
  { from: "Osaka", to: "Himeji", mode: "Shinkansen", time: "30–50 min", yen: "¥1.520–2.310", yenMid: 1900 },
  { from: "Osaka", to: "Kobe", mode: "JR Special Rapid", time: "~22 min", yen: "¥420–1.110", yenMid: 760 },
  { from: "Osaka", to: "Arima Onsen", mode: "Ônibus direto ou Shinkansen+ônibus", time: "~50–70 min", yen: "~¥1.100–1.400 (confirmar)", yenMid: 1250 },
  { from: "Osaka/Kyoto", to: "Tóquio (volta)", mode: "Shinkansen", time: "2h15–2h30", yen: "~¥14.000", yenMid: 14000 },
  { from: "Tóquio", to: "Narita", mode: "N'EX / Access Express", time: "55min–1h", yen: "¥1.380–3.070", yenMid: 2200 },
];

export const LOGISTICS_NOTES = [
  {
    title: "Por que não comprar o JR Pass",
    body:
      "O passe de 14 dias custa ¥80.000 (¥84.000 a partir de 01/10/2026). O trajeto Tóquio↔Kyoto↔Osaka↔Tóquio em passagens avulsas sai por volta de ¥30.000–35.000 por pessoa. Só compensaria com muito mais trechos de trem-bala do que este roteiro tem.",
  },
  {
    title: "Bagagem entre cidades — considerar takkyubin",
    body:
      "Serviços como Yamato Transport (kuroneko) recolhem a mala grande no hotel de manhã e entregam no próximo hotel no dia seguinte, por ¥2.000–3.000 por mala. Vale muito a pena em Tóquio→Kyoto e Kyoto→Osaka: vocês viajam de shinkansen só com mochila. Pedir na recepção com um dia de antecedência.",
  },
];

// ===== 6-8. ROTEIRO BASE =====
// Tóquio tem duas versões (com e sem DisneySea)
export const TOKYO_VARIANTS = {
  sem: {
    id: "sem",
    label: "Sem DisneySea",
    days: [
      { date: "Qui 10/12", morning: "Asakusa (Senso-ji, Nakamise)", afternoon: "Skytree", night: "Akihabara, jantar em Kanda" },
      { date: "Sex 11/12", morning: "Shibuya (cruzamento, Hachiko)", afternoon: "Harajuku, Meiji Jingu, Omotesando", night: "Shinjuku (Omoide Yokocho)" },
      { date: "Sáb 12/12", morning: "Tsukiji Outer Market (café da manhã)", afternoon: "Ginza, Jardim Imperial", night: "Roppongi Hills / Tokyo Tower, vista noturna" },
      { date: "Dom 13/12", morning: "Ueno, Ameyoko", afternoon: "Compras / depachika", night: "Jantar de despedida de Tóquio" },
    ],
    cost: null,
  },
  com: {
    id: "com",
    label: "Com DisneySea",
    days: [
      { date: "Qui 10/12", morning: "Asakusa (Senso-ji, Nakamise)", afternoon: "Skytree", night: "Akihabara" },
      { date: "Sex 11/12", morning: "DisneySea — dia inteiro", afternoon: "(escolhido por ser sexta, dia de semana com menos fila)", night: "", fullDay: true },
      { date: "Sáb 12/12", morning: "Shibuya, Harajuku", afternoon: "Ginza, Tsukiji", night: "Shinjuku" },
      { date: "Dom 13/12", morning: "Ueno, Ameyoko", afternoon: "Compras", night: "Jantar de despedida" },
    ],
    cost:
      "Sobram só 3 dias para o que eram 4 blocos de bairro. Algo vai precisar ser cortado — Ginza ou o segundo bairro de compras são os candidatos naturais, por aparecerem menos nos dois questionários. Comprar o ingresso com antecedência: dezembro é temporada de eventos de Natal e esgota por horário/data.",
  },
};

export const KYOTO_DAYS = [
  {
    date: "Seg 14/12",
    title: "Chegada",
    slots: [
      { time: "12:30", what: "Chegada via shinkansen, check-in no hotel" },
      { time: "14:30", what: "Nishiki Market (mercado coberto, bom para tarde de chegada)" },
      { time: "18:30", what: "Jantar em Pontocho, caminhada por Gion/Hanamikoji" },
    ],
  },
  {
    date: "Ter 15/12",
    title: "Fushimi + Higashiyama",
    slots: [
      { time: "6:30", what: "Fushimi Inari dividido: Pedro sobe a montanha inteira (2–3h); Gio vê os portais de baixo (15–20 min) e segue para o centro", split: true },
      { time: "11:00", what: "Reencontro e almoço" },
      { time: "13:00", what: "Kiyomizu-dera e Higashiyama (Sannenzaka/Ninenzaka) — templo nº1 do roteiro" },
      { time: "18:30", what: "Jantar em Gion (opcional, dependendo da energia)" },
    ],
  },
  {
    date: "Qua 16/12",
    title: "Kinkaku-ji + teamLab + compras",
    slots: [
      { time: "9:00", what: "Kinkaku-ji, visita rápida (45min–1h) — templo nº2 e último do roteiro" },
      { time: "11:00", what: "teamLab Biovortex Kyoto (reservar com 2–3 semanas de antecedência)", booking: true },
      { time: "15:00", what: "Compras no centro (Shijo-Kawaramachi, galeria Teramachi)" },
      { time: "19:00", what: "Arrumação para Osaka" },
    ],
  },
];

export const OSAKA_DAYS = [
  {
    date: "Qui 17/12",
    title: "Chegada + Kaiyukan",
    slots: [
      { time: "10:00", what: "Viagem Kyoto → Osaka (30 min), check-in no hotel" },
      { time: "14:00", what: "Aquário Kaiyukan (~3h, um dos maiores do mundo)" },
      { time: "18:00", what: "Dotonbori e Kuromon Market — jantar de rua + primeira noite de bar" },
    ],
  },
  {
    date: "Sex 18/12",
    title: "Himeji + Kobe",
    slots: [
      { time: "8:00", what: "Castelo de Himeji (único castelo original e intacto do país)" },
      { time: "14:00", what: "Kobe — bairro de Kitano, jantar de carne de Kobe no caminho de volta" },
    ],
  },
  {
    date: "Sáb 19/12",
    title: "Arima Onsen",
    slots: [
      { time: "9:00", what: "Arima Onsen, banho privativo reservado (kashikiri)", booking: true },
      { time: "17:00", what: "Retorno, noite livre em Namba ou Dotonbori" },
    ],
  },
  {
    date: "Dom 20/12",
    title: "Último dia cheio",
    slots: [
      { time: "9:00", what: "Castelo de Osaka" },
      { time: "15:30", what: "Umeda Sky Building, pôr do sol no observatório suspenso" },
      { time: "18:00", what: "Shinsaibashi e Amerikamura, última noite de compras" },
      { time: "20:30", what: "Dotonbori, jantar de despedida do Kansai" },
    ],
  },
  {
    date: "Seg 21/12",
    title: "Transição para Narita",
    slots: [
      { time: "Manhã", what: "Livre em Osaka (sem hora de fechamento de templo pressionando — a vantagem de terminar aqui)" },
      { time: "Tarde", what: "Shinkansen Osaka → Tóquio (~2h30) → trem até Narita (~1h)" },
      { time: "Noite", what: "Check-in no 9h (já reservado, flexível)" },
    ],
  },
];

// ===== CATÁLOGO DE PASSEIOS SELECIONÁVEIS =====
// match: "pedro" | "gio" | "ambos"
// level: "alto" | "medio" | "baixo"
export const EXTRAS = [
  // ---------- TÓQUIO ----------
  {
    id: "x-teamlab-tokyo", city: "toquio", name: "teamLab Planets (Toyosu) ou Borderless (Azabudai)",
    category: "Cultura/arte", duration: "2–4h", match: "ambos", level: "medio",
    note: "Redundante com o teamLab de Kyoto já no plano — só incluir se sobrar tempo, principalmente na versão sem DisneySea.",
    lat: 35.6491, lng: 139.7897,
  },
  {
    id: "x-shibuya-sky", city: "toquio", name: "Shibuya Sky (observatório)",
    category: "Vista", duration: "1–1,5h", match: "ambos", level: "alto",
    note: "Encaixa fácil no fim da tarde em Shibuya.",
    lat: 35.6580, lng: 139.7016,
  },
  {
    id: "x-tokyo-tower", city: "toquio", name: "Tokyo Tower ou Mori Tower (Roppongi)",
    category: "Vista", duration: "1–1,5h", match: "ambos", level: "alto",
    note: "Alternativa ao Skytree, mais central.",
    lat: 35.6586, lng: 139.7454,
  },
  {
    id: "x-golden-gai", city: "toquio", name: "Golden Gai (Shinjuku)",
    category: "Vida noturna", duration: "1–2h", match: "ambos", level: "medio",
    note: "Combina com a noite em Shinjuku já prevista.",
    lat: 35.6938, lng: 139.7048,
  },
  {
    id: "x-yanaka", city: "toquio", name: "Yanaka Ginza",
    category: "Bairro/comida", duration: "2–3h", match: "ambos", level: "medio",
    note: "Bairro antigo, menos turístico, boa opção de manhã tranquila.",
    lat: 35.7276, lng: 139.7668,
  },
  {
    id: "x-odaiba", city: "toquio", name: "Odaiba",
    category: "Vista/compras", duration: "Meio dia", match: "ambos", level: "baixo",
    note: "Vale conferir atrações em cartaz perto da data.",
    lat: 35.6252, lng: 139.7756,
  },
  {
    id: "x-kamakura", city: "toquio", name: "Kamakura (bate-volta)",
    category: "Templo/natureza", duration: "Dia inteiro", match: "pedro", level: "baixo",
    note: "Fora do centro (~1h); não recomendado dado o veto de maratona de templo e o tempo já apertado.",
    lat: 35.3167, lng: 139.5361,
  },
  {
    id: "x-ueno-zoo", city: "toquio", name: "Ueno Zoo (pandas)",
    category: "Família/lazer", duration: "2h", match: "ambos", level: "baixo",
    note: "Alternativa leve se quiserem variar o ritmo.",
    lat: 35.7166, lng: 139.7712,
  },

  // ---------- KYOTO ----------
  {
    id: "x-cha-uji", city: "kyoto", name: "Cerimônia do chá ou Uji (matcha)",
    category: "Cultura", duration: "Meia manhã (Uji: dia inteiro com deslocamento)",
    match: "pedro", level: "alto", priority: true,
    note: "Marcado por Pedro no questionário e ficou de fora do roteiro-base por falta de tempo. Se quiserem incluir, tirar de outro bloco — Uji fica a 30 min, dá pra fazer no lugar da tarde de compras do dia 16.",
    lat: 34.8914, lng: 135.8073,
  },
  {
    id: "x-arashiyama", city: "kyoto", name: "Arashiyama (bambuzal + macacos)",
    category: "Natureza", duration: "Meia manhã", match: "pedro", level: "alto",
    note: "Alto para Pedro (natureza=1), baixo para Gio (natureza=8). Bom candidato a 'programa individual' do Pedro, como o Fushimi.",
    solo: "pedro",
    lat: 35.0170, lng: 135.6710,
  },
  {
    id: "x-nijo", city: "kyoto", name: "Castelo Nijo",
    category: "Cultura/história", duration: "1,5h", match: "ambos", level: "medio",
    note: "Alternativa leve de 'templo' que na verdade é castelo — pode substituir um dos dois já escolhidos.",
    lat: 35.0142, lng: 135.7481,
  },
  {
    id: "x-philosopher", city: "kyoto", name: "Passeio do Filósofo (Philosopher's Path)",
    category: "Natureza/caminhada", duration: "1–2h", match: "pedro", level: "alto",
    note: "Liga vários templos menores por um canal arborizado.",
    lat: 35.0270, lng: 135.7940,
  },
  {
    id: "x-quimono", city: "kyoto", name: "Aluguel de quimono",
    category: "Experiência cultural", duration: "Dia inteiro", match: "ambos", level: "baixo",
    note: "Baixo para os dois (ambos pontuaram baixo). Incluído só por ser clássico de Kyoto — não é prioridade de nenhum dos dois.",
    lat: 35.0037, lng: 135.7780,
  },
  {
    id: "x-nara", city: "kyoto", name: "Nara (bate-volta: cervos + Buda gigante)",
    category: "Natureza/cultura", duration: "Meio dia", match: "ambos", level: "baixo",
    cutByBoth: true,
    note: "Cortado por ambos, mas é o bate-volta mais recomendado do Kansai — mantido caso mudem de ideia. Precisa tirar meio dia de outro bloco.",
    lat: 34.6851, lng: 135.8048,
  },
  {
    id: "x-uji-simples", city: "kyoto", name: "Uji isolado (sem cerimônia formal)",
    category: "Comida/passeio", duration: "Meio dia", match: "ambos", level: "alto",
    note: "Versão mais simples do item do chá — só passear e comer matcha, sem cerimônia marcada. Alto porque comida é prioridade 1 e 2 dos dois.",
    lat: 34.8914, lng: 135.8073,
  },

  // ---------- OSAKA ----------
  {
    id: "x-museu-habitacao", city: "osaka", name: "Museu da Habitação e Vida de Osaka",
    category: "Museu", duration: "1,5–2h", match: "gio", level: "medio", priority: true,
    solo: "gio",
    note: "Não entrou no roteiro-base — é a categoria em que a preferência dos dois mais diverge (Gio 4, Pedro 7), então serve bem como 'programa individual' dela, no mesmo espírito da divisão do Fushimi Inari.",
    lat: 34.7033, lng: 135.5188,
  },
  {
    id: "x-hozenji", city: "osaka", name: "Hozenji Yokocho",
    category: "Templo pequeno/bairro", duration: "20–30 min", match: "ambos", level: "alto",
    note: "Dá o gostinho de templo sem custar tempo. Fica dentro da própria zona de Dotonbori, ótimo encaixe numa noite de bar.",
    lat: 34.6685, lng: 135.5030,
  },
  {
    id: "x-hep-five", city: "osaka", name: "HEP FIVE (roda-gigante no shopping)",
    category: "Vista/lazer", duration: "30–45 min", match: "ambos", level: "medio",
    note: "Alternativa mais barata e rápida ao Umeda Sky.",
    lat: 34.7038, lng: 135.4988,
  },
  {
    id: "x-usj", city: "osaka", name: "Universal Studios Japan (Super Nintendo World)",
    category: "Parque temático", duration: "Dia inteiro", match: "pedro", level: "baixo",
    cutByBoth: true,
    note: "Cortado por ambos, não marcado — mas é a maior atração de Osaka. Ingresso precisa ser comprado com meses de antecedência; se entrar, provavelmente substitui o dia de Himeji+Kobe ou de Arima inteiro.",
    lat: 34.6654, lng: 135.4323,
  },
  {
    id: "x-nara-osaka", city: "osaka", name: "Nara (bate-volta a partir de Osaka)",
    category: "Natureza/cultura", duration: "Meio dia", match: "ambos", level: "baixo",
    cutByBoth: true,
    note: "Também acessível a 40 min de Osaka, caso prefiram fazer daqui em vez de Kyoto.",
    lat: 34.6851, lng: 135.8048,
  },
  {
    id: "x-koyasan", city: "osaka", name: "Koyasan (mosteiro na montanha)",
    category: "Cultura/natureza", duration: "Exige pernoite", match: "pedro", level: "baixo",
    note: "Baixa prioridade dada a agenda fechada. Só entra se abrirem mão de uma noite de Osaka ou Kyoto.",
    lat: 34.2131, lng: 135.5850,
  },
  {
    id: "x-shitennoji", city: "osaka", name: "Shitenno-ji",
    category: "Templo", duration: "1h", match: "ambos", level: "medio",
    note: "Templo budista mais antigo do Japão, dentro da própria Osaka — opção rápida se quiserem um terceiro templo sem sair da cidade.",
    lat: 34.6532, lng: 135.5162,
  },
  {
    id: "x-iluminacoes-osaka", city: "osaka", name: "Iluminações de Nakanoshima / avenida principal",
    category: "Luzes de Natal", duration: "1h", match: "pedro", level: "medio",
    note: "Gio marcou como fácil de cortar — manter como 'se sobrar tempo', não como prioridade.",
    lat: 34.6937, lng: 135.4990,
  },
];

// ===== 9. PENDÊNCIAS =====
export const OPEN_DECISIONS = [
  { id: "d-disneysea", label: "DisneySea: incluir ou não", detail: "Depende de qual dos dois roteiros de Tóquio vocês escolherem.", severity: "alta" },
  { id: "d-hotel-kyoto", label: "Hospedagem em Kyoto", detail: "Ainda não pesquisada.", severity: "alta" },
  { id: "d-hotel-osaka", label: "Hospedagem em Osaka", detail: "Ainda não pesquisada.", severity: "alta" },
  { id: "d-teamlab", label: "Reserva do teamLab Biovortex Kyoto", detail: "Fazer com 2–3 semanas de antecedência.", severity: "alta" },
  { id: "d-arima", label: "Reserva do banho privativo em Arima", detail: "Fazer com antecedência, principalmente por cair num sábado.", severity: "alta" },
  { id: "d-himeji-kobe", label: "Himeji + Kobe no mesmo dia ou separados", detail: "O roteiro-base junta os dois; se quiserem mais tempo no castelo, dá para separar tirando uma manhã do dia do Arima.", severity: "media" },
  { id: "d-tiktok", label: "Restaurantes virais do TikTok (pedido da Gio)", detail: "Não travar agora: pesquisar perto da data, porque esse tipo de lista muda mês a mês.", severity: "baixa" },
  { id: "d-uji", label: "Uji / cerimônia do chá (pedido do Pedro)", detail: "Ficou de fora do roteiro-base; decidir se substitui algo no dia 16 em Kyoto.", severity: "media" },
];

// ===== 10. ITENS PRÁTICOS =====
export const PRACTICAL = [
  { id: "p-esim", emoji: "📶", title: "Conectividade", body: "Decidir entre eSIM (Ubigi, Airalo, Sakura Mobile) ou aluguel de Wi-Fi portátil no aeroporto. Sem isso, Google Maps e tradução ficam limitados." },
  { id: "p-seguro", emoji: "🛡️", title: "Seguro viagem", body: "Atendimento médico no Japão não é gratuito para turista. Vale contratar antes de embarcar." },
  { id: "p-dinheiro", emoji: "💴", title: "Dinheiro em espécie", body: "O Japão ainda é mais dependente de dinheiro do que parece — templos, lojas pequenas e alguns restaurantes não aceitam cartão. Caixas de 7-Eleven e dos Correios (Japan Post) aceitam cartão internacional de forma confiável." },
  { id: "p-ic", emoji: "📱", title: "Cartão IC no celular", body: "Dá para colocar Suica ou ICOCA na carteira digital (Apple Pay ou app no Android), evitando fila de recarga. O mesmo cartão funciona em Tóquio e no Kansai." },
  { id: "p-clima", emoji: "🧥", title: "Clima e mala", body: "Dezembro em Tóquio e no Kansai costuma ter máximas de 8–13°C e mínimas de 0–5°C. Arima, por estar mais alto, é mais frio. Roupa em camadas, casaco bom, e conferir previsão perto da data." },
  { id: "p-restaurante", emoji: "🍽️", title: "Reserva de restaurante", body: "Lugares concorridos (omakase, teppanyaki, ramen famoso) fecham agenda com dias ou semanas de antecedência, ainda mais em dezembro. Usar Tabelog ou pedir para a concierge do hotel." },
  { id: "p-etiqueta", emoji: "🙇", title: "Etiqueta básica", body: "Não se dá gorjeta (pode ser recebido como ofensa); evitar falar alto ou comer andando fora de zonas de comida de rua; em alguns lugares (provador de quimono, certos restaurantes) é preciso tirar o sapato." },
  { id: "p-plugue", emoji: "🔌", title: "Plugue e voltagem", body: "Japão usa tomada tipo A (2 pinos, igual à americana) e 100V. A maioria dos carregadores modernos aceita 100–240V, mas vale conferir os seus." },
  { id: "p-epoca", emoji: "🎄", title: "Época do ano", body: "A viagem termina dia 22/12, então vocês escapam da lotação de Ano Novo, que começa a pesar a partir de 29/12. As iluminações de Natal estarão no auge em Tóquio, Kobe e Osaka — pode gerar aglomeração pontual à noite (Marunouchi, Roppongi, avenida principal de Osaka), mesmo sendo baixa temporada no geral." },
];

// ===== 11. ORÇAMENTO =====
export const BUDGET_LINES = [
  { id: "b-tokyo", label: "Hotel Tóquio (5 noites, 2 pessoas)", brl: 2824, status: "pago" },
  { id: "b-narita", label: "Cápsula Narita (1 noite, 2 pessoas)", brl: 427, sub: "¥13.110", status: "pago" },
  { id: "b-kyoto", label: "Hotel Kyoto (3 noites)", brl: null, status: "aberto" },
  { id: "b-osaka", label: "Hotel Osaka (4 noites)", brl: null, status: "aberto" },
  { id: "b-trens", label: "Trens entre cidades (por pessoa, ida)", brl: 1075, sub: "~¥30.000–35.000 (~R$ 1.000–1.150)", perPerson: true, status: "estimado" },
  { id: "b-batevolta", label: "Bate-voltas do Kansai (Himeji, Kobe, Arima)", brl: 180, sub: "~¥5.000–6.000 por pessoa", perPerson: true, status: "estimado" },
  { id: "b-diario", label: "Alimentação e gastos diários", brl: 3900, sub: "R$ 300/pessoa/dia × 13 dias", perPerson: true, status: "estimado" },
  { id: "b-teamlab", label: "teamLab Biovortex Kyoto", brl: 150, sub: "~¥3.600–5.600 por pessoa", perPerson: true, status: "estimado" },
  { id: "b-disney", label: "DisneySea (se incluído)", brl: 331, sub: "~¥9.400–10.900 por pessoa", perPerson: true, status: "opcional" },
];

// ===== 12. CHECKLIST =====
export const CHECKLIST = [
  { id: "c-kyoto", label: "Reservar hotel em Kyoto" },
  { id: "c-osaka", label: "Reservar hotel em Osaka" },
  { id: "c-teamlab", label: "Comprar ingresso do teamLab Biovortex Kyoto" },
  { id: "c-disney", label: "Decidir DisneySea e comprar ingresso, se for o caso" },
  { id: "c-arima", label: "Reservar banho privativo em Arima" },
  { id: "c-esim", label: "Configurar eSIM ou reservar Wi-Fi portátil" },
  { id: "c-seguro", label: "Contratar seguro viagem" },
  { id: "c-suica", label: "Configurar Suica/ICOCA no celular (ou comprar cartão físico na chegada)" },
  { id: "c-banco", label: "Avisar o banco/cartão sobre a viagem, para evitar bloqueio" },
  { id: "c-restaurante", label: "Reservar restaurantes mais concorridos, se houver algum específico em mente" },
  { id: "c-cancelar", label: "Cancelar reservas alternativas de hotel não usadas (Villa Fontaine, APA, etc.)" },
];
