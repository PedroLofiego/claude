/*
 * Dados do Modo Japão — viagem Tóquio 07→22 (16 dias, 2 pessoas).
 * Preços em BRL convertidos de JPY (¥100 ≈ R$3,30 — Mai/2026).
 * Coordenadas reais para o mapa Leaflet/OpenStreetMap.
 */

export const JPY_TO_BRL = 0.033;
export const yen = (v) => Math.round(v * JPY_TO_BRL);

export const JAPAN_TRIP = {
  label: "Japão · Tóquio + Kansai",
  arrive: "09/dez (chegada por Narita/NRT)",
  depart: "22/dez (volta de NRT)",
  airport: "NRT · Narita",
  nights: 13,
  days: 14,
  people: 2,
  // Orçamento real: passagens JÁ COMPRADAS por R$18.000; teto total R$40.000.
  totalBudgetBRL: 40000,
  flightsPaidBRL: 18000,
};

// Categorias de POI para filtro do mapa
export const POI_CATEGORIES = [
  { id: "templo",   label: "Templos e tradição", emoji: "⛩️", color: "#f43f5e" },
  { id: "vista",    label: "Vistas e ícones",    emoji: "🌆", color: "#6366f1" },
  { id: "geek",     label: "Geek e pop",         emoji: "🎮", color: "#a855f7" },
  { id: "comida",   label: "Comida",             emoji: "🍜", color: "#f59e0b" },
  { id: "bairro",   label: "Bairros p/ explorar",emoji: "🏮", color: "#06b6d4" },
  { id: "noite",    label: "Vida noturna",       emoji: "🍸", color: "#ec4899" },
  { id: "daytrip",  label: "Day trips",          emoji: "🚄", color: "#22c55e" },
  { id: "hidden",   label: "Hidden gems",        emoji: "✨", color: "#eab308" },
  { id: "onsen",    label: "Onsen tattoo-OK",    emoji: "♨️", color: "#14b8a6" },
  { id: "extensao", label: "Extensão (Kansai)",  emoji: "🗾", color: "#94a3b8" },
];

/*
 * POIs — costBRL é o gasto de ENTRADA por pessoa (0 = grátis).
 * spendBRL é gasto típico esperado no local (comida/compras), informativo.
 * transport descreve como chegar + custo do trecho.
 */
