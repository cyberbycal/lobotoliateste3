/* ============================================================
   DADOS — imagens reais via Riot Data Dragon / CommunityDragon.
   Patch verificado ao vivo na API oficial em 03/09/2026: 16.17.1
   (a Riot nunca "resetou" a numeração para bater com o ano —
   segue a contagem original desde 2013). Centralizado aqui.
   ============================================================ */

const DD_VERSION = "16.17.1";
const CURRENT_PATCH = "Patch 16.17";
const DD_CDN = "https://ddragon.leagueoflegends.com/cdn/" + DD_VERSION;
const DD_IMG = DD_CDN + "/img";
const SPLASH = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
const LOADING = "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/";
const CDRAGON_PERK = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/";

function championIcon(id){ return DD_IMG + "/champion/" + id + ".png"; }
function itemIcon(id){ return DD_IMG + "/item/" + id + ".png"; }
function splashUrl(num){ return SPLASH + "Nidalee_" + num + ".jpg"; }
function loadingUrl(num){ return LOADING + "Nidalee_" + num + ".jpg"; }

const NIDALEE_SPLASH_HERO = splashUrl(0);

const ABILITIES = [
  {
    key: "P", name: "Prowl", meta: "Passiva", icon: DD_IMG + "/passive/NidaleePassive.png",
    desc: "Andar em moitas te deixa mais rápida por alguns segundos. Acertar a lança ou a armadilha em alguém marca esse alvo como \"Hunted\", dando visão dele e ainda mais velocidade na direção dele.",
    when: "Use as moitas do mapa a seu favor pra se mover mais rápido entre objetivos e camps.",
    mistake: "Ignorar que acertar o inimigo já te dá vantagem de perseguição — muita gente esquece de aproveitar o Hunted.",
    tip: "Sempre que marcar alguém como Hunted, isso é o sinal verde pra trocar de forma e ir pra cima."
  },
  {
    key: "Q", name: "Javelin Toss / Takedown", meta: "Q — poke e execução", icon: DD_IMG + "/spell/NidaleeQ.png",
    humanDesc: "Na forma humana, joga uma lança em linha reta que causa mais dano quanto mais longe viaja — ótima pra poke à distância.",
    pumaDesc: "Na forma puma, vira um ataque forte de curto alcance, que causa ainda mais dano em alvos com pouca vida.",
    when: "Use a lança pra iniciar o combo à distância; use o Takedown de puma pra finalizar alvos com vida baixa.",
    mistake: "Jogar a lança de muito perto — ela precisa de distância pra causar o dano bônus.",
    tip: "Mire à frente do movimento do inimigo, não em cima da posição atual dele."
  },
  {
    key: "W", name: "Bushwhack / Pounce", meta: "W — armadilha e salto", icon: DD_IMG + "/spell/NidaleeW.png",
    humanDesc: "Na forma humana, planta uma armadilha invisível que também marca quem pisar nela como Hunted.",
    pumaDesc: "Na forma puma, dá um salto pra frente que causa dano e te aproxima rapidinho do alvo.",
    when: "Plante armadilhas em passagens estreitas ou nos seus próprios camps; use o salto pra entrar ou sair de uma luta.",
    mistake: "Usar o salto sem ter um plano de saída — ele te deixa bem perto do inimigo.",
    tip: "Se o alvo do salto estiver Hunted, o alcance aumenta bastante — é sua principal ferramenta de perseguição."
  },
  {
    key: "E", name: "Primal Surge / Swipe", meta: "E — cura e área", icon: DD_IMG + "/spell/NidaleeE.png",
    humanDesc: "Na forma humana, cura um aliado e dá bônus de velocidade de ataque — ótimo suporte em lutas de time.",
    pumaDesc: "Na forma puma, vira um golpe em cone que acerta todo mundo na frente.",
    when: "Use a cura em quem está brigando na lane durante um gank; use o golpe em área quando dois ou mais inimigos estiverem próximos.",
    mistake: "Esquecer que a cura tem alcance curto — chegar perto o suficiente pra usar já é meio caminho andado do gank.",
    tip: "Guardar essa habilidade pra logo depois do salto (W de puma) maximiza o dano em área."
  },
  {
    key: "R", name: "Aspect of the Cougar", meta: "Ultimate — transformação", icon: DD_IMG + "/spell/NidaleeR.png",
    desc: "Transforma Nidalee entre a forma humana (à distância, poke) e a forma puma (corpo a corpo, mobilidade e dano de execução). Não tem custo de mana pra trocar.",
    when: "Alterne entre as formas o tempo todo — é assim que se joga a personagem. Comece humana pra farmar e marcar, vire puma pra executar.",
    mistake: "Ficar presa numa forma só. O poder da Nidalee está exatamente na troca constante.",
    tip: "No começo, treine só a troca de forma no modo prática antes de se preocupar com combos complexos."
  }
];

const COMBOS = [
  {
    name: "Engajar de perto", category: "basico", difficulty: 2,
    steps: ["Q", "R", "W", "E", "Q"],
    goal: "Iniciar uma troca rápida em cima de um alvo já marcado.",
    explain: "Jogue a lança pra marcar o alvo como Hunted, transforme, use o salto (que fica mais forte em alvos marcados), acerte a área e finalize com o ataque de execução.",
    tip: "Só faça esse combo se o alvo já estiver com a vida baixa ou sozinho."
  },
  {
    name: "Poke e aproximação", category: "poke", difficulty: 3,
    steps: ["Q", "R", "W"],
    goal: "Acertar a lança de longe antes de se comprometer com a luta.",
    explain: "Jogue a lança de uma distância segura. Se acertar, o alvo fica marcado e mais fácil de alcançar — só então transforme e entre com o salto.",
    tip: "Se a lança errar, não force a entrada — recue e espere a próxima oportunidade."
  },
  {
    name: "Burst à distância", category: "execucao", difficulty: 4,
    steps: ["Q", "R", "W", "E"],
    goal: "Maximizar o dano da lança usando distância máxima antes do burst final.",
    explain: "A lança causa muito mais dano quanto mais longe viaja. Jogue de bem longe, use moitas pra se aproximar sem ser vista e finalize o combo completo de puma.",
    tip: "Esse é o combo mais avançado — pratique os dois primeiros antes de tentar esse em partida de verdade."
  },
  {
    name: "Gank de lane", category: "gank", difficulty: 3,
    steps: ["P", "R", "W", "Q"],
    goal: "Aparecer de surpresa e fechar o kill numa lane já pressionada.",
    explain: "Aproxime-se por moitas (Prowl te dá velocidade), transforme perto da lane, salte em cima do alvo já marcado e finalize com o Takedown.",
    tip: "Avise a lane antes — um gank sincronizado vale muito mais que um solo."
  },
  {
    name: "Fuga rápida", category: "fuga", difficulty: 1,
    steps: ["R", "W"],
    goal: "Sair de uma luta perdida usando a mobilidade da forma puma.",
    explain: "Transforme em puma e use o salto na direção contrária ao inimigo — mesmo sem alvo, o Pounce te dá deslocamento instantâneo.",
    tip: "Guardar o W pra fuga é sempre melhor do que morrer tentando finalizar um kill duvidoso."
  },
  {
    name: "Combo avançado de invade", category: "avancado", difficulty: 5,
    steps: ["Q", "P", "R", "W", "E", "Q"],
    goal: "Maximizar dano em uma invasão coordenada, marcando o alvo antes mesmo de engajar.",
    explain: "Jogue a lança de longe pra marcar o Hunted já na aproximação, use o Prowl pra ganhar velocidade extra pelas moitas, transforme e execute o combo completo.",
    tip: "Só tente isso com visão garantida da jungle inimiga — sem isso o risco é alto demais."
  }
];

