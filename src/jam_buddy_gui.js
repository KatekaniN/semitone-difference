const { JamBuddy } = require("../src/jam_buddy.js");
const buddy = new JamBuddy();

const resultMessage = {
  outOfRange: "Out of range! Enter a value between 0 and 11.",
  correct: "Correct! Well done ⭐️",
  incorrect: "Incorrect! Try Again 😬",
};4

function randomizeNotes() {
  const notes = buddy.randomizeCurrentNotes();
  const note1 = document.getElementById("note1");
  const note2 = document.getElementById("note2");
  note1.innerHTML = notes[0];
  note2.innerHTML = notes[1];
  clearResult();
}

const minInterval = 0;
const maxInterval = 11;

function submitAnswer(event) {
  event.preventDefault();
  const input = document.getElementById("answer");
  const answer = parseInt(input.value);
  const result = document.getElementById("result");

  if (isNaN(answer) || answer < minInterval || answer > maxInterval) {
    result.style.color = "#FF0101";
    result.innerHTML = resultMessage.outOfRange;
    setTimeout(clearResult, 3000);
    input.value = "";
    return;
  }

  const checkAnswer = buddy.checkAnswer(answer);
  if (checkAnswer) {
    result.style.color = "#F471B7";
    result.innerHTML = resultMessage.correct;
  } else {
    result.style.color = "#FF0101";
    result.innerHTML = resultMessage.incorrect;
  }

  setTimeout(clearResult, 3000);
  input.value = "";
}

function clearResult() {
  const result = document.getElementById("result");
  result.innerHTML = "";
}

randomizeNotes();

const randomNotesBtn = document.getElementById("randomize");
randomNotesBtn.addEventListener("click", randomizeNotes);

const answerForm = document.getElementById("answer-form");
answerForm.addEventListener("submit", submitAnswer);

module.exports = { resultMessage };
