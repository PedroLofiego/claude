/*
 * TRENS ENTRE CIDADES — pesquisa de 09/11/2026.
 * Preços por pessoa, só ida, em iene. Conferir no link antes de comprar:
 * dezembro tem dias de "pico" em que o preço sobe um pouco.
 * tag: "rec" (recomendado) | "barato" | "rapido" | "bonito"
 */

export const TRAINS_UPDATED = "09/11/2026";

export const TRAIN_LEGS = [
  {
    id: "tq-ky",
    date: "Seg 14/12",
    from: "Tóquio",
    to: "Kyoto",
    plan: "Sair do hotel ~9:30. O roteiro chega em Kyoto até ~13:00 (Kinkaku-ji às 14:00).",
    options: [
      {
        id: "hayatoku21",
        tag: "rec",
        name: "Nozomi com desconto EX Hayatoku 21",
        train: "Shinkansen Nozomi (o mais rápido)",
        duration: "2h15",
        yen: 12430,
        when: "Venda abre 13/11 às 22:00 (horário de Brasília) e fecha 23/11 às 11:30 (Brasília). Só vale em alguns trens, com lugares limitados — o smartEX mostra quais. Um que saia até ~11:00 encaixa no roteiro. Depois de comprado não dá para trocar de trem (só cancelar com taxa de ¥320).",
        why: "Rápido e ¥1.500 mais barato que o normal por pessoa. Lugar marcado: escolham a fileira E (lado direito) para ver o Monte Fuji.",
        links: [
          { label: "Comprar no smartEX", url: "https://smart-ex.jp/en/" },
          { label: "Regras do Hayatoku 21", url: "https://smart-ex.jp/en/product/hayatoku21/" },
        ],
      },
      {
        id: "nozomi",
        tag: "rapido",
        name: "Nozomi preço normal (smartEX)",
        train: "Shinkansen Nozomi",
        duration: "2h15",
        yen: 13970,
        when: "Abre 13/11 às 22:00 (Brasília) e fica à venda até o dia. Qualquer horário.",
        why: "Plano B se o Hayatoku esgotar: mesmo trem, qualquer horário. O ingresso vai para o celular e entra direto com o cartão Suica cadastrado.",
        links: [{ label: "Comprar no smartEX", url: "https://smart-ex.jp/en/" }],
      },
      {
        id: "platt",
        tag: "barato",
        name: "Platt Kodama (pacote com desconto)",
        train: "Shinkansen Kodama (para em todas as estações)",
        duration: "~3h40",
        yen: 10700,
        when: "Comprar com antecedência no site da JR Tokai Tours (até a véspera). Vem com 1 bebida grátis.",
        why: "O mais barato de trem-bala (~¥3.300 a menos que o normal), mas leva 1h30 a mais. Saindo ~9:00 chega ~12:45, ainda dentro do roteiro.",
        links: [{ label: "Platt Kodama (JR Tokai Tours)", url: "https://travel.jr-central.co.jp/plan/en" }],
      },
    ],
  },
  {
    id: "ky-os",
    date: "Qui 17/12",
    from: "Kyoto",
    to: "Osaka",
    plan: "O hotel de Kyoto fica do lado da estação Omiya, da linha Hankyu, que vai até Osaka-Umeda. Atenção: o Expresso Limitado (o trem mais frequente) NÃO para em Omiya — peguem qualquer trem 1 parada até Karasuma (2 min, mesma passagem) e embarquem lá. De Umeda, 2 paradas de metrô até Honmachi.",
    options: [
      {
        id: "privace",
        tag: "rec",
        name: "Hankyu com assento PRiVACE",
        train: "Expresso Limitado Hankyu, vagão PRiVACE (poltronas reservadas, mais bonito e silencioso)",
        duration: "~40 min",
        yen: 910,
        when: "Reserva abre 03/12 (14 dias antes), sem cadastro — só e-mail, entrando como convidado (Guest). Reservem a partir de Karasuma, num Expresso Limitado (Limited Express) por volta das 10:00. Também dá para comprar no trem, em dinheiro, se sobrar lugar.",
        why: "Poltrona marcada no vagão 4, silencioso e com espaço para mala. Tarifa normal ¥410 (passa o Suica) + ¥500 do assento.",
        links: [{ label: "Reservar PRiVACE", url: "https://www.hankyu.co.jp/privace/en/guide/" }],
      },
      {
        id: "hankyu",
        tag: "barato",
        name: "Hankyu comum",
        train: "Expresso Limitado Hankyu, vagão comum",
        duration: "~40 min",
        yen: 410,
        when: "Não precisa comprar antes: passa o cartão Suica/ICOCA na catraca.",
        why: "O jeito mais barato. Mesmo trem, sem lugar marcado.",
        links: [{ label: "Hankyu (site oficial)", url: "https://www.hankyu.co.jp/en/" }],
      },
      {
        id: "garaku",
        tag: "bonito",
        name: "Kyo-train Garaku — o trem temático",
        train: "Trem da Hankyu decorado como casa de Kyoto: tatame, biombos, jardim japonês dentro do vagão",
        duration: "~44 min",
        yen: 410,
        unavailable: "Não roda no dia 17 (quinta): só sai aos sábados, domingos e feriados.",
        when: "Não precisa reservar: preço de bilhete normal.",
        why: "É o trem “aesthetic” entre Kyoto e Osaka que você ouviu falar — e custa o mesmo que o comum. Para ver por dentro, só num fim de semana.",
        links: [{ label: "Kyo-train Garaku", url: "https://www.hankyu.co.jp/kyotrain-garaku/en/" }],
      },
      {
        id: "aoniyoshi",
        tag: "bonito",
        name: "Aoniyoshi — o expresso turístico da Kintetsu",
        train: "Trem roxo de luxo com poltronas viradas para a janela e salão; liga Kyoto, Nara e Osaka-Namba",
        duration: "~1h25 (passa por Nara)",
        yen: 2270,
        unavailable: "Não roda às quintas — então também não serve no dia 17.",
        when: "Reserva obrigatória no site da Kintetsu, a partir de 1 mês antes, às 10:30.",
        why: "Dá para andar nele no bate-volta do dia 15 (terça): Kyoto → Nara (~35 min, ~¥1.490).",
        links: [{ label: "Aoniyoshi (Kintetsu)", url: "https://www.kintetsu.co.jp/foreign/english/aoniyoshi/" }],
      },
    ],
  },
  {
    id: "os-nrt",
    date: "Seg 21/12",
    from: "Osaka",
    to: "Narita (cápsula)",
    plan: "Manhã em Tennoji (Harukas às 9:30 e Tsutenkaku às 11:00). O voo de volta sai de Narita no dia 22 às 13:35.",
    options: [
      {
        id: "hayatoku21-volta",
        tag: "rec",
        name: "Nozomi Shin-Osaka → Tóquio com EX Hayatoku 21 + ônibus até Narita",
        train: "Shinkansen Nozomi (2h30) + ônibus da Estação de Tóquio até Narita (~1h10)",
        duration: "~4h30",
        yen: 14480,
        yenNote: "¥12.980 o trem-bala (preço oficial do Hayatoku 21, igual todos os dias) + ~¥1.500 o ônibus",
        when: "Venda abre 20/11 às 22:00 e fecha 30/11 às 11:30 (horário de Brasília). Saindo de Shin-Osaka ~14:00, chegam em Narita ~18:30. O ônibus não precisa de reserva: compra no guichê da saída Yaesu.",
        why: "Previsível, sem taxa de mala e sem ir cedo ao aeroporto. Do trem-bala vocês descem na Estação de Tóquio e pegam o ônibus para Narita na saída Yaesu.",
        links: [
          { label: "Comprar no smartEX", url: "https://smart-ex.jp/en/" },
          { label: "Ônibus Tóquio → Narita", url: "https://tyo-nrt.com/en/" },
        ],
      },
      {
        id: "voo",
        tag: "barato",
        name: "Voo barato Kansai → Narita (Peach ou Jetstar)",
        train: "Trem JR de Tennoji até o aeroporto de Kansai (~50 min, ~¥1.210) + voo de ~1h20",
        duration: "~4h porta a porta",
        yen: 11000,
        yenNote: "≈ ¥6.000–9.000 a passagem + ~¥2.500 a mala despachada + trem até o aeroporto",
        when: "Só compensa se a passagem COM mala sair abaixo de ~¥11.000. Procurem voos saindo entre 16:00 e 18:00.",
        why: "Sai de Tennoji, onde vocês já vão estar, e pousa em Narita, ao lado da cápsula, sem atravessar Tóquio com mala. Mas tem as regras de mala das companhias baratas e é preciso chegar ao aeroporto 1h30 antes.",
        links: [
          { label: "Ver voos de 21/12 (Google Flights)", url: "https://www.google.com/travel/flights?q=Flights%20from%20KIX%20to%20NRT%20on%202026-12-21%20one%20way" },
          { label: "Peach", url: "https://www.flypeach.com/en" },
          { label: "Jetstar Japan", url: "https://www.jetstar.com/jp/en/home" },
        ],
      },
      {
        id: "nozomi-volta",
        tag: "rapido",
        name: "Nozomi preço normal + ônibus (se perderem o prazo do desconto)",
        train: "Shinkansen Nozomi (2h30) + ônibus até Narita",
        duration: "~4h30",
        yen: 16000,
        yenNote: "≈ ¥14.500 o trem-bala + ¥1.500 o ônibus",
        when: "smartEX, qualquer horário, até o próprio dia.",
        why: "Mesmo trajeto da opção recomendada, sem desconto.",
        links: [{ label: "Comprar no smartEX", url: "https://smart-ex.jp/en/" }],
      },
    ],
  },
];

