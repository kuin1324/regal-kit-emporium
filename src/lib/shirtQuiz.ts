import { verifiedTeamFacts } from "./shirtQuizFacts";

export interface QuizProduct {
  name: string;
  team: string;
  sizes: readonly string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  source?: { label: string; url: string };
}

export interface TeamFact {
  teams: string[];
  prompt: string;
  answer: string;
  alternatives: string[];
  explanation: string;
  source: { label: string; url: string };
}

// Historical questions are added only from checked official sources.
export const teamFacts: TeamFact[] = verifiedTeamFacts;

const hash = (value: string) => Array.from(value).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 0);

const question = (product: QuizProduct, data: Omit<QuizQuestion, "options"> & { alternatives: string[] }): QuizQuestion => {
  const options = Array.from(new Set([data.answer, ...data.alternatives])).slice(0, 4);
  const offset = hash(`${product.name}:${data.id}`) % options.length;
  const { alternatives: _alternatives, ...rest } = data;
  return { ...rest, options: [...options.slice(offset), ...options.slice(0, offset)] };
};

export function buildShirtQuiz(product: QuizProduct): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  if (product.team.trim()) {
    questions.push(question(product, {
      id: "team", prompt: "Which team is this item listed under?", answer: product.team,
      alternatives: ["Ajax", "Brazil", "AC Milan", "Japan"].filter(team => team !== product.team),
      explanation: `This item is listed under ${product.team} in our collection.`,
    }));
  }

  // Read the literal label, not inferred release dates or competition appearances.
  const season = product.name.match(/\b(?:19|20)\d{2}\s*[-–/]\s*(?:\d{4}|\d{2})\b|\b\d{2}\s*[-–/]\s*\d{2}\b|\b(?:19|20)\d{2}\b/);
  if (season) {
    const answer = season[0].replace(/\s/g, "");
    questions.push(question(product, {
      id: "season", prompt: "Which season or year appears in this item's name?", answer,
      alternatives: ["1998-99", "2010-11", "2020-21", "2024"].filter(value => value !== answer),
      explanation: `The collection name is “${product.name}”, which includes ${answer}. This is the product label, not a claim about when it was worn in matches.`,
    }));
  }

  const type = /\bshorts?\b/i.test(product.name) ? "Shorts"
    : /\bfull\s*kit\b/i.test(product.name) ? "Full kit"
    : /goalkeeper/i.test(product.name) ? "Goalkeeper"
    : /special\s*edition|concept/i.test(product.name) ? "Special edition / concept"
    : /training|pre[-\s]?match/i.test(product.name) ? "Training / pre-match"
    : /\bhome\b/i.test(product.name) ? "Home"
    : /\baway\b/i.test(product.name) ? "Away"
    : /\bthird\b/i.test(product.name) ? "Third" : null;
  if (type) {
    questions.push(question(product, {
      id: "type", prompt: "Which label is used for this item in its name?", answer: type,
      alternatives: ["Home", "Away", "Goalkeeper", "Training / pre-match"].filter(value => value !== type),
      explanation: `“${product.name}” identifies this item as ${type.toLowerCase()}. Special edition or concept labels do not establish that a design was an official match kit.`,
    }));
  }

  for (const fact of teamFacts.filter(fact => fact.teams.includes(product.team))) {
    questions.push(question(product, { id: `fact-${questions.length}`, ...fact }));
  }

  if (questions.length < 3 && product.sizes.length) {
    const unavailable = ["XXXS", "8XL", "9XL", "10XL"].filter(size => !product.sizes.includes(size));
    questions.push(question(product, {
      id: "size", prompt: "Which size is listed as an option for this item?", answer: product.sizes[0],
      alternatives: unavailable,
      explanation: `The listed sizes for this item are ${product.sizes.join(", ")}.`,
    }));
  }
  // Reliable universal football rules; these do not imply any shirt was worn in a match.
  questions.push(question(product, {
    id: "players", prompt: "In standard association football, how many players can one team have on the pitch?", answer: "11",
    alternatives: ["9", "10", "12"], explanation: "IFAB Law 3 allows a maximum of eleven players per team, including one goalkeeper.",
    source: { label: "IFAB · Law 3", url: "https://www.theifab.com/laws/latest/the-players/" },
  }));
  return questions;
}

export const quizScore = (questions: readonly QuizQuestion[], answers: readonly (string | null)[]) =>
  questions.reduce((score, item, index) => score + (answers[index] === item.answer ? 1 : 0), 0);