const COMBO_CATEGORIES = {
  basico: "Combos básicos", poke: "Combos de poke", execucao: "Combos de execução",
  gank: "Combos de gank", fuga: "Combos de fuga", avancado: "Combos avançados"
};

/* ============ ACADEMIA — ROADMAP EM NÍVEIS ============ */
const ACADEMY_LEVELS = [
  {
    id: "lvl1", icon: "🌱", title: "Sobrevivendo na jungle",
    tasks: [
      { id: "d1", title: "Rotação básica", desc: "Aprenda a rotação básica e termine uma clear completa sem morrer." },
      { id: "d2", title: "Controle de vida/mana", desc: "Nunca entre em luta ou objetivo com menos de 50% de vida sem motivo." },
      { id: "d3", title: "Visão", desc: "Coloque sentinelas no rio e na sua própria jungle." }
    ]
  },
  {
    id: "lvl2", icon: "🐾", title: "Aprendendo a forma puma",
    tasks: [
      { id: "d4", title: "Trocar de forma em combate", desc: "Pratique trocar de forma no meio do combate e usar o W pra se posicionar." },
      { id: "d5", title: "Salto (W puma)", desc: "Treine usar o Pounce tanto pra entrar quanto pra sair de lutas." }
    ]
  },
  {
    id: "lvl3", icon: "🏹", title: "Acerte suas lanças",
    tasks: [
      { id: "d6", title: "Treinar o Q parado", desc: "No modo prática, treine acertar a lança em alvos parados." },
      { id: "d7", title: "Treinar o Q em movimento", desc: "Depois treine em alvos se movendo — mire à frente, não em cima." }
    ]
  },
  {
    id: "lvl4", icon: "🌸", title: "Aprenda os combos",
    tasks: [
      { id: "d8", title: "Combos básicos", desc: "Rode os combos básico e de poke no modo prática até saírem automáticos." },
      { id: "d9", title: "Combo de execução", desc: "Treine o combo de burst à distância." }
    ]
  },
  {
    id: "lvl5", icon: "👁", title: "Aprenda a enxergar o mapa",
    tasks: [
      { id: "w2-3", title: "Consultar matchups", desc: "Antes de cada partida, dá uma olhada no Analisador da Jungle." },
      { id: "w2-1", title: "Refinar o pathing", desc: "Teste ordens diferentes de camps e veja qual flui melhor pro seu ritmo." }
    ]
  },
  {
    id: "lvl6", icon: "⚔️", title: "Comece a invadir",
    tasks: [
      { id: "w3-1", title: "Contra-jungle segura", desc: "Pratique invadir com segurança quando tiver informação e vantagem." },
      { id: "w3-2", title: "Combo avançado", desc: "Treine o combo avançado de invade até conseguir usá-lo em partida real." }
    ]
  },
  {
    id: "lvl7", icon: "🐆", title: "NIDALEE MAIN",
    tasks: [
      { id: "w3-3", title: "Cheat sheet antes de cada partida", desc: "Vira hábito: antes, early, objetivos, teamfight." },
      { id: "w3-5", title: "Comemorar o progresso", desc: "Seja lá como for essa semana, você já está muito além do primeiro dia. ♡" }
    ]
  }
];

const VIDEOS = [
  { topic: "Aprender League of Legends do zero", subject: "Fundamentos", difficulty: "Iniciante", query: "league of legends guia iniciantes completo" },
  { topic: "Aprender jungle", subject: "Jungle", difficulty: "Iniciante", query: "como jogar jungle league of legends guia completo" },
  { topic: "Aprender pathing", subject: "Jungle", difficulty: "Intermediário", query: "pathing de jungle league of legends explicado" },
  { topic: "Aprender macro", subject: "Macro", difficulty: "Intermediário", query: "macro de jungle league of legends quando gankar" },
  { topic: "Aprender Nidalee", subject: "Nidalee", difficulty: "Iniciante", query: "guia de nidalee jungle league of legends" },
  { topic: "Aprender combos de Nidalee", subject: "Nidalee", difficulty: "Avançado", query: "combos de nidalee league of legends tutorial" },
  { topic: "Aprender clears de jungle", subject: "Jungle", difficulty: "Iniciante", query: "jungle clear tutorial league of legends" },
  { topic: "Aprender ganks", subject: "Jungle", difficulty: "Intermediário", query: "como gankar league of legends tutorial jungle" },
  { topic: "Jogar contra diferentes matchups", subject: "Matchups", difficulty: "Avançado", query: "nidalee matchups jungle counter guide" }
];

/* ============ MAPA DA JUNGLE ============ */
const JUNGLE_CAMPS = {
  blue:   { id:"blue", name:"Blue Sentinel", icon:"🔵", what:"Buff que dá mana/energia e redução de cooldown.", when:"Primeiro camp de quase todo pathing, com Smite pronto.", tip:"Comece por aqui se sua rota for pro seu lado azul.", risk:"baixo", next:"Gromp ou Wolves" },
  gromp:  { id:"gromp", name:"Gromp", icon:"🐸", what:"Monstro solitário na moita, dá bastante XP.", when:"Logo após o Blue, ainda com vida alta.", tip:"Cuidado com o veneno — ele causa dano ao longo do tempo.", risk:"baixo", next:"Wolves" },
  wolves: { id:"wolves", name:"Wolves (Alcateia)", icon:"🐺", what:"Um lobo grande e dois pequenos.", when:"No meio do clear, depois do Blue/Gromp.", tip:"Mate os pequenos primeiro pra reduzir dano recebido.", risk:"baixo", next:"Raptors ou Red" },
  raptors:{ id:"raptors", name:"Raptors (Fenda)", icon:"🦖", what:"Um raptor grande e vários pequenos em grupo.", when:"No meio do clear, depois do Blue/Gromp.", tip:"Use habilidades em área pra limpar rápido.", risk:"médio", next:"Red ou Krugs" },
  red:    { id:"red", name:"Red Brambleback", icon:"🔴", what:"Buff que dá dano verdadeiro e queimadura.", when:"Segundo buff do clear, com Smite se disponível.", tip:"Cuidado com invasões — é o camp mais visado pelo jungler inimigo.", risk:"médio", next:"Krugs ou gank" },
  krugs:  { id:"krugs", name:"Krugs (Golens)", icon:"🪨", what:"Golem grande que se divide em menores ao morrer.", when:"Fim do clear, exige mais tempo e atenção.", tip:"Fique de olho na explosão dos golens pequenos.", risk:"médio", next:"Scuttle ou gank" },
  scuttle:{ id:"scuttle", name:"Scuttle Crab", icon:"🦀", what:"Caranguejo do rio que dá ouro, XP e visão temporária.", when:"Assim que reaparece (spawna cedo e de novo depois).", tip:"Contestar o scuttle é uma forma segura de brigar com o jungler inimigo.", risk:"médio", next:"Objetivo ou gank" },
  dragon: { id:"dragon", name:"Dragão", icon:"🐉", what:"Objetivo no rio de baixo — dá bônus permanente pro time.", when:"A partir de ~5 min, sempre com visão e prioridade de lane.", tip:"Matar 4 dragões dá um bônus enorme extra — vale planejar.", risk:"alto", next:"—" },
  herald: { id:"herald", name:"Arauto", icon:"🦂", what:"Monstro no rio de cima que dá uma 'arma' pra derrubar torre.", when:"Meio do early game, geralmente contestado.", tip:"Use a arma logo, antes que expire.", risk:"alto", next:"—" },
  grubs:  { id:"grubs", name:"Vastilarvas (Void Grubs)", icon:"🪱", what:"Aparecem cedo, dão bônus de recall e enfraquecem torres.", when:"Bem no início da partida.", tip:"Ótimas pra pressionar, mas não valem morrer se um dragão real está sendo contestado.", risk:"baixo", next:"—" },
  baron:  { id:"baron", name:"Barão Nashor", icon:"👹", what:"O objetivo mais forte do jogo — buff enorme pro time inteiro.", when:"Aparece mais tarde, geralmente depois dos 20 min.", tip:"Só vá com visão total e vantagem numérica.", risk:"altíssimo", next:"—" }
};