export const TRAIN_TAGS = {
  rec: { label: "Recomendado", cls: "bg-emerald-500/20 text-emerald-100 border-emerald-400/40" },
  barato: { label: "Mais barato", cls: "bg-sky-500/15 text-sky-100 border-sky-400/30" },
  rapido: { label: "Mais rápido", cls: "bg-amber-500/15 text-amber-100 border-amber-400/30" },
  bonito: { label: "Trem temático", cls: "bg-fuchsia-500/15 text-fuchsia-100 border-fuchsia-400/30" },
};

// Trens que entram no calendário do celular (horário do Japão).
export const TRAIN_EVENTS = [
  {
    id: "tq-ky", start: "2026-12-14T10:12", end: "2026-12-14T12:23",
    title: "🚄 NOZOMI 23 Tóquio 10:12 → Kyoto 12:23",
    where: "Tokyo Station",
    desc: "PAGO (smartEX, ¥27.540 os dois). Carro 14, assentos 10D e 10E — o E é janela, lado do Fuji. Embarque com QR Ticket (smartEX → My Trips, um QR por pessoa). Estar na plataforma 15 min antes.",
  },
  {
    id: "ky-os", start: "2026-12-17T10:00", end: "2026-12-17T10:45",
    title: "🚃 Hankyu Kyoto → Osaka-Umeda (PRiVACE)",
    where: "Hankyu Karasuma Station, Kyoto",
    desc: "De Omiya, 1 parada até Karasuma; lá o Expresso Limitado até Osaka-Umeda (~40 min). Vagão 4 = PRiVACE, assento reservado (¥500, reservar a partir de 03/12 como Guest). Passagem ¥410 com Suica. De Umeda, metrô Midosuji 2 paradas até Honmachi.",
  },
  {
    id: "os-nrt", start: "2026-12-21T14:15", end: "2026-12-21T18:15",
    title: "🚄 NOZOMI 256 Shin-Osaka 14:15 → Tóquio 16:45 + ônibus até Narita",
    where: "Shin-Osaka Station",
    desc: "PAGO (smartEX, ¥28.640 os dois). Carro 4, assentos 18A e 18B. Na Estação de Tóquio, saída Yaesu: ônibus TYO-NRT até Narita Terminal 2 (~1h10, ¥1.500, compra no guichê). Check-in na cápsula até meia-noite.",
  },
];