export const JAPAN_POIS = [
  // ⛩️ Templos e tradição
  { id: "sensoji", name: "Senso-ji (Asakusa)", cat: "templo", lat: 35.7148, lng: 139.7967, costBRL: 0, spendBRL: 40, duration: "2h",
    desc: "Templo mais antigo de Tóquio. Portão Kaminarimon + rua Nakamise cheia de lanches.",
    transport: "Metrô Ginza Line → Asakusa (¥180 ≈ R$6)", tip: "Vá antes das 9h para fotos sem multidão. Omikuji (sorte) ¥100." },
  { id: "meiji", name: "Santuário Meiji Jingu", cat: "templo", lat: 35.6764, lng: 139.6993, costBRL: 0, spendBRL: 0, duration: "1h30",
    desc: "Floresta gigante no meio da cidade, ao lado de Harajuku. Hatsumode em janeiro ainda ativo.",
    transport: "JR Yamanote → Harajuku (¥170)", tip: "De manhã cedo o bosque fica só p/ vocês. Amuletos (omamori) = souvenir com significado." },
  { id: "imperial", name: "Palácio Imperial + East Gardens", cat: "templo", lat: 35.6852, lng: 139.7528, costBRL: 0, spendBRL: 0, duration: "2h",
    desc: "Jardins do palácio do Imperador. Kokyo Gaien e ponte Nijubashi.",
    transport: "Metrô → Otemachi/Tokyo Station (¥180)", tip: "East Gardens fecham seg/sex. Grátis." },
  { id: "zojoji", name: "Zojo-ji + Tokyo Tower ao fundo", cat: "templo", lat: 35.6575, lng: 139.7485, costBRL: 0, spendBRL: 0, duration: "1h",
    desc: "Templo com a Tokyo Tower atrás — foto clássica. Fileiras de estátuas Jizo.",
    transport: "Metrô Mita Line → Onarimon (¥180)", tip: "Combine com a subida na Tokyo Tower ao lado." },
  { id: "yanaka", name: "Yanaka Ginza (Tóquio antiga)", cat: "templo", lat: 35.7276, lng: 139.7668, costBRL: 0, spendBRL: 60, duration: "2h30",
    desc: "Bairro que sobreviveu à guerra: rua comercial retrô, gatos, templos pequenos.",
    transport: "JR Yamanote → Nippori (¥170)", tip: "Croquete de menchi-katsu na rua ¥250 — famoso." },

  // 🌆 Vistas e ícones
  { id: "shibuya-crossing", name: "Shibuya Crossing", cat: "vista", lat: 35.6595, lng: 139.7005, costBRL: 0, spendBRL: 0, duration: "1h",
    desc: "O cruzamento mais famoso do mundo. Estátua do Hachiko ao lado.",
    transport: "JR Yamanote → Shibuya (¥170)", tip: "Vista grátis do Starbucks Tsutaya ou do Shibuya Sky pago." },
  { id: "shibuya-sky", name: "Shibuya Sky (observatório)", cat: "vista", lat: 35.6580, lng: 139.7016, costBRL: yen(2500), spendBRL: 0, duration: "1h30",
    desc: "Rooftop aberto no 47º andar com vista 360° — pôr do sol com Monte Fuji se limpo.",
    transport: "Em Shibuya", tip: "¥2500. COMPRE ONLINE com dias de antecedência — pôr do sol esgota." },
  { id: "skytree", name: "Tokyo Skytree", cat: "vista", lat: 35.7101, lng: 139.8107, costBRL: yen(3100), spendBRL: 50, duration: "2h",
    desc: "Torre mais alta do Japão (634m). Vista dupla: Floor 350 + 450.",
    transport: "Metrô → Oshiage (¥180)", tip: "¥3100 andar 350. Se tempo fechado, pule — Shibuya Sky é melhor custo." },
  { id: "tokyo-tower", name: "Tokyo Tower", cat: "vista", lat: 35.6586, lng: 139.7454, costBRL: yen(1500), spendBRL: 0, duration: "1h30",
    desc: "A torre vermelha clássica. Menos alta, mais charmosa e mais barata que a Skytree.",
    transport: "Metrô → Akabanebashi (¥180)", tip: "¥1500 main deck. Iluminada à noite é linda de fora (grátis do Zojo-ji)." },
  { id: "tocho", name: "Observatório GRÁTIS do Gov. Metropolitano", cat: "vista", lat: 35.6896, lng: 139.6921, costBRL: 0, spendBRL: 0, duration: "1h",
    desc: "Observatório no 45º andar em Shinjuku — de graça, vista do Fuji em dia limpo.",
    transport: "Metrô Oedo → Tochomae (¥180)", tip: "Melhor custo-benefício de vista da cidade: R$0." },
  { id: "teamlab", name: "teamLab Planets (Toyosu)", cat: "vista", lat: 35.6491, lng: 139.7897, costBRL: yen(3800), spendBRL: 0, duration: "2h30",
    desc: "Arte digital imersiva andando na água. O lugar mais instagramável do Japão.",
    transport: "Yurikamome → Shin-Toyosu (¥390)", tip: "¥3800. ESGOTA: reserve semanas antes. Leve shorts (água no joelho)." },
  { id: "odaiba", name: "Odaiba + Gundam gigante", cat: "vista", lat: 35.6252, lng: 139.7756, costBRL: 0, spendBRL: 80, duration: "3h",
    desc: "Ilha futurista: Gundam de 20m que se move, Rainbow Bridge, shoppings.",
    transport: "Yurikamome da Shimbashi (¥330)", tip: "Gundam 'transforma' às 11/13/15/17h. Vista da ponte ao anoitecer." },

  // 🎮 Geek e pop
  { id: "akihabara", name: "Akihabara Electric Town", cat: "geek", lat: 35.7022, lng: 139.7741, costBRL: 0, spendBRL: 250, duration: "3h",
    desc: "Meca geek: eletrônicos, anime, retro games, maid cafés, gachapon.",
    transport: "JR Yamanote → Akihabara (¥170)", tip: "Super Potato p/ games retrô. Tax-free acima de ¥5000 com passaporte." },
  { id: "pokemon-center", name: "Pokémon Center Mega Tokyo", cat: "geek", lat: 35.7295, lng: 139.7177, costBRL: 0, spendBRL: 200, duration: "1h30",
    desc: "A maior loja Pokémon do mundo, no Sunshine City (Ikebukuro).",
    transport: "JR Yamanote → Ikebukuro (¥170)", tip: "Tem itens exclusivos de Tóquio. Vá cedo — fila no fim de semana." },
  { id: "nintendo-tokyo", name: "Nintendo TOKYO + Capcom Store (Shibuya Parco)", cat: "geek", lat: 35.6619, lng: 139.6982, costBRL: 0, spendBRL: 200, duration: "1h30",
    desc: "Loja oficial Nintendo + Capcom + Pokémon Center Shibuya no mesmo prédio.",
    transport: "Em Shibuya", tip: "6º andar do Parco. Jump Shop no mesmo prédio p/ fãs de mangá." },
  { id: "ghibli", name: "Museu Ghibli (Mitaka)", cat: "geek", lat: 35.6962, lng: 139.5704, costBRL: yen(1000), spendBRL: 80, duration: "3h",
    desc: "O museu do Studio Ghibli: Totoro, robô do Laputa no telhado, curta exclusivo.",
    transport: "JR Chuo → Mitaka + ônibus (¥320)", tip: "¥1000, venda p/ dezembro foi 10/nov — procure cancelamentos no site oficial (aparecem!)." },
  { id: "sumo", name: "Sumô em Ryogoku: treino matinal (asageiko)", cat: "geek", lat: 35.6970, lng: 139.7935, costBRL: yen(12000), spendBRL: 100, duration: "2h30",
    desc: "Em dezembro NÃO há torneio (próximo: 10-24/jan). Mas dá p/ assistir o treino matinal numa heya (estábulo) de pertinho.",
    transport: "JR Sobu → Ryogoku (¥170)", tip: "Tour guiado ¥10-13k/pessoa — reserve dias antes. Grátis: museu do sumô no Kokugikan + jantar chanko-nabe." },

  // 🍜 Comida
  { id: "tsukiji", name: "Tsukiji Outer Market", cat: "comida", lat: 35.6654, lng: 139.7707, costBRL: 0, spendBRL: 120, duration: "2h30",
    desc: "Mercado de rua de frutos do mar: sushi de café da manhã, tamagoyaki, uni.",
    transport: "Metrô Hibiya → Tsukiji (¥180)", tip: "Vá com fome às 8-9h. Sushi no balcão ¥2500-4000." },
  { id: "ichiran", name: "Ichiran Ramen (Shibuya)", cat: "comida", lat: 35.6613, lng: 139.7003, costBRL: 0, spendBRL: 45, duration: "1h",
    desc: "O ramen tonkotsu mais famoso do mundo, em cabines individuais.",
    transport: "Em Shibuya", tip: "¥1200-1500. Aberto 24h — vá 15h ou 23h p/ evitar 1h de fila." },
  { id: "uobei", name: "Uobei Sushi (esteira digital)", cat: "comida", lat: 35.6591, lng: 139.6983, costBRL: 0, spendBRL: 60, duration: "1h",
    desc: "Sushi por tablet que chega de 'trem-bala' — ¥110-150 o prato.",
    transport: "Em Shibuya", tip: "Almoço farto por ¥1500. Divertido e barato." },
  { id: "omoide", name: "Omoide Yokocho (Piss Alley)", cat: "comida", lat: 35.6930, lng: 139.6994, costBRL: 0, spendBRL: 110, duration: "2h",
    desc: "Vielas de yakitori dos anos 40 com fumaça e lanternas — Tóquio raiz.",
    transport: "Em Shinjuku (saída oeste)", tip: "Espetos ¥150-300. Alguns bares cobram otoshi (couvert) ¥300-500." },
  { id: "depachika", name: "Depachika do Isetan (Shinjuku)", cat: "comida", lat: 35.6916, lng: 139.7045, costBRL: 0, spendBRL: 80, duration: "1h30",
    desc: "Andar de comida de luxo no subsolo: bentos de arte, doces perfeitos.",
    transport: "Metrô → Shinjuku-sanchome (¥180)", tip: "Após 19h30 bentos com 30-50% off. Monte um jantar gourmet barato." },
  { id: "ameyoko", name: "Ameyoko Market (Ueno)", cat: "comida", lat: 35.7107, lng: 139.7743, costBRL: 0, spendBRL: 90, duration: "2h",
    desc: "Mercado de rua barulhento pós-guerra: kebabs, frutas, pastelarias, roupas.",
    transport: "JR Yamanote → Okachimachi/Ueno (¥170)", tip: "Bom p/ compras baratas (tênis, casacos). Pechinche com simpatia." },

  // 🏮 Bairros
  { id: "harajuku", name: "Harajuku / Takeshita Street", cat: "bairro", lat: 35.6702, lng: 139.7026, costBRL: 0, spendBRL: 130, duration: "2h30",
    desc: "Rua da moda jovem e maluca: crepes, roupas, purikura.",
    transport: "JR Yamanote → Harajuku (¥170)", tip: "Combine com Meiji Jingu (do lado) e desça pela Omotesando." },
  { id: "shimokita", name: "Shimokitazawa (brechós)", cat: "bairro", lat: 35.6614, lng: 139.6682, costBRL: 0, spendBRL: 150, duration: "3h",
    desc: "Bairro indie: brechós incríveis, cafés, discos de vinil, teatro.",
    transport: "Keio Inokashira de Shibuya (¥140)", tip: "Melhor vintage shopping de Tóquio — Flamingo, Chicago, New York Joe." },
  { id: "nakameguro", name: "Nakameguro + Daikanyama", cat: "bairro", lat: 35.6440, lng: 139.6982, costBRL: 0, spendBRL: 100, duration: "2h30",
    desc: "Canal arborizado com cafés hipster. Starbucks Reserve Roastery gigante.",
    transport: "Metrô Hibiya → Naka-meguro (¥180)", tip: "Tsutaya Books em Daikanyama é linda. Vibe 'Tóquio elegante'." },
  { id: "ginza", name: "Ginza", cat: "bairro", lat: 35.6717, lng: 139.7650, costBRL: 0, spendBRL: 150, duration: "2h",
    desc: "A 5ª Avenida de Tóquio: flagships, Uniqlo de 12 andares, Itoya (papelaria).",
    transport: "Metrô Ginza Line (¥180)", tip: "Sáb/dom a rua principal fecha p/ carros. Ginza Six rooftop grátis." },
  { id: "ueno-park", name: "Ueno Park + Museu Nacional", cat: "bairro", lat: 35.7156, lng: 139.7745, costBRL: yen(1000), spendBRL: 50, duration: "3h",
    desc: "Parque dos museus. Museu Nacional de Tóquio = melhor coleção de arte japonesa do mundo.",
    transport: "JR Yamanote → Ueno (¥170)", tip: "Museu ¥1000. Zoo com pandas ¥600 (opcional)." },

  // 🍸 Noite
  { id: "golden-gai", name: "Shinjuku Golden Gai", cat: "noite", lat: 35.6938, lng: 139.7048, costBRL: 0, spendBRL: 180, duration: "3h",
    desc: "200+ bares minúsculos (6-8 lugares) em vielas dos anos 50.",
    transport: "Em Shinjuku", tip: "Escolha bares com preço na porta. Couvert ¥500-1000 é normal." },
  { id: "kabukicho", name: "Kabukicho + Godzilla Head", cat: "noite", lat: 35.6952, lng: 139.7019, costBRL: 0, spendBRL: 150, duration: "2h",
    desc: "Distrito neon mais famoso do Japão. Godzilla no topo do cinema Toho.",
    transport: "Em Shinjuku", tip: "Ignore promotores de rua (nunca siga!). Só curta o neon e os arcades." },
  { id: "shibuya-yokocho", name: "Shibuya Yokocho (izakayas)", cat: "noite", lat: 35.6604, lng: 139.7025, costBRL: 0, spendBRL: 160, duration: "2h30",
    desc: "Versão moderna das vielas de izakaya, no Miyashita Park.",
    transport: "Em Shibuya", tip: "Aberto até tarde, ambiente animado sem ser turistão." },
  { id: "roppongi", name: "Roppongi (balada internacional)", cat: "noite", lat: 35.6605, lng: 139.7292, costBRL: 0, spendBRL: 250, duration: "4h",
    desc: "Clubes e bares internacionais. Mori Art Museum aberto até 22h.",
    transport: "Metrô Hibiya → Roppongi (¥180)", tip: "Mori Art + City View ¥2000 até 22h — arte com vista noturna." },

  // 🚄 Day trips
  { id: "kamakura", name: "Kamakura (Grande Buda)", cat: "daytrip", lat: 35.3167, lng: 139.5361, costBRL: yen(300), spendBRL: 150, duration: "dia inteiro",
    desc: "Cidade histórica à beira-mar: Buda de bronze de 13m, templos, rua Komachi.",
    transport: "JR Yokosuka de Tokyo St. (~1h, ¥950 cada trecho)", tip: "Buda ¥300. Combine com Enoshima no Enoden (trem à beira-mar)." },
  { id: "hakone", name: "Hakone (Fuji + onsen)", cat: "daytrip", lat: 35.2324, lng: 139.1069, costBRL: yen(6100), spendBRL: 250, duration: "dia inteiro",
    desc: "Loop clássico: trem de montanha, teleférico sobre fumarolas, barco pirata no lago com Fuji.",
    transport: "Odakyu de Shinjuku (~1h40)", tip: "Hakone Free Pass ¥6100 cobre TUDO no loop. Vá em dia LIMPO (Fuji some com nuvens)." },
  { id: "kawaguchiko", name: "Lago Kawaguchiko (vista Fuji)", cat: "daytrip", lat: 35.5171, lng: 138.7510, costBRL: 0, spendBRL: 180, duration: "dia inteiro",
    desc: "A vista mais clássica do Fuji, com pagode Chureito. Janeiro = ar limpo = Fuji visível.",
    transport: "Ônibus direto de Shinjuku (~2h, ¥2200 cada)", tip: "Reserve ônibus na ida E na volta. Chureito Pagoda = a foto do Japão." },
  { id: "nikko", name: "Nikko (santuários UNESCO)", cat: "daytrip", lat: 36.7581, lng: 139.5986, costBRL: yen(1600), spendBRL: 150, duration: "dia inteiro",
    desc: "Toshogu: o santuário mais ornamentado do Japão, na montanha. Neve possível em janeiro.",
    transport: "Tobu de Asakusa (~2h, pass ¥2120)", tip: "Toshogu ¥1600. Leve casaco reforçado — faz -5°C." },
  { id: "yokohama", name: "Yokohama (Chinatown + Cup Noodles)", cat: "daytrip", lat: 35.4437, lng: 139.6425, costBRL: yen(500), spendBRL: 130, duration: "meio dia",
    desc: "Maior Chinatown do Japão + museu onde você monta seu Cup Noodles.",
    transport: "JR Tokaido (~30min, ¥480)", tip: "Museu Cup Noodles ¥500 + ¥500 p/ fazer o seu. Minato Mirai à noite." },
  { id: "disney", name: "Tokyo DisneySea", cat: "daytrip", lat: 35.6267, lng: 139.8851, costBRL: yen(10900), spendBRL: 250, duration: "dia inteiro",
    desc: "O parque mais bonito da Disney no mundo — só existe em Tóquio.",
    transport: "JR Keiyo → Maihama (~20min, ¥230)", tip: "¥8400-10900 conforme o dia. App do parque p/ filas. Janeiro = baixa temporada!" },

  // 🗾 Extensão Kansai (se quiserem esticar)
  { id: "kyoto", name: "Kyoto (extensão 2-3 dias)", cat: "extensao", lat: 35.0116, lng: 135.7681, costBRL: 0, spendBRL: 400, duration: "2-3 dias",
    desc: "Fushimi Inari (mil portões), Kinkaku-ji dourado, gueixas em Gion, bambuzal de Arashiyama.",
    transport: "Shinkansen de Tóquio (~2h15, ¥13.320 ≈ R$440 cada)", tip: "Se forem, durmam 2 noites lá. Fushimi Inari de manhã cedo (6-7h)." },
  { id: "osaka-ext", name: "Osaka (jantar + Dotonbori)", cat: "extensao", lat: 34.6687, lng: 135.5013, costBRL: 0, spendBRL: 200, duration: "1 dia",
    desc: "15min de Kyoto: Dotonbori neon, takoyaki, okonomiyaki, castelo.",
    transport: "De Kyoto: JR local ¥580 (15-30min)", tip: "Se já estiverem em Kyoto, vale a esticada de 1 noite." },
  { id: "nara", name: "Nara (cervos + Buda gigante)", cat: "extensao", lat: 34.6851, lng: 135.8048, costBRL: yen(800), spendBRL: 100, duration: "meio dia",
    desc: "Cervos que fazem reverência + Todai-ji, o maior Buda de bronze em prédio de madeira.",
    transport: "De Kyoto: JR ¥720 (~45min)", tip: "Bolachas p/ cervos ¥200. Cuidado: eles roubam papel/comida da mão." },

  // ===== EXPANSÃO: mais lugares para o plano =====

  // Vistas extras
  { id: "bunkyo", name: "Observatório GRÁTIS Bunkyo Civic Center", cat: "vista", lat: 35.7081, lng: 139.7522, costBRL: 0, spendBRL: 0, duration: "45min",
    desc: "Vista de graça do 25º andar: Skytree de um lado, Fuji do outro em dia limpo.",
    transport: "Metrô → Korakuen (¥180)", tip: "Menos conhecido que o Tocho — quase sempre vazio." },
  { id: "cat3d", name: "Gato 3D de Shinjuku (billboard)", cat: "vista", lat: 35.6910, lng: 139.7005, costBRL: 0, spendBRL: 0, duration: "20min",
    desc: "O telão curvo com o gato gigante 3D que virou símbolo da nova Shinjuku.",
    transport: "Saída leste da estação Shinjuku", tip: "O gato aparece a cada ~15min entre anúncios. Filma em slow motion!" },
  { id: "borderless", name: "teamLab Borderless (Azabudai Hills)", cat: "vista", lat: 35.6600, lng: 139.7414, costBRL: yen(3800), spendBRL: 0, duration: "3h",
    desc: "O 'irmão' do Planets: salas infinitas de luz que mudam enquanto você anda.",
    transport: "Metrô → Kamiyacho (¥180)", tip: "¥3800. Se só der p/ um teamLab, Planets (água) é mais único. Os dois esgotam." },
  { id: "sumida-cruise", name: "Cruzeiro rio Sumida → Odaiba", cat: "vista", lat: 35.7107, lng: 139.7973, costBRL: yen(1720), spendBRL: 30, duration: "1h",
    desc: "Barco futurista Hotaluna (desenhado pelo criador do Galaxy Express 999) de Asakusa a Odaiba.",
    transport: "Píer de Asakusa", tip: "¥1720. Jeito mais bonito de 'viajar' entre Asakusa e Odaiba — 12 pontes no caminho." },

  // Templos/tradição extras
  { id: "nezu", name: "Santuário Nezu (mini Fushimi Inari)", cat: "templo", lat: 35.7201, lng: 139.7610, costBRL: 0, spendBRL: 0, duration: "1h",
    desc: "Túnel de toriis vermelhos SEM ir a Kyoto, num santuário de 1705 quase sem turistas.",
    transport: "Metrô Chiyoda → Nezu (¥180)", tip: "Combine com Yanaka (10min a pé). Foto no túnel de toriis de manhã." },
  { id: "hie", name: "Santuário Hie (escadaria de toriis)", cat: "templo", lat: 35.6745, lng: 139.7397, costBRL: 0, spendBRL: 0, duration: "45min",
    desc: "Escadaria coberta de toriis no meio dos arranha-céus de Akasaka.",
    transport: "Metrô → Tameike-sanno (¥180)", tip: "Macacos de pedra no lugar dos leões — protetor dos casais." },
  { id: "kagurazaka", name: "Kagurazaka (a 'Kyoto de Tóquio')", cat: "templo", lat: 35.7020, lng: 139.7400, costBRL: 0, spendBRL: 90, duration: "2h",
    desc: "Ladeira de paralelepípedos com vielas de gueixa, restaurantes franceses e izakayas.",
    transport: "Metrô → Iidabashi (¥180)", tip: "Desça as vielas laterais (Hyogo Yokocho) — é onde mora o charme." },

  // Bairros/parques extras
  { id: "kichijoji", name: "Kichijoji + Parque Inokashira", cat: "bairro", lat: 35.7004, lng: 139.5795, costBRL: yen(700), spendBRL: 100, duration: "3h",
    desc: "Bairro favorito dos tóquiotas: parque com pedalinho de cisne, Harmonica Yokocho.",
    transport: "JR Chuo → Kichijoji (¥230)", tip: "Pedalinho ¥700/30min. Fica ao lado do Museu Ghibli — combine!" },
  { id: "koenji", name: "Koenji (vintage + punk)", cat: "bairro", lat: 35.7057, lng: 139.6497, costBRL: 0, spendBRL: 140, duration: "2h30",
    desc: "O bairro mais alternativo: brechós mais baratos que Shimokita, bares punk, lives.",
    transport: "JR Chuo → Koenji (¥180)", tip: "Look Street e PAL p/ garimpo. Menos turista, preço melhor." },
  { id: "jimbocho", name: "Jimbocho (cidade dos livros)", cat: "bairro", lat: 35.6959, lng: 139.7575, costBRL: 0, spendBRL: 80, duration: "1h30",
    desc: "180 sebos e livrarias — mangás antigos, gravuras ukiyo-e acessíveis, art books.",
    transport: "Metrô → Jimbocho (¥180)", tip: "Gravuras vintage a partir de ¥1000 = souvenir de arte barato." },
  { id: "shinjuku-gyoen", name: "Shinjuku Gyoen (jardim imperial)", cat: "bairro", lat: 35.6852, lng: 139.7100, costBRL: yen(500), spendBRL: 0, duration: "2h",
    desc: "O jardim mais bonito da cidade — japonês, inglês e francês em um. Paz total.",
    transport: "Metrô → Shinjuku-gyoemmae (¥180)", tip: "¥500. Em janeiro tem ameixeiras precoces florindo. Fecha às 16h30!" },
  { id: "kappabashi", name: "Kappabashi (rua das facas)", cat: "bairro", lat: 35.7139, lng: 139.7887, costBRL: 0, spendBRL: 250, duration: "1h30",
    desc: "Rua dos utensílios de cozinha: facas japonesas, cerâmica, comida de plástico.",
    transport: "A pé de Asakusa (10min)", tip: "Faca boa de presente: ¥8-15k na Kamata ou Seki. Gravam o nome grátis." },

  // Geek extras
  { id: "nakano", name: "Nakano Broadway (anime raiz)", cat: "geek", lat: 35.7089, lng: 139.6657, costBRL: 0, spendBRL: 180, duration: "2h",
    desc: "Shopping retrô com 30+ lojas Mandarake: figures raras, cels de anime, mangás vintage.",
    transport: "JR Chuo → Nakano (¥180)", tip: "Melhor preço de colecionáveis da cidade — melhor que Akihabara." },
  { id: "gigo", name: "GiGO Akihabara (arcades)", cat: "geek", lat: 35.6995, lng: 139.7714, costBRL: 0, spendBRL: 70, duration: "1h30",
    desc: "4 prédios de arcade: taiko, dance, UFO catcher, purikura.",
    transport: "Em Akihabara", tip: "Fichas ¥100. Dica de UFO catcher: peça ajuda ao staff — eles reposicionam!" },
  { id: "donki", name: "Don Quijote MEGA (Shibuya)", cat: "geek", lat: 35.6580, lng: 139.6997, costBRL: 0, spendBRL: 300, duration: "1h30",
    desc: "Loja-caos de 7 andares aberta 24h: KitKat de sabores, cosméticos, doces, tudo.",
    transport: "Em Shibuya", tip: "Tax-free acima de ¥5000. Deixe p/ perto do fim da viagem (souvenirs)." },
  { id: "karaoke-kan", name: "Karaokê Kan (Lost in Translation)", cat: "geek", lat: 35.6613, lng: 139.6989, costBRL: yen(1400), spendBRL: 60, duration: "1h30",
    desc: "Cabine privada de karaokê — o do filme com Bill Murray fica em Shibuya.",
    transport: "Em Shibuya", tip: "~¥700/30min/pessoa com bebida. Depois das 23h fica mais caro." },

  // Comida extras
  { id: "afuri", name: "Afuri Ramen (caldo de yuzu)", cat: "comida", lat: 35.6467, lng: 139.7101, costBRL: 0, spendBRL: 50, duration: "1h",
    desc: "Ramen leve e cítrico de yuzu — o contraponto perfeito ao tonkotsu pesado.",
    transport: "JR Yamanote → Ebisu (¥170)", tip: "¥1400. Ebisu também tem ótimos bares de vinho natural." },
  { id: "gyukatsu", name: "Gyukatsu Motomura (Shibuya)", cat: "comida", lat: 35.6570, lng: 139.7038, costBRL: 0, spendBRL: 75, duration: "1h",
    desc: "Bife empanado que VOCÊ grelha na pedra quente na mesa. Viral com razão.",
    transport: "Em Shibuya", tip: "¥2000 o set. Fila de 30-60min — vá 14h30 ou 17h." },
  { id: "harmonica", name: "Harmonica Yokocho (Kichijoji)", cat: "comida", lat: 35.7036, lng: 139.5797, costBRL: 0, spendBRL: 120, duration: "2h",
    desc: "Vielas de feira dos anos 40 que viram bar à noite — versão local do Omoide.",
    transport: "Em Kichijoji", tip: "Menos turista que Golden Gai, preço mais honesto." },
  { id: "torikizoku", name: "Torikizoku (yakitori ¥370)", cat: "comida", lat: 35.6600, lng: 139.7017, costBRL: 0, spendBRL: 85, duration: "1h30",
    desc: "Rede de izakaya onde TUDO custa ¥370: espetos, cerveja, highball.",
    transport: "Várias unidades (Shibuya/Shinjuku)", tip: "Jantar + bebidas por ¥2500/pessoa. Peça o momo-kizoku-yaki." },

  // Day trips extras
  { id: "kawagoe", name: "Kawagoe ('Pequena Edo')", cat: "daytrip", lat: 35.9251, lng: 139.4858, costBRL: 0, spendBRL: 130, duration: "meio dia",
    desc: "Cidade-armazém do período Edo a 1h: sino Toki no Kane, ruela dos doces.",
    transport: "Tobu Tojo de Ikebukuro (~35min, ¥490)", tip: "Batata-doce é a especialidade — croquete, chips, até cerveja." },
  { id: "takao", name: "Monte Takao (trilha + vista Fuji)", cat: "daytrip", lat: 35.6254, lng: 139.2439, costBRL: yen(490), spendBRL: 90, duration: "meio dia",
    desc: "A montanha sagrada de Tóquio: teleférico, templo com tengus, Fuji no topo.",
    transport: "Keio de Shinjuku (~50min, ¥430)", tip: "Teleférico ¥490. Janeiro = céu limpo = Fuji quase garantido do cume." },

  // Kansai individual (extensão)
  { id: "fushimi", name: "Fushimi Inari (mil toriis)", cat: "extensao", lat: 34.9671, lng: 135.7727, costBRL: 0, spendBRL: 50, duration: "3h",
    desc: "A trilha de milhares de portões vermelhos subindo a montanha. O ícone de Kyoto.",
    transport: "De Kyoto St.: JR Nara → Inari (¥150)", tip: "GRÁTIS e aberto 24h. Às 7h você tem os toriis quase só p/ vocês." },
  { id: "kinkakuji", name: "Kinkaku-ji (Pavilhão Dourado)", cat: "extensao", lat: 35.0394, lng: 135.7292, costBRL: yen(500), spendBRL: 30, duration: "1h30",
    desc: "O templo coberto de ouro refletido no lago — ainda mais bonito no inverno.",
    transport: "Ônibus 101/205 de Kyoto St. (¥230)", tip: "¥500. Se nevar, corra p/ lá: kinkaku com neve é foto de vida." },
  { id: "arashiyama", name: "Bambuzal de Arashiyama", cat: "extensao", lat: 35.0170, lng: 135.6710, costBRL: 0, spendBRL: 80, duration: "3h",
    desc: "O túnel de bambus gigantes + ponte Togetsukyo + macacos no morro.",
    transport: "JR Sagano de Kyoto (¥240)", tip: "Grátis. Iwatayama (macacos) ¥800 — vista incrível de Kyoto." },
  { id: "gion", name: "Gion (distrito das gueixas)", cat: "extensao", lat: 35.0037, lng: 135.7780, costBRL: 0, spendBRL: 150, duration: "2h30",
    desc: "Ruas de madeira preservadas, casas de chá — no fim da tarde dá pra ver gueixas indo trabalhar.",
    transport: "Ônibus/metrô até Gion-Shijo", tip: "NÃO fotografe gueixas de perto (multa ¥10k nas ruas privadas). Discrição." },
  { id: "usj", name: "Universal Studios Japan (Osaka)", cat: "extensao", lat: 34.6654, lng: 135.4323, costBRL: yen(8600), spendBRL: 200, duration: "dia inteiro",
    desc: "Super Nintendo World: entrar no mundo do Mario vale a viagem p/ gamers.",
    transport: "De Osaka: JR Yumesaki → Universal City (¥190)", tip: "¥8600 + Express Pass se quiser garantir Nintendo World (¥7-10k). Reserve área via app." },

  // ===== ✨ HIDDEN GEMS (virais no TikTok + achados locais) =====
  { id: "nonbei", name: "Nonbei Yokocho ('Viela dos Bêbados')", cat: "hidden", lat: 35.6600, lng: 139.7020, costBRL: 0, spendBRL: 120, duration: "2h",
    desc: "Duas vielas sob o trilho de Shibuya com ~40 bares de 4 lugares. O 'Golden Gai secreto' a 2min do Crossing.",
    transport: "Em Shibuya, atrás do viaduto", tip: "Viral no TikTok mas ainda 90% local. Entre onde tiver banqueta livre." },
  { id: "catstreet", name: "Cat Street (Ura-Harajuku)", cat: "hidden", lat: 35.6668, lng: 139.7043, costBRL: 0, spendBRL: 150, duration: "1h30",
    desc: "A rua paralela à Takeshita que os locais preferem: streetwear, vintage e cafés sem a multidão.",
    transport: "Entre Harajuku e Shibuya, a pé", tip: "Liga Harajuku a Shibuya — faça a pé em vez de trem e descubra lojinhas." },
  { id: "hatou", name: "Chatei Hatou (kissaten lendário)", cat: "hidden", lat: 35.6591, lng: 139.7040, costBRL: 0, spendBRL: 60, duration: "1h",
    desc: "Café coado gota a gota num salão dos anos 80 — o kissaten que inspirou a onda de cafés 'slow'.",
    transport: "Em Shibuya (5min do Crossing)", tip: "Peça o house blend + cheesecake. Sem pressa: é cerimônia, não expresso." },
  { id: "fuglen", name: "Fuglen Tokyo (Tomigaya)", cat: "hidden", lat: 35.6693, lng: 139.6903, costBRL: 0, spendBRL: 60, duration: "1h",
    desc: "Filial do café norueguês cult: café de manhã, coquetéis à noite, no bairro descolado de Tomigaya.",
    transport: "A pé do Parque Yoyogi", tip: "Tomigaya/Oku-Shibuya é o 'novo Shimokita' — explore o quarteirão." },
  { id: "bongo", name: "Onigiri Bongo (Otsuka)", cat: "hidden", lat: 35.7311, lng: 139.7288, costBRL: 0, spendBRL: 40, duration: "1h",
    desc: "O onigiri mais viral do Japão: 60 recheios, feito na hora, desde 1960. Fila que anda rápido.",
    transport: "JR Yamanote → Otsuka (¥170)", tip: "Vá fora do almoço (10h30 ou 15h). Pedida: salmão + ovas + ovo marinado." },
  { id: "shirohige", name: "Shirohige's Cream Puff (Totoro)", cat: "hidden", lat: 35.6497, lng: 139.6497, costBRL: 0, spendBRL: 45, duration: "1h",
    desc: "A ÚNICA confeitaria autorizada pelo Ghibli: carolinas de creme em formato de Totoro.",
    transport: "Odakyu → Setagaya-Daita (¥180)", tip: "Chegue antes das 11h ou encomende no site — esgota todo dia." },
  { id: "toden", name: "Bondinho Toden Arakawa + Zoshigaya", cat: "hidden", lat: 35.7210, lng: 139.7180, costBRL: yen(400), spendBRL: 40, duration: "2h30",
    desc: "O último bonde de rua de Tóquio cruzando bairros que o turismo esqueceu. Tóquio Showa raiz.",
    transport: "Estação Waseda ou Otsuka", tip: "Day pass ¥400. Desça em Kishibojinmae p/ o templo e a alameda de gingkos." },
  { id: "shinokubo", name: "Shin-Okubo (Koreatown)", cat: "hidden", lat: 35.7013, lng: 139.7000, costBRL: 0, spendBRL: 130, duration: "2h",
    desc: "A Koreatown de Tóquio: corn dogs de mussarela, k-beauty, merch de k-pop — febre no TikTok.",
    transport: "JR Yamanote → Shin-Okubo (¥170)", tip: "Um quarteirão da agitação de Shinjuku. Hotteok de sobremesa!" },
  { id: "sangenjaya", name: "Sangenjaya 'Triângulo' (Sankaku Chitai)", cat: "hidden", lat: 35.6437, lng: 139.6698, costBRL: 0, spendBRL: 140, duration: "2h30",
    desc: "Labirinto triangular de vielas com izakayas e bares minúsculos — a nova queridinha dos jovens locais.",
    transport: "Tokyu Den-en-toshi de Shibuya (¥180, 5min)", tip: "2 estações de Shibuya e outro planeta. Carrot Tower tem vista grátis!" },
  { id: "hamarikyu", name: "Jardim Hama-rikyu + chá na lagoa", cat: "hidden", lat: 35.6597, lng: 139.7634, costBRL: yen(300), spendBRL: 40, duration: "2h",
    desc: "Jardim Edo à beira da baía com casa de chá na água e arranha-céus de fundo — contraste perfeito.",
    transport: "Metrô → Shiodome (¥180)", tip: "¥300 entrada + ¥850 matcha c/ doce na Nakajima-no-ochaya." },
  { id: "uranamba", name: "Ura-Namba (Osaka raiz)", cat: "hidden", lat: 34.6640, lng: 135.5035, costBRL: 0, spendBRL: 150, duration: "2h30",
    desc: "Atrás do neon de Dotonbori: vielas de izakayas onde Osaka de verdade come e bebe.",
    transport: "A pé de Namba", tip: "Procure a rua Misono Building — bares dentro de um prédio dos anos 50." },
  { id: "pontocho", name: "Pontocho Alley (Kyoto à noite)", cat: "hidden", lat: 35.0044, lng: 135.7710, costBRL: 0, spendBRL: 180, duration: "2h",
    desc: "Viela de lanternas entre o rio Kamo e Kawaramachi — jantar com chance de ver maiko passando.",
    transport: "A pé de Gion/Kawaramachi", tip: "Restaurantes com vista do rio cobram +20%; os do lado oeste são melhores." },

  // ===== ♨️ ONSEN & SENTO TATTOO-FRIENDLY =====
  { id: "jakotsuyu", name: "Jakotsu-yu (Asakusa) — tattoo OK", cat: "onsen", lat: 35.7120, lng: 139.7937, costBRL: yen(500), spendBRL: 20, duration: "1h30",
    desc: "Sento histórico com água NEGRA de onsen natural, banho externo. Tatuagem liberada de boa.",
    transport: "A pé de Asakusa (8min)", tip: "¥500! Toalha ¥200. Aberto até 0h30, fecha ter. Vá após um dia de andança." },
  { id: "daikokuyu", name: "Daikoku-yu (Oshiage) — tattoo OK", cat: "onsen", lat: 35.7146, lng: 139.8195, costBRL: yen(500), spendBRL: 20, duration: "2h",
    desc: "O 'rei dos sento': rotenburo no telhado com vista da Skytree iluminada. Tatuagem OK.",
    transport: "Metrô → Oshiage (¥180)", tip: "Combine com a Skytree. Sexta/sáb abre a noite toda." },
  { id: "koganeyu", name: "Kogane-yu — sento com craft beer, tattoo OK", cat: "onsen", lat: 35.7000, lng: 139.8080, costBRL: yen(500), spendBRL: 45, duration: "1h30",
    desc: "Sento redesenhado por arquitetos premiados: balcão de cerveja artesanal e DJ booth. Tatuagem OK.",
    transport: "Metrô → Kinshicho (¥180)", tip: "Banho + cerveja gelada de banho tomado = combo imbatível." },
  { id: "kashikiri", name: "Hakone: onsen PRIVATIVO (kashikiri)", cat: "onsen", lat: 35.2400, lng: 139.1030, costBRL: yen(3500), spendBRL: 0, duration: "1h",
    desc: "Banho privado só p/ vocês dois — solução definitiva p/ tatuagem em Hakone.",
    transport: "No loop de Hakone", tip: "~¥3500/h (Hakone Yuryo, Tenzan têm kashikiri). Reserve ao chegar." },

  // ===== 🎄 DEZEMBRO: iluminações e mercados =====
  { id: "bluecave", name: "Shibuya Blue Cave (iluminação)", cat: "vista", lat: 35.6640, lng: 139.6982, costBRL: 0, spendBRL: 0, duration: "45min",
    desc: "Túnel de 800m de LEDs azuis de Shibuya ao Parque Yoyogi — roda até 25/dez, bem nas suas datas!",
    transport: "Em Shibuya (Koen-dori)", tip: "GRÁTIS. Vá ~17h30 na abertura das luzes p/ filmar sem multidão." },
  { id: "midtown-xmas", name: "Iluminações Midtown + Keyakizaka", cat: "vista", lat: 35.6656, lng: 139.7310, costBRL: 0, spendBRL: 0, duration: "1h30",
    desc: "A avenida Keyakizaka acende com a Tokyo Tower ao fundo — a foto de dezembro de Tóquio.",
    transport: "Metrô → Roppongi (¥180)", tip: "GRÁTIS. Combine com Mori Art (até 22h). Multidão no fds — vá em dia útil." },
  { id: "xmasmarket", name: "Tokyo Christmas Market (Jingu Gaien)", cat: "vista", lat: 35.6740, lng: 139.7180, costBRL: yen(1000), spendBRL: 90, duration: "2h",
    desc: "Mercado de Natal alemão com glühwein, bratwurst e a maior pirâmide natalina do Japão.",
    transport: "Metrô → Gaiemmae (¥180)", tip: "¥1000 c/ caneca de brinde. Rola até 25/dez — vão antes de viajar p/ Kyoto." },
  { id: "yebisu-xmas", name: "Yebisu Garden Place (lustre Baccarat)", cat: "vista", lat: 35.6425, lng: 139.7130, costBRL: 0, spendBRL: 40, duration: "1h",
    desc: "O lustre de cristal Baccarat gigante + iluminação clássica — clima de filme de Natal japonês.",
    transport: "JR Yamanote → Ebisu (¥170)", tip: "GRÁTIS. Combine com Afuri ramen ali do lado." },

  // ===== 🍜 COMIDA: os hypados das redes =====
  { id: "rokurinsha", name: "Rokurinsha (Ramen Street, Tokyo Station)", cat: "comida", lat: 35.6812, lng: 139.7671, costBRL: 0, spendBRL: 40, duration: "1h",
    desc: "O tsukemen (macarrão p/ mergulhar) mais famoso do Japão, na 'rua do ramen' dentro da estação.",
    transport: "Tokyo Station (subsolo Yaesu)", tip: "~¥1100. Fila de 30-45min no almoço; vá 10h30 ou 15h." },
  { id: "gyoza-lou", name: "Harajuku Gyoza Lou", cat: "comida", lat: 35.6699, lng: 139.7060, costBRL: 0, spendBRL: 40, duration: "1h",
    desc: "Gyoza de ¥350 a meia dúzia, sempre com fila de locais — o segredo mais barato de Harajuku.",
    transport: "Perto da Takeshita St.", tip: "Peça grelhado E cozido + cerveja. Jantar inteiro por ¥1200." },
  { id: "kura-harajuku", name: "Kura Sushi Global Flagship (Harajuku)", cat: "comida", lat: 35.6690, lng: 139.7027, costBRL: 0, spendBRL: 55, duration: "1h30",
    desc: "O kaiten sushi viral: esteira gigante, ¥115/prato, e a cada 5 pratos você joga o 'bikkura-pon' (gacha).",
    transport: "Em Harajuku (With Harajuku Bldg.)", tip: "Reserve pelo app da Kura p/ pular a fila. Almoço farto ¥1500." },
  { id: "happy-pancake", name: "A Happy Pancake (Omotesando)", cat: "comida", lat: 35.6653, lng: 139.7104, costBRL: 0, spendBRL: 45, duration: "1h",
    desc: "A panqueca soufflé que balança — o doce mais filmado do Japão.",
    transport: "Metrô → Omotesando (¥180)", tip: "~¥1300. Vá em dia útil de manhã; fds a fila passa de 1h." },
  { id: "marion", name: "Marion Crepes (Takeshita St.)", cat: "comida", lat: 35.6716, lng: 139.7031, costBRL: 0, spendBRL: 25, duration: "30min",
    desc: "O crepe original de Harajuku desde 1976 — 70+ sabores enrolados na hora.",
    transport: "Takeshita Street", tip: "~¥700. O de cheesecake com morango é o clássico." },
  { id: "mizuno", name: "Okonomiyaki Mizuno (Dotonbori)", cat: "comida", lat: 34.6685, lng: 135.5019, costBRL: 0, spendBRL: 60, duration: "1h",
    desc: "80 anos de okonomiyaki com estrela no Michelin Bib — feito na chapa na sua frente.",
    transport: "Em Dotonbori (Osaka)", tip: "~¥1500. Peça o yamaimo-yaki (massa de inhame). Fila anda rápido." },
  { id: "wanaka", name: "Takoyaki Wanaka (Osaka)", cat: "comida", lat: 34.6656, lng: 135.5064, costBRL: 0, spendBRL: 20, duration: "30min",
    desc: "O takoyaki preferido dos locais — crocante fora, cremoso dentro.",
    transport: "Sennichimae, Osaka", tip: "8 bolinhas ¥600. Coma em pé com cerveja de vending machine." },
  { id: "nishiki", name: "Mercado Nishiki (Kyoto)", cat: "comida", lat: 35.0050, lng: 135.7649, costBRL: 0, spendBRL: 90, duration: "2h",
    desc: "'A cozinha de Kyoto': 400m de barracas de tamagoyaki, mochi grelhado, tofu de soja preta.",
    transport: "A pé de Kawaramachi", tip: "Vá com fome às 11h. Espetinho de polvo c/ ovo de codorna = icônico." },
];