const JUNGLE_PATHS = [
  { name:"Full Clear", desc:"Limpa todos os camps antes de gankar — maximiza farm e nível.", route:["blue","gromp","wolves","raptors","red","krugs","scuttle"] },
  { name:"Agressivo", desc:"Clear curto seguido de gank cedo, aproveitando o poke da Nidalee.", route:["blue","gromp","wolves","scuttle"] },
  { name:"Gank Nível 3", desc:"Prioriza chegar no nível 3 rápido pra gankar assim que possível.", route:["blue","gromp","wolves"] },
  { name:"Invade", desc:"Começa contestando um camp do lado inimigo com informação de visão.", route:["scuttle","red","krugs"] },
  { name:"Foco em Objetivo", desc:"Clear reduzido guardando recursos pra Arauto ou Dragão cedo.", route:["blue","gromp","scuttle"] }
];

/* ============ CAMPEÕES — base compartilhada p/ matchups e cheat sheet ============ */
/* ============ TODOS OS CAMPEÕES (Data Dragon 16.17.1) ============
   Dataset centralizado — nome de exibição, id oficial (usado nas URLs de
   ícone/splash), rota principal e tags leves usadas só pelo analisador de
   composição. Isso NÃO é dado estatístico oficial — é uma classificação
   simplificada pra alimentar recomendações estratégicas, como pede o
   item 14 do briefing (nunca invento winrate/estatística). */