// TODOS OS TRENS DA VIAGEM, dia a dia (preço por pessoa).
// pay: "suica" (só passar o cartão) | "comprar" (bilhete com prazo) | "reservar" (assento opcional) | "voucher"
export const TRAIN_PAY = {
  suica: { label: "Passa o Suica", cls: "bg-sky-500/15 text-sky-100 border-sky-400/30" },
  comprar: { label: "Comprar antes", cls: "bg-rose-500/20 text-rose-100 border-rose-400/40" },
  reservar: { label: "Reservar assento", cls: "bg-amber-500/20 text-amber-100 border-amber-400/40" },
  pago: { label: "Pago ✓", cls: "bg-emerald-500/25 text-emerald-100 border-emerald-400/50" },
  voucher: { label: "No voucher", cls: "bg-emerald-500/20 text-emerald-100 border-emerald-400/40" },
  gratis: { label: "Grátis", cls: "bg-white/10 text-slate-200 border-white/20" },
};

export const TRAIN_PLAN = [
  {
    day: 1, date: "Qua 09/12",
    rides: [
      { time: "~12:50", from: "Aeroporto de Narita, Terminal 1", to: "Higashi-Nihombashi (hotel)", line: "Keisei Access Express (direto, sem baldeação)", duration: "~60 min", yen: 1370, pay: "suica",
        note: "O KLM pousa no Terminal 1: a estação fica no subsolo. Antes da catraca, comprem o Welcome Suica na máquina (ou usem o Suica do iPhone). Se a recarga pelo cartão falhar, dá para pôr dinheiro em qualquer máquina de estação." },
    ],
  },
  {
    day: 2, date: "Qui 10/12",
    rides: [
      { time: "09:10", from: "Higashi-Nihombashi", to: "Asakusa", line: "Metrô Toei Asakusa (direto)", duration: "8 min", yen: 180, pay: "suica" },
      { time: "16:45", from: "Asakusa", to: "Suehirocho (Akihabara)", line: "Metrô Ginza", duration: "6 min", yen: 180, pay: "suica" },
    ],
  },
  {
    day: 3, date: "Sex 11/12",
    rides: [
      { time: "09:20", from: "Bakurocho (ao lado do hotel)", to: "Harajuku", line: "JR Sobu até Akihabara + JR Yamanote", duration: "~35 min", yen: 270, pay: "suica" },
      { time: "20:30", from: "Shibuya", to: "Hotel", line: "Metrô Hanzomon até Mitsukoshimae + 10 min a pé (ou o caminho que o Google mostrar)", duration: "~30 min", yen: 210, pay: "suica" },
    ],
  },
  {
    day: 4, date: "Sáb 12/12",
    rides: [
      { time: "08:00", from: "Higashi-Nihombashi", to: "Tsukiji", line: "Metrô Toei Asakusa até Higashi-Ginza", duration: "~15 min", yen: 180, pay: "suica" },
      { time: "20:30", from: "Kamiyacho (Azabudai Hills)", to: "Hotel", line: "Metrô Hibiya até Kodenmacho + 5 min a pé", duration: "~25 min", yen: 210, pay: "suica" },
    ],
  },
  {
    day: 5, date: "Dom 13/12",
    rides: [
      { time: "10:30", from: "Hotel", to: "Shimokitazawa", line: "Metrô até Shinjuku + linha Odakyu", duration: "~40 min", yen: 400, pay: "suica" },
      { time: "15:45", from: "Shinjuku", to: "Keio-Yomiuri-Land", line: "Linha Keio + gôndola do parque até a entrada", duration: "~40 min", yen: 310, pay: "suica" },
      { time: "20:30", from: "Keio-Yomiuri-Land", to: "Hotel", line: "Linha Keio até Shinjuku + metrô Toei Shinjuku até Bakuro-Yokoyama", duration: "~1h", yen: 600, pay: "suica" },
    ],
  },
  {
    day: 6, date: "Seg 14/12",
    rides: [
      { time: "09:40", from: "Bakurocho", to: "Estação de Tóquio", line: "JR Sobu Rapid (2 paradas)", duration: "5 min", yen: 160, pay: "suica", note: "Estejam às 9:55 na plataforma do Tokaido Shinkansen." },
      { time: "10:12", from: "Tóquio", to: "Kyoto", line: "🚄 Shinkansen NOZOMI 23 (N700S) · carro 14, assentos 10D e 10E", duration: "2h11", yen: 13770, pay: "pago",
        note: "Comprado em 16/11 no smartEX: ¥27.540 os dois (tarifa normal; o desconto tinha esgotado). Pode trocar de horário de graça até a partida. Embarque com QR Ticket: smartEX → My Trips → um QR por pessoa na catraca." },
      { time: "12:30", from: "Estação de Kyoto", to: "Hotel (Shijo-Omiya)", line: "Ônibus 206 ou 26, ou táxi (~¥1.500)", duration: "~20 min", yen: 230, pay: "suica" },
      { time: "13:30", from: "Shijo-Omiya", to: "Kinkaku-ji", line: "Ônibus 205 (ou 12)", duration: "~30 min", yen: 230, pay: "suica" },
    ],
  },
  {
    day: 7, date: "Ter 15/12",
    rides: [
      { time: "Dia", from: "Kyoto", to: "Uji + Nara (ou Himeji)", line: "JR Nara (Uji e Nara) — ou JR Special Rapid até Himeji", duration: "~20–90 min por trecho", yen: 1500, pay: "suica",
        note: "Para ir a Nara no trem bonito Aoniyoshi (Kintetsu, saindo de Kyoto): reserva no site da Kintetsu, já aberta (1 mês antes). Himeji sai ~¥4.600 ida e volta.", link: "https://www.kintetsu.co.jp/foreign/english/aoniyoshi/" },
    ],
  },
  {
    day: 8, date: "Qua 16/12",
    rides: [
      { time: "06:30", from: "Omiya", to: "Fushimi Inari", line: "Hankyu até Kawaramachi + Keihan de Gion-Shijo até Fushimi-Inari", duration: "~30 min", yen: 450, pay: "suica" },
      { time: "10:30", from: "Inari", to: "Estação de Kyoto", line: "JR Nara (2 paradas)", duration: "5 min", yen: 150, pay: "suica" },
      { time: "14:30", from: "Estação de Kyoto", to: "Kiyomizu", line: "Ônibus 206 ou táxi", duration: "~15 min", yen: 230, pay: "suica" },
    ],
  },
  {
    day: 9, date: "Qui 17/12",
    rides: [
      { time: "10:00", from: "Omiya → Karasuma", to: "Osaka-Umeda", line: "🚃 Hankyu Expresso Limitado · vagão 4 PRiVACE", duration: "~40 min", yen: 910, pay: "reservar",
        note: "¥410 no Suica + ¥500 do assento PRiVACE. Reserva abre 03/12, como Guest. Sem reserva também dá (vagão comum, ¥410).", link: "https://www.hankyu.co.jp/privace/en/guide/" },
      { time: "10:50", from: "Umeda", to: "Honmachi (hotel)", line: "Metrô Midosuji (2 paradas)", duration: "5 min", yen: 240, pay: "suica" },
      { time: "17:30", from: "Honmachi", to: "Castelo de Osaka", line: "Metrô Chuo até Morinomiya", duration: "~10 min", yen: 240, pay: "suica" },
    ],
  },
  {
    day: 10, date: "Sex 18/12",
    rides: [
      { time: "09:30", from: "Osaka (Umeda)", to: "Sannomiya (Kobe)", line: "JR Special Rapid", duration: "~22 min", yen: 420, pay: "suica" },
      { time: "10:00", from: "Sannomiya", to: "Shin-Kobe", line: "Metrô Seishin-Yamate (1 parada)", duration: "2 min", yen: 210, pay: "suica" },
      { time: "16:15", from: "Sannomiya", to: "Kobe Illuminage", line: "Ônibus do evento (horário no voucher)", duration: "~45 min", yen: 0, pay: "voucher" },
      { time: "19:30", from: "Kobe", to: "Osaka", line: "Ônibus de volta + JR Special Rapid", duration: "~1h15", yen: 420, pay: "suica" },
    ],
  },
  {
    day: 11, date: "Sáb 19/12",
    rides: [
      { time: "07:45", from: "Honmachi", to: "Universal City", line: "Metrô Chuo até Bentencho + JR até Nishikujo + JR Yumesaki", duration: "~30 min", yen: 420, pay: "suica" },
    ],
  },
  {
    day: 12, date: "Dom 20/12",
    rides: [
      { time: "09:45", from: "Honmachi", to: "Nakazakicho", line: "Metrô Midosuji até Umeda + Tanimachi (1 parada)", duration: "~12 min", yen: 240, pay: "suica" },
      { time: "16:00", from: "Umeda", to: "Shinsaibashi", line: "Metrô Midosuji", duration: "6 min", yen: 240, pay: "suica" },
    ],
  },
  {
    day: 13, date: "Seg 21/12",
    rides: [
      { time: "09:15", from: "Honmachi", to: "Tennoji", line: "Metrô Midosuji", duration: "10 min", yen: 240, pay: "suica" },
      { time: "13:35", from: "Honmachi (buscar a mala)", to: "Shin-Osaka", line: "Metrô Midosuji (direto)", duration: "12 min", yen: 240, pay: "suica" },
      { time: "14:15", from: "Shin-Osaka", to: "Tóquio", line: "🚄 Shinkansen NOZOMI 256 · carro 4, assentos 18A e 18B", duration: "2h30", yen: 14320, pay: "pago",
        note: "Comprado em 16/11 no smartEX: ¥28.640 os dois. Assentos confirmados em 21/11: carro 4, 18A e 18B. Pode trocar de horário de graça. Embarque com QR Ticket (smartEX → My Trips)." },
      { time: "~17:00", from: "Estação de Tóquio (saída Yaesu)", to: "Narita Terminal 2", line: "Ônibus TYO-NRT", duration: "~1h10", yen: 1500, pay: "suica", note: "Sem reserva: paga no guichê ou no ônibus. Desçam no Terminal 2 (a cápsula fica no subsolo)." },
    ],
  },
  {
    day: 14, date: "Ter 22/12",
    rides: [
      { time: "~10:00", from: "Narita Terminal 2 (cápsula)", to: "Narita Terminal 1 (KLM)", line: "Ônibus grátis entre terminais (a cada ~7 min)", duration: "~10 min", yen: 0, pay: "gratis",
        note: "O voo KL0862 sai do Terminal 1, não do 2. Check-out da cápsula até 10:00 e já peguem o ônibus." },
    ],
  },
];
