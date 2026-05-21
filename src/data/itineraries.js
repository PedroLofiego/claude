/*
 * MOCKED — substituir por API de roteiros (ex.: GetYourGuide, Triposo)
 * ou geração via LLM em produção.
 *
 * Roteiros calibrados para a viagem 22 dez 2026 → 9 jan 2027,
 * perfil jovem (20-30). Cada destino tem 4 dias "âncora" no calendário:
 *   - xmasEve  (24/dez)
 *   - xmasDay  (25/dez)
 *   - nyeEve   (31/dez)
 *   - nyeDay   (01/jan)
 * Os demais dias usam o pool `regular` (com foco em nightlife,
 * experiências fotogênicas e atividades fora do óbvio).
 */

const POOLS = {
  lisboa: {
    xmasEve: {
      theme: "Véspera de Natal",
      items: [
        "Mercado de Natal da Praça do Comércio (vinho quente e barracas)",
        "Iluminação de Natal na Rua Augusta",
        "Consoada portuguesa: bacalhau cozido com tudo + rabanada",
        "Missa do Galo na Sé (opcional, à meia-noite)",
      ],
    },
    xmasDay: {
      theme: "Dia de Natal sossegado",
      items: [
        "Brunch tardio em Cais do Sodré",
        "Caminhada por Alfama e Miradouro de Santa Luzia",
        "Bondinho 28 vazio (lojas fechadas, atrações abertas)",
        "Jantar de bolo-rei e vinho do Porto no airbnb",
      ],
    },
    nyeEve: {
      theme: "Réveillon no Terreiro do Paço",
      items: [
        "Almoço tardio e descanso",
        "Show grátis no Terreiro do Paço com nomes nacionais",
        "Fogos sobre o Tejo à meia-noite",
        "After-party em Lux Frágil (club lendário da Madonna)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro lento",
      items: [
        "Café com pastel de Belém para curar a ressaca",
        "Mosteiro dos Jerónimos (geralmente aberto)",
        "Caminhada pela orla até Belém",
        "Jantar leve em Time Out Market",
      ],
    },
    regular: [
      { theme: "Belém Insta-friendly", items: ["MAAT sobre o rio", "Pastéis de Belém na fila do balcão", "LX Factory: brunch e brechós", "Pôr do sol no Miradouro de Santa Catarina"] },
      { theme: "Sintra Selvagem", items: ["Quinta da Regaleira (poço iniciático)", "Palácio da Pena com névoa", "Cabo da Roca: fim da Europa continental", "Jantar em Cascais à beira-mar"] },
      { theme: "Cais do Sodré à noite", items: ["Time Out Market (food hall até tarde)", "Pink Street bar crawl", "Pensão Amor (cabaré-bar lendário)", "Lux Frágil até o amanhecer"] },
      { theme: "Surf em Cascais", items: ["Aula de surf em Carcavelos com roupa térmica", "Almoço de marisco em Cascais", "Boca do Inferno", "Trem de volta com pôr do sol"] },
      { theme: "Bairros & Miradouros", items: ["Graça e Senhora do Monte", "Castelo de São Jorge", "Bairro Alto à noite", "Jantar de fado contemporâneo"] },
    ],
  },

  paris: {
    xmasEve: {
      theme: "Véspera de Natal em Paris",
      items: [
        "Marché de Noël na La Défense (maior da cidade)",
        "Patinação no gelo no Hôtel de Ville",
        "Tour Eiffel cintilando às 22h (a cada hora)",
        "Réveillon prévia: jantar de ostras em brasserie no Marais",
      ],
    },
    xmasDay: {
      theme: "Natal pelos bairros",
      items: [
        "Brunch em hotel ou bistrô (a maioria abre)",
        "Galerie Lafayette com a árvore gigante",
        "Caminhada por Montmartre e Sacré-Cœur",
        "Jantar à luz de velas no Belleville (etíope/vietnamita)",
      ],
    },
    nyeEve: {
      theme: "Réveillon nos Champs-Élysées",
      items: [
        "Brunch tarde e descanso",
        "Champanhe no Trocadero (vista da Torre Eiffel)",
        "Show de luzes no Arco do Triunfo à meia-noite (gratuito)",
        "Festa em Concrete ou La Bellevilloise até o amanhecer",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro nos museus",
      items: [
        "Café da manhã tardio no Marais",
        "Musée d'Orsay (aberto, com menos gente)",
        "Caminhada pelo Sena",
        "Jantar tipo bistrô em Saint-Germain",
      ],
    },
    regular: [
      { theme: "Paris Iluminada", items: ["Champs-Élysées decorada (foto e compras)", "Roda-gigante em Tuileries", "Jantar em Montmartre", "Cabaret alternativo em Pigalle"] },
      { theme: "Arte alternativa", items: ["Catacumbas de Paris (subterrâneo macabro)", "Atelier des Lumières (arte imersiva)", "Canal Saint-Martin: cafés e brechós", "Bar de cocktails em Le Mary Celeste"] },
      { theme: "Versalhes no inverno", items: ["RER C até Versalhes", "Salão dos Espelhos vazio", "Jardins com geada (épico para foto)", "Jantar em La Défense"] },
      { theme: "Saint-Germain + Disney", items: ["Sainte-Chapelle (vitrais)", "Café de Flore para gente assistir", "RER A → Disneyland Paris (decoração natalina)", "Fogos do parque na volta"] },
      { theme: "Latin Quarter & Marais", items: ["Shakespeare and Company", "Crepes na Rue Mouffetard", "Bar crawl no Marais", "Jazz em Caveau de la Huchette"] },
    ],
  },

  roma: {
    xmasEve: {
      theme: "Véspera de Natal em Roma",
      items: [
        "Vaticano iluminado com a árvore gigante na Praça São Pedro",
        "Mercado de Natal em Piazza Navona (Befana)",
        "Cenone de la Vigilia: jantar de 7 peixes em Trastevere",
        "Missa do Galo no Vaticano (chega 21h se quiser entrar)",
      ],
    },
    xmasDay: {
      theme: "Bênção papal e farinha",
      items: [
        "Urbi et Orbi do Papa ao meio-dia na Praça São Pedro",
        "Almoço longo de massa em trattoria familiar",
        "Caminhada pelo Foro Romano com céu de inverno",
        "Cinema em Piazza di Spagna ou gelato em Giolitti",
      ],
    },
    nyeEve: {
      theme: "Réveillon no Circo Massimo",
      items: [
        "Aperitivo em Monti com lentilha (sorte para o ano)",
        "Concertão grátis no Circo Massimo (sempre nome grande)",
        "Fogos vistos do Pincio com champanhe",
        "Festa em club tipo Spazio Novecento ou Goa",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro em Trastevere",
      items: [
        "Brunch em Trastevere",
        "Caminhada pela Ponte Sisto e Janículo (vista)",
        "Aperitivo de Aperol em Campo de' Fiori",
        "Jantar de cacio e pepe em Roscioli (reservar)",
      ],
    },
    regular: [
      { theme: "Roma Antiga descolada", items: ["Coliseu sem fila no inverno", "Fórum Romano + Palatino", "Aperitivo em Monti", "Jantar de carbonara"] },
      { theme: "Vaticano + Trastevere", items: ["Museus Vaticanos manhã cedo", "Capela Sistina", "Almoço em Trastevere", "Bar crawl noturno"] },
      { theme: "Vespa e centro", items: ["Tour de Vespa 3h (instagrammável)", "Fontana di Trevi à meia-noite", "Panteão", "Gelato em Giolitti"] },
      { theme: "Underground & Aperitivo", items: ["Tour Catacumbas de São Calisto", "Aula de pasta", "Pigneto (bairro alternativo)", "Pizza al taglio em Bonci"] },
      { theme: "Day trip Nápoles + Pompéia", items: ["Frecciarossa para Nápoles (1h10)", "Pizza em Da Michele", "Pompéia", "Volta tarde para Roma"] },
    ],
  },

  milao: {
    xmasEve: {
      theme: "Vigilia milanesa",
      items: [
        "Mercatino di Sant'Ambrogio (clássico desde 1288)",
        "Galleria Vittorio Emanuele iluminada",
        "Panettone Cova ou Marchesi e champanhe",
        "Cenone della Vigilia em trattoria típica",
      ],
    },
    xmasDay: {
      theme: "Natal & moda",
      items: [
        "Catedral do Duomo aberta para missa de Natal",
        "Brunch em hotel de luxo (Bulgari ou Mandarin)",
        "Quadrilatero della Moda (passear, mesmo fechado)",
        "Drinks em rooftop com vista para o Duomo",
      ],
    },
    nyeEve: {
      theme: "Réveillon na Piazza Duomo",
      items: [
        "Almoço de ravioli em Navigli",
        "Concertão GRÁTIS na Piazza Duomo (atração nacional sempre top)",
        "DJ set após meia-noite e fogos sobre a Catedral",
        "After-party em Just Cavalli ou Magazzini Generali",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro design",
      items: [
        "Brunch tardio em Brera",
        "Cenoteca em Navigli com aperitivo",
        "Última olhada na cidade pelas ruas vazias",
        "Aperol spritz à beira do canal",
      ],
    },
    regular: [
      { theme: "Duomo + Última Ceia", items: ["Subir ao terraço do Duomo (foto épica)", "Galleria Vittorio Emanuele", "Última Ceia de Leonardo (reservar com 2 meses)", "Aperitivo em Brera"] },
      { theme: "Navigli & design", items: ["Bike pelos Navigli", "Aperitivo aoperal+stuzzichini", "Design District Tortona", "Jantar siciliano"] },
      { theme: "Compras & noite", items: ["Quadrilatero della Moda", "Vintage em 10 Corso Como", "Drink no rooftop Terrazza Aperol", "Club Volt ou Old Fashion"] },
      { theme: "Day trip Lago di Como", items: ["Trem 40min até Como", "Bellagio de balsa", "Vila Olmo no inverno", "Almoço de risotto"] },
      { theme: "Day trip Verona", items: ["Trem 1h10 para Verona", "Casa de Julieta", "Arena de Verona", "Volta à noite com taça de Amarone"] },
    ],
  },

  veneza: {
    xmasEve: {
      theme: "Véspera em Veneza",
      items: [
        "Mercatini di Natale no Campo Santo Stefano",
        "Missa de Natal na Basílica de San Marco (reserva)",
        "Cenone della Vigilia de frutos do mar",
        "Caminhada pelas ruas vazias e enevoadas",
      ],
    },
    xmasDay: {
      theme: "Natal aquático",
      items: [
        "Café em Caffè Florian (o mais antigo do mundo)",
        "Passeio de gôndola pela manhã (turistas raros)",
        "Almoço em osteria típica em Cannaregio",
        "Pôr do sol na Punta della Dogana",
      ],
    },
    nyeEve: {
      theme: "Réveillon na Piazza San Marco",
      items: [
        "Cenone em restaurante com vista para o Canal",
        "Festa GRÁTIS na Piazza San Marco (DJ + show)",
        "Fogos sobre a Lagoa à meia-noite",
        "Beijo coletivo dos 'innamorati' na piazza",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro tradicional",
      items: [
        "Banho gelado no Lido de Veneza (a tradição)",
        "Almoço em sestiere Cannaregio (longe dos turistas)",
        "Galleria dell'Accademia ou Peggy Guggenheim",
        "Bacaro tour: ombre e cicheti",
      ],
    },
    regular: [
      { theme: "Veneza essencial", items: ["Basílica de San Marco e Campanile", "Palácio Ducal + Ponte dos Suspiros", "Almoço em bacaro", "Passeio de gôndola ao crepúsculo"] },
      { theme: "Burano + Murano", items: ["Vaporetto para Murano (vidro)", "Almoço em Burano (casas coloridas)", "Vaporetto pela laguna", "Volta a Veneza no fim de tarde"] },
      { theme: "Veneza alternativa", items: ["Cannaregio: bairro autêntico", "Bacaro tour (ombre de prosecco)", "Ponte de Rialto à noite", "Jazz em Venice Jazz Club"] },
      { theme: "Day trip Verona", items: ["Trem 1h10 até Verona", "Casa de Julieta", "Arena Romana", "Aperitivo no Café Borsari"] },
      { theme: "Dorsoduro hipster", items: ["Galleria dell'Accademia", "Peggy Guggenheim Collection", "Almoço em campo Santa Margherita", "Spritz veneziano clássico"] },
    ],
  },

  barcelona: {
    xmasEve: {
      theme: "Nochebuena catalã",
      items: [
        "Fira de Santa Llúcia (mercado em frente à Catedral)",
        "Encontre o Caganer e o Tió de Nadal (tradições peculiares)",
        "Jantar de escudella e neules",
        "Missa do Galo na Sagrada Família",
      ],
    },
    xmasDay: {
      theme: "Natal no Mediterrâneo",
      items: [
        "Brunch em Eixample",
        "Caminhada pelo Bairro Gótico vazio",
        "Praia da Barceloneta com casaco (sol garantido)",
        "Jantar tardio em Gràcia",
      ],
    },
    nyeEve: {
      theme: "12 uvas na Plaça d'Espanya",
      items: [
        "Aperitivo de cava + tapas",
        "Show de luzes em Montjuïc",
        "12 uvas com a multidão na Plaça d'Espanya à meia-noite",
        "Festa em Razzmatazz (5 ambientes) até 6h",
      ],
    },
    nyeDay: {
      theme: "Cabal Gata 1º",
      items: [
        "Brunch em Pijp ou El Born",
        "Caminhada por Park Güell sem multidão",
        "Aperitivo em Plaça del Sol (Gràcia)",
        "Jantar leve de pintxos",
      ],
    },
    regular: [
      { theme: "Gaudí Essencial", items: ["Sagrada Família (foto sem multidão)", "Park Güell logo cedo", "Casa Batlló com áudio-guia", "Tapas em Gràcia"] },
      { theme: "Bairro Gótico hipster", items: ["Catedral e ruas medievais", "El Born: cocktails", "Almoço em La Boqueria (bar Pinotxo)", "Razzmatazz à noite"] },
      { theme: "Bike + Barceloneta", items: ["Bike pela orla", "Almoço de paella", "Bunkers del Carmel ao pôr do sol", "Pintxos em Plaça del Sol"] },
      { theme: "Day trip ski Andorra", items: ["Ônibus direto (3h)", "Meio dia em Grandvalira", "Almoço em refúgio", "Volta para Barcelona"] },
      { theme: "Montjuïc + arte", items: ["Castelo de Montjuïc (teleférico)", "Fundació Miró", "Poble Espanyol", "Fonte Mágica (show noturno)"] },
    ],
  },

  viena: {
    xmasEve: {
      theme: "Heiliger Abend vienense",
      items: [
        "Christkindlmarkt em Rathausplatz (mais bonito da Europa)",
        "Punsch e Lebkuchen entre as barracas",
        "Concerto de Natal em St. Stephen's Cathedral",
        "Carpa frita: prato típico de véspera austríaca",
      ],
    },
    xmasDay: {
      theme: "Natal imperial",
      items: [
        "Palácio Schönbrunn (geralmente aberto)",
        "Café Sacher: a Sachertorte original",
        "Concerto de Natal na Musikverein (verificar)",
        "Jantar de ganso assado típico de natal",
      ],
    },
    nyeEve: {
      theme: "Silvesterpfad pela cidade",
      items: [
        "Aperitivo no Naschmarkt",
        "Silvesterpfad: caminho com palcos free pelas ruas",
        "Valsa do Danúbio Azul tocada à meia-noite na Heldenplatz",
        "After-party em Pratersauna ou Grelle Forelle",
      ],
    },
    nyeDay: {
      theme: "Concerto de Ano Novo",
      items: [
        "Concerto de Ano Novo da Filarmônica (TV livre / ingresso caro)",
        "Café da manhã estendido em café histórico (Central, Sperl)",
        "Caminhada pelo MuseumsQuartier",
        "Jantar de Wiener Schnitzel em Figlmüller",
      ],
    },
    regular: [
      { theme: "Imperial Vienna", items: ["Hofburg (residência imperial)", "Spanish Riding School", "Almoço em café tradicional", "Albertina museum"] },
      { theme: "Café culture", items: ["Café Central", "Café Demel (rivalidade com Sacher)", "Apple strudel show", "Concerto de Mozart em Karlskirche"] },
      { theme: "Day trip Wachau Valley", items: ["Trem para Krems (1h)", "Castelo de Dürnstein", "Almoço de Tafelspitz", "Volta à noite"] },
      { theme: "Vienna alternativa", items: ["MuseumsQuartier", "Mostrar Hundertwasserhaus", "Mercado Naschmarkt", "Bar crawl no 7º distrito"] },
      { theme: "Day trip Bratislava", items: ["Trem 1h até Bratislava", "Cidade velha", "Castelo no morro", "Volta para Viena"] },
    ],
  },

  budapeste: {
    xmasEve: {
      theme: "Karácsony húngaro",
      items: [
        "Vásárcsarnok decorado (mercado central)",
        "Christmas Market em Vörösmarty Square",
        "Mulled wine (forralt bor) e chimney cake (kürtőskalács)",
        "Cenone húngara: peixe carpa + repolho recheado",
      ],
    },
    xmasDay: {
      theme: "Termas de Natal",
      items: [
        "Banho termal no Széchenyi (aberto no Natal!)",
        "Brunch em New York Café (uma das mais belas cafeterias do mundo)",
        "Caminhada pela Buda Castle quase vazia",
        "Jantar no Mazel Tov (bairro judeu)",
      ],
    },
    nyeEve: {
      theme: "Réveillon em Pest",
      items: [
        "Cruzeiro no Danúbio com jantar e champanhe",
        "Festa de rua em Vörösmarty Square",
        "Fogos sobre o Parlamento (vista da Bastião dos Pescadores)",
        "Ruin pub crawl até de manhã (Szimpla Kert)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro nas termas",
      items: [
        "Café em Buda Castle bairro",
        "Banho termal Gellért (cura-ressaca)",
        "Almoço de goulash",
        "Cinema retrô em Művész",
      ],
    },
    regular: [
      { theme: "Pest essencial", items: ["Parlamento Húngaro", "Basílica de St. Stephen", "Andrássy Avenue", "Heroes' Square"] },
      { theme: "Ruin Pubs", items: ["Szimpla Kert (o original)", "Mazel Tov (bar-jardim)", "Instant-Fogas (mega complex)", "Café Csiga"] },
      { theme: "Buda Hills & termas", items: ["Buda Castle", "Matthias Church", "Bastião dos Pescadores", "Termas Rudas (banhos turcos)"] },
      { theme: "Day trip Eger", items: ["Trem 2h para Eger", "Vale da Bela Mulher (vinhos)", "Castelo de Eger", "Volta à noite"] },
      { theme: "Underground & arte", items: ["House of Terror Museum", "Memento Park (estátuas comunistas)", "Galeria Új Budapest", "Jantar em District VII"] },
    ],
  },

  praga: {
    xmasEve: {
      theme: "Štědrý den tcheco",
      items: [
        "Mercado de Natal final em Staroměstské náměstí",
        "Trdelník com sorvete e Nutella",
        "Cenone com carpa frita + salada de batata (tradição)",
        "Missa do Galo na Catedral de São Vito",
      ],
    },
    xmasDay: {
      theme: "Boêmia no inverno",
      items: [
        "Castelo de Praga ao amanhecer (vazio)",
        "Caminhada pela Charles Bridge nevada",
        "Almoço de svíčková (filé com creme)",
        "Café e koláč em Café Louvre",
      ],
    },
    nyeEve: {
      theme: "Réveillon na cidade dos 100 spires",
      items: [
        "Jantar de svíčková + cerveja Pilsner Urquell",
        "Letná Park: melhor mirante grátis para os fogos",
        "Fogos sobre o Castelo e a Charles Bridge",
        "Festa em Karlovy Lazne (maior club da Europa Central)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro tcheco",
      items: [
        "Brunch lento em café boêmio",
        "Lennon Wall (graffiti dos Beatles)",
        "Cinema retrô em Kino Lucerna",
        "Sopa de alho (česnečka) para curar a ressaca",
      ],
    },
    regular: [
      { theme: "Castelo + Malá Strana", items: ["Castelo de Praga", "Catedral de São Vito", "Lennon Wall", "Café no Café Savoy"] },
      { theme: "Pub Crawl + Cerveja", items: ["Aula de cerveja tcheca", "Beer spa (banho em IPA)", "Pub Crawl Prague (5 bares + open bar)", "Karlovy Lazne (5 andares de música)"] },
      { theme: "Underground & alternativo", items: ["Tour bunker nuclear comunista", "Museu KGB", "Bairro Žižkov", "Hospoda com goulash"] },
      { theme: "Bate-volta Český Krumlov", items: ["Trem/ônibus (~3h)", "Castelo medieval UNESCO", "Almoço com guláš", "Volta a Praga"] },
      { theme: "Vinohrady & Náplavka", items: ["Bairro de Vinohrady (cafés)", "Náplavka riverside bar", "Vyšehrad (vista alternativa)", "Jantar em restaurante Sansho"] },
    ],
  },

  berlim: {
    xmasEve: {
      theme: "Heiligabend berlinense",
      items: [
        "Christmas Market em Charlottenburg (o mais bonito)",
        "Mercado de Natal em Gendarmenmarkt (entrada paga, shows ao vivo)",
        "Glühwein + Bratwurst nas barracas",
        "Cenone alemã: ganso + Rotkohl em restaurante tradicional",
      ],
    },
    xmasDay: {
      theme: "Berlim contemplativa",
      items: [
        "Brunch em Mitte",
        "Brandenburg Gate vazio para foto",
        "Museum Island (geralmente aberto)",
        "Jantar vietnamita em Prenzlauer Berg",
      ],
    },
    nyeEve: {
      theme: "Réveillon Brandenburg",
      items: [
        "Almoço cedo em currywurst joint",
        "Festa FREE no Brandenburg Gate (até 1M de pessoas)",
        "Fogos amadores em 360° (legalíssimos pela cidade)",
        "After-party em Watergate, Sisyphos ou maratona no Berghain",
      ],
    },
    nyeDay: {
      theme: "Recuperação alternativa",
      items: [
        "Café da manhã em Kreuzberg",
        "East Side Gallery a pé (resto do muro de Berlim)",
        "Banho turco em Hamam (mulheres) ou Liquidrom (misto)",
        "Jantar leve em Vabali (espa + restaurante)",
      ],
    },
    regular: [
      { theme: "Berlim cool: Kreuzberg + Friedrichshain", items: ["Currywurst em Curry 36", "RAW Gelände (galpão alternativo)", "East Side Gallery", "Bar crawl em Kreuzberg"] },
      { theme: "Histórico mas leve", items: ["Brandenburg Gate", "Memorial do Holocausto", "Reichstag (reserva)", "Berlin Underworlds (bunker WWII)"] },
      { theme: "Techno marathon", items: ["Restaurante asiático em Mitte", "Tresor (lendário)", "Berghain: vista, look e tentativa", "Aftershow no domingo"] },
      { theme: "Museus + Mauerpark", items: ["Pergamon Museum", "Hackescher Markt", "Mauerpark", "Jantar vietnamita"] },
      { theme: "Day trip Potsdam", items: ["Trem 30min", "Sanssouci nevado", "Holländisches Viertel", "Volta café em Babelsberg"] },
    ],
  },

  amsterda: {
    xmasEve: {
      theme: "Kerstavond holandês",
      items: [
        "Amsterdam Light Festival: passeio de barco com instalações",
        "Compras de Kerstbrood (pão de Natal)",
        "Cenone holandesa: gourmetten (fondue de mesa em grupo)",
        "Hot chocolate em café histórico (Winkel 43)",
      ],
    },
    xmasDay: {
      theme: "Natal artístico",
      items: [
        "Rijksmuseum (Vermeer, Rembrandt) — aberto",
        "Brunch em Pijp",
        "Vondelpark gelado",
        "Indonesian rijsttafel no jantar (tradição local)",
      ],
    },
    nyeEve: {
      theme: "Oudejaarsavond",
      items: [
        "Oliebollen (bolinho frito) nas barracas",
        "Cenone com champanhe e raclette",
        "Fogos legais em TODA a cidade (caos coletivo)",
        "Festa em Paradiso ou Melkweg",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro mergulho",
      items: [
        "Nieuwjaarsduik: mergulho coletivo no mar gelado (opcional!)",
        "Brunch em Foodhallen",
        "Patinação na Museumplein",
        "Café com canela em coffee shop legal",
      ],
    },
    regular: [
      { theme: "Canais & Light Festival", items: ["Walking pela Jordaan", "Bitterballen + frites", "Light Festival boat tour", "Brown café"] },
      { theme: "Anne Frank + cultura", items: ["Anne Frank House (reservar)", "Vondelpark", "Rijksmuseum", "Jantar em De Pijp"] },
      { theme: "Coffee shops + Red Light", items: ["Coffee shop legal", "Museu da Cannabis", "Red Light District tour", "Bar de gin em Jordaan"] },
      { theme: "Bate-volta Zaanse Schans", items: ["Trem 17min para os moinhos", "Queijaria", "Volta para Amsterdã", "Jantar indonésio"] },
      { theme: "Heineken + Westerpark", items: ["Heineken Experience", "Almoço em West", "Pllek (club hipster em containers)", "Club Het Schip"] },
    ],
  },

  edimburgo: {
    xmasEve: {
      theme: "Christmas Eve escocês",
      items: [
        "Edinburgh Christmas Market em Princes Street Gardens",
        "Roda-gigante e Star Flyer com vista para o castelo",
        "Almoço de haggis (versão vegetariana existe)",
        "Pub crawl em Royal Mile (tradicional ceilidh)",
      ],
    },
    xmasDay: {
      theme: "Natal nos Highlands (light)",
      items: [
        "Brunch em hotel ou pub aberto",
        "Calton Hill ao amanhecer (vista da cidade)",
        "Castelo de Edimburgo (geralmente aberto)",
        "Jantar Christmas dinner em pub tradicional",
      ],
    },
    nyeEve: {
      theme: "Hogmanay Street Party",
      items: [
        "Aquecimento em pub com whisky (single malt)",
        "Hogmanay Street Party (ingresso £30, 80k pessoas)",
        "Concerto principal em Princes Street",
        "Fogos sobre o Castelo de Edimburgo à meia-noite",
      ],
    },
    nyeDay: {
      theme: "Loony Dook & Auld Lang Syne",
      items: [
        "Loony Dook: mergulho no rio Forth (em South Queensferry)",
        "Brunch curativo em café Princes Street",
        "Caminhada por Arthur's Seat (com vista do castelo)",
        "Jantar de fish & chips em pub histórico",
      ],
    },
    regular: [
      { theme: "Old Town", items: ["Royal Mile", "Castelo de Edimburgo", "Camera Obscura", "Whisky tasting em Scotch Whisky Experience"] },
      { theme: "Harry Potter trail", items: ["The Elephant House café", "Greyfriars Kirkyard (cemitério dos nomes)", "Victoria Street (Diagonal Beco)", "Tour Harry Potter"] },
      { theme: "Day trip Highlands", items: ["Tour para Loch Ness e Glen Coe", "Castelo de Stirling", "Almoço em vila escocesa", "Volta tarde para Edimburgo"] },
      { theme: "Day trip Glasgow", items: ["Trem 50min para Glasgow", "Kelvingrove Museum", "Bar crawl em Ashton Lane", "Volta para Edimburgo"] },
      { theme: "Pub culture", items: ["The Bow Bar (whiskys raros)", "The Last Drop (vista do castelo)", "Sandy Bell's (folk music)", "Stockbridge: bairro descolado"] },
    ],
  },

  atenas: {
    xmasEve: {
      theme: "Paramoní Christougennon",
      items: [
        "Mercado de Natal em Syntagma Square",
        "Crianças cantando kalanta nas ruas (canções tradicionais)",
        "Christopsomo (pão de Natal grego) + meliomakarona",
        "Jantar em taverna ouzeri em Plaka",
      ],
    },
    xmasDay: {
      theme: "Acrópole vazia",
      items: [
        "Acrópole quase sem turistas",
        "Brunch em Monastiraki",
        "Caminhada pelo Templo de Zeus Olímpico",
        "Jantar de cordeiro assado em taverna",
      ],
    },
    nyeEve: {
      theme: "Réveillon na Syntagma",
      items: [
        "Vasilopita: bolo com moeda escondida (tradição da sorte)",
        "Show grátis com nomes nacionais em Praça Syntagma",
        "Fogos à meia-noite + dança coletiva",
        "Festa em club em Gazi (LGBT-friendly)",
      ],
    },
    nyeDay: {
      theme: "Protochronia",
      items: [
        "Café da manhã com Vasilopita restante",
        "Tour da Acrópole agora com luz da manhã",
        "Almoço em Plaka",
        "Pôr do sol em Lycabettus",
      ],
    },
    regular: [
      { theme: "Atenas Antiga", items: ["Museu da Acrópole", "Ágora antiga", "Templo de Zeus", "Pôr do sol em Lycabettus"] },
      { theme: "Exarchia alternativo", items: ["Bairro Exarchia (street art)", "Mercado central", "Café em Psyrri", "Bar de uzo em Monastiraki"] },
      { theme: "Bate-volta Hidra", items: ["Ferry de Pireus (~1h30)", "Ilha sem carros", "Almoço de polvo grelhado", "Volta com pôr do sol"] },
      { theme: "Praia + Cabo Sounion", items: ["Tour para Cabo Sounion", "Templo de Poseidon ao pôr do sol", "Almoço à beira-mar", "Volta para Atenas"] },
      { theme: "Bate-volta Delfos", items: ["Ônibus 2h30", "Sítio do Oráculo", "Vila de Arachova", "Volta tarde"] },
    ],
  },

  reykjavik: {
    xmasEve: {
      theme: "Aðfangadagur",
      items: [
        "Loja em Laugavegur fecha 22h (compras de última hora)",
        "Aurora boreal tour (alta probabilidade no inverno)",
        "Cenone tradicional: hangikjöt (cordeiro defumado) + smoked salmon",
        "Programa de TV Áramótaskaupið no airbnb (cultural)",
      ],
    },
    xmasDay: {
      theme: "Cidade no silêncio absoluto",
      items: [
        "Café da manhã em hotel (a maior parte da cidade FECHA)",
        "Hallgrímskirkja (igreja icônica) — aberta para visita",
        "Caminhada pela orla até o Sun Voyager",
        "Jantar reservado em restaurante de fine dining (Dill ou Matur og Drykkur)",
      ],
    },
    nyeEve: {
      theme: "Brennur + fogos amadores",
      items: [
        "Brenna (fogueira) num bairro local (lista no Visit Reykjavík)",
        "Cenone com champanhe + cordeiro defumado",
        "Áramótaskaupið (TV) — todo islandês assiste, vibe coletiva",
        "Fogos amadores em 360° pela cidade (vista da Perlan)",
      ],
    },
    nyeDay: {
      theme: "Nyársdagur na Blue Lagoon",
      items: [
        "Blue Lagoon ao amanhecer (reservar com 1 mês)",
        "Brunch em Sandholt em Laugavegur",
        "Aurora boreal tour de noite (segunda chance)",
        "Jantar leve em Bæjarins Beztu (hot dog famoso) — geralmente aberto",
      ],
    },
    regular: [
      { theme: "Golden Circle", items: ["Þingvellir (placas tectônicas)", "Geyser ativo", "Cachoeira Gullfoss", "Tomate em estufa geotermal (almoço)"] },
      { theme: "South Coast Tour", items: ["Cachoeiras Seljalandsfoss + Skógafoss", "Praia preta de Reynisfjara", "Glaciar Sólheimajökull", "Volta para Reykjavík"] },
      { theme: "Snowmobile Langjökull", items: ["Snowmobile na geleira", "Caverna de gelo", "Almoço no glacier base camp", "Volta a Reykjavík"] },
      { theme: "Cidade & nightlife", items: ["Harpa Concert Hall", "Hot dog em Bæjarins Beztu", "Sky Lagoon ao pôr do sol", "Runtur na Laugavegur"] },
      { theme: "Snæfellsnes peninsula", items: ["Mt. Kirkjufell (vista de GoT)", "Cachoeira Kirkjufellsfoss", "Vila de pescadores Arnarstapi", "Jantar em Borgarnes"] },
    ],
  },

  toquio: {
    xmasEve: {
      theme: "Kurisumasu Ibu",
      items: [
        "Iluminações de Roppongi Hills (Keyakizaka)",
        "Tokyo Midtown Christmas Lights",
        "Tradição: KFC no jantar (sim, é coisa real!) ou Christmas Cake",
        "Date spot: Tokyo Tower vermelha à noite",
      ],
    },
    xmasDay: {
      theme: "Natal vibe Tokyo (não é feriado)",
      items: [
        "Mercado/restaurantes 100% abertos (não é feriado)",
        "Disney Sea com decoração de Natal (reservar)",
        "Akihabara: themed cafés natalinos",
        "Caroline Bar em Roppongi à noite",
      ],
    },
    nyeEve: {
      theme: "Ōmisoka & Joya no Kane",
      items: [
        "Toshikoshi soba: macarrão tradicional para 'atravessar o ano'",
        "Contagem regressiva em Shibuya Crossing (multidão)",
        "Toque de 108 sinos em Zōjō-ji ou Sensō-ji",
        "Festa em club Womb em Shibuya"
      ],
    },
    nyeDay: {
      theme: "Hatsumōde — primeira visita ao templo",
      items: [
        "Hatsumōde no Templo Meiji ao amanhecer",
        "Otoshidama e Omikuji (fortuna)",
        "Sunrise japonês (hatsuhinode) de algum mirante",
        "Osechi-ryōri: comida tradicional de Ano Novo",
      ],
    },
    regular: [
      { theme: "Shibuya & Harajuku jovem", items: ["Cruzamento de Shibuya", "Don Quijote", "Takeshita Street", "Karaokê em Karaoke Kan"] },
      { theme: "Akihabara nerd", items: ["Akihabara: lojas de games e anime", "Maid café", "Capsule toy hunting", "Themed café (Pokémon, Square Enix)"] },
      { theme: "Day trip ski Yuzawa", items: ["Shinkansen 1h40", "Snowboard ou ski meio dia", "Onsen para descongelar", "Volta com cerveja no trem"] },
      { theme: "Asakusa + TeamLab", items: ["Templo Senso-ji ao amanhecer", "Nakamise-dori", "TeamLab Planets", "Skytree ao pôr do sol"] },
      { theme: "Kyoto Express", items: ["Shinkansen 2h15", "Fushimi Inari", "Bambuzal de Arashiyama", "Gion à noite"] },
    ],
  },

  seul: {
    xmasEve: {
      theme: "Crismas-eve coreana",
      items: [
        "Iluminação em Cheonggyecheon stream (mágico)",
        "Korea Christmas Market in Sinchon (novidade local)",
        "BBQ coreano com soju (date spot na Coreia)",
        "Lotte World Tower observation deck à noite",
      ],
    },
    xmasDay: {
      theme: "Natal de date em Seul",
      items: [
        "N Seoul Tower (locks of love)",
        "Brunch em café temático",
        "Hanok Village em Bukchon",
        "Show de luzes em Garden of Morning Calm (extensão)",
      ],
    },
    nyeEve: {
      theme: "Cerimônia do Sino de Bosingak",
      items: [
        "Pickling-up em Hongdae (drinks de chá)",
        "Cerimônia do Sino (Boshingak Bell-Ringing) à meia-noite",
        "Festa em club em Itaewon ou Gangnam (Octagon, Arena)",
        "Ramyeon na CU às 5h da manhã",
      ],
    },
    nyeDay: {
      theme: "Haemaji (sunrise) coreana",
      items: [
        "Sunrise de Ano Novo em Achasan Mountain (tradição)",
        "Tteokguk (sopa de bolinho de arroz — você ganha 1 ano de idade!)",
        "Spa 24h jjimjilbang para descansar",
        "Jantar leve de bibimbap",
      ],
    },
    regular: [
      { theme: "Hongdae & K-pop", items: ["Aula de K-pop dance (1h30)", "Trickeye Museum 3D", "Hongdae Free Market", "Bar crawl em Hongdae"] },
      { theme: "Myeongdong & Gangnam", items: ["Skincare shopping", "BBQ coreano", "Gangnam à noite", "Spa jjimjilbang"] },
      { theme: "Day trip ski Vivaldi Park", items: ["Pickup de ônibus (~1h40)", "Snowboard meio dia", "Almoço no resort", "Chimaek no Han River"] },
      { theme: "Bukchon & Tradicional", items: ["Aluguel de hanbok", "Palácio Gyeongbokgung", "Bukchon Hanok Village", "Café em Insadong"] },
      { theme: "DMZ + Han River", items: ["Tour DMZ (Coreia do Norte ao fundo)", "Volta a Seul", "Patinação no Lotte World", "Han River à noite"] },
    ],
  },

  bangkok: {
    xmasEve: {
      theme: "Christmas Eve tropical",
      items: [
        "Decorações natalinas em CentralWorld e Siam Paragon (escala épica)",
        "Jantar de Natal em hotel internacional (Mandarin Oriental)",
        "Asiatique à beira-rio com luzes",
        "Sky bar Lebua ou Mahanakhon SkyWalk",
      ],
    },
    xmasDay: {
      theme: "Natal em Bangkok (não é feriado)",
      items: [
        "Tudo aberto: Grand Palace + Wat Pho",
        "Aula de cooking thai (3h)",
        "Massagem tailandesa em Wat Pho",
        "Jantar em rooftop com vista do rio",
      ],
    },
    nyeEve: {
      theme: "Réveillon no Asiatique",
      items: [
        "Aperitivo no Sirimahannop (barco a vela museu)",
        "Festa no Asiatique com fogos sobre o rio Chao Phraya",
        "Fogos também em CentralWorld (5 minutos de show)",
        "After-party em Beam Bangkok ou Sing Sing Theater"
      ],
    },
    nyeDay: {
      theme: "Wai Phra 9 Wat",
      items: [
        "Tradição local: visitar 9 templos no 1º de janeiro (sorte)",
        "Almoço no Chinatown (Yaowarat)",
        "Massagem para recuperação",
        "Pôr do sol em barco no Chao Phraya",
      ],
    },
    regular: [
      { theme: "Templos & Rio", items: ["Grand Palace + Wat Pho", "Wat Arun ao pôr do sol", "Jantar à beira do rio", "Sky bar Lebua"] },
      { theme: "Khao San + festa", items: ["Khao San Road (street food)", "Club Sing Sing Theater", "Drinks no The Bamboo Bar", "Late night em Soi Cowboy (passagem rápida)"] },
      { theme: "Muay Thai & spa", items: ["Aula de Muay Thai", "Pad thai de rua", "Spa thai", "Chinatown noite"] },
      { theme: "Day trip Ayutthaya", items: ["Trem ou tour (~1h30)", "Templos em ruínas e Buda em árvore", "Bike", "Volta a Bangkok"] },
      { theme: "Mercados & comida", items: ["Mercado de Or Tor Kor", "Mercado noturno Rod Fai", "Massagem", "Cooking class"] },
    ],
  },

  istambul: {
    xmasEve: {
      theme: "Véspera de Natal em Istambul",
      items: [
        "Mercado armênio cristão em Kumkapı",
        "Missa em Igreja Católica de Santo Antônio em Beyoğlu",
        "Jantar de meze + raki",
        "Cruzeiro pelo Bósforo iluminado",
      ],
    },
    xmasDay: {
      theme: "Hammam day",
      items: [
        "Hammam tradicional em Çemberlitaş ou Cağaloğlu",
        "Brunch em Karaköy",
        "Hagia Sophia + Mesquita Azul (Natal não é feriado oficial)",
        "Jantar em rooftop em Galata",
      ],
    },
    nyeEve: {
      theme: "Yılbaşı no Bósforo",
      items: [
        "Aperitivo em rooftop em Karaköy",
        "Cruzeiro de réveillon no Bósforo (jantar + música)",
        "Fogos sobre o estreito vistos da Galata Bridge",
        "Festa em Mini Müzikhol (techno) ou Sortie",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro pelos bazares",
      items: [
        "Brunch turco (mesa cheia de queijos, azeitonas, ovos)",
        "Grande Bazar e Mercado de Especiarias (aberto)",
        "Hammam de tarde",
        "Jantar leve de pide",
      ],
    },
    regular: [
      { theme: "Sultanahmet sem fila", items: ["Hagia Sophia", "Mesquita Azul", "Cisterna da Basílica iluminada", "Topkapi"] },
      { theme: "Bazares & Bósforo", items: ["Grande Bazar", "Mercado de Especiarias", "Cruzeiro pelo Bósforo", "Jantar em Karaköy"] },
      { theme: "Lado Asiático cool", items: ["Balsa para Kadıköy", "Mercado de peixe + café", "Moda neighborhood", "Pôr do sol em Üsküdar"] },
      { theme: "Galata noite", items: ["Avenida Istiklal", "Torre de Gálata", "Bondinho histórico", "Mini Müzikhol ou Klein Garten (techno)"] },
      { theme: "Capadócia (extensão)", items: ["Voo doméstico (1h15)", "Passeio de balão ao amanhecer", "Hotel-caverna em Göreme", "Vale do Amor + ATV"] },
    ],
  },

  dubai: {
    xmasEve: {
      theme: "Christmas Eve no Golfo",
      items: [
        "Madinat Jumeirah Souk com luzes natalinas",
        "Burj Park Christmas Market",
        "Brunch de Natal em hotel 5★ (Atlantis ou St. Regis)",
        "Show de luzes nas Dubai Fountains",
      ],
    },
    xmasDay: {
      theme: "Praia de Natal a 25 ºC",
      items: [
        "Beach club (Cove Beach ou Drift)",
        "Almoço de mariscos à beira da praia",
        "Camel ride no deserto",
        "Jantar no At.mosphere (122º andar do Burj)",
      ],
    },
    nyeEve: {
      theme: "Burj Khalifa: o show",
      items: [
        "Almoço cedo e check de view spot (Downtown ou Burj Park)",
        "Drinks em rooftop (Treehouse Rooftop Lounge)",
        "Show pirotécnico icônico de 6min no Burj Khalifa à meia-noite",
        "After-party em WHITE Dubai ou Soho Garden"
      ],
    },
    nyeDay: {
      theme: "Recuperação Marina",
      items: [
        "Brunch tarde em hotel",
        "Beach club Cove Beach",
        "Atlantis Aquaventure waterpark",
        "Jantar leve em Dubai Marina",
      ],
    },
    regular: [
      { theme: "Burj & Mall", items: ["Burj Khalifa At The Top", "Dubai Mall (aquário, fontes)", "Jantar com vista", "Walk de Dubai Marina"] },
      { theme: "Aventura no deserto", items: ["Dune bashing 4x4", "Sandboard", "Jantar beduíno + dança do ventre", "Glamping opcional"] },
      { theme: "Skydive & adrenalina", items: ["Skydive sobre a Palm Jumeirah", "Brunch em Atlantis", "Beach club", "Drinks em rooftop"] },
      { theme: "Ski Dubai + Global Village", items: ["Ski Dubai indoor", "Lunch em Mall of Emirates", "Global Village", "Show de fogos noturno"] },
      { theme: "Bate-volta Abu Dhabi", items: ["Mesquita Sheikh Zayed", "Louvre Abu Dhabi", "Ferrari World", "Volta para Dubai"] },
    ],
  },

  madeira: {
    xmasEve: {
      theme: "Véspera de Natal em Funchal",
      items: [
        "Funchal iluminado: 4 milhões de lâmpadas pelas ruas do centro",
        "Mercado dos Lavradores decorado + bolo do mel quente",
        "Jantar típico de bacalhau com batata-doce e milho",
        "Missa do Galo na Sé do Funchal (meia-noite, com coro)",
      ],
    },
    xmasDay: {
      theme: "Natal na ilha verde",
      items: [
        "Teleférico do Monte: subida ao pico ao amanhecer",
        "Brunch em café do Monte com vinho da Madeira",
        "Piscinas naturais do Porto Moniz (mar da Madeira no Natal!)",
        "Poncha com mel e aguardente num bar de aldeia",
      ],
    },
    nyeEve: {
      theme: "O maior show de fogos do mundo",
      items: [
        "Esplanada do Lido: melhor view das 8 barcaças de fogos",
        "Jantar de marisco com vinho Verdelho na orla",
        "Contagem regressiva na Avenida do Mar com multidão local",
        "Show pirotécnico de 8 minutos (recorde Guinness) sobre o oceano",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro na levada",
      items: [
        "Levada das 25 Fontes: trilha entre florestas de laurissilva",
        "Almoço de espada frita com banana (prato típico)",
        "Miradouro do Cabo Girão: segunda maior falésia do mundo",
        "Poncha de laranja no fim da tarde em São Vicente",
      ],
    },
    regular: [
      { theme: "Funchal & Mercado", items: ["Mercado dos Lavradores (frutas exóticas)", "Teleférico do Funchal", "Old Blandy's Wine Lodge (prova de Madeira)", "Jantar em restaurante do porto"] },
      { theme: "Levada & natureza", items: ["Levada do Caldeirão Verde (4h)", "Floresta laurissilva UNESCO", "Piscina natural de São Vicente", "Dinner com vista da costa norte"] },
      { theme: "Costa sul e praias", items: ["Cabo Girão Glass Floor", "Piscinas do Porto Moniz", "Miradouro do Pico do Arieiro", "Poncha no pôr do sol"] },
      { theme: "Day trip Porto Santo", items: ["Ferry ou avião para Porto Santo (9km de praia dourada)", "Almoço de grelhados à beira-mar", "Snorkeling", "Volta ao entardecer"] },
      { theme: "Trilha & adrenalina", items: ["Canyoning em Ribeira do Cidrão", "Jeep tour ao Pico Ruivo", "Arvorismo em Ribeiro Frio", "Jantar de carne de vinha d'alhos"] },
    ],
  },

  tenerife: {
    xmasEve: {
      theme: "Nochebuena canária",
      items: [
        "Mercado de Natal em La Laguna (cidade UNESCO)",
        "Jantar de rancho canario e papas arrugadas com mojo",
        "Santa Cruz de Tenerife: ruas iluminadas e música ao vivo",
        "Missa do Galo na Catedral de La Laguna",
      ],
    },
    xmasDay: {
      theme: "Natal vulcânico",
      items: [
        "Teide ao amanhecer: vulcão com neve e céu cor-de-laranja",
        "Brunch no Parador Nacional (dentro do parque do Teide)",
        "Praia Las Teresitas com 20°C e pouquíssima gente",
        "Vinho local Tacoronte-Acentejo ao pôr do sol",
      ],
    },
    nyeEve: {
      theme: "Año Nuevo na Avenida Anaga",
      items: [
        "Jantar de lapas grelhadas e camarão en gabardina",
        "Santa Cruz de Tenerife: show principal na Avenida Anaga",
        "12 uvas + fogos sobre a baía à meia-noite",
        "Festa até amanhecer em Monkey Beach Club",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro no Teide",
      items: [
        "Subida ao Teide de teleférico (reservar)",
        "Vista do mar de nuvens abaixo dos seus pés",
        "Almoço em restaurante com vista panorâmica",
        "Stargazing noturno (ITV Teide — melhor céu da Europa)",
      ],
    },
    regular: [
      { theme: "Praia & Siam Park", items: ["Siam Park (melhor parque aquático do mundo)", "Praia Las Teresitas", "Almoço de frutos do mar em Los Abrigos", "Drinks em rooftop em Santa Cruz"] },
      { theme: "Teide & natureza", items: ["Parque Nacional do Teide", "Rota das Tajinastes", "Las Cañadas del Teide", "Jantar de gofio e mojo no pueblo"] },
      { theme: "La Laguna & cultura", items: ["Old Town de La Laguna (UNESCO)", "Mercado de El Agricultor", "Loro Parque em Puerto de la Cruz", "Café de especialidade em Santa Cruz"] },
      { theme: "Stargazing night", items: ["Tour de observação astronômica no Teide (19h)", "Telescópio + laser guide", "Cocido canario no jantar de volta", "Vinhos locais no apartamento"] },
      { theme: "Day trip La Gomera", items: ["Ferry 40min para La Gomera", "Parque Nacional Garajonay (névoa mágica)", "Almoço de mojo rojo em San Sebastián", "Volta de tarde"] },
    ],
  },

  malta: {
    xmasEve: {
      theme: "Il-Milied f'Malta",
      items: [
        "Valeta iluminada: Republic Street com luzes de Natal",
        "Missa do Galo na Co-Catedral de São João (meia-noite, imperdível)",
        "Jantar de lampuki (peixe típico maltês) em restaurante do porto",
        "Pastizzi quentes da noite: massa folhada com ricota ou ervilha",
      ],
    },
    xmasDay: {
      theme: "Natal na cidade mais antiga da UE",
      items: [
        "Valeta de manhã: ruas desertas com luz de inverno épica",
        "Grand Harbour panorama do Upper Barrakka Gardens",
        "Brunch no Café Cordina (o mais antigo de Malta)",
        "Mdina ao entardecer: cidade medieval em silêncio",
      ],
    },
    nyeEve: {
      theme: "Grand Harbour em chamas",
      items: [
        "Jantar na orla de Sliema com vista para Valeta",
        "Festa de réveillon em Paceville (bairro de clubs de Malta)",
        "Fogos sobre o Grand Harbour à meia-noite",
        "After em Hugo's Lounge ou Gianpula Village",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro arqueológico",
      items: [
        "Templos de Ħaġar Qim: mais antigos que Stonehenge e as pirâmides",
        "Almoço de ftira (pão maltês) com tuna em barraca local",
        "Blue Grotto de barco (água turquesa mesmo no inverno)",
        "Mergulho no naufrágio do Tug 2 (para certificados)",
      ],
    },
    regular: [
      { theme: "Valeta Barroca", items: ["Co-Catedral de São João (Caravaggio)", "Museu de Arqueologia", "Upper Barrakka + Saluting Battery", "Jantar maltês no Rubino"] },
      { theme: "Mdina & Rabat", items: ["Mdina: cidade silenciosa medieval", "Catacumbas de São Paulo em Rabat", "Almoço de fenek (coelho maltês)", "Pôr do sol sobre a ilha"] },
      { theme: "Gozo & Blue Lagoon", items: ["Ferry para Gozo", "Azure Window site + Dwejra", "Blue Lagoon em Comino (mesmo no inverno!)", "Almoço de ftira em Victoria"] },
      { theme: "Mergulho & snorkel", items: ["Dive site: MS Karwela wreck", "Snorkel em St. Peter's Pool", "Almoço em Marsaxlokk (porto de pescadores)", "Sunset em Dingli Cliffs"] },
      { theme: "Nightlife Paceville", items: ["Happy hour em Sliema", "Bares de Paceville (St. Julian's)", "Hugo's Lounge rooftop", "Late-night kebab maltês"] },
    ],
  },

  dubrovnik: {
    xmasEve: {
      theme: "Božić em Dubrovnik",
      items: [
        "Muralhas de Dubrovnik ao entardecer: vista do Adriático em ouro",
        "Mercado de Natal no Stradun com vin brulet (vinho quente)",
        "Jantar de brodet (ensopado de peixe dálmata) em konoba",
        "Missa de Natal na Catedral de Dubrovnik",
      ],
    },
    xmasDay: {
      theme: "Natal medieval",
      items: [
        "Stradun vazio ao amanhecer: cenário de Game of Thrones real",
        "Teleférico para o Monte Srd: vista do Adriático 360°",
        "Almoço de peka (borrego assado em tacho) em konoba",
        "Kayak ao redor das muralhas com água cristalina",
      ],
    },
    nyeEve: {
      theme: "Fogos sobre o Adriático",
      items: [
        "Jantar de polvo na brasa com vinho Pošip branco",
        "Baile no Stradun iluminado com música ao vivo",
        "Fogos sobre o Adriático vistos das Muralhas à meia-noite",
        "After em Cave Bar More (bar dentro de uma caverna)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro na ilha Lokrum",
      items: [
        "Barco para a Ilha Lokrum (jardins medievais e pavões)",
        "Snorkel nas piscinas naturais de Lokrum",
        "Almoço de grelhados na marina de Gruž",
        "Pôr do sol do Miradouro Srđ com uma taça de Plavac Mali",
      ],
    },
    regular: [
      { theme: "Muralhas & Old Town", items: ["Percurso completo das Muralhas (2km)", "Stradun", "Bica em Café Festival", "Jantar em konoba Dalmatino"] },
      { theme: "Game of Thrones tour", items: ["Tour GoT oficial pela cidade velha", "Escada da Vergonha", "Clube Revelin (forte medieval)", "Barco para os Elafiti"] },
      { theme: "Kayak & praias", items: ["Sea kayak ao redor das muralhas", "Praia Banje", "Almoço de prstaci (mariscos)", "Pôr do sol da Fortaleza Lovrijenac"] },
      { theme: "Day trip Montenegro", items: ["Transfer para Kotor (1h30)", "Muralhas de Kotor", "Baía de Kotor de barco", "Volta para Dubrovnik"] },
      { theme: "Vinhos & gastronomia", items: ["Degustação de Pošip e Plavac Mali", "Trufas da Ístria", "Konoba em Cavtat (vila vizinha)", "Porto de Gruž ao pôr do sol"] },
    ],
  },

  nice: {
    xmasEve: {
      theme: "Noël niçois",
      items: [
        "Marché de Noël na Place Masséna com iluminações",
        "Socca quentinha em barraca do Cours Saleya",
        "Jantar de daube niçoise (ensopado provençal) em bistrô",
        "Missa do Galo na Catedral de Santa Reparata",
      ],
    },
    xmasDay: {
      theme: "Natal na Riviera",
      items: [
        "Promenade des Anglais ao amanhecer sem turistas",
        "Brunch tardio em Le Café de Turin (mariscos desde 1908)",
        "Colina do Castelo: panorama de Nice do alto",
        "Pôr do sol com rosé de Provence em Vieux-Nice",
      ],
    },
    nyeEve: {
      theme: "Réveillon na Promenade",
      items: [
        "Jantar de bouillabaisse e pissaladière em Vieux-Nice",
        "Festa pública na Place Masséna com DJ e show",
        "Fogos sobre o Mediterrâneo à meia-noite",
        "After em Le Smalls ou Shapko (jazz e cocktails)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro em Mônaco",
      items: [
        "Trem 30min para Mônaco (sem precisar de carro)",
        "Casino de Monte Carlo (só para foto, ou jogue 20€)",
        "Almoço de Barba Juana (culinária monegasca)",
        "Jardim Exótico de Mônaco ao pôr do sol",
      ],
    },
    regular: [
      { theme: "Riviera essencial", items: ["Promenade des Anglais", "Vieux-Nice: socca e mercado", "Musée Matisse", "Jantar em Le Comptoir du Marché"] },
      { theme: "Day trip Mônaco", items: ["Trem para Mônaco", "Casino Monte Carlo", "Museu Oceanográfico", "Volta com pôr do sol"] },
      { theme: "Day trip Eze & Antibes", items: ["Eze: vila medieval na rocha (vistas incríveis)", "Antibes: Musée Picasso", "Mercado provençal", "Volta para Nice"] },
      { theme: "Arte & gastronomia", items: ["MAMAC (arte contemporânea)", "Mercado Cours Saleya manhã", "Aula de culinária niçoise", "Degustação de vinhos de Bellet"] },
      { theme: "Colinas & perfume", items: ["Grasse: capital do perfume (1h)", "Destilaria de perfume + workshop", "Almoço em village provençal", "Pôr do sol no Parc de la Colline du Château"] },
    ],
  },

  telaviv: {
    xmasEve: {
      theme: "Véspera em Tel Aviv",
      items: [
        "Jaffa ao pôr do sol: cidade mais antiga do mundo",
        "Mercado HaCarmel: hummus, sabich e especiarias",
        "Jantar de shakshuka e pita em Dr. Shakshuka (clássico)",
        "Bar de vinho natural em Florentin (bairro artsy)",
      ],
    },
    xmasDay: {
      theme: "Natal secular em Tel Aviv",
      items: [
        "Praia de Tel Aviv: 18°C, surf leve, quase vazio",
        "Brunch de mezze em Rothschild Boulevard",
        "Museu de Arte de Tel Aviv (coleção impressionante)",
        "Bares de Dizengoff Square ao entardecer",
      ],
    },
    nyeEve: {
      theme: "NYE na Rothschild",
      items: [
        "Jantar de degustação em restaurante israelense moderno",
        "Festa de rua na Rothschild Boulevard + praia de Tel Aviv",
        "Show de fogos sobre o Mar Mediterrâneo à meia-noite",
        "After no The Block ou Clara (techno levantino até o sol nascer)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro em Jerusalém",
      items: [
        "Ônibus 1h para Jerusalém (funciona!)",
        "Cidade Velha: Muro das Lamentações + Via Dolorosa + Santo Sepulcro",
        "Almoço de hummus Abu Shukri em East Jerusalem",
        "Pôr do sol do Monte das Oliveiras sobre a cidade dourada",
      ],
    },
    regular: [
      { theme: "Tel Aviv beach life", items: ["Promenade de Gordon Beach a Jaffa (4km a pé)", "Almoço no mercado de Jaffa", "Bairro Neve Tzedek (mais antigo de Tel Aviv)", "Drinks em rooftop na Rothschild"] },
      { theme: "Day trip Jerusalém", items: ["Ônibus para Jerusalém", "Cidade Velha e seus 4 bairros", "Museu Israel + Dead Sea Scrolls", "Volta de tarde"] },
      { theme: "Florentin & nightlife", items: ["Street art em Florentin", "Mercado Levinsky (especiarias etíopes)", "Bar crawl em Ben Yehuda e Lilienblum", "The Block (techno de madrugada)"] },
      { theme: "Day trip Dead Sea", items: ["Tour para o Mar Morto (1h30)", "Flutuar sem afundar", "Lama mineral", "Volta ao pôr do sol"] },
      { theme: "Bauhaus & café", items: ["White City: arquitetura Bauhaus UNESCO", "Tour a pé pela Rothschild", "Café de especialidade em Sarona Market", "Jantar de fine dining israelense"] },
    ],
  },

  singapura: {
    xmasEve: {
      theme: "Christmas Eve em Singapura",
      items: [
        "Orchard Road: a rua mais decorada do mundo no Natal",
        "Jantar de chili crab no East Coast Seafood Centre",
        "Marina Bay Sands light show de Natal",
        "Bar rooftop do Marq pela One-Altitude (57° andar)",
      ],
    },
    xmasDay: {
      theme: "Natal tropical",
      items: [
        "Gardens by the Bay: Supertrees de dia + Cloud Forest",
        "Brunch no Botanist (dentro dos jardins)",
        "Sentosa Island: Universal Studios com decoração natalina",
        "Jantar de laksa e nasi lemak num hawker center histórico",
      ],
    },
    nyeEve: {
      theme: "Marina Bay NYE",
      items: [
        "Jantar em restaurante com vista para Marina Bay",
        "Marina Bay Sands: melhor spot de fogos do mundo",
        "Show de laser + fogos + drones às meia-noite",
        "After-party na rooftop pool do MBS ou ZoukOut na Sentosa",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro em Little India",
      items: [
        "Brunch de roti canai + teh tarik em Little India",
        "Chinatown: templos e mercado de madrugada",
        "National Museum of Singapore",
        "Jantar de dim sum em Maxwell Food Centre",
      ],
    },
    regular: [
      { theme: "Marina Bay & Supertrees", items: ["Gardens by the Bay (noite — OCBC Garden Rhapsody)", "Marina Bay Sands skypark", "Merlion", "Jantar no Lau Pa Sat hawker"] },
      { theme: "Hawker culture", items: ["Tiong Bahru Market (café da manhã)", "Maxwell Food Centre (almoço)", "Chinatown Complex (jantar)", "Tong Ah Coffee Room (late night kaya toast)"] },
      { theme: "Sentosa & praia", items: ["Universal Studios Singapore", "Palawan Beach", "S.E.A. Aquarium", "Drinks em Tanjong Beach Club"] },
      { theme: "Cultural districts", items: ["Little India: Sri Veeramakaliamman", "Arab Street + Haji Lane", "Baba House em Chinatown", "Jantar de peranakan"] },
      { theme: "Nightlife em Clarke Quay", items: ["Boat Quay sunset drinks", "Clarke Quay: Zouk, Marquee", "ZoukOut festival (dezembro)", "Madrugada com prawn noodles"] },
    ],
  },

  bali: {
    xmasEve: {
      theme: "Véspera tropical em Bali",
      items: [
        "Templo Tanah Lot ao pôr do sol (às 17h o sol afunda no mar)",
        "Jantar de bebek betutu (pato defumado em folhas de banana)",
        "Seminyak: rua de restaurantes e beach clubs decorados",
        "Ku De Ta beach club: festa de véspera com DJ internacional",
      ],
    },
    xmasDay: {
      theme: "Natal balinês",
      items: [
        "Amanhecer em Tegallalang: terraços de arroz dourados ao sol",
        "Ubud Monkey Forest + mercado artesanal",
        "Brunch saudável no Locavore Nusantara (top restaurante da Ásia)",
        "Kecak Fire Dance no Templo Uluwatu ao pôr do sol",
      ],
    },
    nyeEve: {
      theme: "Réveillon na praia de Canggu",
      items: [
        "Jantar de satay e nasi goreng em warung chique",
        "Finns Beach Club: festa NYE com 50k pessoas e headliners",
        "Fogos na praia à meia-noite + banho de mar",
        "After em La Brisa ou Old Man's até amanhecer",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro em modo ioga",
      items: [
        "Ioga ao amanhecer com vista para o oceano em Canggu",
        "Superfood bowl + smoothie de pitaya em café orgânico",
        "Spa de massagem balinesa 2h",
        "Sunset de coco verde na piscina do villa",
      ],
    },
    regular: [
      { theme: "Ubud espiritual", items: ["Tegallalang ao amanhecer", "Ubud Monkey Forest", "Tirta Empul (banho purificador)", "Jantar de Nasi Campur em warung"] },
      { theme: "Surf & Uluwatu", items: ["Aula de surf em Uluwatu (todos os níveis)", "Piscinas de rocha de Padang Padang", "Almoço de ikan bakar", "Kecak Fire Dance ao pôr do sol"] },
      { theme: "Beach clubs & Seminyak", items: ["Potato Head Beach Club", "Praia de Seminyak", "Jl. Petitenget para jantar", "Revolver Espresso"] },
      { theme: "Canggu vibes", items: ["Brunch em Crate Café", "Surf em Echo Beach", "Batu Bolong tarde", "La Brisa rooftop ao pôr do sol"] },
      { theme: "Munduk & cachoeiras", items: ["Cachoeira Munduk (norte)", "Trekking entre cachoeiras", "Almoço em restaurante com vista das montanhas", "Volta ao pôr do sol"] },
    ],
  },

  hongkong: {
    xmasEve: {
      theme: "Christmas Eve em Hong Kong",
      items: [
        "Avenue of Stars: decoração natalina com vista para o skyline",
        "Harbour City: shopping mall com maior árvore de Natal da cidade",
        "Jantar de dim sum em Tim Ho Wan (Michelin mais barato do mundo)",
        "A Symphony of Lights show às 20h sobre Victoria Harbour",
      ],
    },
    xmasDay: {
      theme: "Natal com o melhor skyline do mundo",
      items: [
        "Victoria Peak ao amanhecer: Hong Kong aos seus pés",
        "Brunch de yum cha em Maxim's City Hall",
        "Lantau Island: Tian Tan Buddha + vila de Tai O",
        "Temple Street Night Market com oysters e dim sum",
      ],
    },
    nyeEve: {
      theme: "Victoria Harbour em chamas",
      items: [
        "Jantar de Cantonese fine dining com vista para a baía",
        "Star Ferry ao entardecer: a travessia mais cinematográfica do mundo",
        "Show de fogos simultâneos do Victoria Harbour à meia-noite",
        "After em Lan Kwai Fong (o maior bar crawl da Ásia)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro em Kowloon",
      items: [
        "Dim sum brunch em Spring Moon (Peninsula Hotel)",
        "Wong Tai Sin Temple: fortuna para o ano novo",
        "Mercado de jade em Jade Market",
        "Sunset do Tsim Sha Tsui Promenade sobre a ilha",
      ],
    },
    regular: [
      { theme: "Victoria Peak & Central", items: ["Peak Tram ao amanhecer", "Peak Lookout brunch", "Central: PMQ (design local)", "Lan Kwai Fong à noite"] },
      { theme: "Street food & mercados", items: ["Temple Street Night Market", "Sham Shui Po: tecidos e eletrônicos", "Yuen Long: dim sum autêntico", "Late-night wonton noodles em dai pai dong"] },
      { theme: "Lantau Island", items: ["MTR para Tung Chung", "Cable car para Ngong Ping", "Tian Tan Buddha", "Village de Tai O (casas sobre a água)"] },
      { theme: "Macau day trip", items: ["Ferry 1h para Macau", "Ruínas de São Paulo", "Casinos + comer pork chop bun", "Pôr do sol de Torre de Macau"] },
      { theme: "Nightlife Wan Chai", items: ["Felix bar no 28º andar do Peninsula", "Wan Chai bar crawl", "Club Volar ou Levels", "Madrugada em cha chaan teng"] },
    ],
  },

  taipei: {
    xmasEve: {
      theme: "Véspera de Natal em Taipei",
      items: [
        "Taipei 101 iluminado ao entardecer: foto obrigatória",
        "Shilin Night Market: oyster vermicelli e stinky tofu",
        "Bares de Xinyi District (bairro mais moderno da cidade)",
        "Show de luzes em Ximending (Harajuku de Taipei)",
      ],
    },
    xmasDay: {
      theme: "Natal em Jiufen",
      items: [
        "Jiufen: a cidade de O Espírito das Coisas (névoa + lanternas)",
        "Chá de bubble tea na casa de chá histórica A-Mei",
        "Almoço de taro ball soup com vista para o oceano",
        "Volta ao pôr do sol com o trem panorâmico",
      ],
    },
    nyeEve: {
      theme: "Taipei 101: 600 fogos em 60 segundos",
      items: [
        "Jantar de Taiwanese hot pot com vista para o 101",
        "Show transmitido globalmente: fogos saem do Taipei 101",
        "Taipei Music Center: festa de réveillon local",
        "Night market de Raohe às 3h da manhã",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro em Taroko",
      items: [
        "Ônibus/trem para Hualien (2h) — Taroko Gorge",
        "Cânion de mármore com rio turquesa: trilha Shakadang",
        "Almoço de amido de batata-doce em Tianxiang",
        "Trem panorâmico de volta ao pôr do sol",
      ],
    },
    regular: [
      { theme: "Night markets", items: ["Shilin Night Market", "Raohe Street Night Market", "Ningxia Night Market (mais autêntico)", "Night market de Huaxi (cobra)"] },
      { theme: "Jiufen & Costa", items: ["Jiufen na neblina", "Jinguashi (minas de ouro)", "Praia de Fulong", "Volta com vista de cliff"] },
      { theme: "Taipei culture", items: ["Museu do Palácio Nacional (jade!)", "Chiang Kai-shek Memorial Hall", "Bopiliao Historic Block", "Ximending para compras"] },
      { theme: "Day trip Taroko", items: ["Trem para Hualien", "Taroko Gorge: cânion de mármore", "Eternal Spring Shrine", "Volta ao pôr do sol"] },
      { theme: "Geek & café", items: ["Akihabara de Taipei em Guanghua", "Retro gaming bar em Da'an", "Café de especialidade em Zhongzheng", "Bares de Yongkang Street"] },
    ],
  },

  kualalumpur: {
    xmasEve: {
      theme: "Christmas Eve em KL",
      items: [
        "KLCC Park: Torres Petronas iluminadas + decoração natalina",
        "Jantar de bak kut teh (sopa de porco com ervas) em Petaling Street",
        "Pavilion KL: maior decoração natalina de shopping da Ásia",
        "Rooftop bar Heli Lounge Bar com vista para as Petronas",
      ],
    },
    xmasDay: {
      theme: "Natal multicultural",
      items: [
        "Batu Caves ao amanhecer: templo hindu numa caverna",
        "Brunch de nasi lemak no Village Park (fila, mas vale cada minuto)",
        "Museu Nacional de Malaysia",
        "Jalan Alor: rua de comida de rua aberta o dia todo",
      ],
    },
    nyeEve: {
      theme: "Torres Petronas em festa",
      items: [
        "Jantar de babi guling ou rendang em restaurante do centro",
        "KLCC Park: melhor spot para ver os fogos",
        "Fogos + show de lasers nas Torres Petronas à meia-noite",
        "After em Zouk KL ou Marini's on 57 (rooftop com vista 360°)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro em Chinatown",
      items: [
        "Petaling Street: dim sum e compras",
        "Masjid Jamek: mesquita mais antiga de KL",
        "Briyani de cabra em Restoran Nasi Kandar Pelita",
        "Pôr do sol da Torre KL (menakjubkan!)",
      ],
    },
    regular: [
      { theme: "Petronas & cultura", items: ["Torres Petronas skybridge", "KLCC Park pôr do sol", "Aquaria KLCC", "Jantar de satay em Jalan Alor"] },
      { theme: "Batu Caves & Little India", items: ["Batu Caves ao amanhecer", "Brickfields (Little India)", "Masala dosa + teh tarik", "Mercado de flores de Masjid India"] },
      { theme: "Street food tour", items: ["Jalan Alor de madrugada", "Gurney Drive hawker", "Char kway teow + Hokkien mee", "Cendol gelado de sobremesa"] },
      { theme: "Day trip Genting Highlands", items: ["Ônibus 1h para Genting", "First World Indoor Theme Park", "Casinos + hotels futuristas na nuvem", "Volta ao entardecer"] },
      { theme: "Shopping & Bukit Bintang", items: ["Pavilion KL", "Low Yat Plaza (tecnologia)", "Changkat Bukit Bintang à noite", "Speakeasy bar The Deceased"] },
    ],
  },

  hochiminh: {
    xmasEve: {
      theme: "Véspera de Natal em Saigon",
      items: [
        "Catedral de Notre-Dame de Saigon iluminada com multidão",
        "Ben Thanh Night Market: banh mi e pho especial de Natal",
        "Bui Vien Walking Street: bar crawl com turistas do mundo",
        "Rooftop bar EON Heli Bar (52º andar com vista 360°)",
      ],
    },
    xmasDay: {
      theme: "Natal histórico em Saigon",
      items: [
        "Cu Chi Tunnels ao amanhecer (mais fresco, antes do calor)",
        "Almoço de com tam (arroz com costeleta) em lanchonete local",
        "Palácio da Reunificação (pré-1975)",
        "Bia hoi (cerveja gelada) na calçada de Pham Ngu Lao",
      ],
    },
    nyeEve: {
      theme: "1 milhão de pessoas na Nguyen Hue",
      items: [
        "Jantar de lau (hot pot vietnamita) antes da festa",
        "Nguyen Hue Walking Street: show ao vivo + pré-fogos",
        "Contagem regressiva com fogos sobre o Rio Saigon",
        "After em Lush Bar ou Broma Not a Bar até amanhecer",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro no Mekong",
      items: [
        "Day trip ao Delta do Mekong de barco",
        "Mercado flutuante de Cai Rang",
        "Almoço de camarão grelhado em palafita",
        "Volta ao fim de tarde — banh mi e bia hoi na calçada",
      ],
    },
    regular: [
      { theme: "História & túneis", items: ["Cu Chi Tunnels", "Museu da Guerra", "Palácio da Reunificação", "Pho 24 para jantar"] },
      { theme: "Bui Vien nightlife", items: ["Ben Thanh Market de tarde", "Bui Vien Walking Street à noite", "Club Chill Saigon", "Madrugada em Apocalypse Now"] },
      { theme: "Comida de rua", items: ["Com tam café da manhã", "Banh mi Huynh Hoa (melhor de SG)", "Bun bo Hue no almoço", "Pho bo especial no jantar"] },
      { theme: "Day trip Mekong", items: ["Ferry para Ben Tre", "Barco pelos canais de coco", "Almoço de peixe elefante em palafita", "Volta ao pôr do sol"] },
      { theme: "Distrito 1 a pé", items: ["Gia Long Palace", "Fine Arts Museum", "Ben Thanh Market", "Saigon Skydeck ao entardecer"] },
    ],
  },

  phuket: {
    xmasEve: {
      theme: "Christmas Eve na praia",
      items: [
        "Kata Beach ao pôr do sol: bar de praia com fogos de artifício",
        "Jantar de frutos do mar na areia (fresh catch do dia)",
        "Bangla Road: a rua mais louca do Sudeste Asiático",
        "Rooftop party em Baba Nest (melhor pôr do sol de Phuket)",
      ],
    },
    xmasDay: {
      theme: "Natal nas ilhas Phi Phi",
      items: [
        "Speedboat para as Ilhas Phi Phi ao amanhecer",
        "Snorkeling em Maya Bay (praia do filme A Praia)",
        "Almoço de grelhados em restaurante da praia em Phi Phi Don",
        "Volta ao pôr do sol — coco verde e massagem tailandesa",
      ],
    },
    nyeEve: {
      theme: "Fogos direto na areia",
      items: [
        "Jantar de langostins ao vivo no seafood market",
        "Patong Beach: festa 24h com fogos na praia",
        "Bangla Road: contagem regressiva + clubs em 3 andares",
        "After-party em Illuzion Nightclub (capacidade: 5.000)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro no Similan",
      items: [
        "Day trip ao Parque Nacional das Similan Islands",
        "Snorkeling entre corais e tartarugas marinhas",
        "Almoço de massaman curry a bordo",
        "Yoga ou meditação à tardinha em Kata",
      ],
    },
    regular: [
      { theme: "Praias & beach clubs", items: ["Kata Beach manhã", "Karon Beach tarde", "Surin Beach sunset", "Beach party em Catch Beach Club"] },
      { theme: "Phi Phi Islands", items: ["Speedboat para Phi Phi", "Maya Bay + snorkeling", "Almoço em restaurante da praia", "Bar Ibiza em Phi Phi Don ao pôr do sol"] },
      { theme: "Bangla Road nightlife", items: ["Muay Thai show em Bangla Boxing Stadium", "Bar crawl em Bangla Road", "Illuzion Nightclub", "Madrugada em Tiger Disco"] },
      { theme: "Norte de Phuket", items: ["Templo Chalong", "Big Buddha (45m)", "Patong Beach", "Cocktail em rooftop"] },
      { theme: "Koh Phangan Full Moon", items: ["Ferry de Phuket para Koh Phangan", "Full Moon Party (beach rave de 30k pessoas)", "Snorkeling no dia seguinte", "Volta de ferry"] },
    ],
  },

  chiangmai: {
    xmasEve: {
      theme: "Yi Peng de Natal",
      items: [
        "Mercado de Natal de Chiang Mai em Nimman Road",
        "Khao soi: curry com macarrão — o melhor prato do norte tailandês",
        "Mae Jo: lançamento de lanternas do Yi Peng (verificar data exata)",
        "Café + live music em Bar Roots (jardim com lanternas)",
      ],
    },
    xmasDay: {
      theme: "Natal no topo da Tailândia",
      items: [
        "Doi Inthanon: pico mais alto da Tailândia (2.565m, faz frio!)",
        "Cachoeiras Wachirathan ao amanhecer",
        "Almoço de arroz no temple hill restaurant",
        "Wat Doi Suthep ao pôr do sol com névoa dourada",
      ],
    },
    nyeEve: {
      theme: "10.000 lanternas ao céu",
      items: [
        "Jantar de set menu tailandês em Baan Tong Luang",
        "Yi Peng: lançamento coletivo de lanternas ao amanhecer do Rio Ping",
        "Contagem regressiva + fogos em Nimmanhaemin Road",
        "After em Bar Zoe ou North Gate Jazz Club",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro com elefantes",
      items: [
        "Santuário ético de elefantes: banho e alimentação dos animais",
        "Almoço de pad see ew perto do santuário",
        "Masagem tailandesa 2h no Oasis Spa",
        "Night Bazaar ao entardecer: artesanato local e street food",
      ],
    },
    regular: [
      { theme: "Templos & Old City", items: ["Wat Chedi Luang (ruínas 14c)", "Wat Phra Singh", "Old City a pé", "Dinner no Sunday Walking Street"] },
      { theme: "Yi Peng & lanternas", items: ["Tour de lanternas Mae Jo", "Floating lanterns no rio", "Khao soi em Khao Soi Khun Yai", "Fogo de artifício no centro"] },
      { theme: "Elefantes & natureza", items: ["Elephant Nature Park (ético)", "Zip-line em Jungle Flight", "Trekking em Doi Inthanon", "Almoço em hilltribe village"] },
      { theme: "Culinária tailandesa", items: ["Aula de culinária Thai Farm (3h)", "Mercado de manhã cedo", "Dim Dim Sum para brunch", "Jantar de sai ua (salsicha do norte)"] },
      { theme: "Nimman & café", items: ["Nimman Road: cafés e boutiques", "Maya Mall para se refrescar", "TCDC library design", "North Gate Jazz Co. live music"] },
    ],
  },

  osaka: {
    xmasEve: {
      theme: "Kurisumasu Ibu em Osaka",
      items: [
        "Dōtonbori iluminado: Christmas lights no canal",
        "USJ (Universal Studios Japan): decoração natalina de inverno",
        "Jantar de kaiseki em restaurante Minami",
        "Glico Man e Namba de noite: foto natalina clássica",
      ],
    },
    xmasDay: {
      theme: "Natal em Kyoto",
      items: [
        "Shinkansen 15min para Kyoto: Fushimi Inari ao amanhecer",
        "Bambuzal de Arashiyama com geada dourada",
        "Almoço de tofu kaiseki em Nanzen-ji",
        "Volta à noite — izakaya de kushikatsu em Shinsekai",
      ],
    },
    nyeEve: {
      theme: "Ōmisoka em Dōtonbori",
      items: [
        "Toshikoshi soba de macarrão no Ano Novo (tradição)",
        "Contagem regressiva em Dōtonbori com os osakenses",
        "Hatsumōde em Sumiyoshi Taisha (120k pessoas!)",
        "After em Shinsaibashi-suji (aberto a noite toda)",
      ],
    },
    nyeDay: {
      theme: "Hatsumōde em Namba",
      items: [
        "Hatsumōde matinal no Osaka Tenmangu Shrine",
        "Otoshidama e Omikuji (fortuna do ano)",
        "Brunch de tamagoyaki e dashi em Kuromon Market",
        "Castelo de Osaka nevado com bandeiras de Ano Novo",
      ],
    },
    regular: [
      { theme: "Dōtonbori & Namba", items: ["Dōtonbori canal walk", "Takoyaki em Wanaka", "Kushikatsu em Shinsekai", "Club Bar Drops em Shinsaibashi"] },
      { theme: "Kyoto Express", items: ["Shinkansen 15min para Kyoto", "Fushimi Inari", "Arashiyama", "Gion ao pôr do sol"] },
      { theme: "USJ & pop culture", items: ["Universal Studios Japan", "Harry Potter world", "Street food em Dotonbori de volta", "Animate em Den Den Town"] },
      { theme: "Osaka Castle & Umeda", items: ["Castelo de Osaka iluminado", "HEP Five (roda-gigante)", "Rooftop do Umeda Sky Building", "Okonomiyaki em Dotonbori"] },
      { theme: "Nara day trip", items: ["Trem 40min para Nara", "Cervo solto na cidade", "Tōdai-ji (Buda gigante)", "Volta com taiyaki"] },
    ],
  },

  maldivas: {
    xmasEve: {
      theme: "Véspera de Natal nos atolos",
      items: [
        "Snorkeling no Coral Garden do resort ao pôr do sol",
        "Jantar de pés na areia com iluminação de tochas",
        "Show privativo de fogos sobre o oceano",
        "Champanhe olhando as estrelas (zero poluição luminosa)",
      ],
    },
    xmasDay: {
      theme: "Natal no bungalô sobre a água",
      items: [
        "Café da manhã no deck privativo: polvo do Índico vivo",
        "Mergulho com tubarão-baleia (verificar temporada)",
        "Spa com massagem balinesa sobre o oceano",
        "Jantar fine dining com pés na areia + iluminação de tochas",
      ],
    },
    nyeEve: {
      theme: "NYE mais íntimo do planeta",
      items: [
        "Jantar de degustação na areia para dois",
        "Show de fogos privativo sobre o atol",
        "Champanhe na piscina infinita ao luar",
        "Mergulho noturno com manta rays (biofluorescência)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro no índico",
      items: [
        "Sunrise em caiaque nas águas de cristal",
        "Breakfast em flutuante no oceano",
        "Snorkel com tartarugas ao amanhecer",
        "Day trip para ilha local de pescadores + pesca de atum",
      ],
    },
    regular: [
      { theme: "Mergulho premium", items: ["Dive site com tubarão-baleia", "Manta ray point", "Naufrágio SS Victory", "Debriefing com cerveja de coco"] },
      { theme: "Praias & água", items: ["Sandbank privativo ao pôr do sol", "Kayak + paddleboard", "Sunset cruise de dhow", "Jantar de lagosta fresca"] },
      { theme: "Ilha local", items: ["Day trip a Maafushi (ilha habitada)", "Mercado de peixe", "Almoço de mas riha (curry de atum)", "Snorkel na casa de reef"] },
      { theme: "Spa & relaxo", items: ["Massagem de pedras quentes", "Banho de flores", "Ioga ao amanhecer sobre o oceano", "Spa de lama vulcânica"] },
      { theme: "Adrenalina aquática", items: ["Jet ski", "Flyboard", "Parasailing sobre os atolos", "Pesca noturna de lula"] },
    ],
  },

  srilanka: {
    xmasEve: {
      theme: "Véspera de Natal em Colombo",
      items: [
        "Galle Face Green: passseio beira-mar com vista do oceano",
        "Jantar de cari de frutos do mar em Ministry of Crab (top da Ásia)",
        "Bairro de Colombo Fort iluminado",
        "Missa de Natal em St. Lucia's Cathedral (maioria cristã em dez.)",
      ],
    },
    xmasDay: {
      theme: "Natal em Galle Fort",
      items: [
        "Galle Fort: muralhas holandesas do século XVII à beira-mar",
        "Brunch de hopper (crepe de coco) com ovo em café local",
        "Lion Stout gelado em bar da muralha ao pôr do sol",
        "Jantar de cari de frango no airbnb com vista para o oceano",
      ],
    },
    nyeEve: {
      theme: "Colombo Galle Face",
      items: [
        "Jantar de rice and curry na varanda de Galle Face Hotel",
        "Galle Face Green: festival de comidas e artistas locais",
        "Fogos sobre o oceano Índico à meia-noite",
        "After em Colombo social scene: Hatch, Ministry, Sky Lounge",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro nas baleias",
      items: [
        "Mirissa: tour de avistamento de baleias azuis ao amanhecer",
        "Almoço de grelhados de camarão na praia",
        "Snorkel em Pigeon Island",
        "Sunset em Weligama com cerveja Lion",
      ],
    },
    regular: [
      { theme: "Sigiriya & safari", items: ["Sigiriya: Rocha do Leão (1.200 degraus)", "Safari em Minneriya (elefantes)", "Polonnaruwa (ruínas antigas)", "Jantar de kiri hodhi"] },
      { theme: "Trem panorâmico Ella", items: ["Kandy: Templo do Dente de Buda", "Trem Kandy–Ella (6h — plantações de chá)", "Nine Arch Bridge", "Jantar em Ella"] },
      { theme: "Praia sul", items: ["Mirissa: praia com tartarugas", "Unawatuna: reef de snorkel", "Almoço de peixe em Koggala", "Galle Fort ao pôr do sol"] },
      { theme: "Colombo urbano", items: ["Pettah Market (caos colorido)", "Gangaramaya Temple", "Barefoot Garden Café", "Nightlife em Colombo 7"] },
      { theme: "Baleias & Yala", items: ["Safari Yala: leopardos", "Mirissa: baleias azuis ao amanhecer", "Almoço em Tangalle", "Pôr do sol na praia deserta"] },
    ],
  },

  doha: {
    xmasEve: {
      theme: "Véspera de Natal no Qatar",
      items: [
        "Souq Waqif ao entardecer: sombras longas e incenso de oud",
        "Jantar de machbous (arroz com cordeiro) em restaurante tradicional",
        "The Pearl: ilha artificial com iate e restaurantes",
        "Shisha em bar de rooftop com vista para o Golfo Pérsico",
      ],
    },
    xmasDay: {
      theme: "Natal no Museu Islâmico",
      items: [
        "Museu de Arte Islâmica: coleção de 1.400 anos de arte do mundo islâmico",
        "Brunch de mezze libanês em Nobu Doha",
        "Corniche de Doha: skyline futurista de Lusail ao fundo",
        "Camel racing ao entardecer (espetáculo único)",
      ],
    },
    nyeEve: {
      theme: "Fogos sobre o Golfo Pérsico",
      items: [
        "Jantar de degustação em Idam (restaurante de Alain Ducasse no Qatar)",
        "Corniche de Doha: melhor view para os fogos + multidão festiva",
        "Fogos sobre o Golfo com o skyline de Lusail como pano de fundo",
        "After em rooftop do Mondrian Hotel ou W Doha",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro em Lusail",
      items: [
        "Lusail City: a cidade do Mundial 2022 e o Estádio Lusail",
        "Almoço de harees (trigo com frango) no Katara Cultural Village",
        "Katara Amphitheatre: shows gratuitos de Ano Novo",
        "Sunset no cais de Katara com dhow de pesca ao fundo",
      ],
    },
    regular: [
      { theme: "Arte & museus", items: ["Museu de Arte Islâmica (IM Pei)", "Mathaf: Arab Museum of Modern Art", "Almoço em Café Arabesque", "Pôr do sol na Corniche"] },
      { theme: "Souq & tradição", items: ["Souq Waqif: falcões e artesanato", "Shisha + gahwa (café árabe)", "Galeria de falcões ao vivo", "Jantar de mansaf em Al Wathba"] },
      { theme: "Desert dunes", items: ["Safari 4x4 nas dunas de Khor al-Adaid", "Sand dune boarding", "Jantar beduíno em acampamento", "Stargazing no deserto"] },
      { theme: "Lusail & modernidade", items: ["Lusail: passeio no stadium do Mundial", "The Pearl: iates e restaurantes", "Villaggio Mall (gondola indoor!)", "Rooftop do Marriott ao pôr do sol"] },
      { theme: "Cruzeiro & mar", items: ["Cruzeiro de dhow pelo Golfo ao pôr do sol", "Al Wakrah: cidade histórica de pesca", "Snorkel em Al Wakrah beach", "Mariscos no mercado de peixe de Al Wakrah"] },
    ],
  },

  abudhabi: {
    xmasEve: {
      theme: "Véspera de Natal em Abu Dhabi",
      items: [
        "Mesquita Sheikh Zayed iluminada ao pôr do sol: dourada e branca",
        "Yas Marina: bares e restaurantes na beira d'água",
        "Jantar de degustação em Li Beirut (Jumeirah Etihad Towers)",
        "Yas Island: show de Natal no Yas Beach",
      ],
    },
    xmasDay: {
      theme: "Natal no Louvre",
      items: [
        "Louvre Abu Dhabi: o mais fotogênico dos Louvres (dome de aço + luz)",
        "Brunch de pratos mundiais no restaurante do Louvre",
        "Corniche: passeio à beira-mar de 8km",
        "Ferrari World para adrenalina (montanha-russa mais rápida do mundo)",
      ],
    },
    nyeEve: {
      theme: "Yas Island NYE",
      items: [
        "Jantar em Coya Abu Dhabi (Peruvian fine dining no Yas Bay)",
        "Concert principal no Etihad Arena (headliner internacional)",
        "Fogos sobre a marina de Yas Bay à meia-noite",
        "After em Warehouse Abu Dhabi ou IRIS Abu Dhabi (rooftop)",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro no deserto",
      items: [
        "Safari de 4x4 nas dunas douradas de Liwa",
        "Nascer do sol sobre o Empty Quarter (maior deserto do mundo)",
        "Almoço de shuwa (cordeiro assado em buraco de terra) em Al Ain",
        "Pôr do sol de dhow pela Corniche de Abu Dhabi",
      ],
    },
    regular: [
      { theme: "Sheikh Zayed & Louvre", items: ["Mesquita Sheikh Zayed ao amanhecer", "Louvre Abu Dhabi", "Almoço em Mina Port", "Corniche sunset walk"] },
      { theme: "Yas Island adrenalina", items: ["Ferrari World (240km/h de montanha-russa!)", "Yas Waterworld", "Warner Bros. World", "Jantar em Yas Marina"] },
      { theme: "Deserto Liwa", items: ["Safari 4x4 em Liwa Oasis", "Dunas mais altas do mundo", "Stargazing no deserto", "Acampamento glamping"] },
      { theme: "Al Ain City", items: ["Al Ain Zoo", "Jebel Hafeet (pico mais alto dos EAU)", "Mercado de camelos de Al Ain", "Jantar de shawarma em Al Ain"] },
      { theme: "Bate-volta Dubai", items: ["Abu Dhabi–Dubai em 1h de carro", "Burj Khalifa At The Top", "Dubai Frame", "Volta para Abu Dhabi"] },
    ],
  },

  muscat: {
    xmasEve: {
      theme: "Véspera de Natal em Muscat",
      items: [
        "Royal Opera House Muscat: concerto de Natal (confirmar programa)",
        "Muttrah Corniche ao pôr do sol: promenade do século XIX",
        "Jantar de shuwa (cordeiro assado 24h) em restaurante omanense",
        "Muttrah Souq à noite: frankincense e prata sob luzes douradas",
      ],
    },
    xmasDay: {
      theme: "Natal no sultanato mais hospitaleiro do mundo",
      items: [
        "Grande Mesquita Sultan Qaboos: majestosa, aberta a turistas",
        "Brunch em hotel de luxo com vista para a Baía de Muscat",
        "Muscat Festival de artes e cultura (verifique datas)",
        "Passeio de dhow pela Baía de Muscat ao pôr do sol",
      ],
    },
    nyeEve: {
      theme: "Fogos sobre a Baía de Muscat",
      items: [
        "Jantar de crevettes no Al Bandar Hotel (Marina)",
        "Royal Opera House: gala de Réveillon",
        "Fogos sobre a baía de Muscat à meia-noite",
        "After em Aqua Bar do W Muscat ou Trader Vic's",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro em Wadi Shab",
      items: [
        "Wadi Shab: trekking 2h até piscinas de esmeralda escondidas",
        "Nadar dentro de caverna com cascata",
        "Almoço de grelhados em barraca de estrada omanense",
        "Wahiba Sands: sunset nas dunas de areia vermelha",
      ],
    },
    regular: [
      { theme: "Muscat clássico", items: ["Palácio Al Alam + fortalezas Jalali e Mirani", "Grande Mesquita Sultan Qaboos", "Muttrah Souq", "Jantar de harees e shuwa"] },
      { theme: "Wadi adventures", items: ["Wadi Shab: piscinas esmeralda", "Wadi Bani Khalid", "Nadar em cachoeira escondida", "Volta ao pôr do sol"] },
      { theme: "Wahiba Sands", items: ["Safari 4x4 nas dunas vermelho-alaranjadas", "Quad bike nas dunas", "Pernoite em acampamento beduíno", "Sunrise nas dunas (inesquecível)"] },
      { theme: "Opera & arte", items: ["Royal Opera House Muscat (mais bonito da Arábia)", "Bait Al Zubair Museum", "Almoço em Al Angham (culinária omanense)", "Corniche de tarde"] },
      { theme: "Day trip Nizwa", items: ["Nizwa Fort (século XVII)", "Mercado de cabras de sexta-feira", "Artesanato de prata", "Jebel Shams: Grand Canyon do Omã"] },
    ],
  },

  hoian: {
    xmasEve: {
      theme: "Véspera de Natal à luz de lanternas",
      items: [
        "Old Town de Hoi An ao entardecer: 400 casas iluminadas por lanternas",
        "Lançamento de lanternas no Rio Thu Bon ao pôr do sol",
        "Jantar de cao lau (macarrão exclusivo de Hoi An)",
        "Live music em Bar Bros na margem do rio",
      ],
    },
    xmasDay: {
      theme: "Natal em My Son",
      items: [
        "My Son: templos Cham do século IV (Patrimônio UNESCO)",
        "Almoço de banh xeo (crepe crocante) em restaurante local",
        "An Bang Beach: praia a 5km com beach bars quase vazios",
        "Roupa sob medida pronta: buscar em Taylor Shop!",
      ],
    },
    nyeEve: {
      theme: "Lanternas no Rio + fogos",
      items: [
        "Jantar de white rose dumplings e com ga Hoi An",
        "Lançamento coletivo de lanternas ao Rio Thu Bon",
        "Fogos em frente à Old Town à meia-noite",
        "After em The Deck Bar com drinques de lychee e ginger",
      ],
    },
    nyeDay: {
      theme: "1º de janeiro de bicicleta",
      items: [
        "Bike pelos arrozais ao amanhecer com névoa matinal",
        "Café da manhã de banh mi na barraca mais famosa da cidade",
        "Aula de culinária no campo: pho, banh xeo, mango salad",
        "Fim de tarde de sampan no Rio Thu Bon",
      ],
    },
    regular: [
      { theme: "Old Town & lanternas", items: ["Old Town ao pôr do sol (sem carros!)", "Lançamento de lanterna no rio", "Jantar de cao lau", "Bar da margem com música ao vivo"] },
      { theme: "My Son & história Cham", items: ["Templos My Son ao amanhecer", "Museu de Escultura Cham em Da Nang", "Banh mi Ba Mien para almoço", "Pôr do sol em An Bang Beach"] },
      { theme: "Praia & beach bars", items: ["An Bang Beach de manhã", "Almoço de seafood na areia", "Paddleboard no Rio Thu Bon", "Sunset drinks em The Field"] },
      { theme: "Culinária vietnamita", items: ["Aula de culinária no campo", "Mercado central de Hoi An", "Banh xeo + white rose dumplings", "Bia hoi ao entardecer"] },
      { theme: "Day trip Da Nang", items: ["Golden Bridge (mãos gigantes)", "Marble Mountains", "My Khe Beach em Da Nang", "Almoço de mi quang (macarrão amarelo)"] },
    ],
  },
};

/**
 * Constrói roteiro alinhado ao calendário real da viagem.
 * Encaixa automaticamente as âncoras de Natal/Réveillon nas datas
 * 24/12, 25/12, 31/12 e 01/01 quando elas caem dentro da viagem.
 *
 * @param {string} destinationId
 * @param {number} days
 * @param {string} startDateISO  formato "YYYY-MM-DD"
 */
export function buildItinerary(destinationId, days, startDateISO) {
  const pool = POOLS[destinationId];
  if (!pool || days <= 0) return [];
  const start = parseISODate(startDateISO);
  if (!start) return [];

  const monthsPT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const weekdaysPT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const out = [];
  let regularIdx = 0;

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const md = `${date.getMonth() + 1}-${date.getDate()}`;

    let entry;
    let kind = "regular";
    if (md === "12-24" && pool.xmasEve) { entry = pool.xmasEve; kind = "xmasEve"; }
    else if (md === "12-25" && pool.xmasDay) { entry = pool.xmasDay; kind = "xmasDay"; }
    else if (md === "12-31" && pool.nyeEve) { entry = pool.nyeEve; kind = "nyeEve"; }
    else if (md === "1-1" && pool.nyeDay) { entry = pool.nyeDay; kind = "nyeDay"; }
    else {
      entry = pool.regular[regularIdx % pool.regular.length];
      regularIdx++;
    }

    out.push({
      day: i + 1,
      dateLabel: `${weekdaysPT[date.getDay()]} ${date.getDate()}/${monthsPT[date.getMonth()]}`,
      kind,
      theme: entry.theme,
      items: entry.items,
    });
  }
  return out;
}

function parseISODate(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
