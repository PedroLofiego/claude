/*
 * ============================================================
 * PACOTES DE AGÊNCIA — comparação com o roteiro de vocês
 * ============================================================
 * Dois roteiros prontos de agência, dia a dia, com cada atração
 * classificada pelo que o site já tem:
 *   roteiro  — já está no roteiro-base de vocês
 *   catalogo — está em "Explorar e montar" (dá pra marcar)   → actId
 *   mapa     — está só no Mapa (dá pra salvar no plano)      → poiId
 *   fora     — não existe no site
 * Só os dias no Japão são comparados; Dubai, Singapura e Paris
 * aparecem como trechos fora do escopo.
 */

export const COVERAGE = {
  roteiro: { label: "No seu roteiro", short: "No roteiro", emoji: "✅", cls: "bg-emerald-500/20 text-emerald-100 ring-emerald-400/40" },
  catalogo: { label: "No catálogo (dá pra incluir)", short: "No catálogo", emoji: "📚", cls: "bg-sky-500/20 text-sky-100 ring-sky-400/40" },
  mapa: { label: "Só no mapa", short: "No mapa", emoji: "📍", cls: "bg-violet-500/20 text-violet-100 ring-violet-400/40" },
  fora: { label: "Não está no site", short: "Fora", emoji: "➖", cls: "bg-slate-500/20 text-slate-300 ring-slate-400/30" },
};

