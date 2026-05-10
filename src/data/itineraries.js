/*
 * MOCKED — substituir por API de roteiros (ex.: GetYourGuide, Triposo)
 * ou geração via LLM em produção.
 *
 * Estes roteiros estão calibrados para uma viagem em DEZ/JAN (Natal e
 * Réveillon) com perfil JOVEM (20-30): nightlife, experiências
 * fotogênicas, day trips de inverno e atividades fora do óbvio.
 *
 * Cada destino tem um pool de "dias temáticos". O builder repete/intercala
 * os dias para preencher a quantidade total da viagem.
 */

const POOLS = {
  lisboa: [
    { theme: "Centro & Mercados de Natal", items: ["Praça do Comércio iluminada", "Mercado de Natal em Rossio", "Bondinho 28 (vai e volta panorâmico)", "Jantar em Alfama com fado moderno"] },
    { theme: "Belém Insta-friendly", items: ["MAAT (museu sobre o rio)", "Pastéis de Belém na fila do balcão", "LX Factory: brunch e lojas vintage", "Pôr do sol no Miradouro de Santa Catarina"] },
    { theme: "Sintra Selvagem (no inverno)", items: ["Quinta da Regaleira (poço iniciático)", "Palácio da Pena com névoa", "Cabo da Roca: fim do mundo continental", "Jantar em Cascais à beira-mar"] },
    { theme: "Cais do Sodré: noite de Lisboa", items: ["Time Out Market (food hall até tarde)", "Pink Street bar crawl", "Pensão Amor (cabaré-bar lendário)", "Lux Frágil até o amanhecer"] },
    { theme: "Réveillon lisboeta", items: ["Concerto grátis no Terreiro do Paço", "Fogos sobre o Tejo à meia-noite", "After-party em Bairro Alto", "Café com pastel no dia 1º"] },
    { theme: "Surf & Day Trip Cascais", items: ["Aula de surf em Carcavelos (com roupa térmica)", "Almoço de marisco em Cascais", "Cascais → Boca do Inferno", "Trem de volta com pôr do sol"] },
  ],
  paris: [
    { theme: "Paris Iluminada", items: ["Champs-Élysées decorada (compras + foto)", "Patinação no gelo no Hôtel de Ville", "Tour Eiffel à noite (cintilação a cada hora)", "Jantar em bistrô em Montmartre"] },
    { theme: "Mercados de Natal & Marais", items: ["Mercado de Natal em Tuileries (roda-gigante)", "Bar crawl no Marais (cocktail bars descolados)", "Galeria Lafayette: árvore gigante", "Crepe doce na Rue Montorgueil"] },
    { theme: "Arte alternativa", items: ["Catacumbas de Paris (subterrâneo macabro)", "Atelier des Lumières (arte imersiva)", "Canal Saint-Martin: cafés e brechós", "Jantar etíope em Belleville"] },
    { theme: "Versalhes", items: ["RER C até Versalhes", "Salão dos Espelhos", "Jardins (mais fotogênicos com geada)", "Volta a Paris e jantar em La Défense"] },
    { theme: "Réveillon parisiense", items: ["Brunch tarde no Marais", "Show de luzes no Arco do Triunfo", "Champanhe na Trocadero com Eiffel piscando", "Festa em club tipo Concrete ou La Bellevilloise"] },
    { theme: "Saint-Germain & Disney", items: ["Sainte-Chapelle (vitrais)", "Café de Flore para gente assistir", "RER A → Disneyland Paris (decoração natalina)", "Volta tarde com fogos do parque"] },
  ],
  roma: [
    { theme: "Roma Antiga descolada", items: ["Coliseu (sem fila no inverno)", "Fórum Romano + Palatino", "Aperitivo em Monti (bairro hipster)", "Jantar com cacio e pepe"] },
    { theme: "Vaticano + Trastevere", items: ["Museus Vaticanos (manhã)", "Capela Sistina e Basílica de São Pedro", "Travessia para Trastevere", "Bar crawl em Trastevere"] },
    { theme: "Vespa & Centro", items: ["Tour de Vespa por 2-3h (instagrammável)", "Fontana di Trevi à meia-noite", "Panteão", "Gelato em Giolitti"] },
    { theme: "Underground & Aperitivo", items: ["Tour Catacumbas de São Calisto", "Appia Antiga de bike", "Aula de pasta com chef local", "Aperitivo em Pigneto (bairro alternativo)"] },
    { theme: "Réveillon italiano", items: ["Almoço tardio com lentilha (tradição da sorte)", "Concerto grátis no Circo Massimo", "Fogos sobre o Coliseu", "Festa em club como Goa ou Spazio Novecento"] },
    { theme: "Bate-volta Nápoles + Pompéia", items: ["Frecciarossa para Nápoles (1h10)", "Pizza margherita em Da Michele", "Pompéia (cidade soterrada)", "Volta tarde para Roma"] },
  ],
  barcelona: [
    { theme: "Gaudí com poucos turistas", items: ["Sagrada Família (foto sem multidão)", "Park Güell logo cedo", "Casa Batlló com áudio-guia", "Tapas em Gràcia à noite"] },
    { theme: "Bairro Gótico hipster", items: ["Catedral e ruas medievais", "El Born: bares de coquetel", "Mercado de La Boqueria (almoço no bar Pinotxo)", "Razzmatazz à noite"] },
    { theme: "Praia de inverno + bike", items: ["Bike pela Barceloneta", "Almoço de paella à beira-mar", "Bunkers del Carmel ao pôr do sol", "Pintxos em Plaça del Sol"] },
    { theme: "Day trip ski em Andorra", items: ["Ônibus direto (3h)", "Aluguel de equipamento + meio dia em Grandvalira", "Almoço em refúgio de montanha", "Volta para Barcelona à noite"] },
    { theme: "Réveillon em Barcelona", items: ["Brunch em Eixample", "12 uvas na Plaça d'Espanya", "Show de luzes em Montjuïc", "Apolo ou Sala Bikini até o amanhecer"] },
    { theme: "Montjuïc + arte", items: ["Castelo de Montjuïc (telef.)", "Fundació Miró", "Poble Espanyol", "Fonte Mágica (show noturno)"] },
  ],
  toquio: [
    { theme: "Shibuya & Harajuku jovem", items: ["Cruzamento de Shibuya (foto da Mag's Park)", "Don Quijote (chaos store)", "Takeshita Street em Harajuku", "Karaokê em Karaoke Kan"] },
    { theme: "Iluminações & Roppongi", items: ["Roppongi Hills + Tokyo Midtown ilumination", "Mori Art Museum", "Jantar em izakaya", "Bar crawl em Roppongi"] },
    { theme: "Akihabara nerd", items: ["Akihabara: lojas de games e anime", "Maid café (experiência só de ir uma vez)", "Capsule toy hunting", "Themed café (Pokémon, Square Enix)"] },
    { theme: "Day trip ski em Yuzawa", items: ["Shinkansen 1h40 até Echigo-Yuzawa", "Snowboard ou ski meio dia", "Onsen para descongelar", "Volta com cerveja no trem"] },
    { theme: "Asakusa + TeamLab", items: ["Templo Senso-ji ao amanhecer", "Nakamise-dori (street food)", "TeamLab Planets (arte imersiva)", "Pôr do sol na Skytree"] },
    { theme: "Réveillon japonês", items: ["Jantar de soba (toshikoshi soba)", "Hatsumōde no Templo Meiji à meia-noite", "Toque de 108 sinos em Zōjō-ji", "Sunrise japonês de Ano Novo"] },
    { theme: "Kyoto Express", items: ["Shinkansen para Kyoto (2h15)", "Fushimi Inari (10.000 torii)", "Bambuzal de Arashiyama", "Gion à noite tentando avistar gueixas"] },
  ],
  seul: [
    { theme: "Hongdae & K-pop", items: ["Aula de K-pop dance (1h30)", "Trickeye Museum 3D", "Hongdae Free Market (sábados)", "Bar crawl em Hongdae até o metrô abrir"] },
    { theme: "Myeongdong & Gangnam", items: ["Skincare shopping em Myeongdong", "Jantar de bbq coreano", "Gangnam à noite (clubs Octagon, Arena)", "Spa 24h jjimjilbang"] },
    { theme: "Day trip de ski (Vivaldi Park)", items: ["Pickup de ônibus em Seul (~1h40)", "Snowboard meio dia ou dia inteiro", "Almoço no resort", "Volta + chimaek no Han River"] },
    { theme: "Bukchon & Tradicional", items: ["Aluguel de hanbok (entrada grátis nos palácios)", "Palácio Gyeongbokgung", "Bukchon Hanok Village", "Insadong: café de cabras / café temático"] },
    { theme: "DMZ + Han River", items: ["Tour de meio dia na DMZ (Coreia do Norte ao fundo)", "Volta a Seul", "Patinação no Lotte World Tower", "Réveillon prático: Han River + cerveja"] },
    { theme: "Réveillon coreano", items: ["Jantar de hot pot", "Cerimônia do Sino de Bosingak (multidão!)", "Festa em club em Itaewon", "Ramyeon de madrugada na CU"] },
    { theme: "Itaewon descolado", items: ["Itaewon: bairro multicultural", "Café temático (Cat / Raccoon / Sheep)", "Leeum Museum (arte contemporânea)", "Noraebang privativo (karaokê)"] },
  ],
  praga: [
    { theme: "Mercados de Natal", items: ["Praça da Cidade Velha (mercado principal + árvore gigante)", "Trdelník com Nutella", "Praça Wenceslas (segundo mercado)", "Vinho quente (svařák) em copo plástico"] },
    { theme: "Castelo + Malá Strana", items: ["Castelo de Praga ao amanhecer", "Catedral de São Vito", "Lennon Wall (graffiti dos Beatles)", "Café no Café Savoy"] },
    { theme: "Pub Crawl + Cerveja", items: ["Aula de cerveja tcheca", "Beer spa (banho em cuba de IPA)", "Pub Crawl Prague (5 bares + open bar)", "Karlovy Lazne (maior club da Europa Central)"] },
    { theme: "Underground & alternativo", items: ["Tour bunker nuclear comunista", "Museu KGB", "Žižkov: bairro alternativo + bares pequenos", "Hospoda local com goulash"] },
    { theme: "Réveillon em Praga", items: ["Almoço de carpa (tradição tcheca)", "Letná Park: melhor vista para fogos", "Festa em Karlovy Lazne ou Roxy", "Café no Café Louvre dia 1º"] },
    { theme: "Bate-volta Český Krumlov", items: ["Trem ou ônibus (~3h)", "Castelo medieval em UNESCO", "Almoço com guláš e cerveja Eggenberg", "Volta a Praga"] },
  ],
  berlim: [
    { theme: "Berlim cool: Kreuzberg + Friedrichshain", items: ["Currywurst em Curry 36", "RAW Gelände (galpão alternativo)", "East Side Gallery a pé", "Bar crawl em Kreuzberg"] },
    { theme: "Histórico mas leve", items: ["Brandenburg Gate", "Memorial do Holocausto", "Reichstag (cúpula com reserva)", "Berlin Underworlds (bunker da WWII)"] },
    { theme: "Mercados de Natal especiais", items: ["Charlottenburg (mais bonito da cidade)", "Gendarmenmarkt (entrada paga, shows ao vivo)", "Mercado nórdico em Kulturbrauerei", "Glühwein em todos eles"] },
    { theme: "Techno marathon", items: ["Restaurante asiático em Mitte", "Tresor (lendário)", "Berghain: vista, look e tentativa", "Aftershow no domingo (Klubnacht segue)"] },
    { theme: "Museus + Mauerpark", items: ["Pergamon Museum", "Almoço em Hackescher Markt", "Mauerpark (karaokê ao ar livre se rolar)", "Jantar vietnamita em Prenzlauer Berg"] },
    { theme: "Réveillon Brandenburg", items: ["Brunch em Mitte", "Festa free no Brandenburg Gate (até 1M de pessoas)", "Fogos em todas as direções da cidade", "After em Watergate ou Sisyphos"] },
    { theme: "Day trip Potsdam", items: ["Trem 30min até Potsdam", "Sanssouci nevado", "Holländisches Viertel", "Volta com café no Babelsberg"] },
  ],
  amsterda: [
    { theme: "Canais & Light Festival", items: ["Walking pela Jordaan e Nine Streets", "Almoço holandês: bitterballen + frites", "Light Festival boat tour à noite", "Brown café (bar tradicional)"] },
    { theme: "Anne Frank + cultura", items: ["Anne Frank House (reservar com 2 meses)", "Vondelpark a pé", "Rijksmuseum (Vermeer, Rembrandt)", "Jantar em De Pijp"] },
    { theme: "Coffee shops + Red Light", items: ["Coffee shop legal (Bulldog, Greenhouse)", "Museu da Cannabis", "Red Light District tour à noite", "Bar de gin em Jordaan"] },
    { theme: "Patinação + Heineken", items: ["Patinação no gelo da Museumplein", "Heineken Experience", "Foodhallen (food hall + bar)", "Club em Westerpark (Pllek, Het Schip)"] },
    { theme: "Bate-volta Zaanse Schans", items: ["Trem 17min para os moinhos de vento", "Queijaria + experiência de tamancos", "Volta para Amsterdã", "Jantar indonésio (rijsttafel)"] },
    { theme: "Réveillon em Amsterdã", items: ["Brunch em Pijp", "Fogos em toda a cidade (legal usar até 1h)", "Festa em Paradiso ou Melkweg", "Oliebollen (bolinho frito) de Ano Novo"] },
  ],
  atenas: [
    { theme: "Acrópole sem multidão", items: ["Acrópole (subir cedo)", "Templo de Zeus Olímpico", "Plaka: almoço com vista", "Pôr do sol em Lycabettus"] },
    { theme: "Exarchia alternativo", items: ["Bairro de Exarchia (street art e bares)", "Mercado central de Atenas", "Café em Psyrri", "Bar de uzo em Monastiraki"] },
    { theme: "Museus essenciais", items: ["Museu da Acrópole", "Museu Arqueológico Nacional", "Almoço em Kolonaki (chique)", "Cinema retrô em Aigli"] },
    { theme: "Bate-volta Hidra", items: ["Ferry de Pireus (~1h30)", "Ilha sem carros", "Almoço de polvo grelhado", "Volta com pôr do sol"] },
    { theme: "Réveillon ateniense", items: ["Vasilopita (bolo da sorte)", "Show + fogos na Praça Syntagma", "Festa em Gazi (clubs LGBT-friendly)", "Bougatsa de manhã"] },
    { theme: "Bate-volta Delfos", items: ["Ônibus de 2h30", "Sítio arqueológico do Oráculo", "Almoço em vila de Arachova", "Volta para Atenas"] },
  ],
  reykjavik: [
    { theme: "Aurora boreal hunt", items: ["Tour de aurora boreal de jeep ou barco", "Apps de previsão (Vedur)", "Roupas térmicas alugadas", "Bebida quente em food truck"] },
    { theme: "Golden Circle", items: ["Þingvellir (placas tectônicas)", "Geyser ativo", "Cachoeira Gullfoss (parcialmente congelada)", "Tomate em estufa geotermal (almoço)"] },
    { theme: "Blue Lagoon + Snæfellsnes", items: ["Blue Lagoon (reservar)", "Massagem aquática opcional", "Drive até a península Snæfellsnes", "Jantar em Borgarnes"] },
    { theme: "Aventura na geleira", items: ["Snowmobile na geleira Langjökull", "Caverna de gelo", "Almoço no glacier base camp", "Volta a Reykjavík"] },
    { theme: "Cidade & nightlife", items: ["Hallgrímskirkja (igreja icônica)", "Hot dog em Bæjarins Beztu", "Sky Lagoon ao pôr do sol", "Bar runtur na Laugavegur (sai depois das 23h)"] },
    { theme: "Réveillon islandês", items: ["Bonfire (brenna) num bairro", "Programa de TV Áramótaskaupið com locais", "Fogos lendários sobre a cidade", "Aurora (com sorte) à 1h da manhã"] },
  ],
  bangkok: [
    { theme: "Templos & Rio", items: ["Grand Palace + Wat Pho", "Wat Arun ao pôr do sol", "Jantar à beira do Chao Phraya", "Sky bar Lebua (Hangover 2)"] },
    { theme: "Comida & Mercados", items: ["Aula de cooking thai", "Mercado de Or Tor Kor", "Mercado noturno Rod Fai", "Massagem em Wat Pho"] },
    { theme: "Khao San + festa", items: ["Khao San Road (street food + bares)", "Soi Cowboy (bairro vermelho — passagem rápida)", "Club Sing Sing Theater", "Drinks no The Bamboo Bar"] },
    { theme: "Muay Thai & spa", items: ["Aula de Muay Thai (1h30)", "Almoço de pad thai de rua", "Spa thai tradicional", "Jantar no Chinatown (Yaowarat)"] },
    { theme: "Day trip Ayutthaya", items: ["Trem ou tour para Ayutthaya (~1h30)", "Templos em ruínas e Buda em árvore", "Bike pelas ruínas", "Volta a Bangkok"] },
    { theme: "Réveillon em Bangkok", items: ["Almoço asiático em centro comercial", "Fogos no Asiatique e CentralWorld", "Festa em Beam Bangkok", "Tom yum às 4h da manhã"] },
  ],
  istambul: [
    { theme: "Sultanahmet sem fila", items: ["Hagia Sophia", "Mesquita Azul", "Cisterna da Basílica iluminada", "Topkapi"] },
    { theme: "Bazares & Bósforo", items: ["Grande Bazar", "Mercado de Especiarias", "Cruzeiro pelo Bósforo ao pôr do sol", "Jantar em Karaköy"] },
    { theme: "Lado Asiático cool", items: ["Balsa para Kadıköy", "Mercado de peixe + café", "Moda neighborhood (lojinhas)", "Pôr do sol em Üsküdar"] },
    { theme: "Galata noite", items: ["Avenida Istiklal", "Torre de Gálata", "Bondinho histórico", "Mini Müzikhol ou Klein Garten (techno)"] },
    { theme: "Hammam + Réveillon", items: ["Hammam em Çemberlitaş (1h)", "Jantar de meze", "Festa em Sortie ou Reina", "Fogos sobre o Bósforo"] },
    { theme: "Capadócia (extensão)", items: ["Voo doméstico (1h15)", "Passeio de balão ao amanhecer", "Hotel-caverna em Göreme", "Vale do Amor + ATV"] },
  ],
  dubai: [
    { theme: "Burj & Mall", items: ["Burj Khalifa At The Top", "Dubai Mall (aquário, fontes)", "Jantar com vista para Burj Khalifa", "Walk de Dubai Marina"] },
    { theme: "Old Dubai + Souks", items: ["Al Fahidi + Coffee Museum", "Souk do Ouro e das Especiarias", "Travessia de abra (R$2)", "Jantar em Bastakiya"] },
    { theme: "Aventura no deserto", items: ["Dune bashing 4x4", "Sandboard", "Jantar beduíno + dança do ventre", "Glamping opcional"] },
    { theme: "Skydive & adrenalina", items: ["Skydive sobre a Palm Jumeirah (R$3k)", "Brunch em Atlantis", "Beach club Cove Beach", "Drinks em rooftop em DIFC"] },
    { theme: "Ski Dubai + Global Village", items: ["Ski Dubai indoor (-2 ºC)", "Lunch em Mall of Emirates", "Global Village (parque temático multinacional)", "Show de fogos noturno"] },
    { theme: "Réveillon Burj Khalifa", items: ["Reservar mesa em rooftop com vista para Burj", "Show pirotécnico de 6 minutos no Burj", "After-party em White Dubai ou WHITE", "Café da manhã na praia"] },
    { theme: "Bate-volta Abu Dhabi", items: ["Mesquita Sheikh Zayed (foto épica)", "Louvre Abu Dhabi", "Ferrari World (montanha-russa mais rápida do mundo)", "Volta para Dubai"] },
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
