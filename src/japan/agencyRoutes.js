// Comparação entre os roteiros de agência que o Pedro recebeu e o que existe neste site.
// status: "tinha"  = já estava no catálogo antes desta conferência
//         "novo"   = entrou agora, justamente por aparecer nesses roteiros
//         "fora"   = não cabe nesta viagem, com o motivo explicado
export const COVERAGE = {
  tinha: { label: "Já estava no site", emoji: "✅", color: "#22c55e" },
  novo: { label: "Adicionado agora", emoji: "🆕", color: "#38bdf8" },
  fora: { label: "Não cabe na viagem", emoji: "⚠️", color: "#f59e0b" },
};

export const AGENCY_ROUTES = [
  {
    id: "happytour",
    name: "Japão + Singapura + Dubai",
    source: "Documento que você enviou (Happy Tour, 23/03 a 10/04 de 2027)",
    shape: "Grupo de no mínimo 30 pessoas, guia falando espanhol, 3 almoços inclusos.",
    price: "USD 6.135 por pessoa em quarto duplo, só a parte terrestre do Japão — sem passagem aérea.",
    nights: "Tóquio 4n · Kyoto 3n · Osaka 2n (+ Singapura e Dubai como extensões)",
    verdict:
      "O trecho Japão é 9 dias contra os 13 de vocês, e o preço da parte terrestre sozinho (≈R$33 mil por pessoa ao câmbio de hoje) já estoura o orçamento inteiro de R$40 mil que vocês têm para os dois.",
    items: [
      { name: "Harajuku e Omotesando", status: "tinha", actId: "t-harajuku" },
      { name: "Santuário Meiji Jingu", status: "tinha", actId: "t-meiji" },
      { name: "Shibuya Scramble Crossing", status: "tinha", actId: "t-shibuya-crossing" },
      { name: "Tokyo Tower", status: "tinha", actId: "t-tokyo-tower" },
      { name: "Monte Fuji (tour de dia inteiro)", status: "novo", actId: "t-kawaguchiko" },
      { name: "Yokohama: Cup Noodles, Yamashita Park, Chinatown", status: "novo", actId: "t-yokohama" },
      { name: "Kinkaku-ji, o Pavilhão Dourado", status: "tinha", actId: "k-kinkakuji" },
      { name: "Kiyomizu-dera", status: "tinha", actId: "k-kiyomizu" },
      { name: "Fushimi Inari-taisha", status: "tinha", actId: "k-fushimi" },
      { name: "Hiroshima + Miyajima + Memorial da Paz", status: "tinha", actId: "dt-hiroshima-act" },
      { name: "Nara: Todai-ji e o parque dos cervos", status: "tinha", actId: "k-nara" },
      { name: "Nara: Kasuga Taisha", status: "novo", actId: "k-kasuga" },
      { name: "Nara: Kofuku-ji", status: "novo", actId: "k-kofukuji" },
      { name: "Umeda Sky Building", status: "tinha", actId: "o-umeda-sky" },
      { name: "Castelo de Osaka", status: "tinha", actId: "o-osaka-castle" },
      { name: "Museu de História de Osaka", status: "tinha", actId: "o-museu-historia" },
      { name: "Shinsaibashi", status: "tinha", actId: "o-shinsaibashi" },
      {
        name: "Dubai e Singapura",
        status: "fora",
        note: "São extensões vendidas à parte deste pacote. As passagens de vocês já estão compradas, com chegada e saída por Tóquio — não há como encaixar.",
      },
    ],
  },
  {
    id: "bahiavista",
    name: "Japão — Cores do Outono",
    source: "bahiavista.com.br/japao-cores-do-outono (roteiro de outono)",
    shape: "Hotéis 4 estrelas com café da manhã, roteiro acompanhado.",
    price: "Sob consulta no site.",
    nights: "Osaka 2n · Kyoto 4n · Takayama 1n · Hakone 1n · Tóquio 4n (+ Dubai 2n)",
    verdict:
      "É um roteiro de OUTONO, montado em cima das folhas vermelhas de outubro e novembro. Vocês vão em dezembro: os momiji já caíram. Metade da graça desse pacote não existe na data de vocês — e ele usa 4 bases (inclui Takayama e Hakone) contra as 3 de vocês.",
    items: [
      { name: "Castelo de Osaka", status: "tinha", actId: "o-osaka-castle" },
      { name: "Nara: Todai-ji e os cervos sagrados", status: "tinha", actId: "k-nara" },
      { name: "Fushimi Inari-taisha", status: "tinha", actId: "k-fushimi" },
      { name: "Kinkaku-ji, o Pavilhão Dourado", status: "tinha", actId: "k-kinkakuji" },
      { name: "Kiyomizu-dera", status: "tinha", actId: "k-kiyomizu" },
      { name: "Hakone: Lago Ashi, teleférico e Owakudani", status: "novo", actId: "t-hakone" },
      { name: "Monte Fuji", status: "novo", actId: "t-kawaguchiko" },
      { name: "Kanazawa: Kenroku-en e cultura samurai", status: "novo", actId: "k-kanazawa" },
      {
        name: "Takayama e Shirakawa-go",
        status: "novo",
        actId: "k-shirakawago",
        note: "Entrou no catálogo, mas com o veredito explicado: exige pernoite fora e o light-up na neve é só janeiro e fevereiro.",
      },
      {
        name: "Folhas vermelhas de outono (momiji)",
        status: "fora",
        note: "É o tema do pacote inteiro e não acontece em dezembro. O Tofuku-ji, o ponto nº1 de folhas de Kyoto em novembro, aparece no site justamente com esse aviso.",
      },
      {
        name: "Festival de outono de Takayama",
        status: "fora",
        note: "Acontece em outubro. Não existe na data de vocês.",
      },
      {
        name: "Dubai (2 noites)",
        status: "fora",
        note: "Extensão do pacote. As passagens de vocês são diretas para Tóquio.",
      },
    ],
  },
];

// O que vocês têm que nenhum dos dois roteiros de agência tem
export const YOUR_EDGE = [
  "13 dias só no Japão, contra 9 e 11 dos pacotes — mais tempo em menos cidades",
  "Dezembro entrega o que outubro não dá: iluminações de Natal, temporada de caranguejo e a melhor visibilidade do Monte Fuji do ano inteiro",
  "Nada de grupo de 30 pessoas com guia em espanhol e horário fechado",
  "DisneySea, teamLab, Kobe, Himeji, Arima Onsen e a vida noturna de Osaka — nenhum pacote inclui",
  "Comida de rua e konbini no lugar de almoço de excursão em restaurante de grupo",
];