export const AGENCY_PACKAGES = [
  {
    id: "happytour",
    name: "Japão + Singapura + Dubai",
    agency: "Happy Tour (documento .docx, revisado em 22/05/2026)",
    dates: "23/03 → 10/04/2027",
    season: "Primavera — época das cerejeiras (sakura)",
    japanDays: "26/03 → 04/04 · 9 noites no Japão",
    price: "Parte terrestre Japão: USD 6.135 por pessoa (duplo). Aéreo sob consulta.",
    style: "Grupo com guia em espanhol, mínimo de 30 pessoas. Vários dias são 'livres' com passeio opcional pago à parte.",
    extras: "Extensões opcionais para Singapura (04–07/04, USD 1.660) e Dubai (07–10/04, USD 1.450) — fora do escopo desta comparação.",
    days: [
      { date: "23–26/03", title: "Salvador → Dubai → Tóquio", outOfScope: true, note: "Parada em Dubai antes de chegar ao Japão." },
      {
        date: "27/03", title: "Tóquio — city tour",
        items: [
          { name: "Harajuku e Omotesando", status: "roteiro", where: "Sex 11/12, tarde" },
          { name: "Santuário Meiji", status: "roteiro", where: "Sex 11/12, tarde" },
          { name: "Cruzamento de Shibuya", status: "roteiro", where: "Sex 11/12, manhã" },
          { name: "Tokyo Tower", status: "roteiro", where: "Sáb 12/12, noite" },
        ],
      },
      {
        date: "28/03", title: "Monte Fuji (opcional)",
        items: [{ name: "Tour de dia inteiro ao Monte Fuji", status: "catalogo", actId: "t-kawaguchiko", note: "Dezembro é o melhor mês do ano para ver o Fuji. No catálogo há também Hakone e o Monte Takao." }],
      },
      {
        date: "29/03", title: "Yokohama (opcional)",
        items: [{ name: "Yokohama: Museu Cup Noodles, Parque Yamashita, Chinatown", status: "catalogo", actId: "t-yokohama", note: "Cabe em meio período — é o bate-volta mais leve e barato da lista." }],
      },
      {
        date: "30/03", title: "Tóquio → Kyoto",
        items: [{ name: "Trem-bala para Kyoto", status: "roteiro", where: "Seg 14/12" }],
      },
      {
        date: "31/03", title: "Kyoto — city tour",
        items: [
          { name: "Kinkaku-ji (Pavilhão Dourado)", status: "roteiro", where: "Qua 16/12, manhã" },
          { name: "Kiyomizu-dera", status: "roteiro", where: "Ter 15/12, tarde" },
          { name: "Fushimi Inari", status: "roteiro", where: "Ter 15/12, manhã" },
        ],
      },
      {
        date: "01/04", title: "Hiroshima + Miyajima (opcional)",
        items: [{ name: "Memorial da Paz, Cúpula da Bomba e ilha de Miyajima", status: "catalogo", actId: "dt-hiroshima-act", note: "Consome o dia inteiro (~12h)." }],
      },
      {
        date: "02/04", title: "Kyoto → Nara → Osaka",
        items: [
          { name: "Nara: Todai-ji e parque dos cervos", status: "catalogo", actId: "k-nara", note: "Vocês dois cortaram Nara, mas está guardado no catálogo." },
          { name: "Santuário Kasuga Taisha (Nara)", status: "catalogo", actId: "k-kasuga", note: "Entra dentro do dia de Nara, não é um dia extra." },
          { name: "Templo Kofuku-ji (Nara)", status: "catalogo", actId: "k-kofukuji", note: "Resolve o buraco de museu da Gio. Atenção: o pagode está sob andaime de restauração até 2034." },
        ],
      },
      {
        date: "03/04", title: "Osaka — city tour",
        items: [
          { name: "Umeda Sky Building", status: "roteiro", where: "Dom 20/12, tarde" },
          { name: "Castelo de Osaka", status: "roteiro", where: "Dom 20/12, manhã" },
          { name: "Museu de História de Osaka", status: "catalogo", actId: "o-museu-historia" },
          { name: "Shinsaibashi", status: "roteiro", where: "Dom 20/12, noite" },
        ],
      },
      { date: "04/04 →", title: "Osaka → Brasil ou extensões", outOfScope: true, note: "Singapura (04–07/04) e Dubai (07–10/04) são opcionais." },
    ],
  },
  {
    id: "bahiavista",
    name: "Japão — Cores do Outono",
    agency: "Bahia Vista (bahiavista.com.br)",
    url: "https://bahiavista.com.br/japao-cores-do-outono/",
    dates: "08 → 25/11/2026",
    season: "Outono — folhas vermelhas e douradas (momiji)",
    japanDays: "11/11 → 23/11 · 12 noites no Japão",
    price: "USD 9.985 por pessoa (duplo), com aéreo incluso. Individual: + USD 2.550.",
    style: "Grupo pequeno (~12 pessoas) com coordenador desde Salvador. 9 almoços e 2 jantares inclusos, 4 trechos de trem-bala, ryokan em Hakone.",
    extras: "Atenção: a página se contradiz — os dias falam em Paris (e 'Rio → Amsterdam' no dia 1), mas os serviços inclusos citam Emirates via Dubai. Vale perguntar à agência.",
    days: [
      { date: "08–10/11", title: "Salvador → Europa → Osaka", outOfScope: true, note: "Escala na Europa (Paris, segundo o roteiro)." },
      {
        date: "11–12/11", title: "Osaka",
        items: [
          { name: "Umeda Sky Building", status: "roteiro", where: "Dom 20/12, tarde" },
          { name: "Dotonbori", status: "roteiro", where: "Qui 17/12, noite" },
          { name: "Shinsaibashi", status: "roteiro", where: "Dom 20/12, noite" },
        ],
      },
      {
        date: "13/11", title: "Osaka → Nara → Kyoto",
        items: [
          { name: "Castelo de Osaka", status: "roteiro", where: "Dom 20/12, manhã" },
          { name: "Nara: Todai-ji e cervos", status: "catalogo", actId: "k-nara" },
          { name: "Fushimi Inari", status: "roteiro", where: "Ter 15/12, manhã" },
        ],
      },
      {
        date: "14/11", title: "Kyoto",
        items: [
          { name: "Kinkaku-ji (Pavilhão Dourado)", status: "roteiro", where: "Qua 16/12, manhã" },
          { name: "Kiyomizu-dera", status: "roteiro", where: "Ter 15/12, tarde" },
          { name: "Almoço com apresentação de maiko", status: "catalogo", actId: "k-gion-corner", note: "No site, o jeito mais simples de ver maiko é o Gion Corner." },
          { name: "Santuário Heian", status: "catalogo", actId: "k-heian" },
          { name: "Ninenzaka e Sannenzaka", status: "roteiro", where: "Ter 15/12, tarde" },
        ],
      },
      {
        date: "15/11", title: "Kyoto",
        items: [
          { name: "Bambuzal de Arashiyama", status: "catalogo", actId: "k-arashiyama", note: "Sugerido como programa só do Pedro." },
          { name: "Templo Tenryu-ji", status: "catalogo", actId: "k-tenryuji", note: "Fica colado no bambuzal — e a porta dos fundos dá direto nele, furando a fila da entrada principal." },
          { name: "Oficina de origami", status: "mapa", poiId: "origami-kaikan", note: "No site, a opção é o Origami Kaikan, em Tóquio." },
          { name: "Cerimônia do chá", status: "catalogo", actId: "k-uji", note: "Pedido do Pedro, ainda sem lugar no roteiro." },
        ],
      },
      {
        date: "16/11", title: "Hiroshima + Miyajima",
        items: [{ name: "Memorial da Paz, almoço de okonomiyaki e Miyajima", status: "catalogo", actId: "dt-hiroshima-act" }],
      },
      {
        date: "17/11", title: "Nakasendo + Takayama",
        items: [
          { name: "Vilas de Magome e Tsumago (Rota dos Samurais)", status: "fora", note: "Ficam na rota do Nakasendo, entre Nagoya e Matsumoto: 4h+ de cada base de vocês e só fazem sentido com pernoite. Fora do alcance deste roteiro." },
          { name: "Takayama — rua Kamisannomachi", status: "catalogo", actId: "k-shirakawago", note: "No catálogo junto com Shirakawa-go, com o veredito: exige pernoite fora." },
        ],
      },
      {
        date: "18/11", title: "Shirakawa-go → Hakone",
        items: [
          { name: "Vila de Shirakawa-go (UNESCO)", status: "catalogo", actId: "k-shirakawago", note: "O light-up na neve é só janeiro e fevereiro, por sorteio — em dezembro não acontece." },
          { name: "Noite em ryokan com onsen em Hakone", status: "mapa", poiId: "hakone" },
        ],
      },
      {
        date: "19/11", title: "Hakone → Tóquio",
        items: [
          { name: "Lago Ashi e teleférico com vista do Fuji", status: "catalogo", actId: "t-hakone", note: "O circuito completo, com o Freepass que junta os 5 transportes num ticket só." },
          { name: "Tokyo Tower", status: "roteiro", where: "Sáb 12/12, noite" },
        ],
      },
      {
        date: "20/11", title: "Tóquio",
        items: [
          { name: "Templo Senso-ji (Asakusa)", status: "roteiro", where: "Qui 10/12, manhã" },
          { name: "Odaiba", status: "catalogo", actId: "t-odaiba" },
          { name: "Ginza", status: "roteiro", where: "Sáb 12/12, tarde" },
          { name: "Harajuku, Takeshita, Omotesando e Shibuya", status: "roteiro", where: "Sex 11/12" },
        ],
      },
      {
        date: "21/11", title: "Nikko",
        items: [{ name: "Santuário Toshogu e trilha Kanmangafuchi", status: "catalogo", actId: "t-nikko", note: "Em dezembro a parte alta da montanha pode estar fechada — conte só com o Toshogu." }],
      },
      {
        date: "22/11", title: "Tóquio",
        items: [
          { name: "Santuário Meiji", status: "roteiro", where: "Sex 11/12, tarde" },
          { name: "Harajuku e Shibuya", status: "roteiro", where: "Sex 11/12" },
        ],
      },
      { date: "23–25/11", title: "Tóquio → Europa → Brasil", outOfScope: true, note: "Volta com escala na Europa." },
    ],
  },
];

export function coverageCount(pkg) {
  const count = { roteiro: 0, catalogo: 0, mapa: 0, fora: 0 };
  pkg.days.forEach((d) => (d.items || []).forEach((it) => (count[it.status] += 1)));
  return count;
}
