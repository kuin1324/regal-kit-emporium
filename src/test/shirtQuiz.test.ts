import { describe, it, expect } from "vitest";
import { allCollectieItems } from "@/lib/collection";
import { buildShirtQuiz, quizScore, teamFacts } from "@/lib/shirtQuiz";

describe("shirt quizzes", () => {
  it("gives every catalog item a quiz with at least three unambiguous questions", () => {
    expect(allCollectieItems.length).toBeGreaterThan(2000);
    for (const product of allCollectieItems) {
      const quiz = buildShirtQuiz(product);
      expect(quiz.length, product.name).toBeGreaterThanOrEqual(3);
      for (const question of quiz) {
        expect(question.options.length, product.name).toBe(4);
        expect(question.options.filter(option => option === question.answer)).toHaveLength(1);
        expect(new Set(question.options).size).toBe(4);
        expect(question.explanation.length).toBeGreaterThan(0);
      }
    }
  });
  it("uses actual shirt labels without claiming a concept shirt was worn in matches", () => {
    const quiz = buildShirtQuiz({ name: "Colombia Special Edition Shirt 2026", team: "Colombia", sizes: ["S", "M", "L"] });
    expect(quiz.find(q => q.id === "team")?.answer).toBe("Colombia");
    expect(quiz.find(q => q.id === "season")?.answer).toBe("2026");
    expect(quiz.find(q => q.id === "type")?.answer).toBe("Special edition / concept");
    expect(quiz.filter(q => q.id.startsWith("fact"))).toHaveLength(0);
  });
  it("keeps historical answers tied to verified official facts", () => {
    expect(teamFacts.find(fact => fact.teams.includes("FC Barcelona"))?.answer).toBe("1899");
    expect(teamFacts.find(fact => fact.teams.includes("PSG"))?.answer).toBe("1970");
    expect(teamFacts.find(fact => fact.teams.includes("Liverpool"))?.answer).toBe("Anfield");
    for (const fact of teamFacts) expect(fact.source.url).toMatch(/^https:\/\//);
  });
  it("scores only correct submitted answers", () => {
    const quiz = buildShirtQuiz({ name: "Ajax Home Shirt 25-26", team: "Ajax", sizes: ["M"] });
    expect(quizScore(quiz, [])).toBe(0);
    expect(quizScore(quiz, quiz.map(q => q.answer))).toBe(quiz.length);
    expect(quizScore(quiz, [quiz[0].answer, "incorrect"])).toBe(1);
  });
});