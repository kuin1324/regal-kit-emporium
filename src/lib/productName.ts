import { useTranslation } from "react-i18next";

type Lang = "nl" | "en" | "fr" | "de" | "es" | "pt" | "it" | "zh";
const LANGS: Lang[] = ["nl", "en", "fr", "de", "es", "pt", "it", "zh"];

/**
 * Kit-type woordenboek. Sleutel = canonieke (Engelse/Nederlandse) term,
 * waarde = vertaling per taal. Langere termen staan eerst zodat losse
 * woorden niet te vroeg matchen.
 */
const KIT: [string, Record<Lang, string>][] = [
  ["Special Editions", { nl: "Special Editions", en: "Special Editions", fr: "Éditions Spéciales", de: "Sondereditionen", es: "Ediciones Especiales", pt: "Edições Especiais", it: "Edizioni Speciali", zh: "特别版" }],
  ["Special Edition", { nl: "Special Edition", en: "Special Edition", fr: "Édition Spéciale", de: "Sonderedition", es: "Edición Especial", pt: "Edição Especial", it: "Edizione Speciale", zh: "特别版" }],
  ["Anniversary", { nl: "Jubileum", en: "Anniversary", fr: "Anniversaire", de: "Jubiläum", es: "Aniversario", pt: "Aniversário", it: "Anniversario", zh: "周年纪念" }],
  ["Pre-Match", { nl: "Pre-Match", en: "Pre-Match", fr: "Avant-Match", de: "Pre-Match", es: "Pre-Partido", pt: "Pré-Jogo", it: "Pre-Partita", zh: "赛前" }],
  ["Pre Match", { nl: "Pre-Match", en: "Pre-Match", fr: "Avant-Match", de: "Pre-Match", es: "Pre-Partido", pt: "Pré-Jogo", it: "Pre-Partita", zh: "赛前" }],
  ["Training Shirt", { nl: "Trainingsshirt", en: "Training Shirt", fr: "Maillot d'Entraînement", de: "Trainingstrikot", es: "Camiseta de Entrenamiento", pt: "Camisa de Treino", it: "Maglia da Allenamento", zh: "训练球衣" }],
  ["Trainingsshirt", { nl: "Trainingsshirt", en: "Training Shirt", fr: "Maillot d'Entraînement", de: "Trainingstrikot", es: "Camiseta de Entrenamiento", pt: "Camisa de Treino", it: "Maglia da Allenamento", zh: "训练球衣" }],
  ["Training", { nl: "Training", en: "Training", fr: "Entraînement", de: "Training", es: "Entrenamiento", pt: "Treino", it: "Allenamento", zh: "训练" }],
  ["Goalkeeper", { nl: "Keeper", en: "Goalkeeper", fr: "Gardien", de: "Torwart", es: "Portero", pt: "Guarda-redes", it: "Portiere", zh: "门将" }],
  ["Keeper", { nl: "Keeper", en: "Goalkeeper", fr: "Gardien", de: "Torwart", es: "Portero", pt: "Guarda-redes", it: "Portiere", zh: "门将" }],
  ["Long Sleeve", { nl: "Lange Mouwe Shirt", en: "Long Sleeve Shirt", fr: "Maillot Manches Longues", de: "Langarm Trikot", es: "Camiseta Manga Larga", pt: "Camisa Manga Comprida", it: "Maglia Manica Lunga", zh: "长袖球衣" }],
  ["Longsleeve", { nl: "Lange Mouwe Shirt", en: "Long Sleeve Shirt", fr: "Maillot Manches Longues", de: "Langarm Trikot", es: "Camiseta Manga Larga", pt: "Camisa Manga Comprida", it: "Maglia Manica Lunga", zh: "长袖球衣" }],
  ["Fourth", { nl: "Vierde", en: "Fourth", fr: "Quatrième", de: "Viertes", es: "Cuarta", pt: "Quarta", it: "Quarta", zh: "第四" }],
  ["Third", { nl: "Derde", en: "Third", fr: "Troisième", de: "Drittes", es: "Tercera", pt: "Terceira", it: "Terza", zh: "第三" }],
  ["Derde", { nl: "Derde", en: "Third", fr: "Troisième", de: "Drittes", es: "Tercera", pt: "Terceira", it: "Terza", zh: "第三" }],
  ["Home", { nl: "Thuis", en: "Home", fr: "Domicile", de: "Heim", es: "Local", pt: "Casa", it: "Casa", zh: "主场" }],
  ["Thuis", { nl: "Thuis", en: "Home", fr: "Domicile", de: "Heim", es: "Local", pt: "Casa", it: "Casa", zh: "主场" }],
  ["Away", { nl: "Uit", en: "Away", fr: "Extérieur", de: "Auswärts", es: "Visitante", pt: "Fora", it: "Trasferta", zh: "客场" }],
  ["Uit", { nl: "Uit", en: "Away", fr: "Extérieur", de: "Auswärts", es: "Visitante", pt: "Fora", it: "Trasferta", zh: "客场" }],
  ["Concept", { nl: "Concept", en: "Concept", fr: "Concept", de: "Konzept", es: "Concepto", pt: "Conceito", it: "Concept", zh: "概念版" }],
  ["Tribute", { nl: "Eerbetoon", en: "Tribute", fr: "Hommage", de: "Tribut", es: "Homenaje", pt: "Homenagem", it: "Tributo", zh: "致敬版" }],
  ["Retro", { nl: "Retro", en: "Retro", fr: "Rétro", de: "Retro", es: "Retro", pt: "Retrô", it: "Retro", zh: "复古" }],
  ["Windbreaker", { nl: "Windjack", en: "Windbreaker", fr: "Coupe-Vent", de: "Windjacke", es: "Cortavientos", pt: "Corta-Vento", it: "Giacca a Vento", zh: "风衣" }],
  ["Jacket", { nl: "Jack", en: "Jacket", fr: "Veste", de: "Jacke", es: "Chaqueta", pt: "Casaco", it: "Giacca", zh: "外套" }],
  ["Shorts", { nl: "Broekje", en: "Shorts", fr: "Short", de: "Hose", es: "Pantalón Corto", pt: "Calção", it: "Pantaloncini", zh: "球裤" }],
  ["Jersey", { nl: "Shirt", en: "Jersey", fr: "Maillot", de: "Trikot", es: "Camiseta", pt: "Camisa", it: "Maglia", zh: "球衣" }],
  ["Shirt", { nl: "Shirt", en: "Shirt", fr: "Maillot", de: "Trikot", es: "Camiseta", pt: "Camisa", it: "Maglia", zh: "球衣" }],
  ["Full Kit", { nl: "Compleet Tenue", en: "Full Kit", fr: "Tenue Complète", de: "Komplettes Trikotset", es: "Equipación Completa", pt: "Equipamento Completo", it: "Divisa Completa", zh: "全套球衣" }],
  ["Kit", { nl: "Tenue", en: "Kit", fr: "Tenue", de: "Trikotsatz", es: "Equipación", pt: "Equipamento", it: "Divisa", zh: "球衣套装" }],
  ["World Cup", { nl: "Wereldkampioenschap", en: "World Cup", fr: "Coupe du Monde", de: "Weltmeisterschaft", es: "Copa del Mundo", pt: "Copa do Mundo", it: "Coppa del Mondo", zh: "世界杯" }],
  ["Champions League", { nl: "Champions League", en: "Champions League", fr: "Ligue des Champions", de: "Champions League", es: "Liga de Campeones", pt: "Liga dos Campeões", it: "Champions League", zh: "欧冠" }],
  ["Conference League", { nl: "Conference League", en: "Conference League", fr: "Ligue Conférence", de: "Conference League", es: "Liga Conferencia", pt: "Liga Conferência", it: "Conference League", zh: "欧协联" }],
  ["Premier League", { nl: "Premier League", en: "Premier League", fr: "Premier League", de: "Premier League", es: "Premier League", pt: "Premier League", it: "Premier League", zh: "英超" }],
  ["League", { nl: "Competitie", en: "League", fr: "Ligue", de: "Liga", es: "Liga", pt: "Liga", it: "Lega", zh: "联赛" }],
  ["Final", { nl: "Finale", en: "Final", fr: "Finale", de: "Finale", es: "Final", pt: "Final", it: "Finale", zh: "决赛" }],
  ["Cup", { nl: "Beker", en: "Cup", fr: "Coupe", de: "Pokal", es: "Copa", pt: "Copa", it: "Coppa", zh: "杯赛" }],
  ["Editions", { nl: "Edities", en: "Editions", fr: "Éditions", de: "Editionen", es: "Ediciones", pt: "Edições", it: "Edizioni", zh: "版本" }],
  ["Edition", { nl: "Editie", en: "Edition", fr: "Édition", de: "Edition", es: "Edición", pt: "Edição", it: "Edizione", zh: "版本" }],
  ["Heritage", { nl: "Heritage", en: "Heritage", fr: "Patrimoine", de: "Heritage", es: "Herencia", pt: "Herança", it: "Heritage", zh: "传承" }],
  ["Archive", { nl: "Archief", en: "Archive", fr: "Archive", de: "Archiv", es: "Archivo", pt: "Arquivo", it: "Archivio", zh: "档案" }],
  ["Collection", { nl: "Collectie", en: "Collection", fr: "Collection", de: "Kollektion", es: "Colección", pt: "Coleção", it: "Collezione", zh: "系列" }],
  ["Authentic", { nl: "Authentic", en: "Authentic", fr: "Authentic", de: "Authentic", es: "Authentic", pt: "Authentic", it: "Authentic", zh: "球员版" }],
  ["Player Version", { nl: "Spelersversie", en: "Player Version", fr: "Version Joueur", de: "Spielerversion", es: "Versión Jugador", pt: "Versão Jogador", it: "Versione Player", zh: "球员版" }],
  ["Classic", { nl: "Klassiek", en: "Classic", fr: "Classique", de: "Klassisch", es: "Clásico", pt: "Clássico", it: "Classico", zh: "经典" }],
  ["Icons", { nl: "Icons", en: "Icons", fr: "Icônes", de: "Ikonen", es: "Iconos", pt: "Ícones", it: "Icone", zh: "传奇" }],
  ["Icon", { nl: "Icon", en: "Icon", fr: "Icône", de: "Ikone", es: "Icono", pt: "Ícone", it: "Icona", zh: "传奇" }],
  ["Terrace", { nl: "Terrace", en: "Terrace", fr: "Terrace", de: "Terrace", es: "Terrace", pt: "Terrace", it: "Terrace", zh: "看台风" }],
  ["Lifestyler", { nl: "Lifestyle", en: "Lifestyler", fr: "Lifestyle", de: "Lifestyle", es: "Lifestyle", pt: "Lifestyle", it: "Lifestyle", zh: "潮流款" }],
  ["Anniversary", { nl: "Jubileum", en: "Anniversary", fr: "Anniversaire", de: "Jubiläum", es: "Aniversario", pt: "Aniversário", it: "Anniversario", zh: "周年纪念" }],
  ["Years", { nl: "Jaar", en: "Years", fr: "Ans", de: "Jahre", es: "Años", pt: "Anos", it: "Anni", zh: "周年" }],
  ["Night", { nl: "Night", en: "Night", fr: "Nuit", de: "Nacht", es: "Noche", pt: "Noite", it: "Notte", zh: "夜色" }],
  ["Day", { nl: "Day", en: "Day", fr: "Jour", de: "Tag", es: "Día", pt: "Dia", it: "Giorno", zh: "日" }],
  ["Golden", { nl: "Gouden", en: "Golden", fr: "Doré", de: "Golden", es: "Dorado", pt: "Dourado", it: "Dorato", zh: "金色" }],
  ["Gold", { nl: "Goud", en: "Gold", fr: "Or", de: "Gold", es: "Oro", pt: "Ouro", it: "Oro", zh: "金" }],
  ["Black", { nl: "Zwart", en: "Black", fr: "Noir", de: "Schwarz", es: "Negro", pt: "Preto", it: "Nero", zh: "黑" }],
  ["Purple", { nl: "Paars", en: "Purple", fr: "Violet", de: "Lila", es: "Morado", pt: "Roxo", it: "Viola", zh: "紫" }],
  ["Pink", { nl: "Roze", en: "Pink", fr: "Rose", de: "Pink", es: "Rosa", pt: "Rosa", it: "Rosa", zh: "粉色" }],
  ["Long Sleeve", { nl: "Lange Mouwe Shirt", en: "Long Sleeve Shirt", fr: "Maillot Manches Longues", de: "Langarm Trikot", es: "Camiseta Manga Larga", pt: "Camisa Manga Comprida", it: "Maglia Manica Lunga", zh: "长袖球衣" }],
  ["GK", { nl: "Keeper", en: "Goalkeeper", fr: "Gardien", de: "Torwart", es: "Portero", pt: "Guarda-redes", it: "Portiere", zh: "门将" }],
];


