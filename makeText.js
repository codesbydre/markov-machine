/** Command-line tool to generate Markov text. */
const fs = require("fs");
const axios = require("axios");
const { MarkovMachine } = require("./markov");

function generateText(text) {
  let mm = new MarkovMachine(text);
  console.log(mm.makeText());
}

function makeTextFromFile(path) {
  fs.readFile(path, "utf8", function (err, data) {
    if (err) {
      console.error(`Cannot read file: ${path}: ${err}`);
      process.exit(1);
    } else {
      generateText(data);
    }
  });
}

async function makeTextFromUrl(url) {
  try {
    let resp = await axios.get(url);
    generateText(resp.data);
  } catch (err) {
    console.error(`Cannot make request to ${url}: ${err}`);
    process.exit(1);
  }
}

function makeTextFromInput() {
  let method = process.argv[2];
  let source = process.argv[3];

  switch (method) {
    case "file":
      return makeTextFromFile(source);
    case "url":
      return makeTextFromUrl(source);
    default:
      console.error(`Unknown method: ${method}`);
      process.exit(1);
  }
}

// makeTextFromInput();
if (process.env.NODE_ENV !== "test") makeTextFromInput();

module.exports = { generateText, makeTextFromFile, makeTextFromUrl };
