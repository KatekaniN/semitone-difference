const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const { JamBuddy } = require("../src/jam_buddy.js");

beforeAll(function () {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf8"
  );
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.buddy = new JamBuddy();
  require("../src/jam_buddy_gui.js");
});

describe("JamBuddy Game", function () {
  let note1, note2, result, randomizeBtn, answerInput, submitBtn, resultMessage;
  let buddy;

  beforeEach(function () {
    resultMessage = require("../src/jam_buddy_gui.js").resultMessage;
    note1 = document.getElementById("note1");
    note2 = document.getElementById("note2");
    result = document.getElementById("result");
    randomizeBtn = document.getElementById("randomize");
    answerInput = document.getElementById("answer");
    submitBtn = document.getElementById("submit");
    answerForm = document.getElementById("answer-form");
    jasmine.clock().install();
    buddy = new JamBuddy();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  it("should display two random notes when page loads", function () {
    expect(note1.textContent).not.toBe("");
    expect(note2.textContent).not.toBe("");
    expect(note1.textContent).not.toEqual(note2.textContent);
  });

  it("should display two random notes when 'Get Random Notes' button is clicked", function () {
    randomizeBtn.click();
    expect(note1.textContent).not.toBe("");
    expect(note2.textContent).not.toBe("");
    expect(note1.textContent).not.toEqual(note2.textContent);
  });

  it("should clear the result message when 'Get Random Notes' button is clicked", function () {
    result.textContent = "Some result message";
    randomizeBtn.click();
    expect(result.textContent).toBe("");
  });

  it("should clear the result message after 3 seconds", function () {
    answerInput.value = 12;
    submitBtn.click();
    expect(result.textContent).toBe(resultMessage.outOfRange);
    jasmine.clock().tick(3000);
    expect(result.textContent).toBe("");
  });

  it("should call buddy.randomizeCurrentNotes when 'Get Random Notes' button is clicked", async function () {
    spyOn(JamBuddy.prototype, "randomizeCurrentNotes").and.callThrough();
    const randomizePromise = new Promise((resolve) => {
      randomizeBtn.addEventListener(
        "click",
        () => {
          resolve();
        },
        { once: true }
      );
    });
    randomizeBtn.click();
    await randomizePromise;
    expect(JamBuddy.prototype.randomizeCurrentNotes).toHaveBeenCalledTimes(1);
  });

  describe("Answer Submission", function () {
    let correctInterval;

    beforeEach(function () {
      buddy.randomizeCurrentNotes();
      correctInterval = Math.abs(
        buddy.allNotes[note1.textContent] - buddy.allNotes[note2.textContent]
      );
    });

    it("should display 'Correct!' when the correct answer is submitted", function () {
      answerInput.value = correctInterval;
      submitBtn.click();
      expect(result.textContent).toBe(resultMessage.correct);
    });

    it("should clear the input field after displaying an answer", function () {
      answerInput.value = correctInterval;
      submitBtn.click();
      expect(result.textContent).toBe(resultMessage.correct);
      expect(answerInput.value).toBe("");
    });

    it("should display 'Incorrect! when the incorrect answer is submitted", function () {
      if (correctInterval === 0) {
        answerInput.value = correctInterval + 1;
      } else {
        answerInput.value = correctInterval - 1;
      }
      submitBtn.click();
      expect(result.textContent).toBe(resultMessage.incorrect);
    });

    it("should display an out-of-range error when answer is not between min and max values", function () {
      answerInput.value = -1;
      submitBtn.click();
      expect(result.textContent).toBe(resultMessage.outOfRange);

      answerInput.value = 12;
      submitBtn.click();
      expect(result.textContent).toBe(resultMessage.outOfRange);
    });

    it("should call buddy.checkAnswer when the submit button is clicked", async function () {
      spyOn(JamBuddy.prototype, "checkAnswer").and.callThrough();
      answerInput.value = correctInterval;

      const submitPromise = new Promise((resolve) => {
        answerForm.addEventListener("submit", (event) => {
          event.preventDefault();
          resolve();
        });
      });

      submitBtn.click();
      await submitPromise;

      expect(JamBuddy.prototype.checkAnswer).toHaveBeenCalledOnceWith(
        correctInterval
      );
    });
  });
});