/** Landen-/nationale teamnamen. */
const COUNTRIES: [string, Record<Lang, string>][] = [
  ["Netherlands", { nl: "Nederland", en: "Netherlands", fr: "Pays-Bas", de: "Niederlande", es: "Países Bajos", pt: "Países Baixos", it: "Paesi Bassi", zh: "荷兰" }],
  ["Holland", { nl: "Nederland", en: "Netherlands", fr: "Pays-Bas", de: "Niederlande", es: "Países Bajos", pt: "Países Baixos", it: "Paesi Bassi", zh: "荷兰" }],
  ["Nederland", { nl: "Nederland", en: "Netherlands", fr: "Pays-Bas", de: "Niederlande", es: "Países Bajos", pt: "Países Baixos", it: "Paesi Bassi", zh: "荷兰" }],
  ["Germany", { nl: "Duitsland", en: "Germany", fr: "Allemagne", de: "Deutschland", es: "Alemania", pt: "Alemanha", it: "Germania", zh: "德国" }],
  ["Duitsland", { nl: "Duitsland", en: "Germany", fr: "Allemagne", de: "Deutschland", es: "Alemania", pt: "Alemanha", it: "Germania", zh: "德国" }],
  ["Italy", { nl: "Italië", en: "Italy", fr: "Italie", de: "Italien", es: "Italia", pt: "Itália", it: "Italia", zh: "意大利" }],
  ["Italië", { nl: "Italië", en: "Italy", fr: "Italie", de: "Italien", es: "Italia", pt: "Itália", it: "Italia", zh: "意大利" }],
  ["Spain", { nl: "Spanje", en: "Spain", fr: "Espagne", de: "Spanien", es: "España", pt: "Espanha", it: "Spagna", zh: "西班牙" }],
  ["Spanje", { nl: "Spanje", en: "Spain", fr: "Espagne", de: "Spanien", es: "España", pt: "Espanha", it: "Spagna", zh: "西班牙" }],
  ["France", { nl: "Frankrijk", en: "France", fr: "France", de: "Frankreich", es: "Francia", pt: "França", it: "Francia", zh: "法国" }],
  ["Frankrijk", { nl: "Frankrijk", en: "France", fr: "France", de: "Frankreich", es: "Francia", pt: "França", it: "Francia", zh: "法国" }],
  ["England", { nl: "Engeland", en: "England", fr: "Angleterre", de: "England", es: "Inglaterra", pt: "Inglaterra", it: "Inghilterra", zh: "英格兰" }],
  ["Engeland", { nl: "Engeland", en: "England", fr: "Angleterre", de: "England", es: "Inglaterra", pt: "Inglaterra", it: "Inghilterra", zh: "英格兰" }],
  ["Portugal", { nl: "Portugal", en: "Portugal", fr: "Portugal", de: "Portugal", es: "Portugal", pt: "Portugal", it: "Portogallo", zh: "葡萄牙" }],
  ["Brazil", { nl: "Brazilië", en: "Brazil", fr: "Brésil", de: "Brasilien", es: "Brasil", pt: "Brasil", it: "Brasile", zh: "巴西" }],
  ["Brazilië", { nl: "Brazilië", en: "Brazil", fr: "Brésil", de: "Brasilien", es: "Brasil", pt: "Brasil", it: "Brasile", zh: "巴西" }],
  ["Argentina", { nl: "Argentinië", en: "Argentina", fr: "Argentine", de: "Argentinien", es: "Argentina", pt: "Argentina", it: "Argentina", zh: "阿根廷" }],
  ["Argentinië", { nl: "Argentinië", en: "Argentina", fr: "Argentine", de: "Argentinien", es: "Argentina", pt: "Argentina", it: "Argentina", zh: "阿根廷" }],
  ["Belgium", { nl: "België", en: "Belgium", fr: "Belgique", de: "Belgien", es: "Bélgica", pt: "Bélgica", it: "Belgio", zh: "比利时" }],
  ["België", { nl: "België", en: "Belgium", fr: "Belgique", de: "Belgien", es: "Bélgica", pt: "Bélgica", it: "Belgio", zh: "比利时" }],
  ["Croatia", { nl: "Kroatië", en: "Croatia", fr: "Croatie", de: "Kroatien", es: "Croacia", pt: "Croácia", it: "Croazia", zh: "克罗地亚" }],
  ["Morocco", { nl: "Marokko", en: "Morocco", fr: "Maroc", de: "Marokko", es: "Marruecos", pt: "Marrocos", it: "Marocco", zh: "摩洛哥" }],
  ["Japan", { nl: "Japan", en: "Japan", fr: "Japon", de: "Japan", es: "Japón", pt: "Japão", it: "Giappone", zh: "日本" }],
  ["Mexico", { nl: "Mexico", en: "Mexico", fr: "Mexique", de: "Mexiko", es: "México", pt: "México", it: "Messico", zh: "墨西哥" }],
  ["Turkey", { nl: "Turkije", en: "Turkey", fr: "Turquie", de: "Türkei", es: "Turquía", pt: "Turquia", it: "Turchia", zh: "土耳其" }],
  ["Poland", { nl: "Polen", en: "Poland", fr: "Pologne", de: "Polen", es: "Polonia", pt: "Polónia", it: "Polonia", zh: "波兰" }],
  ["Sweden", { nl: "Zweden", en: "Sweden", fr: "Suède", de: "Schweden", es: "Suecia", pt: "Suécia", it: "Svezia", zh: "瑞典" }],
  ["Denmark", { nl: "Denemarken", en: "Denmark", fr: "Danemark", de: "Dänemark", es: "Dinamarca", pt: "Dinamarca", it: "Danimarca", zh: "丹麦" }],
  ["Norway", { nl: "Noorwegen", en: "Norway", fr: "Norvège", de: "Norwegen", es: "Noruega", pt: "Noruega", it: "Norvegia", zh: "挪威" }],
  ["Switzerland", { nl: "Zwitserland", en: "Switzerland", fr: "Suisse", de: "Schweiz", es: "Suiza", pt: "Suíça", it: "Svizzera", zh: "瑞士" }],
  ["Austria", { nl: "Oostenrijk", en: "Austria", fr: "Autriche", de: "Österreich", es: "Austria", pt: "Áustria", it: "Austria", zh: "奥地利" }],
  ["Scotland", { nl: "Schotland", en: "Scotland", fr: "Écosse", de: "Schottland", es: "Escocia", pt: "Escócia", it: "Scozia", zh: "苏格兰" }],
  ["Ireland", { nl: "Ierland", en: "Ireland", fr: "Irlande", de: "Irland", es: "Irlanda", pt: "Irlanda", it: "Irlanda", zh: "爱尔兰" }],
  ["Wales", { nl: "Wales", en: "Wales", fr: "Pays de Galles", de: "Wales", es: "Gales", pt: "País de Gales", it: "Galles", zh: "威尔士" }],
  ["Greece", { nl: "Griekenland", en: "Greece", fr: "Grèce", de: "Griechenland", es: "Grecia", pt: "Grécia", it: "Grecia", zh: "希腊" }],
  ["Egypt", { nl: "Egypte", en: "Egypt", fr: "Égypte", de: "Ägypten", es: "Egipto", pt: "Egito", it: "Egitto", zh: "埃及" }],
  ["Nigeria", { nl: "Nigeria", en: "Nigeria", fr: "Nigéria", de: "Nigeria", es: "Nigeria", pt: "Nigéria", it: "Nigeria", zh: "尼日利亚" }],
  ["Algeria", { nl: "Algerije", en: "Algeria", fr: "Algérie", de: "Algerien", es: "Argelia", pt: "Argélia", it: "Algeria", zh: "阿尔及利亚" }],
  ["Senegal", { nl: "Senegal", en: "Senegal", fr: "Sénégal", de: "Senegal", es: "Senegal", pt: "Senegal", it: "Senegal", zh: "塞内加尔" }],
  ["South Korea", { nl: "Zuid-Korea", en: "South Korea", fr: "Corée du Sud", de: "Südkorea", es: "Corea del Sur", pt: "Coreia do Sul", it: "Corea del Sud", zh: "韩国" }],
  ["United States", { nl: "Verenigde Staten", en: "United States", fr: "États-Unis", de: "Vereinigte Staaten", es: "Estados Unidos", pt: "Estados Unidos", it: "Stati Uniti", zh: "美国" }],
  ["Colombia", { nl: "Colombia", en: "Colombia", fr: "Colombie", de: "Kolumbien", es: "Colombia", pt: "Colômbia", it: "Colombia", zh: "哥伦比亚" }],
  ["Uruguay", { nl: "Uruguay", en: "Uruguay", fr: "Uruguay", de: "Uruguay", es: "Uruguay", pt: "Uruguai", it: "Uruguay", zh: "乌拉圭" }],
  ["Chile", { nl: "Chili", en: "Chile", fr: "Chili", de: "Chile", es: "Chile", pt: "Chile", it: "Cile", zh: "智利" }],
  ["Serbia", { nl: "Servië", en: "Serbia", fr: "Serbie", de: "Serbien", es: "Serbia", pt: "Sérvia", it: "Serbia", zh: "塞尔维亚" }],
  ["Czech Republic", { nl: "Tsjechië", en: "Czech Republic", fr: "Tchéquie", de: "Tschechien", es: "Chequia", pt: "Chéquia", it: "Cechia", zh: "捷克" }],
  ["Russia", { nl: "Rusland", en: "Russia", fr: "Russie", de: "Russland", es: "Rusia", pt: "Rússia", it: "Russia", zh: "俄罗斯" }],
  ["China", { nl: "China", en: "China", fr: "Chine", de: "China", es: "China", pt: "China", it: "Cina", zh: "中国" }],
  ["Canada", { nl: "Canada", en: "Canada", fr: "Canada", de: "Kanada", es: "Canadá", pt: "Canadá", it: "Canada", zh: "加拿大" }],
  ["Australia", { nl: "Australië", en: "Australia", fr: "Australie", de: "Australien", es: "Australia", pt: "Austrália", it: "Australia", zh: "澳大利亚" }],
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildRules = (lang: Lang): [RegExp, string][] =>
  [...COUNTRIES, ...KIT].map(([term, map]) => [
    new RegExp(`(?<![\\p{L}])${escape(term)}(?![\\p{L}])`, "giu"),
    map[lang],
  ]);

const CACHE = new Map<Lang, [RegExp, string][]>();
const rulesFor = (lang: Lang) => {
  if (!CACHE.has(lang)) CACHE.set(lang, buildRules(lang));
  return CACHE.get(lang)!;
};

const translateName = (name: string, langRaw: string): string => {
  const base = ((langRaw || "nl").split("-")[0] as Lang);
  const lang: Lang = LANGS.includes(base) ? base : "nl";
  let out = name;
  // Ook de tekst tussen haakjes wordt vertaald (zelfde regels).
  for (const [re, val] of rulesFor(lang)) out = out.replace(re, val);
  // Verwijder de volgnummers achter dubbele shirtnamen (" 2", " 3", ...)
  out = out.replace(/\s+[2-9]\s*$/, "");
  // Voorkom dubbele woorden na vertaling (bv. "Shirt Shirt")
  out = out.replace(/\b(\p{L}+)(\s+\1)+\b/giu, "$1");
  return out.replace(/\s+/g, " ").trim();
};

/** Returns a function that translates an internal product name (id) to display name. */
export const useProductName = () => {
  const { i18n } = useTranslation();
  return (name: string): string => translateName(name, i18n.language);
};

export { translateName };