/*
 * Cidades-base disponíveis para dividir a viagem (multi-bases).
 */
export const CITIES = [
  { id: "toquio", label: "Tóquio", emoji: "🗼" },
  { id: "kyoto", label: "Kyoto", emoji: "🎎" },
  { id: "osaka", label: "Osaka", emoji: "🐙" },
  { id: "hakone", label: "Hakone", emoji: "🗻" },
];

/*
 * Transporte entre cidades — POR PESSOA, só ida, em BRL.
 * Shinkansen reservado (preço SmartEX app é ~10% menor).
 */
const INTERCITY = {
  "toquio-kyoto": { costBRL: yen(13320), label: "Shinkansen Hikari/Nozomi · 2h15" },
  "toquio-osaka": { costBRL: yen(13870), label: "Shinkansen · 2h30" },
  "toquio-hakone": { costBRL: yen(2470), label: "Odakyu Romancecar · 1h25" },
  "kyoto-osaka": { costBRL: yen(580), label: "JR local · ~30min" },
  "kyoto-hakone": { costBRL: yen(11310), label: "Hikari até Odawara + Hakone Tozan" },
  "osaka-hakone": { costBRL: yen(11870), label: "Shinkansen até Odawara + local" },
};

export function intercityRoute(cityA, cityB) {
  if (!cityA || !cityB || cityA === cityB) return null;
  return INTERCITY[`${cityA}-${cityB}`] ?? INTERCITY[`${cityB}-${cityA}`] ?? null;
}

