/*
 * ROTA IDEAL — montada em 03/11/2026 a partir das escolhas finais da Klook.
 * Regra: os passeios pagos são âncoras; o resto do dia é "bater perna" em
 * bairros próximos, sem correria (2–3 lugares por dia, folga entre um e outro).
 *
 * kind: "klook" (já no carrinho) | "comprar" (escolhido, venda ainda não abriu)
 *       | "perna" (andar/explorar, grátis) | "comida" | "transp" | "livre"
 * map: texto para busca no Google Maps. from/end: onde a rota do dia começa e termina
 * (hotel), usados no botão "Rota do dia no Google Maps".
 */

export const ROUTE_UPDATED = "03/11/2026";

export const ROUTE_KINDS = {
  klook: { label: "Ingresso", cls: "bg-emerald-500/20 text-emerald-100" },
  comprar: { label: "Comprar quando abrir", cls: "bg-amber-500/25 text-amber-100" },
  perna: { label: "Bater perna", cls: "bg-sky-500/20 text-sky-100" },
  comida: { label: "Comer", cls: "bg-rose-500/20 text-rose-100" },
  transp: { label: "Deslocamento", cls: "bg-slate-500/25 text-slate-200" },
  livre: { label: "Livre", cls: "bg-violet-500/20 text-violet-100" },
};