const CHAMPIONS = {
  "Aatrox":{id:"Aatrox",role:"top",tags:["ad","dive"]},
  "Ahri":{id:"Ahri",role:"mid",tags:["ap","poke","mobilidade"]},
  "Akali":{id:"Akali",role:"mid",tags:["ap","dive","mobilidade"]},
  "Akshan":{id:"Akshan",role:"mid",tags:["ad","mobilidade","poke"]},
  "Alistar":{id:"Alistar",role:"support",tags:["tank","cc","engage"]},
  "Ambessa":{id:"Ambessa",role:"top",tags:["ad","engage","dive"]},
  "Amumu":{id:"Amumu",role:"jungle",tags:["ap","tank","cc","engage"]},
  "Anivia":{id:"Anivia",role:"mid",tags:["ap","poke","cc"]},
  "Annie":{id:"Annie",role:"mid",tags:["ap","cc","poke"]},
  "Aphelios":{id:"Aphelios",role:"adc",tags:["ad","poke"]},
  "Ashe":{id:"Ashe",role:"adc",tags:["ad","poke","cc"]},
  "Aurelion Sol":{id:"AurelionSol",role:"mid",tags:["ap","poke"]},
  "Aurora":{id:"Aurora",role:"mid",tags:["ap","mobilidade","poke"]},
  "Azir":{id:"Azir",role:"mid",tags:["ap","poke","cc"]},
  "Bard":{id:"Bard",role:"support",tags:["ap","cc","poke"]},
  "Bel'Veth":{id:"Belveth",role:"jungle",tags:["ad","mobilidade","dive"]},
  "Blitzcrank":{id:"Blitzcrank",role:"support",tags:["tank","cc","engage"]},
  "Brand":{id:"Brand",role:"support",tags:["ap","poke","cc"]},
  "Braum":{id:"Braum",role:"support",tags:["tank","cc","engage"]},
  "Briar":{id:"Briar",role:"jungle",tags:["ad","engage","dive"]},
  "Caitlyn":{id:"Caitlyn",role:"adc",tags:["ad","poke"]},
  "Camille":{id:"Camille",role:"top",tags:["ad","mobilidade","dive"]},
  "Corki":{id:"Corki",role:"mid",tags:["ad","poke"]},
  "Darius":{id:"Darius",role:"top",tags:["ad","dive","tank"]},
  "Diana":{id:"Diana",role:"jungle",tags:["ap","engage","mobilidade"]},
  "Dr. Mundo":{id:"DrMundo",role:"top",tags:["tank","dive"]},
  "Draven":{id:"Draven",role:"adc",tags:["ad","dive"]},
  "Ekko":{id:"Ekko",role:"jungle",tags:["ap","mobilidade","engage"]},
  "Elise":{id:"Elise",role:"jungle",tags:["ap","engage","dive"]},
  "Evelynn":{id:"Evelynn",role:"jungle",tags:["ap","dive","mobilidade"]},
  "Ezreal":{id:"Ezreal",role:"adc",tags:["ad","poke","mobilidade"]},
  "Fiddlesticks":{id:"Fiddlesticks",role:"jungle",tags:["ap","cc","engage"]},
  "Fiora":{id:"Fiora",role:"top",tags:["ad","mobilidade","dive"]},
  "Fizz":{id:"Fizz",role:"mid",tags:["ap","mobilidade","dive"]},
  "Galio":{id:"Galio",role:"mid",tags:["tank","cc","engage"]},
  "Gangplank":{id:"Gangplank",role:"top",tags:["ad","poke"]},
  "Garen":{id:"Garen",role:"top",tags:["ad","tank","dive"]},
  "Gnar":{id:"Gnar",role:"top",tags:["ad","tank","cc"]},
  "Gragas":{id:"Gragas",role:"jungle",tags:["tank","cc","engage"]},
  "Graves":{id:"Graves",role:"jungle",tags:["ad","poke"]},
  "Gwen":{id:"Gwen",role:"top",tags:["ap","dive","mobilidade"]},
  "Hecarim":{id:"Hecarim",role:"jungle",tags:["ad","engage","mobilidade","dive"]},
  "Heimerdinger":{id:"Heimerdinger",role:"mid",tags:["ap","poke","cc"]},
  "Hwei":{id:"Hwei",role:"mid",tags:["ap","poke","cc"]},
  "Illaoi":{id:"Illaoi",role:"top",tags:["ad","tank","dive"]},
  "Irelia":{id:"Irelia",role:"top",tags:["ad","mobilidade","dive"]},
  "Ivern":{id:"Ivern",role:"jungle",tags:["ap","cc","engage"]},
  "Janna":{id:"Janna",role:"support",tags:["ap","poke","cc"]},
  "Jarvan IV":{id:"JarvanIV",role:"jungle",tags:["ad","engage","cc","tank"]},
  "Jax":{id:"Jax",role:"top",tags:["ad","dive","mobilidade"]},
  "Jayce":{id:"Jayce",role:"top",tags:["ad","poke"]},
  "Jhin":{id:"Jhin",role:"adc",tags:["ad","poke","cc"]},
  "Jinx":{id:"Jinx",role:"adc",tags:["ad","poke"]},
  "K'Sante":{id:"KSante",role:"top",tags:["tank","cc","engage"]},
  "Kai'Sa":{id:"Kaisa",role:"adc",tags:["ad","mobilidade","dive"]},
  "Kalista":{id:"Kalista",role:"adc",tags:["ad","poke","mobilidade"]},
  "Karma":{id:"Karma",role:"support",tags:["ap","poke","cc"]},
  "Karthus":{id:"Karthus",role:"jungle",tags:["ap","poke"]},
  "Kassadin":{id:"Kassadin",role:"mid",tags:["ap","mobilidade","dive"]},
  "Katarina":{id:"Katarina",role:"mid",tags:["ap","dive","mobilidade"]},
  "Kayle":{id:"Kayle",role:"top",tags:["ad","poke","mobilidade"]},
  "Kayn":{id:"Kayn",role:"jungle",tags:["ad","mobilidade","dive"]},
  "Kennen":{id:"Kennen",role:"top",tags:["ap","cc","engage"]},
  "Kha'Zix":{id:"Khazix",role:"jungle",tags:["ad","engage","mobilidade","dive"]},
  "Kindred":{id:"Kindred",role:"jungle",tags:["ad","poke"]},
  "Kled":{id:"Kled",role:"top",tags:["ad","engage","dive"]},
  "Kog'Maw":{id:"KogMaw",role:"adc",tags:["ad","poke"]},
  "LeBlanc":{id:"Leblanc",role:"mid",tags:["ap","mobilidade","dive"]},
  "Lee Sin":{id:"LeeSin",role:"jungle",tags:["ad","engage","mobilidade","dive"]},
  "Leona":{id:"Leona",role:"support",tags:["tank","cc","engage"]},
  "Lillia":{id:"Lillia",role:"jungle",tags:["ap","cc","mobilidade"]},
  "Lissandra":{id:"Lissandra",role:"mid",tags:["ap","cc","engage"]},
  "Lucian":{id:"Lucian",role:"adc",tags:["ad","dive","mobilidade"]},
  "Lulu":{id:"Lulu",role:"support",tags:["ap","poke","cc"]},
  "Lux":{id:"Lux",role:"mid",tags:["ap","poke","cc"]},
  "Malphite":{id:"Malphite",role:"top",tags:["tank","cc","engage"]},
  "Malzahar":{id:"Malzahar",role:"mid",tags:["ap","cc","poke"]},
  "Maokai":{id:"Maokai",role:"jungle",tags:["tank","cc","engage"]},
  "Master Yi":{id:"MasterYi",role:"jungle",tags:["ad","mobilidade","dive"]},
  "Mel":{id:"Mel",role:"mid",tags:["ap","poke","cc"]},
  "Milio":{id:"Milio",role:"support",tags:["ap","poke","cc"]},
  "Miss Fortune":{id:"MissFortune",role:"adc",tags:["ad","poke"]},
  "Mordekaiser":{id:"Mordekaiser",role:"top",tags:["ap","dive","tank"]},
  "Morgana":{id:"Morgana",role:"support",tags:["ap","cc","poke"]},
  "Naafiri":{id:"Naafiri",role:"jungle",tags:["ad","dive","mobilidade"]},
  "Nami":{id:"Nami",role:"support",tags:["ap","poke","cc"]},
  "Nasus":{id:"Nasus",role:"top",tags:["ad","tank","dive"]},
  "Nautilus":{id:"Nautilus",role:"support",tags:["tank","cc","engage"]},
  "Neeko":{id:"Neeko",role:"mid",tags:["ap","cc","poke"]},
  "Nilah":{id:"Nilah",role:"adc",tags:["ad","dive","mobilidade"]},
  "Nocturne":{id:"Nocturne",role:"jungle",tags:["ad","engage","dive"]},
  "Nunu":{id:"Nunu",role:"jungle",tags:["tank","cc","engage"]},
  "Olaf":{id:"Olaf",role:"jungle",tags:["ad","dive","tank"]},
  "Orianna":{id:"Orianna",role:"mid",tags:["ap","poke","cc"]},
  "Ornn":{id:"Ornn",role:"top",tags:["tank","cc","engage"]},
  "Pantheon":{id:"Pantheon",role:"top",tags:["ad","engage","dive"]},
  "Poppy":{id:"Poppy",role:"top",tags:["tank","cc","engage"]},
  "Pyke":{id:"Pyke",role:"support",tags:["ad","dive","cc"]},
  "Qiyana":{id:"Qiyana",role:"mid",tags:["ad","dive","mobilidade"]},
  "Quinn":{id:"Quinn",role:"top",tags:["ad","poke","mobilidade"]},
  "Rakan":{id:"Rakan",role:"support",tags:["ap","engage","mobilidade"]},
  "Rammus":{id:"Rammus",role:"jungle",tags:["tank","cc","engage"]},
  "Rek'Sai":{id:"RekSai",role:"jungle",tags:["ad","engage","tank"]},
  "Rell":{id:"Rell",role:"support",tags:["tank","cc","engage"]},
  "Renata Glasc":{id:"Renata",role:"support",tags:["ap","cc","poke"]},
  "Renekton":{id:"Renekton",role:"top",tags:["ad","dive","tank"]},
  "Rengar":{id:"Rengar",role:"jungle",tags:["ad","engage","mobilidade","dive"]},
  "Riven":{id:"Riven",role:"top",tags:["ad","mobilidade","dive"]},
  "Rumble":{id:"Rumble",role:"top",tags:["ap","poke","tank"]},
  "Ryze":{id:"Ryze",role:"mid",tags:["ap","poke","mobilidade"]},
  "Samira":{id:"Samira",role:"adc",tags:["ad","dive","mobilidade"]},
  "Sejuani":{id:"Sejuani",role:"jungle",tags:["tank","cc","engage"]},
  "Senna":{id:"Senna",role:"support",tags:["ad","poke"]},
  "Seraphine":{id:"Seraphine",role:"support",tags:["ap","poke","cc"]},
  "Sett":{id:"Sett",role:"top",tags:["ad","tank","dive"]},
  "Shaco":{id:"Shaco",role:"jungle",tags:["ad","engage","dive"]},
  "Shen":{id:"Shen",role:"top",tags:["tank","cc","engage"]},
  "Shyvana":{id:"Shyvana",role:"jungle",tags:["ad","tank","dive"]},
  "Singed":{id:"Singed",role:"top",tags:["tank","poke"]},
  "Sion":{id:"Sion",role:"top",tags:["tank","engage","cc"]},
  "Sivir":{id:"Sivir",role:"adc",tags:["ad","poke"]},
  "Skarner":{id:"Skarner",role:"jungle",tags:["tank","cc","engage"]},
  "Smolder":{id:"Smolder",role:"adc",tags:["ad","poke"]},
  "Sona":{id:"Sona",role:"support",tags:["ap","poke","cc"]},
  "Soraka":{id:"Soraka",role:"support",tags:["ap","poke"]},
  "Swain":{id:"Swain",role:"mid",tags:["ap","cc","poke"]},
  "Sylas":{id:"Sylas",role:"mid",tags:["ap","mobilidade","dive"]},
  "Syndra":{id:"Syndra",role:"mid",tags:["ap","poke","cc"]},
  "Tahm Kench":{id:"TahmKench",role:"support",tags:["tank","cc","engage"]},
  "Taliyah":{id:"Taliyah",role:"jungle",tags:["ap","poke","mobilidade"]},
  "Talon":{id:"Talon",role:"mid",tags:["ad","dive","mobilidade"]},
  "Taric":{id:"Taric",role:"support",tags:["tank","cc","engage"]},
  "Teemo":{id:"Teemo",role:"top",tags:["ap","poke"]},
  "Thresh":{id:"Thresh",role:"support",tags:["tank","cc","engage"]},
  "Tristana":{id:"Tristana",role:"adc",tags:["ad","dive","mobilidade"]},
  "Trundle":{id:"Trundle",role:"jungle",tags:["ad","tank","dive"]},
  "Tryndamere":{id:"Tryndamere",role:"top",tags:["ad","dive","mobilidade"]},
  "Twisted Fate":{id:"TwistedFate",role:"mid",tags:["ap","poke"]},
  "Twitch":{id:"Twitch",role:"adc",tags:["ad","poke","dive"]},
  "Udyr":{id:"Udyr",role:"jungle",tags:["ad","tank","dive"]},
  "Urgot":{id:"Urgot",role:"top",tags:["ad","tank","dive"]},
  "Varus":{id:"Varus",role:"adc",tags:["ad","poke","cc"]},
  "Vayne":{id:"Vayne",role:"adc",tags:["ad","mobilidade","dive"]},
  "Veigar":{id:"Veigar",role:"mid",tags:["ap","poke","cc"]},
  "Vel'Koz":{id:"Velkoz",role:"mid",tags:["ap","poke","cc"]},
  "Vex":{id:"Vex",role:"mid",tags:["ap","poke","cc"]},
  "Vi":{id:"Vi",role:"jungle",tags:["ad","engage","cc","dive"]},
  "Viego":{id:"Viego",role:"jungle",tags:["ad","engage","mobilidade"]},
  "Viktor":{id:"Viktor",role:"mid",tags:["ap","poke","cc"]},
  "Vladimir":{id:"Vladimir",role:"mid",tags:["ap","poke","tank"]},
  "Volibear":{id:"Volibear",role:"jungle",tags:["tank","engage","dive"]},
  "Warwick":{id:"Warwick",role:"jungle",tags:["ad","tank","dive"]},
  "Wukong":{id:"MonkeyKing",role:"top",tags:["ad","engage","dive"]},
  "Xayah":{id:"Xayah",role:"adc",tags:["ad","poke","mobilidade"]},
  "Xerath":{id:"Xerath",role:"mid",tags:["ap","poke","cc"]},
  "Xin Zhao":{id:"XinZhao",role:"jungle",tags:["ad","engage","dive"]},
  "Yasuo":{id:"Yasuo",role:"mid",tags:["ad","mobilidade","dive"]},
  "Yone":{id:"Yone",role:"mid",tags:["ad","mobilidade","dive"]},
  "Yorick":{id:"Yorick",role:"top",tags:["ad","tank","poke"]},
  "Yunara":{id:"Yunara",role:"adc",tags:["ad","mobilidade","poke"]},
  "Yuumi":{id:"Yuumi",role:"support",tags:["ap","poke","cc"]},
  "Zac":{id:"Zac",role:"jungle",tags:["tank","cc","engage"]},
  "Zed":{id:"Zed",role:"mid",tags:["ad","dive","mobilidade"]},
  "Zeri":{id:"Zeri",role:"adc",tags:["ad","mobilidade","poke"]},
  "Ziggs":{id:"Ziggs",role:"mid",tags:["ap","poke"]},
  "Zilean":{id:"Zilean",role:"support",tags:["ap","cc","poke"]},
  "Zoe":{id:"Zoe",role:"mid",tags:["ap","poke","cc"]},
  "Zyra":{id:"Zyra",role:"support",tags:["ap","cc","poke"]},
  "Cho'Gath":{id:"Chogath",role:"top",tags:["tank","cc","poke"]}
};
function champIcon(name){ const c = CHAMPIONS[name]; return c ? championIcon(c.id) : null; }
const CHAMPION_NAMES = Object.keys(CHAMPIONS);
const JUNGLE_NAMES = CHAMPION_NAMES.filter(function(n){ return CHAMPIONS[n].role === "jungle"; });
const ROLE_LABEL_PT = { top:"topo", jungle:"jungle", mid:"meio", adc:"atirador", support:"suporte" };