/*
 * Bairros para hospedagem — preço por NOITE do QUARTO (casal/twin p/ 2),
 * calibrado p/ janeiro (baixa temporada pós-Ano Novo = mais barato).
 */
export const LODGING_AREAS = [
  { id: "asakusa", city: "toquio", name: "Asakusa", lat: 35.7130, lng: 139.7940, emoji: "⛩️",
    priceNight: { hostel: 260, airbnb: 420, midrange: 520, upscale: 1100 },
    chains: ["Toyoko Inn Asakusa (~R$310/n)", "APA Asakusa Ekimae (~R$360/n)", "Dormy Inn c/ onsen (~R$520/n)"],
    pros: ["Mais barato de Tóquio", "Charme tradicional, Senso-ji do lado", "Direto do aeroporto Narita (Access Express)"],
    cons: ["Longe de Shibuya/Shinjuku (~30min)", "Bairro dorme cedo"],
    verdict: "Melhor custo-benefício. Ideal se a prioridade é gastar em experiências, não no quarto." },
  { id: "ueno", city: "toquio", name: "Ueno", lat: 35.7115, lng: 139.7770, emoji: "🐼",
    priceNight: { hostel: 250, airbnb: 400, midrange: 500, upscale: 1000 },
    chains: ["Toyoko Inn Ueno (~R$300/n)", "APA Keisei Ueno (~R$350/n)", "Sotetsu Fresa Inn (~R$420/n)"],
    pros: ["Barato", "Skyliner direto do Narita (41min)", "JR Yamanote na porta + parque e museus"],
    cons: ["Menos vida noturna", "Área da estação é feiosa"],
    verdict: "Prático e econômico — ótimo p/ chegada e day trips (Nikko sai perto, de Asakusa)." },
  { id: "shinjuku", city: "toquio", name: "Shinjuku", lat: 35.6900, lng: 139.7000, emoji: "🌃",
    priceNight: { hostel: 320, airbnb: 600, midrange: 750, upscale: 1500 },
    chains: ["APA Shinjuku Kabukicho (~R$450/n)", "Sotetsu Fresa Nishi-Shinjuku (~R$520/n)", "Dormy Inn Premium (~R$650/n)"],
    pros: ["Hub de TUDO (trens, ônibus p/ Fuji/Hakone)", "Vida noturna na porta (Golden Gai, Omoide)", "Nunca fecha"],
    cons: ["Mais caro", "Estação é um labirinto (maior do mundo)"],
    verdict: "A escolha clássica p/ primeira vez, se o orçamento permitir quarto ~R$750/noite." },
  { id: "shibuya", city: "toquio", name: "Shibuya", lat: 35.6590, lng: 139.7010, emoji: "🛍️",
    priceNight: { hostel: 330, airbnb: 650, midrange: 800, upscale: 1600 },
    chains: ["APA Shibuya Dogenzaka (~R$480/n)", "sequence MIYASHITA PARK (~R$700/n)", "JR-East METS (~R$620/n)"],
    pros: ["Coração jovem da cidade", "Compras e comida infinitas", "Yamanote + linhas privadas"],
    cons: ["O mais caro junto com Ginza", "Muvuca constante"],
    verdict: "Perfeito p/ o perfil de vocês, mas paga-se prêmio de localização." },
  { id: "ikebukuro", city: "toquio", name: "Ikebukuro", lat: 35.7295, lng: 139.7109, emoji: "🎮",
    priceNight: { hostel: 270, airbnb: 450, midrange: 550, upscale: 1050 },
    chains: ["Toyoko Inn Ikebukuro (~R$310/n)", "APA Ikebukuro Eki-Kitaguchi (~R$370/n)", "Sotetsu Fresa (~R$430/n)"],
    pros: ["Custo-benefício + vida noturna própria", "Paraíso geek (Sunshine City, Pokémon Center)", "Yamanote direto"],
    cons: ["Menos 'cartão-postal'", "20min de Shibuya"],
    verdict: "Dark horse: quarto bom por menos, bairro animado, base geek." },
  { id: "ginza-tokyo", city: "toquio", name: "Ginza / Tokyo Station", lat: 35.6750, lng: 139.7650, emoji: "🥂",
    priceNight: { hostel: 350, airbnb: 700, midrange: 900, upscale: 2100 },
    chains: ["APA Ginza-Kyobashi (~R$520/n)", "Sotetsu Fresa Ginza-7 (~R$560/n)", "Via Inn Tokyo Station (~R$500/n)"],
    pros: ["Central e elegante", "Shinkansen na porta (p/ Kyoto)", "Perto de Tsukiji e Palácio"],
    cons: ["Caro", "Morto à noite (comercial)"],
    verdict: "Só se acharem promo de hotel 4★ — a área é linda mas sem vida noturna." },

  // ===== KYOTO =====
  { id: "kyoto-station", city: "kyoto", name: "Estação Kyoto", lat: 34.9858, lng: 135.7588, emoji: "🚉",
    priceNight: { hostel: 240, airbnb: 420, midrange: 480, upscale: 1000 },
    chains: ["Toyoko Inn Kyoto Ekimae (~R$300/n)", "APA Kyoto Eki-Horikawa (~R$360/n)", "Vessel Campana (~R$480/n)"],
    pros: ["Chega/sai de shinkansen a pé", "Ônibus p/ todos os templos saem daqui", "Hotéis novos e baratos"],
    cons: ["Zero charme histórico", "15-20min de ônibus até Gion/Higashiyama"],
    verdict: "A base mais prática e barata de Kyoto — ideal p/ estadias curtas de 2-3 noites." },
  { id: "gion-higashiyama", city: "kyoto", name: "Gion / Higashiyama", lat: 35.0037, lng: 135.7756, emoji: "🎎",
    priceNight: { hostel: 280, airbnb: 560, midrange: 620, upscale: 1500 },
    chains: ["Poucas redes aqui — o forte são machiya no Airbnb", "APA Gion (~R$450/n)"],
    pros: ["Dormir no meio do Japão antigo", "Templos a pé (Kiyomizu, Yasaka)", "Machiya (casas tradicionais) p/ alugar"],
    cons: ["Mais caro", "Restaurantes fecham cedo"],
    verdict: "A experiência 'Kyoto de filme'. Vale pagar mais se Kyoto for o coração da viagem." },
  { id: "kawaramachi", city: "kyoto", name: "Centro (Kawaramachi)", lat: 35.0083, lng: 135.7681, emoji: "🏮",
    priceNight: { hostel: 260, airbnb: 500, midrange: 550, upscale: 1150 },
    chains: ["Toyoko Inn Shijo-Karasuma (~R$310/n)", "APA Kawaramachi (~R$380/n)", "Daiwa Roynet (~R$460/n)"],
    pros: ["Vida noturna de Kyoto (Pontocho, Kiyamachi)", "Anda-se a pé p/ Gion", "Comércio e restaurantes infinitos"],
    cons: ["Meio-termo em tudo", "Ruas movimentadas"],
    verdict: "Equilíbrio ideal: charme + noite + logística. Melhor p/ 3+ noites." },

  // ===== OSAKA =====
  { id: "namba", city: "osaka", name: "Namba / Dotonbori", lat: 34.6666, lng: 135.5012, emoji: "🐙",
    priceNight: { hostel: 220, airbnb: 380, midrange: 460, upscale: 950 },
    chains: ["Toyoko Inn Namba (~R$290/n)", "APA Namba-Eki Higashi (~R$340/n)", "Sotetsu Grand Fresa (~R$400/n)"],
    pros: ["Dotonbori na porta (neon + comida)", "A Osaka divertida acontece aqui", "Kuromon Market a pé"],
    cons: ["Barulhento", "Turístico"],
    verdict: "A escolha certa p/ sentir Osaka: sai do hotel e cai na farra do Glico Man." },
  { id: "umeda", city: "osaka", name: "Umeda / Estação Osaka", lat: 34.7025, lng: 135.4959, emoji: "🚄",
    priceNight: { hostel: 240, airbnb: 420, midrange: 500, upscale: 1050 },
    chains: ["Toyoko Inn Umeda (~R$300/n)", "APA Osaka-Umeda (~R$360/n)", "Hotel Hankyu RESPIRE (~R$520/n)"],
    pros: ["Hub de trens (fácil p/ Kyoto/Nara/Kobe)", "Umeda Sky Building", "Shopping gigante"],
    cons: ["Corporativo, menos vibe", "15min de metrô até Dotonbori"],
    verdict: "Prático p/ quem vai usar Osaka como base de day trips pelo Kansai." },
  { id: "shinsekai", city: "osaka", name: "Shinsekai / Tennoji", lat: 34.6524, lng: 135.5063, emoji: "🗼",
    priceNight: { hostel: 180, airbnb: 320, midrange: 380, upscale: 800 },
    chains: ["Toyoko Inn Tsutenkaku (~R$260/n)", "APA Tennoji (~R$310/n)", "Via Inn Abeno (~R$330/n)"],
    pros: ["O mais barato do Japão urbano", "Kushikatsu e Torre Tsutenkaku retrô", "Metrô direto p/ tudo"],
    cons: ["Área mais 'raiz' à noite", "Menos polido"],
    verdict: "Orçamento apertado? Aqui o hotel 3★ custa preço de hostel de Tóquio." },

  // ===== HAKONE =====
  { id: "hakone-onsen", city: "hakone", name: "Hakone (ryokan + onsen)", lat: 35.2323, lng: 139.1069, emoji: "♨️",
    priceNight: { hostel: 400, airbnb: 750, midrange: 900, upscale: 2200 },
    chains: ["K's House Hakone (hostel c/ onsen, ~R$400/n)", "Tenzan/Yuryo têm kashikiri (banho privado) p/ tatuados"],
    pros: ["Experiência clássica: ryokan, yukata, onsen", "Meio caminho do loop do Fuji", "Jantar kaiseki incluso no upscale"],
    cons: ["Caro p/ o que oferece em conforto ocidental", "1 noite basta"],
    verdict: "1 noite de ryokan com onsen = memória de viagem. Meia pensão no tier 4-5★." },
];

