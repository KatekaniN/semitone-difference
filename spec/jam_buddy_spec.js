const { errorMessages, JamBuddy } = require("../src/jam_buddy.js");

describe("JamBuddy", () => {
  let buddy;

  beforeEach(() => {
    buddy = new JamBuddy();
  });

  describe("Initialization", () => {
    it("should initialize with all notes", () => {
      expect(buddy.allNotes).toEqual({
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
      });
    });

    it("should initialize with no current notes", () => {
      expect(buddy.notes).toEqual([]);
    });
  });

  describe("setCurrentNotes", () => {
    it("should set valid current notes", () => {
      buddy.setCurrentNotes(["Db", "G"]);
      expect(buddy.getCurrentNotes()).toEqual(["Db", "G"]);
    });

    it("should throw an error if an invalid note is entered", () => {
      expect(() => buddy.setCurrentNotes(["A", "B#"])).toThrowError(
        errorMessages.invalidNote
      );
    });

    it("should throw an error if less than two notes are provided", () => {
      expect(() => buddy.setCurrentNotes(["A"])).toThrowError(
        errorMessages.inputTwoNotes
      );
    });

    it("should throw an error if more than two notes are provided", () => {
      expect(() => buddy.setCurrentNotes(["A", "C#", "D"])).toThrowError(
        errorMessages.inputTwoNotes
      );
    });
  });

  describe("getCurrentNotes", () => {
    it("should return the current notes if set", () => {
      buddy.setCurrentNotes(["A", "C#"]);
      expect(buddy.getCurrentNotes()).toEqual(["A", "C#"]);
    });

    it("should throw an error if no notes are set", () => {
      expect(() => buddy.getCurrentNotes()).toThrowError(
        errorMessages.noNoteSet
      );
    });
  });

  describe("randomizeCurrentNotes", () => {
    it("should randomize current notes to two unique notes", () => {
      buddy.randomizeCurrentNotes();
      const notes = buddy.getCurrentNotes();
      expect(notes.length).toBe(2);
      expect(notes[0]).not.toEqual(notes[1]);
    });
  });

  describe("checkAnswer", () => {
    it("should return true for a correct clockwise distance", () => {
      buddy.setCurrentNotes(["A", "C#"]);
      expect(buddy.checkAnswer(4)).toBe(true);
    });

    it("should return true for a correct anticlockwise distance", () => {
      buddy.setCurrentNotes(["A", "C#"]);
      expect(buddy.checkAnswer(8)).toBe(true);
    });

    it("should return false for an incorrect distance", () => {
      buddy.setCurrentNotes(["A", "C#"]);
      expect(buddy.checkAnswer(3)).toBe(false);
    });

    it("should throw an error if no notes are set", () => {
      expect(() => buddy.checkAnswer(1)).toThrowError(
        errorMessages.noPresetNotes
      );
    });
  });
});
