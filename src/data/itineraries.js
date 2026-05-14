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