// Guia de transporte com custos
export const TRANSPORT_GUIDE = [
  { id: "suica", name: "Suica/Pasmo no celular", costBRL: 0, per: "recarga conforme uso",
    desc: "Cartão de transporte no Apple/Google Wallet. Paga metrô, JR, ônibus, konbini e vending machines.",
    tip: "Adicione ANTES de viajar (app Suica). Cada viagem de metrô ¥180-250 (R$6-8). Orçamento: ~R$25-35/dia/pessoa." },
  { id: "subway-pass", name: "Tokyo Subway Ticket 72h", costBRL: yen(1500), per: "por pessoa",
    desc: "Metrô ILIMITADO (Tokyo Metro + Toei) por 72h — só para turistas.",
    tip: "¥1500/72h = R$50. Se usarem metrô 4+ vezes/dia, compensa muito. Vende no aeroporto e BIC Camera." },
  { id: "narita", name: "SUA CHEGADA 09/dez: Narita (NRT) → Tóquio", costBRL: yen(2570), per: "por pessoa",
    desc: "Skyliner (41min até Ueno, ¥2570) ou N'EX (1h até Shinjuku/Tokyo St., ¥3070) ou Access Express (¥1310 até Asakusa).",
    tip: "Se hotel em Asakusa/Ueno: Skyliner/Access Express. Se Shinjuku/Shibuya: N'EX. Ônibus ¥1300 é o mais barato (75-100min)." },
  { id: "haneda", name: "Haneda → Tóquio (se chegar por HND)", costBRL: yen(500), per: "por pessoa",
    desc: "Monotrilho até Hamamatsucho (¥500, 20min) ou Keikyu até Shinagawa (¥300).",
    tip: "Haneda é MUITO mais perto que Narita. Se puderem escolher o voo, prefiram HND." },
  { id: "jrpass", name: "JR Pass 7 dias — vale a pena?", costBRL: yen(50000), per: "por pessoa",
    desc: "¥50.000 (R$1.650). Trens JR ilimitados incl. shinkansen.",
    tip: "NÃO vale só p/ Tóquio. SÓ compensa se fizerem Tóquio→Kyoto→Osaka→Tóquio na mesma semana (¥27k+ em trechos avulsos... ainda assim não fecha). Veredito: comprem trechos avulsos." },
  { id: "shinkansen", name: "Shinkansen Tóquio ⇄ Kyoto (avulso)", costBRL: yen(13320), per: "por pessoa/trecho",
    desc: "Hikari/Nozomi, 2h15. ¥13.320 (R$440) cada trecho, assento reservado.",
    tip: "Ida+volta p/ 2 pessoas = R$1.760. Compre no app SmartEX com desconto (¥12.030) e escolha assento lado direito (vista do Fuji: fileira E)." },
  { id: "taxi", name: "Táxi (evitar)", costBRL: yen(500), per: "bandeirada",
    desc: "Bandeirada ¥500 + ¥100/255m. Uma corrida curta sai ¥1500-2500.",
    tip: "Trem fecha ~0h30-1h. Se perderem o último, táxi Shibuya→Asakusa ~¥6000 (R$200). Fiquem de olho no horário!" },
];

