class JamBuddy {
  constructor() {
    this.allNotes = {
      A: 0,
      "A#": 1,
      Bb: 1,
      B: 2,
      C: 3,
      "C#": 4,
      Db: 4,
      D: 5,
      "D#": 6,
      Eb: 6,
      E: 7,
      F: 8,
      "F#": 9,
      Gb: 9,
      G: 10,
      "G#": 11,
      Ab: 11,
    };
    this.notes = [];
  }

  setCurrentNotes(inputNotes) {
    if (inputNotes.length !== 2) {
      throw new Error(errorMessages.inputTwoNotes);
    }
    const uniqueNotes = new Set(inputNotes);
    if (uniqueNotes.size !== 2) {
      throw new Error(errorMessages.notesShouldBeUnique);
    }
    for (let note of inputNotes) {
      if (!this.allNotes.hasOwnProperty(note)) {
        throw new Error(errorMessages.invalidNote);
      }
    }
    this.notes = inputNotes;
  }

  getCurrentNotes() {
    if (this.notes.length < 2) {
      throw new Error(errorMessages.noNoteSet);
    }
    return this.notes;
  }

  randomizeCurrentNotes() {
    const noteKeys = Object.keys(this.allNotes);
    let note1, note2;
    do {
      note1 = noteKeys[Math.floor(Math.random() * noteKeys.length)];
      note2 = noteKeys[Math.floor(Math.random() * noteKeys.length)];
    } while (note1 === note2);

    this.notes = [note1, note2];
    return this.notes;
  }
  adjustNegativeValue(value) {
    if (value < 0) {
      value += 12;
    }
    return value;
  }
  checkAnswer(int) {
    if (this.notes.length !== 2) {
      throw new Error(errorMessages.noPresetNotes);
    }
    const indexNoteOne = this.allNotes[this.notes[0]];
    const indexNoteTwo = this.allNotes[this.notes[1]];

    let clockwiseDistance = 0;
    let anticlockwiseDistance = 0;

    if (indexNoteOne === indexNoteTwo) {
      clockwiseDistance = 0;
      anticlockwiseDistance = 12;
    } else {
      clockwiseDistance = this.adjustNegativeValue(indexNoteTwo - indexNoteOne);
      anticlockwiseDistance = this.adjustNegativeValue(
        indexNoteOne - indexNoteTwo
      );
    }

    return int === anticlockwiseDistance || int === clockwiseDistance;
  }
}

const errorMessages = {
  inputTwoNotes: "Exactly two notes must be provided",
  invalidNote: `Invalid note entered`,
  noNoteSet: "No notes set available",
  noPresetNotes: "Notes must be set before checking answer",
  notesShouldBeUnique: "Notes should be unique",
};
module.exports = { errorMessages, JamBuddy };