export const ROUTE_DAYS = [
  {
    n: 1, date: "Qua 09/12", city: "toquio", title: "Chegada + Tóquio iluminada", pace: "leve",
    from: "Comfort Hotel Tokyo Higashi Nihombashi", end: "Comfort Hotel Tokyo Higashi Nihombashi",
    sleep: "Comfort Hotel Higashi Nihombashi",
    slots: [
      { time: "11:45", kind: "transp", what: "Pouso em Narita. Trem Access Express direto até Higashi-Nihombashi (~55 min)." },
      { time: "14:30", kind: "livre", what: "Check-in e descanso — dia de voo longo, não tem nada marcado." },
      { time: "—", kind: "klook", what: "Cupom Don Quijote — vale a viagem toda.", klookId: "cupom-donki" },
      { time: "—", kind: "klook", what: "Cupom Bic Camera — vale a viagem toda.", klookId: "cupom-bic" },
      { time: "17:00", kind: "perna", what: "Caminhada leve: Nihonbashi → Estação de Tóquio. A avenida Naka-dori de Marunouchi fica toda iluminada em dezembro.", map: "Marunouchi Naka-dori Illumination" },
      { time: "19:00", kind: "comida", what: "Jantar na Tokyo Ramen Street (subsolo da Estação de Tóquio). Voltar cedo.", map: "Tokyo Ramen Street" },
    ],
    tip: "Antes de sair do Brasil: baixem no celular todos os PDFs dos vouchers (botão amarelo em cada ingresso) para abrir sem internet.",
  },
  {
    n: 2, date: "Qui 10/12", city: "toquio", title: "Asakusa + Akihabara", pace: "médio",
    from: "Comfort Hotel Tokyo Higashi Nihombashi", end: "Comfort Hotel Tokyo Higashi Nihombashi",
    sleep: "Comfort Hotel Higashi Nihombashi",
    slots: [
      { time: "09:30", kind: "perna", what: "Templo Senso-ji e a rua Nakamise cedo, antes da multidão.", map: "Senso-ji" },
      { time: "11:00", kind: "perna", what: "Kappabashi, a rua das lojas de cozinha (facas, pratos, comida de plástico) — 10 min a pé.", map: "Kappabashi Dougu Street" },
      { time: "12:15", kind: "comida", what: "Almoço em Asakusa (tempurá ou lámen)." },
      { time: "13:30", kind: "klook", what: "Museu Samurai & Ninja com experiência (~1h).", klookId: "samurai-tokyo", map: "Samurai Ninja Museum Tokyo Asakusa" },
      { time: "15:00", kind: "perna", what: "Beira do rio Sumida e ponte Azuma — a melhor vista do Skytree de graça. Café e pausa.", map: "Sumida Park" },
      { time: "16:45", kind: "transp", what: "Metrô Ginza até Suehirocho (10 min)." },
      { time: "17:00", kind: "perna", what: "Akihabara: fliperamas (GiGO, Taito Station), lojas de games retrô (Super Potato), Yodobashi e Bic Camera.", map: "Akihabara Electric Town" },
      { time: "19:30", kind: "comida", what: "Jantar nos izakayas debaixo dos trilhos de Kanda — a 10 min do hotel.", map: "Kanda Station" },
    ],
  },
  {
    n: 3, date: "Sex 11/12", city: "toquio", title: "Harajuku + Shibuya", pace: "médio",
    from: "Comfort Hotel Tokyo Higashi Nihombashi", end: "Comfort Hotel Tokyo Higashi Nihombashi",
    sleep: "Comfort Hotel Higashi Nihombashi",
    slots: [
      { time: "10:00", kind: "perna", what: "Santuário Meiji Jingu — floresta no meio da cidade, caminhada tranquila (~45 min).", map: "Meiji Jingu" },
      { time: "11:00", kind: "perna", what: "Takeshita Street (Harajuku): lojinhas e crepe.", map: "Takeshita Street" },
      { time: "12:30", kind: "comida", what: "Almoço em Omotesando." },
      { time: "13:30", kind: "perna", what: "Omotesando e Cat Street a pé até Shibuya — lojas de rua, sem pressa.", map: "Cat Street Shibuya" },
      { time: "15:00", kind: "perna", what: "Cruzamento de Shibuya e estátua do Hachiko.", map: "Shibuya Scramble Crossing" },
      { time: "15:40", kind: "comprar", what: "Shibuya Sky — mirante a céu aberto, pôr do sol às 16:28.", klookId: "shibuya-sky", map: "Shibuya Sky" },
      { time: "17:30", kind: "perna", what: "Shibuya Parco (Nintendo Tokyo e Pokémon Center) e Don Quijote de Shibuya (cupom).", map: "Shibuya Parco" },
      { time: "19:30", kind: "comida", what: "Jantar em Shibuya. Quem tiver pique: Omoide Yokocho em Shinjuku (2 paradas)." },
    ],
  },
  {
    n: 4, date: "Sáb 12/12", city: "toquio", title: "Tsukiji + Ginza + Tokyo Tower", pace: "médio",
    from: "Comfort Hotel Tokyo Higashi Nihombashi", end: "Comfort Hotel Tokyo Higashi Nihombashi",
    sleep: "Comfort Hotel Higashi Nihombashi",
    slots: [
      { time: "08:30", kind: "comida", what: "Café da manhã no Mercado de Tsukiji por conta própria: omelete tamagoyaki, sushi, ostras.", map: "Tsukiji Outer Market" },
      { time: "10:30", kind: "perna", what: "Jardim Hama-rikyu (15 min a pé), com casa de chá no lago. Opcional.", map: "Hamarikyu Gardens" },
      { time: "12:00", kind: "perna", what: "Ginza: no sábado a avenida Chuo-dori fecha para carros à tarde. Itoya (papelaria), Uniqlo e o depachika (andar de comida) do Mitsukoshi.", map: "Ginza Chuo-dori" },
      { time: "15:30", kind: "perna", what: "Templo Zojo-ji, ao pé da Tokyo Tower.", map: "Zojo-ji" },
      { time: "16:00", kind: "klook", what: "Tokyo Tower — mirante de 150 m, pôr do sol às 16:29.", klookId: "tokyo-tower", map: "Tokyo Tower" },
      { time: "17:30", kind: "perna", what: "Azabudai Hills e Roppongi Hills: mercado de Natal e a avenida Keyakizaka iluminada.", map: "Roppongi Hills Keyakizaka" },
      { time: "19:30", kind: "comida", what: "Jantar em Roppongi e volta ao hotel." },
    ],
  },
  {
    n: 5, date: "Dom 13/12", city: "toquio", title: "Shimokitazawa + Shinjuku + Yomiuriland", pace: "médio",
    from: "Comfort Hotel Tokyo Higashi Nihombashi", end: "Comfort Hotel Tokyo Higashi Nihombashi",
    sleep: "Comfort Hotel Higashi Nihombashi",
    slots: [
      { time: "Manhã", kind: "livre", what: "Manhã devagar (a Gio rende mais à tarde). Deixar a mala grande pronta para o takkyubin." },
      { time: "11:00", kind: "perna", what: "Shimokitazawa: brechós, lojas vintage e cafés. Almoço lá (o curry do bairro é famoso).", map: "Shimokitazawa" },
      { time: "14:00", kind: "perna", what: "Shinjuku: depachika da Isetan, Don Quijote e a cabeça do Godzilla em Kabukicho.", map: "Shinjuku Isetan" },
      { time: "15:45", kind: "transp", what: "Linha Keio, de Shinjuku até Keio-Yomiuri-Land (~40 min), e o teleférico do parque." },
      { time: "17:00", kind: "klook", what: "Yomiuriland + Jewellumination: brinquedos e o show de luzes de Natal (~3h). Jantar no parque.", klookId: "yomiuriland", map: "Yomiuriland" },
      { time: "20:30", kind: "transp", what: "Volta ao hotel (~1h)." },
    ],
    tip: "Pedir na recepção, até a noite do dia 13, o envio da mala grande para o hotel de Kyoto (takkyubin, ~¥2.500 por mala).",
  },
  {
    n: 6, date: "Seg 14/12", city: "kyoto", title: "Chegada em Kyoto: Kinkaku-ji + Nishiki + Gion", pace: "médio",
    from: "Kyoto Station", end: "HOTEL MYSTAYS Kyoto Shijo",
    sleep: "MYSTAYS Kyoto Shijo",
    slots: [
      { time: "10:12", kind: "transp", what: "Trem-bala NOZOMI 23 Tóquio 10:12 → Kyoto 12:23 (modelo novo N700S, tomada em todo assento). Sentem na fileira E (lado direito) para ver o Monte Fuji. Comprar com EX Hayatoku 21 a partir de 13/11 22:00 (Brasília).", trains: "tq-ky" },
      { time: "12:30", kind: "transp", what: "Deixar mochilas no hotel (Shijo-Omiya) e almoçar por perto." },
      { time: "14:00", kind: "perna", what: "Kinkaku-ji, o Pavilhão Dourado (ônibus 205, ~30 min; a visita leva ~45 min).", map: "Kinkaku-ji" },
      { time: "16:00", kind: "perna", what: "Mercado Nishiki e galerias Teramachi/Shinkyogoku, provando o que der vontade.", map: "Nishiki Market" },
      { time: "18:30", kind: "comida", what: "Jantar em Pontocho, o beco à beira do rio.", map: "Pontocho" },
      { time: "20:00", kind: "perna", what: "Gion à noite: Hanamikoji e o canal Shirakawa com lanternas.", map: "Gion Shirakawa" },
    ],
  },
  {
    n: 7, date: "Ter 15/12", city: "kyoto", title: "Dia de bate-volta", pace: "livre",
    sleep: "MYSTAYS Kyoto Shijo",
    slots: [
      { time: "Dia todo", kind: "livre", what: "Bate-volta escolhido na aba “Bate-volta de Kyoto”. Sugestão: Himeji (castelo, desejo da Gio) ou Uji + Nara (chá do Pedro + templos da Gio, na mesma linha de trem)." },
      { time: "19:00", kind: "comida", what: "Volta a Kyoto e jantar perto do hotel (Shijo/Karasuma)." },
    ],
  },
  {
    n: 8, date: "Qua 16/12", city: "kyoto", title: "Fushimi Inari + teamLab + Kiyomizu", pace: "cheio",
    from: "HOTEL MYSTAYS Kyoto Shijo", end: "HOTEL MYSTAYS Kyoto Shijo",
    sleep: "MYSTAYS Kyoto Shijo",
    slots: [
      { time: "07:00", kind: "perna", what: "Fushimi Inari vazio. Pedro sobe a montanha inteira (2–2h30); a Gio chega às 9:00 e vê os portões de baixo (sem trilha).", map: "Fushimi Inari Taisha", split: true },
      { time: "09:30", kind: "comida", what: "Reencontro na base e café da manhã." },
      { time: "10:30", kind: "transp", what: "Linha JR Nara: Inari → Estação de Kyoto (5 min) e 10 min a pé." },
      { time: "11:00", kind: "klook", what: "teamLab Biovortex Kyoto (~2h).", klookId: "teamlab-kyoto", map: "teamLab Biovortex Kyoto" },
      { time: "13:15", kind: "comida", what: "Almoço na Kyoto Ramen Koji (10º andar da Estação de Kyoto).", map: "Kyoto Ramen Koji" },
      { time: "14:30", kind: "transp", what: "Ônibus ou táxi até Kiyomizu (~15 min)." },
      { time: "15:00", kind: "perna", what: "Kiyomizu-dera e as ladeiras Sannenzaka/Ninenzaka (lojinhas, matcha).", map: "Kiyomizu-dera" },
      { time: "16:45", kind: "perna", what: "Santuário Yasaka e parque Maruyama no fim da tarde.", map: "Yasaka Shrine" },
      { time: "18:00", kind: "comida", what: "Jantar em Gion. Mala grande para Osaka por takkyubin." },
    ],
  },
  {
    n: 9, date: "Qui 17/12", city: "osaka", title: "Chegada em Osaka + castelo iluminado + Dotonbori", pace: "médio",
    from: "HOTEL MYSTAYS Kyoto Shijo", end: "Travelodge Honmachi Osaka",
    sleep: "Travelodge Honmachi",
    slots: [
      { time: "10:00", kind: "transp", what: "Linha Hankyu: de Omiya 1 parada até Karasuma, e lá o Expresso Limitado até Osaka-Umeda (~40 min; vagão 4 = PRiVACE, lugar marcado) e metrô até Honmachi. Deixar a mala.", trains: "ky-os" },
      { time: "12:00", kind: "comida", what: "Almoço no Mercado Kuromon: vieira, espetinho de wagyu, ouriço.", map: "Kuromon Market" },
      { time: "13:30", kind: "perna", what: "Den Den Town (games e anime) e Namba.", map: "Den Den Town" },
      { time: "15:30", kind: "livre", what: "Check-in e descanso." },
      { time: "18:00", kind: "klook", what: "Iluminação no Castelo de Osaka (~1h).", klookId: "osaka-illuminage", map: "Osaka Castle Nishinomaru Garden" },
      { time: "19:30", kind: "comida", what: "Noite de bar em Dotonbori — desejo dos dois.", map: "Dotonbori" },
    ],
  },
  {
    n: 10, date: "Sex 18/12", city: "osaka", title: "Dia de Kobe", pace: "médio",
    from: "Travelodge Honmachi Osaka", end: "Travelodge Honmachi Osaka",
    sleep: "Travelodge Honmachi",
    slots: [
      { time: "09:30", kind: "transp", what: "JR de Osaka até Sannomiya (~25 min) e metrô até Shin-Kobe." },
      { time: "10:30", kind: "comprar", what: "Teleférico de Kobe + Jardim de Ervas Nunobiki. Desçam a pé pelo jardim.", klookId: "kobe-ropeway", map: "Kobe Nunobiki Herb Gardens" },
      { time: "12:30", kind: "perna", what: "Kitano: as casas antigas dos estrangeiros, ladeiras e um Starbucks dentro de uma casa histórica.", map: "Kitano Ijinkan" },
      { time: "13:30", kind: "comida", what: "Almoço de carne de Kobe (no almoço é bem mais barato que no jantar), em Sannomiya." },
      { time: "15:00", kind: "perna", what: "Chinatown de Kobe (Nankinmachi) e o porto (Meriken Park, Harborland).", map: "Nankinmachi Kobe" },
      { time: "16:15", kind: "transp", what: "Ônibus de Sannomiya até o parque da iluminação, no norte de Kobe (~45 min). O horário do ônibus vem no voucher." },
      { time: "17:30", kind: "klook", what: "Kobe Illuminage: parque inteiro iluminado (aberto 17:00–22:00).", klookId: "kobe-illuminage", map: "Kobe Fruit Flower Park Ozawa" },
      { time: "19:30", kind: "transp", what: "Volta a Osaka (~1h15)." },
    ],
  },
  {
    n: 11, date: "Sáb 19/12", city: "osaka", title: "Universal Studios Japan", pace: "cheio",
    from: "Travelodge Honmachi Osaka", end: "Travelodge Honmachi Osaka",
    sleep: "Travelodge Honmachi",
    slots: [
      { time: "07:45", kind: "transp", what: "Metrô Chuo até Bentencho e linha JR Yumesaki até Universal City (~30 min). Cheguem antes de abrir." },
      { time: "08:30", kind: "klook", what: "Universal com Express Pass 4: fura-fila em Harry Potter e JAWS (a qualquer hora) e em Mario Kart e Donkey Kong (horário marcado no voucher).", klookId: "usj", map: "Universal Studios Japan" },
      { time: "No voucher", kind: "klook", what: "Super Nintendo World: Mario Kart e Mine-Cart Madness (Donkey Kong) nos horários do Express. Yoshi e as pulseiras Power-Up sem pressa, que a entrada na área já está garantida." },
      { time: "Tarde", kind: "perna", what: "Com as filas grandes resolvidas: resto do parque, árvore de Natal e o show de Natal ao anoitecer." },
      { time: "19:30", kind: "comida", what: "Jantar no CityWalk, na saída do parque, ou perto do hotel. Noite de descanso." },
    ],
  },
  {
    n: 12, date: "Dom 20/12", city: "osaka", title: "Umeda + compras + matcha + Dotonbori", pace: "médio",
    from: "Travelodge Honmachi Osaka", end: "Travelodge Honmachi Osaka",
    sleep: "Travelodge Honmachi",
    slots: [
      { time: "10:30", kind: "perna", what: "Nakazakicho: casinhas antigas com cafés e brechós, a 10 min a pé de Umeda.", map: "Nakazakicho" },
      { time: "12:30", kind: "comida", what: "Almoço em Umeda (andares de restaurante das lojas de departamento)." },
      { time: "13:30", kind: "perna", what: "Compras em Umeda: Yodobashi, Grand Front e o depachika da Hankyu. Na base do Umeda Sky tem o mercado de Natal alemão (grátis, sem subir no mirante).", map: "Yodobashi Umeda" },
      { time: "16:00", kind: "perna", what: "Metrô Midosuji para o sul: Shinsaibashi-suji e Amerikamura, últimas compras. Conferir no voucher o endereço da aula de matcha.", map: "Shinsaibashi-suji" },
      { time: "18:00", kind: "klook", what: "Aula de matcha e doces japoneses (~1h).", klookId: "matcha-osaka" },
      { time: "19:30", kind: "klook", what: "Barquinho no canal de Dotonbori (20 min).", klookId: "dotonbori-boat", map: "Tazaemonbashi pier" },
      { time: "20:00", kind: "comida", what: "Jantar de despedida e bar em Dotonbori." },
    ],
  },
  {
    n: 13, date: "Seg 21/12", city: "osaka", title: "Tennoji + Shinsekai → Narita", pace: "médio",
    from: "Travelodge Honmachi Osaka", end: "9h nine hours Narita Airport",
    sleep: "9h nine hours Narita (cápsula)",
    slots: [
      { time: "09:00", kind: "transp", what: "Check-out e deixar a mala no hotel." },
      { time: "09:30", kind: "klook", what: "Mirante Harukas 300 (~1h).", klookId: "harukas", map: "Abeno Harukas 300" },
      { time: "11:00", kind: "klook", what: "Torre Tsutenkaku + escorregador gigante (15 min a pé do Harukas).", klookId: "tsutenkaku", map: "Tsutenkaku" },
      { time: "12:00", kind: "comida", what: "Almoço de kushikatsu (espetinho empanado) em Shinsekai.", map: "Shinsekai Kushikatsu Daruma" },
      { time: "13:30", kind: "transp", what: "Buscar a mala, metrô até Shin-Osaka (15 min) e trem-bala ~14:00 até Tóquio (2h30); ônibus da Estação de Tóquio até Narita (~1h10). Alternativa: voo barato Kansai → Narita.", trains: "os-nrt" },
      { time: "Noite", kind: "transp", what: "Check-in na cápsula 9h, no Terminal 2 de Narita." },
    ],
  },
  {
    n: 14, date: "Ter 22/12", city: "narita", title: "Volta para casa", pace: "leve",
    slots: [
      { time: "Manhã", kind: "transp", what: "Check-out da cápsula até 10:00, no Terminal 2." },
      { time: "13:35", kind: "transp", what: "Voo de volta saindo de Narita." },
    ],
  },
];