// Roteiro dia a dia (09 → 22/dez)
export const JAPAN_ITINERARY = [
  { day: 1, date: "09/dez", theme: "Chegada por Narita (NRT)", icon: "🛬",
    items: ["Skyliner (Ueno/Asakusa) ou N'EX (Shinjuku/Shibuya) até o hotel", "Ativar Suica no celular + jantar de konbini (onigiri + melon pan)", "Caminhada leve pelo bairro p/ segurar o jet lag até 21-22h"] },
  { day: 2, date: "10/dez", theme: "Shibuya + Harajuku", icon: "🌆",
    items: ["Shibuya Crossing + Hachiko de manhã", "Cat Street até Harajuku + Meiji Jingu", "Nintendo TOKYO / Pokémon Center (Parco)", "Pôr do sol no Shibuya Sky (reservado!)", "Noite: Blue Cave + Ichiran ou Gyukatsu"] },
  { day: 3, date: "11/dez", theme: "Asakusa + Skytree + Akihabara", icon: "⛩️",
    items: ["Senso-ji às 8h30 (sem multidão) + Nakamise", "Kappabashi (facas) a pé", "Tarde geek em Akihabara (Super Potato, GiGO, gachapon)", "Noite: Jakotsu-yu — onsen tattoo-friendly p/ fechar o dia"] },
  { day: 4, date: "12/dez", theme: "Tsukiji + Ginza + Palácio", icon: "🍣",
    items: ["Café da manhã de sushi no Tsukiji (8h30)", "Hama-rikyu: chá na lagoa", "Ginza: Uniqlo 12 andares, Itoya, MUJI flagship", "Noite: iluminações de Marunouchi + Tokyo Station"] },
  { day: 5, date: "13/dez", theme: "teamLab + Odaiba", icon: "🎨",
    items: ["teamLab Planets 10h (reservado!)", "Yurikamome p/ Odaiba: Gundam + Rainbow Bridge", "Fim de tarde em Shimbashi (izakayas de salaryman)"] },
  { day: 6, date: "14/dez", theme: "Day trip: Kamakura + Enoshima", icon: "🚄",
    items: ["JR até Kamakura (~1h): Grande Buda + Hase-dera", "Rua Komachi p/ almoço", "Enoden (trem à beira-mar) até Enoshima", "Pôr do sol na ilha + volta"] },
  { day: 7, date: "15/dez", theme: "Shimokita + Sangenjaya + Nakameguro", icon: "🛍️",
    items: ["Brechós de Shimokitazawa de manhã", "Almoço + Triângulo de Sangenjaya (vista grátis da Carrot Tower)", "Canal de Nakameguro + Starbucks Reserve", "Noite: Nonbei Yokocho em Shibuya"] },
  { day: 8, date: "16/dez", theme: "Day trip: Hakone OU Kawaguchiko (Fuji)", icon: "🗻",
    items: ["ESCOLHER pelo tempo — dia limpo = Fuji visível!", "Hakone: loop completo c/ Free Pass (teleférico + barco pirata)", "Onsen kashikiri (privativo = tatuagem sem stress)", "OU Kawaguchiko: pagode Chureito + lago"] },
  { day: 9, date: "17/dez", theme: "Ikebukuro geek + Yanaka/Nezu", icon: "🎮",
    items: ["Opcional 7h: treino de sumô (asageiko) em Ryogoku", "Yanaka Ginza + santuário Nezu (mini Fushimi)", "Tarde: Sunshine City — Pokémon Center Mega", "Noite: Golden Gai ou Omoide Yokocho"] },
  { day: 10, date: "18/dez", theme: "→ Kyoto (shinkansen)", icon: "🚅",
    items: ["Shinkansen 9h (assento E = vista do Fuji)", "Check-in + Kinkaku-ji (Pavilhão Dourado)", "Fim de tarde em Gion (chance de ver maiko)", "Jantar em Pontocho"] },
  { day: 11, date: "19/dez", theme: "Kyoto: Fushimi Inari + Arashiyama", icon: "⛩️",
    items: ["Fushimi Inari às 7h (mil toriis vazios)", "Bambuzal de Arashiyama + macacos de Iwatayama", "Chá em Higashiyama", "Noite: izakayas de Kiyamachi"] },
  { day: 12, date: "20/dez", theme: "Nara + Osaka à noite", icon: "🦌",
    items: ["Manhã: cervos de Nara + Todai-ji", "Trem p/ Osaka: check-in em Namba", "Dotonbori: takoyaki + Glico Man", "Noite raiz em Ura-Namba ou kushikatsu no Shinsekai"] },
  { day: 13, date: "21/dez", theme: "Volta a Tóquio + despedida", icon: "🛒",
    items: ["Shinkansen de volta (manhã)", "Don Quijote MEGA p/ souvenirs + KitKat", "Tokyo Christmas Market (Jingu Gaien) ou iluminações Midtown", "Última noite: Omoide Yokocho"] },
  { day: 14, date: "22/dez", theme: "Volta ao Brasil (NRT)", icon: "🛫",
    items: ["Café tranquilo + malas", "Tax-free conferido (recibos no passaporte)", "Skyliner/N'EX p/ NARITA 4h antes do voo"] },
];