/* Leitura estratégica com base nas mecânicas dos campeões e agregados de counter (Patch 16.17). */
const MATCHUPS = {
  "Rengar": { danger:"alto",
    strategy:["Rengar depende de emboscadas em moitas — evite ficar parada em bushes sem visão.","Nidalee sai na frente até o nível 3; use isso pra pressionar cedo, antes do salto dele ficar forte.","Compre controle de visão nas moitas do seu lado da jungle assim que possível."],
    dangers:["Ele se torna muito perigoso à noite (quando ativa a forma fera) — redobre a atenção nesses momentos.","Um salto bem cronometrado dele pode te matar sozinha em poucos segundos."],
    mistakes:"Não entre em moitas desconhecidas sem sentinela — é exatamente ali que o Rengar espera." },
  "Lee Sin": { danger:"medio",
    strategy:["Lee Sin é forte em skirmishes cedo; evite trocar dano corpo a corpo com ele antes do nível 3.","Use a lança pra desgastar antes de qualquer engajamento direto.","Fique atenta ao chute — ele pode virar o combo pra cima do seu time."],
    dangers:["O combo dele (Q-W) pode chegar muito rápido em cima de você.","Ele é forte em invasões cedo."],
    mistakes:"Não subestime o kick dele em teamfight — ele pode reposicionar seu time inteiro." },
  "Kha'Zix": { danger:"medio",
    strategy:["Kha'Zix quer pegar alvos isolados; evite se afastar demais do seu time sem visão.","Ele fica mais forte fora de visão dos inimigos — mantenha sentinelas em pontos-chave.","Use o poke da lança pra desgastar antes que ele consiga o salto de isolamento."],
    dangers:["Dano de execução alto contra alvos com pouca vida.","O isolamento dele pode te pegar sozinha longe do time."],
    mistakes:"Evite farmar sozinha em cantos afastados do mapa sem visão quando ele estiver sem ser visto." },
  "Graves": { danger:"baixo",
    strategy:["Nidalee tem alcance maior — use a lança pra desgastar Graves antes que ele se aproxime.","Evite trocar tiros de perto; a arma dele causa dano alto em curta distância.","Aproveite objetivos de mapa: Graves depende mais de skirmish corpo a corpo que de mobilidade em área."],
    dangers:["O pulo dele (Correria Rápida) pode fechar distância rapidamente.","Dano explosivo se ele conseguir se aproximar."],
    mistakes:"Não confie só na distância — se ele fechar o espaço, o combo dele dói bastante." },
  "Kindred": { danger:"alto",
    strategy:["Kindred tende a vencer trocas de longo alcance — evite ficar num tiroteio prolongado de lanças.","Prefira pegar objetivos rápido com Smite reforçado, já que ela também disputa muito bem essa área.","Jogue mais pelo mapa (ganks) do que pelo confronto direto na jungle."],
    dangers:["A marca dela (Caça) aumenta o dano progressivamente contra o mesmo alvo.","A ultimate impede mortes na área, o que atrapalha finalizações."],
    mistakes:"Evite ficar parada trocando dano à distância — esse é o jogo favorito dela." },
  "Viego": { danger:"baixo",
    strategy:["Esse é um dos matchups mais favoráveis pra Nidalee — o alcance da lança supera o de Viego antes do nível 6.","Poke bastante cedo e evite lutas prolongadas corpo a corpo.","Cuidado depois que ele conseguir a ultimate — possuir um aliado morto pode virar o jogo dele."],
    dangers:["A execução dele em alvos com pouca vida é perigosa depois do nível 6.","Ele pode ficar imprevisível ao possuir campeões diferentes."],
    mistakes:"Não relaxe demais só porque o early é favorável — o late game dele ainda pode surpreender." },
  "Kayn": { danger:"medio",
    strategy:["Cedo, Kayn é relativamente fraco em skirmish — pressione antes que ele evolua.","Fique de olho em qual forma ele escolheu (Sombra ou Rhaast) pra saber o que esperar.","Use visão pra saber por onde ele atravessa paredes."],
    dangers:["A mobilidade de atravessar paredes dele dificulta prever de onde vem o gank.","Depois da evolução, o poder de luta dele cresce bastante."],
    mistakes:"Não subestime o Kayn só porque ele começa fraco — o meio de jogo é onde ele vira ameaça." },
  "Xin Zhao": { danger:"medio",
    strategy:["Use a distância a seu favor — Xin Zhao precisa chegar perto pra fazer efeito.","Cuidado com o avanço dele em linha reta; ele pode fechar espaço rapidamente.","Poke bastante antes de qualquer engajamento direto."],
    dangers:["O empurrão dele pode te deixar vulnerável no meio do combo.","Ele é forte em lutas de time corpo a corpo."],
    mistakes:"Não troque golpes de perto sem vantagem de vida — o kit dele é feito pra isso." },
  "Warwick": { danger:"alto",
    strategy:["Warwick fareja alvos com pouca vida — evite lutar já machucada perto dele.","Mantenha distância; ele depende de chegar perto e prender o alvo.","Jogue objetivos com atenção redobrada, já que a ultimate dele silencia e prende quem for pego."],
    dangers:["A ultimate (investida) prende e silencia — corta seu combo inteiro.","Ele se cura bastante durante a luta, dificultando o burst."],
    mistakes:"Não entre em confronto corpo a corpo com pouca vida — é exatamente o que ativa o faro dele." },
  "Shaco": { danger:"alto",
    strategy:["Shaco se esconde e monta emboscadas com caixas — desconfie de moitas silenciosas demais.","Poke de longe antes de se aproximar de qualquer área suspeita.","Compre sentinelas extras nos seus camps se ele estiver invadindo com frequência."],
    dangers:["Clones dele podem confundir decisões em teamfight.","Dano de crítico alto se pegar você desprevenida."],
    mistakes:"Não ignore caixas espalhadas pela jungle — elas costumam indicar onde ele passou ou vai passar." },
  "Jarvan IV": { danger:"medio",
    strategy:["A combinação Q-E dele prende no lugar — mantenha distância antes do engajamento.","Use o alcance da lança pra desgastar antes que ele consiga fechar a prisão de terreno.","Evite lutar em espaços fechados onde a barreira dele é mais fácil de acertar."],
    dangers:["A prisão de terreno (barreira) pode isolar você do seu time.","Bom engajador em teamfight coordenado."],
    mistakes:"Não fique parada perto de paredes ou cantos — é ali que a combo dele funciona melhor." },
  "Nocturne": { danger:"alto",
    strategy:["A ultimate global dele pode aparecer em qualquer lugar do mapa — mantenha visão nas lanes.","Evite ficar isolada quando ele tiver a ultimate pronta.","Poke antes que ele consiga fechar distância com o medo em área."],
    dangers:["Ultimate silencia e cega quem não está perto dele.","Dano alto e sustentado em lutas prolongadas."],
    mistakes:"Não ignore o aviso de ultimate global — ele pode aparecer do nada em cima de você." },
  "Master Yi": { danger:"medio",
    strategy:["Poke bastante antes que ele consiga ativar a invulnerabilidade e fechar distância.","Evite lutar sozinha contra ele depois do nível 6.","Priorize objetivos onde seu time pode focar ele rápido."],
    dangers:["A ultimate dá invulnerabilidade e velocidade de movimento altíssima.","Dano de ataque básico escala muito rápido."],
    mistakes:"Não subestime o snowball dele — se ele conseguir uma vantagem de itens, fica muito difícil de parar." },
  "Bel'Veth": { danger:"medio",
    strategy:["Ela precisa de farm pra ficar forte — pressione o pathing dela cedo.","Evite lutas prolongadas depois que ela tiver itens.","Use objetivos pra negar o crescimento dela."],
    dangers:["Escala extremamente bem com itens.","Mobilidade alta em teamfight."],
    mistakes:"Não deixe o jogo se arrastar sem pressão — ela fica cada vez mais forte com o tempo." },
  "Briar": { danger:"alto",
    strategy:["Ela entra com tudo — evite lutas corpo a corpo prolongadas sem vantagem.","Use a distância da lança pra desgastar antes do frenesi dela começar.","Cuidado com o self-cc dela: ela fica descontrolada, mas isso não te protege se você estiver perto."],
    dangers:["Frenesi de sangue aumenta o dano dela conforme a vida baixa.","Difícil de controlar com CC curto."],
    mistakes:"Não entre em troca direta sem vantagem numérica — o kit dela pune duelos 1x1." },
  "Rek'Sai": { danger:"medio",
    strategy:["Ela é forte em skirmish com os túneis — controle visão nas entradas.","Poke antes de qualquer engajamento pra reduzir o impacto do dive dela.","Evite lutar perto de túneis que você não controla."],
    dangers:["Mobilidade alta pelos túneis dela.","Dano de execução em alvos com pouca vida."],
    mistakes:"Não ignore os túneis no mapa — eles indicam rotas de gank dela." },
  "Amumu": { danger:"medio",
    strategy:["A ultimate em área dele é o principal perigo — mantenha distância em teamfight.","Poke antes que ele consiga se aproximar o suficiente pra engajar.","Fique atenta ao cast time da ultimate — dá pra reagir se você estiver de olho."],
    dangers:["Engajamento em área que pode pegar o time inteiro.","Tankiness alta dificulta o burst."],
    mistakes:"Não agrupe demais o time perto dele — facilita o engajamento em área." },
  "Sejuani": { danger:"medio",
    strategy:["Ela quer prender e iniciar — use a distância pra evitar o combo dela.","Poke antes de qualquer confronto direto.","Cuidado em lutas com pouco espaço, onde o stun em área dela rende mais."],
    dangers:["CC forte em área.","Muito tanque, difícil de eliminar rápido."],
    mistakes:"Não fique agrupada perto dela sem espaço pra se separar." },
  "Zac": { danger:"medio",
    strategy:["Ele salta e prende em área — mantenha distância segura.","Poke pra desgastar antes que ele use o salto.","Cuidado com o renascimento dele — ele pode voltar à luta depois de 'morrer'."],
    dangers:["Engajamento elástico difícil de prever.","Sobrevive a bursts que matariam outros tanques."],
    mistakes:"Não considere ele morto até o corpo desaparecer de vez." },
  "Vi": { danger:"alto",
    strategy:["A ultimate dela prende um único alvo através do mapa — evite ficar isolada.","Poke antes que ela consiga engajar em cima de você.","Jogue perto do seu time quando ela tiver a ultimate pronta."],
    dangers:["Ultimate de longo alcance que ignora obstáculos.","Dive forte em cima de alvos prioritários."],
    mistakes:"Não farme isolada quando ela tiver ultimate — você é alvo prioritário." },
  "Diana": { danger:"medio",
    strategy:["Ela puxa e engaja em área — mantenha distância em teamfight.","Poke antes que ela consiga se aproximar.","Cuidado com o escudo dela em trocas prolongadas."],
    dangers:["Puxão que reposiciona o time inimigo.","Dano em área alto no combo completo."],
    mistakes:"Não subestime o alcance da lua crescente dela." },
  "Ekko": { danger:"medio",
    strategy:["Ele tem um botão de reset perigoso — cuidado ao tentar finalizar ele.","Poke antes de qualquer engajamento.","Fique atenta à zona de tempo dele — sair dela reduz o dano recebido."],
    dangers:["Pode reverter o tempo se cometer erro, anulando ganhos.","Dano em área forte com a ultimate."],
    mistakes:"Não confirme o kill cedo demais — o reset dele pode virar a luta." },
  "Evelynn": { danger:"alto",
    strategy:["Ela é invisível na maior parte do early — sentinelas de controle ajudam bastante.","Evite farmar isolada depois do nível 6, quando ela fica invisível de verdade.","Jogue perto do time quando não souber onde ela está."],
    dangers:["Burst alto em alvos isolados.","Praticamente impossível de rastrear sem visão de controle."],
    mistakes:"Não ignore sentinelas de controle — é a única forma confiável de vê-la." },
  "Fiddlesticks": { danger:"alto",
    strategy:["A ultimate dele pode aparecer em qualquer lugar do mapa — mantenha visão nas lanes.","Evite ficar agrupada demais quando ele tiver ultimate.","Poke antes de qualquer engajamento direto."],
    dangers:["Engajamento global em área com medo.","Dano alto sustentado em teamfight."],
    mistakes:"Não ignore o aviso de ultimate global." },
  "Nunu": { danger:"baixo",
    strategy:["Ele depende do snowball com o urso — pressione o pathing dele cedo.","Poke antes de qualquer engajamento.","Contest objetivos onde ele tenta roubar com o Smite reforçado."],
    dangers:["Engajamento em área forte se ele conseguir vantagem.","Pode roubar objetivos com facilidade."],
    mistakes:"Não deixe ele crescer livre — pressione o caminho dele cedo." },
  "Hecarim": { danger:"alto",
    strategy:["Ele ganha velocidade quanto mais se move — evite lutas longas e corridas.","Poke antes que ele consiga fechar distância.","Jogue perto do time quando ele tiver ultimate pronta."],
    dangers:["Engajamento em área com medo na ultimate.","Muito difícil de fugir depois que ele pega velocidade."],
    mistakes:"Não tente correr em linha reta dele — ele te alcança." },
  "Ivern": { danger:"baixo",
    strategy:["Ivern não briga bem sozinho — pressione o clear dele, já que ele investe recursos em ajudar as lanes.","Poke antes de qualquer troca; ele depende do escudo pra sobreviver.","Contest camps grandes: ele costuma dar monstros pro time em vez de focar em lutar."],
    dangers:["A raiz (CC) dele pode travar você no lugar certo pra um gank.","O escudo em aliados pode salvar um kill que parecia certo."],
    mistakes:"Não ignore o Daisy (o Sentinela) em lutas de objetivo — ele tanka bastante." },
  "Skarner": { danger:"medio",
    strategy:["Ele quer te puxar pro time dele — mantenha distância de paredes e cantos.","Poke antes de qualquer engajamento direto.","Cuidado ao contestar camps perto de cristais — a mobilidade dele aumenta ali."],
    dangers:["Captura em área que arrasta pra perto do time inimigo.","Muito forte em pequenos espaços."],
    mistakes:"Não lute em corredores estreitos — é onde o kit dele funciona melhor." },
  "Shyvana": { danger:"baixo",
    strategy:["Shyvana precisa se aproximar pra fazer dano — a lança te dá vantagem de distância.","Evite lutas longas corpo a corpo antes do nível 6.","Ela é forte em objetivos com a queimadura — cuidado ao contestar dragão sem vantagem."],
    dangers:["Forma dragão aumenta alcance e dano dela temporariamente.","Boa em split push e evasão de gank."],
    mistakes:"Não dispute objetivo de perto sem vantagem — a queimadura dela pesa na disputa." },
  "Volibear": { danger:"medio",
    strategy:["Ele quer prender no lugar e bater — mantenha distância antes do combate.","Poke bastante; ele não tem ferramenta de longo alcance pra revidar.","Cuidado com o mergulho na ultimate em cima de alvos prioritários."],
    dangers:["Ultimate de mergulho que ignora certas defesas.","Sustain alto em lutas prolongadas."],
    mistakes:"Não fique parada perto de paredes — o stun dele prende você contra obstáculos." },
  "Karthus": { danger:"medio",
    strategy:["Ele farma de longe com dano em área — evite ficar parada perto de creeps dele.","A passiva permite que ele continue lutando mesmo 'morto' por alguns segundos.","A ultimate global pode zerar sua vida de qualquer parte do mapa — jogue com vida de sobra tarde no jogo."],
    dangers:["Ultimate com alcance de mapa inteiro.","Dano em área forte para contestar objetivos."],
    mistakes:"Não relaxe achando que ele morreu — a passiva permite um último combo mortal." },
  "Trundle": { danger:"baixo",
    strategy:["Trundle rouba estatísticas no confronto direto — evite lutas prolongadas 1x1.","Poke antes de qualquer troca corpo a corpo.","Ele é forte em roubar objetivos com o pilar de gelo — tenha visão perto de dragão/barão."],
    dangers:["O pilar dele pode bloquear sua fuga ou dividir uma luta ao meio.","Rouba resistências, ficando mais forte quanto mais vocês lutam."],
    mistakes:"Não dispute objetivo sem visão perto do fim da disputa — o roubo dele é rápido." }
};

