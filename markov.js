/** Textual markov chain generator */

class MarkovMachine {
  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter((c) => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    let chains = {};

    for (let i = 0; i < this.words.length; i++) {
      let word = this.words[i];
      let nextWord = this.words[i + 1] || null;

      if (!chains[word]) {
        chains[word] = [];
      }
      chains[word].push(nextWord);
    }
    this.chains = chains;
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    let keys = Object.keys(this.chains);
    let key = keys[Math.floor(Math.random() * keys.length)];
    let out = [];

    while (out.length < numWords) {
      out.push(key);
      let wordChoices = this.chains[key];
      key = wordChoices[Math.floor(Math.random() * wordChoices.length)];

      if (key === null) {
        keys = Object.keys(this.chains);
        key = keys[Math.floor(Math.random() * keys.length)];
      }
    }
    return out.join(" ");
  }
}

module.exports = { MarkovMachine };