// Estimativa diária por pessoa (sem hotel).
// Comida no estilo de vocês: café no 7-Eleven, almoço na rua, janta em
// lugar de esquina ou hypado das redes. meals = por refeição (R$/pessoa).
export const DAILY_STYLES = [
  { id: "economic", label: "Econômico", foodBRL: 112, transportBRL: 28, funBRL: 60,
    meals: { breakfast: 20, lunch: 34, dinner: 58 },
    desc: "Konbini de manhã (R$20) + gyudon/soba em pé no almoço (R$34) + ramen ou izakaya barato à noite (R$58)" },
  { id: "comfortable", label: "Nosso estilo", foodBRL: 158, transportBRL: 35, funBRL: 130,
    meals: { breakfast: 22, lunch: 46, dinner: 90 },
    desc: "7-Eleven de manhã (R$22) + esquina/kaiten no almoço (R$46) + jantar hypado das redes: Gyukatsu, Ichiran, yokocho (R$90)" },
  { id: "premium", label: "Premium", foodBRL: 330, transportBRL: 60, funBRL: 250,
    meals: { breakfast: 30, lunch: 90, dinner: 210 },
    desc: "Café em kissaten + almoços de sushi de balcão + jantares top (wagyu, omakase acessível 1-2x na viagem)" },
];

/*
 * Guia de compras — FORA dos cálculos de orçamento (gasto pessoal).
 * Links oficiais p/ pesquisar antes de ir.
 */