/* Fallback genérico por rota, usado quando o campeão escolhido não é jungler
   e não tem uma entrada detalhada acima (item 12 do briefing). */
const GENERIC_MATCHUP_BY_ROLE = {
  top:{ danger:"baixo",
    strategy:["Vocês raramente se encontram cedo — o que importa é se a lane dele ganha prioridade e libera o jungler inimigo pra te contestar ou gankar.","Pergunte: ele consegue jogar sozinho (split push) ou precisa de ajuda do time pra funcionar?","Se ele empurrar rápido, seu jungler inimigo pode aparecer nas outras lanes — redobre a atenção nos ganks."],
    dangers:["Se ele conseguir controlar a lane sozinho, o jungler inimigo ganha liberdade de rota.","Pode aparecer em teamfights depois de vencer a lane isolada."],
    mistakes:"Não ignore o placar do top — uma lane fora de controle lá em cima muda o resto do mapa." },
  mid:{ danger:"baixo",
    strategy:["O mid geralmente disputa visão e prioridade no rio — isso afeta diretamente seu controle de Scuttle e Dragão.","Se ele tiver prioridade, o jungler inimigo consegue se mover mais livremente pelo mapa.","Aproveite quando ele estiver ausente da lane (roaming) pra pressionar objetivos do lado dele."],
    dangers:["Prioridade de mid costuma dar visão de rio pro time inimigo.","Roams de mid podem reforçar ganks em outras lanes."],
    mistakes:"Não contste Scuttle ou Dragão sem saber onde o mid inimigo está." },
  adc:{ danger:"baixo",
    strategy:["A prioridade no bot lane decide bastante sobre quem controla o Dragão.","Se o bot inimigo empurrar forte, considere um gank early antes que ele fique forte demais.","Fique de olho na dupla bot/support: juntos eles definem se dá pra contestar objetivo com segurança."],
    dangers:["ADCs fortes cedo podem tornar a disputa de Dragão arriscada pro seu time.","Combos de engage da dupla bot podem punir um gank malfeito."],
    mistakes:"Não gankar bot semavaliar o suporte inimigo — o CC dele pode virar a jogada contra você." },
  support:{ danger:"baixo",
    strategy:["Supports de engage tornam qualquer gank bot mais arriscado — cuidado ao entrar sem vantagem.","Supports de visão/controle dificultam suas invasões — espere sentinelas nos seus camps.","Avalie se o suporte inimigo prioriza proteger o ADC ou criar picks — isso muda como você deve gankar bot."],
    dangers:["CC de engage pode reverter um gank que parecia fácil.","Visão de controle pode revelar seu pathing."],
    mistakes:"Não invada ou gankeie bot sem checar se o suporte tem o combo de engage pronto." }
};

