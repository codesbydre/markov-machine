const {
  generateText,
  makeTextFromFile,
  makeTextFromUrl,
} = require("./makeText");
const fs = require("fs");
const axios = require("axios");
const { MarkovMachine } = require("./markov");

jest.mock("fs");
jest.mock("axios");
jest.mock("./markov");

describe("generateText", () => {
  test("Generate text using MarkovMachine", () => {
    const mockText = "This is some mock text.";
    const mockMarkovMachine = { makeText: jest.fn(() => mockText) };
    MarkovMachine.mockImplementation(() => mockMarkovMachine);

    generateText("some text");
    expect(mockMarkovMachine.makeText).toHaveBeenCalled();
  });
});

describe("makeTextFromFile", () => {
  test("Read a file and generate text", () => {
    const mockFileData = "This is some mock file data.";
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, mockFileData);
    });

    makeTextFromFile("filepath");
    expect(fs.readFile).toHaveBeenCalledWith(
      "filepath",
      "utf8",
      expect.any(Function)
    );
  });

  test("Log an error and exit process if the file cannot be read", () => {
    const mockError = new Error("Mock error.");
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(mockError, null);
    });
    console.error = jest.fn();
    const processExitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation(() => {});

    makeTextFromFile("filepath");
    expect(console.error).toHaveBeenCalledWith(
      `Cannot read file: filepath: ${mockError}`
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});

describe("makeTextFromUrl", () => {
  test("Fetch data from a URL and generate a text", async () => {
    const mockUrlData = "This is some mock URL data.";
    axios.get.mockResolvedValue({ data: mockUrlData });

    await makeTextFromUrl("http://example.com");
    expect(axios.get).toHaveBeenCalledWith("http://example.com");
  });

  test("Log an error and exit process if the request fails", async () => {
    const mockError = new Error("Mock error.");
    axios.get.mockRejectedValue(mockError);
    console.error = jest.fn();
    const processExitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation(() => {});

    await makeTextFromUrl("http://example.com");
    expect(console.error).toHaveBeenCalledWith(
      `Cannot make request to http://example.com: ${mockError}`
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