// ===== BATE-VOLTA SAINDO DE KYOTO (hotel MYSTAYS Shijo, perto da estação Omiya) =====
// match: "pedro" | "gio" | "ambos"; size: "dia" (dia inteiro) | "meio" (meio período)
export const KYOTO_TRIPS = [
  {
    id: "himeji", name: "Himeji", emoji: "🏯", size: "dia", match: "gio", top: true,
    tagline: "O castelo original mais bonito do Japão",
    why: "Era desejo da Gio no questionário e saiu junto com a excursão de ônibus. Indo por conta própria vocês fazem só o castelo e o jardim, no seu ritmo.",
    how: "Trem JR Special Rapid de Kyoto até Himeji (~1h30, ~¥2.310 cada trecho) ou trem-bala (~45 min, ~¥5.000).",
    doWhat: ["Castelo de Himeji (~2h, com escadas internas íngremes)", "Jardim Koko-en, ao lado (~45 min)", "Rua Miyukidori para almoçar"],
    cost: "Transporte ~¥4.600–10.000 ida e volta por pessoa + castelo ~¥2.500 (preço novo para turistas)",
    tip: "Saiam até 8:30 para pegar o castelo sem fila. A volta pode parar em Kobe, mas vocês já vão a Kobe no dia 18.",
    lat: 34.8394, lng: 134.6939,
  },
  {
    id: "uji-nara", name: "Uji + Nara", emoji: "🍵", size: "dia", match: "ambos", top: true,
    tagline: "Chá de manhã, templos e cervos à tarde",
    why: "Junta o desejo de chá e Uji do Pedro com os templos da Gio. As duas cidades ficam na mesma linha de trem (JR Nara), então o dia é simples.",
    how: "JR Nara: Kyoto → Uji (~20 min), depois Uji → Nara (~40 min) e volta a Kyoto (~45 min). ~¥1.500 no total por pessoa.",
    doWhat: ["Uji: templo Byodo-in (o da moeda de 10 ienes) e a rua do matcha", "Nara: cervos soltos, o Buda gigante do Todai-ji e as lanternas do Kasuga Taisha"],
    cost: "Transporte ~¥1.500 + entradas ~¥1.500 por pessoa",
    tip: "Comprem os biscoitos para os cervos (¥200) só no parque, porque eles avançam. O Nintendo Museum, em Uji, vende ingresso só por sorteio no site oficial; para dezembro provavelmente já encerrou.",
    lat: 34.8892, lng: 135.8077,
  },
  {
    id: "arashiyama", name: "Arashiyama", emoji: "🎋", size: "meio", match: "ambos",
    tagline: "Bambuzal, rio e macacos — o mais fácil de chegar",
    why: "É o bate-volta mais perto do hotel: a linha Hankyu sai da estação Omiya e vai direto. Dá para fazer numa manhã e ainda voltar para Kyoto.",
    how: "Hankyu de Omiya até Arashiyama (~20 min, com baldeação rápida em Katsura). ~¥240 cada trecho.",
    doWhat: ["Bambuzal (cedo, antes das 9:00)", "Templo Tenryu-ji e o jardim", "Ponte Togetsukyo", "Parque dos macacos (subida de ~20 min)", "Trem romântico Sagano (para em dez/29)"],
    cost: "Transporte ~¥500 + entradas ~¥1.500 por pessoa (trem Sagano ~¥880)",
    tip: "Em meados de dezembro costuma acontecer o Hanatouro, quando ruas e bambuzal ficam iluminados à noite. Conferir as datas de 2026.",
    lat: 35.0094, lng: 135.6668,
  },
  {
    id: "hikone", name: "Hikone", emoji: "🏯", size: "meio", match: "gio",
    tagline: "Castelo original e tesouro nacional, sem multidão",
    why: "Um dos 12 castelos originais do Japão, ao lado do Lago Biwa. Bom plano B se Himeji parecer longe demais.",
    how: "JR Special Rapid de Kyoto até Hikone (~50 min, ~¥1.170 cada trecho).",
    doWhat: ["Castelo de Hikone", "Jardim Genkyu-en", "Rua Yume-kyobashi (lojas antigas)", "Hikonyan, o mascote-gato que aparece no castelo"],
    cost: "Transporte ~¥2.300 + castelo e jardim ~¥1.000 por pessoa",
    tip: "Dá para combinar com o castelo de Himeji? Não: ficam em lados opostos de Kyoto. Escolham um dos dois.",
    lat: 35.2763, lng: 136.2519,
  },
  {
    id: "kurama-kibune", name: "Kurama + Kibune", emoji: "⛰️", size: "meio", match: "pedro",
    tagline: "Vila de montanha e templos na floresta",
    why: "Natureza era a prioridade nº 1 do Pedro. Uma trilha curta liga o templo de Kurama ao santuário de Kibune, com lanternas vermelhas na escadaria.",
    how: "Trem Eizan de Demachiyanagi até Kurama (~30 min, ~¥470 cada trecho).",
    doWhat: ["Templo Kurama-dera", "Trilha pela montanha até Kibune (~1h, com subida)", "Santuário Kibune (as escadas das lanternas)"],
    cost: "Transporte ~¥1.000 + entradas ~¥500 por pessoa",
    tip: "A Gio pode fazer o trecho de Kurama de bondinho e encontrar o Pedro em Kibune de trem. O onsen de Kurama é banho público, então não serve para quem tem tatuagem.",
    lat: 35.1180, lng: 135.7708,
  },
  {
    id: "fushimi-sake", name: "Fushimi (saquê)", emoji: "🍶", size: "meio", match: "pedro",
    tagline: "Bairro das destilarias, a 2 paradas do Fushimi Inari",
    why: "Fica ao lado do Fushimi Inari, então dá para emendar no dia 16 se sobrar fôlego. Tem destilarias com degustação barata.",
    how: "Keihan até Chushojima ou Fushimi-Momoyama (~20 min do centro).",
    doWhat: ["Museu do saquê Gekkeikan (entrada com degustação)", "Rua de bares Fushimi Sakagura Koji (vários saquês num lugar só)", "Canais e casas antigas de madeira"],
    cost: "Transporte ~¥500 + museu ~¥600 por pessoa",
    tip: "O barquinho Jukkokubune não funciona no inverno.",
    lat: 34.9318, lng: 135.7612,
  },
];