/* Registro de skins reais — número corresponde à ordem de splash/loading no Data Dragon. */
const SKINS = [
  { name: "Nidalee (Clássica)", price: 0, year: "Original", num: 0 },
  { name: "Snow Bunny Nidalee", price: 520, year: "2009", num: 1 },
  { name: "French Maid Nidalee", price: 520, year: "2010", num: 2 },
  { name: "Leopard Nidalee", price: 520, year: "2010", num: 3 },
  { name: "Pharaoh Nidalee", price: 520, year: "2011", num: 4 },
  { name: "Bewitching Nidalee", price: 975, year: "2011", num: 5 },
  { name: "Headhunter Nidalee", price: 975, year: "2013", num: 6 },
  { name: "Warring Kingdoms Nidalee", price: 975, year: "2015", num: 7 },
  { name: "Challenger Nidalee", price: 975, year: "2016", num: 8 },
  { name: "Super Galaxy Nidalee", price: 1350, year: "2017", num: 9 },
  { name: "Dawnbringer Nidalee", price: 1350, year: "2019", num: 10 },
  { name: "Cosmic Huntress Nidalee", price: 1350, year: "2020", num: 11 },
  { name: "DWG Nidalee", price: 1350, year: "2021", num: 12 },
  { name: "Ocean Song Nidalee", price: 1350, year: "2022", num: 13 },
  { name: "Kittalee", price: 1350, year: "2023", num: 14 },
  { name: "La Ilusión Nidalee", price: 1350, year: "2023", num: 15 },
  { name: "Spirit Blossom Nidalee", price: 1350, year: "2025", num: 16 }
];