export const SHOPPING_GUIDE = [
  { id: "roupas", label: "Roupas & Streetwear", emoji: "👕", items: [
    { name: "Uniqlo Ginza (flagship 12 andares)", area: "Ginza", url: "https://www.uniqlo.com/jp/ja/", desc: "Básicos ¥990-2990; peças exclusivas do Japão. Tax-free no 12º andar." },
    { name: "GU", area: "Shibuya / Ginza", url: "https://www.gu-global.com/jp/ja/", desc: "A 'irmã barata' da Uniqlo — tendências pela metade do preço." },
    { name: "2nd STREET", area: "várias (Shimokita!)", url: "https://www.2ndstreet.jp/", desc: "Rede de usados: Comme des Garçons, Issey Miyake, North Face por fração." },
    { name: "RAGTAG", area: "Harajuku / Shibuya", url: "https://www.ragtag.jp/", desc: "Second-hand de grife japonesa curado (Yohji, CDG, Sacai)." },
    { name: "Kinji Used Clothing", area: "Harajuku", url: "https://www.kinji.jp/", desc: "Galpão de vintage — volume grande, preço honesto." },
    { name: "WEGO", area: "Takeshita St.", url: "https://wego.jp/", desc: "Fast fashion jovem estilo Harajuku, barato p/ presentes." },
    { name: "BEAMS Japan", area: "Shinjuku", url: "https://www.beams.co.jp/", desc: "6 andares de 'Japão moderno': moda, craft e souvenir de bom gosto." },
    { name: "Onitsuka Tiger", area: "Omotesando", url: "https://www.onitsukatiger.com/jp/ja-jp/", desc: "Modelos exclusivos do Japão — bem mais barato que no Brasil." },
  ]},
  { id: "tech", label: "Tecnologia & Games", emoji: "🎧", items: [
    { name: "Yodobashi Camera Multimedia Akiba", area: "Akihabara", url: "https://www.yodobashi.com/", desc: "9 andares de eletrônicos. Passaporte = tax-free + cupom 5-7%." },
    { name: "Bic Camera", area: "Shibuya / Yurakucho", url: "https://www.biccamera.com/", desc: "Compare com a Yodobashi; cupom de turista no site." },
    { name: "Super Potato", area: "Akihabara", url: "https://www.superpotato.com/", desc: "Games retrô: Famicom, GameBoy, cartuchos raros testados." },
    { name: "BOOK OFF / HARD OFF", area: "várias", url: "https://www.bookoff.co.jp/", desc: "Usados impecáveis: jogos, consoles, câmeras, vinil, mangá ¥110." },
    { name: "Mandarake Complex", area: "Akihabara / Nakano", url: "https://www.mandarake.co.jp/", desc: "Colecionáveis e figures raros — preços melhores em Nakano." },
    { name: "Map Camera", area: "Shinjuku", url: "https://www.mapcamera.com/", desc: "Câmeras usadas grau A com garantia — meca da fotografia." },
  ]},
  { id: "beleza", label: "Beleza & Farmácia", emoji: "💄", items: [
    { name: "Matsumoto Kiyoshi", area: "várias", url: "https://www.matsukiyo.co.jp/", desc: "Skincare japonês (Hada Labo, Anessa, Melano CC) tax-free." },
    { name: "@cosme STORE", area: "Harajuku", url: "https://www.cosme.net/", desc: "Flagship com rankings reais de cosméticos — 3 andares." },
    { name: "K-beauty em Shin-Okubo", area: "Shin-Okubo", url: "https://www.shinokubo.info/", desc: "Skincare coreano mais barato que no BR + corn dog na saída." },
  ]},
  { id: "geral", label: "Geral & Souvenirs", emoji: "🎁", items: [
    { name: "Don Quijote MEGA (24h)", area: "Shibuya", url: "https://www.donki.com/", desc: "KitKat de sabores, doces, gadgets — tax-free acima de ¥5000." },
    { name: "LOFT", area: "Shibuya", url: "https://www.loft.co.jp/", desc: "Papelaria dos sonhos e presentes de design." },
    { name: "Hands", area: "Shibuya / Shinjuku", url: "https://hands.net/", desc: "DIY e mil coisas úteis que você não sabia que queria." },
    { name: "MUJI Ginza (flagship)", area: "Ginza", url: "https://www.muji.com/jp/", desc: "6 andares + padaria; bem mais barato que MUJI no exterior." },
    { name: "Daiso Harajuku", area: "Takeshita St.", url: "https://www.daiso-sangyo.co.jp/", desc: "Tudo ¥110 — souvenir em massa sem dó." },
    { name: "3COINS", area: "várias", url: "https://www.3coins.jp/", desc: "'Daiso premium': tudo ¥330 com ótimo design." },
    { name: "Kappabashi (rua das facas)", area: "Asakusa", url: "https://www.kappabashi.or.jp/", desc: "Faca japonesa com nome gravado grátis — presente definitivo." },
  ]},
];

/*
 * Guia de alimentação — no estilo da dupla:
 * café no konbini, almoço de rua, janta de esquina ou hypada.
 * priceBRL = por pessoa. Já coberto pela "diária" do orçamento.
 */
export const FOOD_GUIDE = [
  { id: "cafe", label: "Café da manhã no konbini (7-Eleven/Lawson/FamilyMart)", emoji: "🏪",
    note: "Meta: ~R$20-22/pessoa. Konbini no Japão é NÍVEL: tudo fresco, caixas sem fila, café bom.",
    items: [
      { name: "Onigiri (salmão, atum-maionese, umeboshi)", priceBRL: 6, yen: "¥180", desc: "O básico perfeito — pegue 2" },
      { name: "Tamago sando (sanduíche de ovo)", priceBRL: 9, yen: "¥280", desc: "O sanduíche viral do 7-Eleven" },
      { name: "Melon pan / croissant", priceBRL: 5, yen: "¥160", desc: "Doce de padaria de konbini" },
      { name: "Café drip da máquina (L)", priceBRL: 6, yen: "¥180", desc: "Melhor que muito café de cafeteria" },
      { name: "Karaage-kun (Lawson)", priceBRL: 8, yen: "¥240", desc: "Frango frito de balcão — vício" },
      { name: "Iogurte / fruta cortada", priceBRL: 7, yen: "¥200", desc: "P/ aliviar a consciência" },
    ]},
  { id: "almoco", label: "Almoço de rua e esquina", emoji: "🍛",
    note: "Meta: ~R$34-50/pessoa. Redes de esquina japonesas são baratas, rápidas e boas.",
    items: [
      { name: "Gyudon (Sukiya / Yoshinoya / Matsuya)", priceBRL: 18, yen: "¥550", desc: "Bowl de arroz c/ carne — pede na máquina" },
      { name: "Soba/udon em pé (tachigui)", priceBRL: 15, yen: "¥450", desc: "Experiência salaryman raiz" },
      { name: "Teishoku (prato feito japonês)", priceBRL: 31, yen: "¥950", desc: "Arroz + missô + principal — Yayoiken" },
      { name: "CoCo Ichibanya (curry)", priceBRL: 36, yen: "¥1100", desc: "Monte seu curry — nível de picância 1-10" },
      { name: "Kaiten sushi (Kura / Sushiro / Uobei)", priceBRL: 46, yen: "¥1400", desc: "10-12 pratos girando ou por tablet" },
      { name: "Ichiran / ramen de balcão", priceBRL: 43, yen: "¥1300", desc: "O clássico das cabines individuais" },
      { name: "Bento de depachika", priceBRL: 40, yen: "¥1200", desc: "Após 19h30 cai p/ metade!" },
    ]},
  { id: "jantar", label: "Jantar: esquinas e hypados das redes", emoji: "🔥",
    note: "Meta: ~R$58-99/pessoa. Os virais valem: quase todos custam menos que restaurante médio no Brasil.",
    items: [
      { name: "Gyukatsu Motomura (Shibuya)", priceBRL: 64, yen: "¥1930", desc: "Bife empanado que você grelha na pedra" },
      { name: "Harajuku Gyoza Lou", priceBRL: 40, yen: "¥1200", desc: "Jantar inteiro de gyoza + cerveja" },
      { name: "Rokurinsha (Tokyo Station)", priceBRL: 36, yen: "¥1100", desc: "O tsukemen mais famoso do país" },
      { name: "Afuri (Ebisu)", priceBRL: 46, yen: "¥1400", desc: "Ramen de yuzu leve e cítrico" },
      { name: "Torikizoku (yakitori)", priceBRL: 83, yen: "¥2500", desc: "TUDO ¥370: espetos + bebidas a noite toda" },
      { name: "Shibuya/Harmonica Yokocho (izakaya crawl)", priceBRL: 99, yen: "¥3000", desc: "Vários bares, pratinhos + drinks" },
      { name: "Okonomiyaki Mizuno (Osaka)", priceBRL: 50, yen: "¥1500", desc: "Bib Gourmand na chapa" },
      { name: "Yakiniku em pé (Jiromaru)", priceBRL: 99, yen: "¥3000", desc: "Wagyu por espeto, sem taxa de serviço" },
    ]},
  { id: "doces", label: "Doces e cafés virais", emoji: "🍡",
    note: "Encaixe 1/dia no 'lazer' da diária — nenhum passa de R$45.",
    items: [
      { name: "Crepe da Marion (Takeshita St.)", priceBRL: 23, yen: "¥700", desc: "O crepe original de Harajuku" },
      { name: "A Happy Pancake (soufflé)", priceBRL: 43, yen: "¥1300", desc: "A panqueca que balança" },
      { name: "Taiyaki (peixinho de massa)", priceBRL: 8, yen: "¥250", desc: "Recheio de anko ou creme, na rua" },
      { name: "Cream puff do Totoro (Shirohige)", priceBRL: 20, yen: "¥600", desc: "A carolina mais fofa do mundo" },
      { name: "Pudim / mochi de konbini", priceBRL: 10, yen: "¥300", desc: "Sobremesa de ¥300 nível confeitaria" },
      { name: "Matcha + doce em Kyoto (Nishiki)", priceBRL: 30, yen: "¥900", desc: "Chá batido na hora c/ wagashi" },
    ]},
];
