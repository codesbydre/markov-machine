const { MarkovMachine } = require("./markov");

describe("MarkovMachine Class", () => {
  let mm;

  beforeEach(() => {
    mm = new MarkovMachine("the cat in the hat");
  });

  test("Words are split correctly", () => {
    expect(mm.words).toEqual(["the", "cat", "in", "the", "hat"]);
  });
  test("Chains are created correctly", () => {
    expect(mm.chains).toEqual({
      the: ["cat", "hat"],
      cat: ["in"],
      in: ["the"],
      hat: [null],
    });
  });
  test("Generated text has correct number of words", () => {
    expect(mm.makeText(10).split(" ").length).toBe(10);
  });
  test("Generated text starts with a word from the original text", () => {
    expect(mm.words).toContain(mm.makeText(10).split(" ")[0]);
  });
});