const CHEAT_SHEET = {
  "Antes da partida": ["Escolher runas", "Conferir matchup", "Definir pathing", "Pensar no primeiro objetivo"],
  "Early game": ["Fazer clear", "Olhar lanes", "Procurar gank", "Controlar visão", "Observar jungler inimigo"],
  "Objetivos": ["Dragão", "Vastilarvas", "Arauto", "Barão"],
  "Teamfight": ["Acertar lança", "Não entrar sem marca", "Procurar alvo isolado", "Usar mobilidade", "Sair se necessário"]
};

const SCOUT_CHECKLIST = [
  "Quem ganha o early game na jungle?",
  "Quem limpa mais rápido?",
  "Quem pode invadir Nidalee?",
  "Qual lane possui prioridade?",
  "Qual lane é mais fácil de gankar?",
  "Quem escala melhor?",
  "Quem é a principal ameaça?",
  "Qual objetivo deve ser priorizado?",
  "Qual matchup precisa de ajuda?",
  "Onde provavelmente estará o jungler inimigo?",
  "Qual lane deve receber o primeiro gank?",
  "Onde colocar visão?",
  "Quando contestar dragão?",
  "Quando contestar Void Grubs?",
  "Quando NÃO lutar?"
];

const DICAS = [
  "Você não precisa ser boa de primeira.",
  "Errar faz parte de aprender.",
  "Se morrer, não significa que você é ruim.",
  "E se eu ficar brava por causa de um jogo, pode me lembrar que eu estou sendo uma boba.",
  "Eu prefiro perder 100 partidas com você do que ganhar uma sem você.",
  "Cada Vastilarva que você for buscar sem querer só vira mais uma piada nossa daqui a um mês."
];

/* Build/runas de referência — meta atual, usada em todos os matchups. */
const CURRENT_BUILD = {
  patch: CURRENT_PATCH,
  runesPrimaryTree: { name: "Domínio", icon: CDRAGON_PERK + "styles/7200_domination.png" },
  runesSecondaryTree: { name: "Feitiçaria", icon: CDRAGON_PERK + "styles/7202_sorcery.png" },
  keystone: { name: "Colheita Sombria", icon: CDRAGON_PERK + "styles/domination/darkharvest/darkharvest.png" },
  runesPrimary: ["Colheita Sombria", "Impacto Repentino", "Lembranças Sinistras", "Caçador de Tesouros"],
  runesSecondary: ["Transcendência", "Andarilho das Águas"],
  shards: ["Adaptativo", "Adaptativo", "Vida Extra"],
  items: [
    { name: "Botas do Feiticeiro", id: 3020 },
    { name: "Lich Bane", id: 3100 },
    { name: "Cajado do Vazio", id: 3135 },
    { name: "Ampulheta de Zhonya", id: 3157 },
    { name: "Barrete de Rabadon", id: 3089 }
  ],
  startItem: { name: "Faca de Caça Élfica", id: 1039 }
};
