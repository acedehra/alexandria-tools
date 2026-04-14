import { describe, it, expect } from "vitest";

describe("Text Counter Utilities", () => {
  function countChars(text: string): number {
    return text.length;
  }

  function countCharsNoSpaces(text: string): number {
    return text.replace(/\s/g, "").length;
  }

  function countWords(text: string): number {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  }

  function countLines(text: string): number {
    return text === "" ? 0 : text.split("\n").length;
  }

  function countParagraphs(text: string): number {
    return text.trim() === ""
      ? 0
      : text
          .trim()
          .split(/\n\s*\n/)
          .filter((p) => p.trim()).length;
  }

  function countSentences(text: string): number {
    return text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim()).length;
  }

  function avgWordLength(text: string): string {
    const charsNoSpaces = countCharsNoSpaces(text);
    const words = countWords(text);
    return words > 0 ? (charsNoSpaces / words).toFixed(1) : "0.0";
  }

  function readingTime(text: string): number {
    const words = countWords(text);
    return Math.ceil(words / 200);
  }

  describe("countChars", () => {
    it("counts all characters including spaces", () => {
      expect(countChars("hello world")).toBe(11);
    });

    it("returns 0 for empty string", () => {
      expect(countChars("")).toBe(0);
    });

    it("counts newlines and special characters", () => {
      expect(countChars("hello\nworld!")).toBe(12);
    });
  });

  describe("countCharsNoSpaces", () => {
    it("counts characters excluding spaces", () => {
      expect(countCharsNoSpaces("hello world")).toBe(10);
    });

    it("excludes tabs and newlines", () => {
      expect(countCharsNoSpaces("hello\t\nworld")).toBe(10);
    });

    it("returns 0 for whitespace only", () => {
      expect(countCharsNoSpaces(" \t\n")).toBe(0);
    });
  });

  describe("countWords", () => {
    it("counts words separated by whitespace", () => {
      expect(countWords("hello world test")).toBe(3);
    });

    it("returns 0 for empty string", () => {
      expect(countWords("")).toBe(0);
    });

    it("returns 0 for whitespace only", () => {
      expect(countWords("   ")).toBe(0);
    });

    it("handles multiple spaces between words", () => {
      expect(countWords("hello  world")).toBe(2);
    });
  });

  describe("countLines", () => {
    it("counts lines separated by newlines", () => {
      expect(countLines("line1\nline2\nline3")).toBe(3);
    });

    it("returns 0 for empty string", () => {
      expect(countLines("")).toBe(0);
    });

    it("returns 1 for single line", () => {
      expect(countLines("single line")).toBe(1);
    });

    it("handles trailing newline", () => {
      expect(countLines("line1\nline2\n")).toBe(3);
    });
  });

  describe("countParagraphs", () => {
    it("counts paragraphs separated by blank lines", () => {
      expect(countParagraphs("para1\n\npara2\n\npara3")).toBe(3);
    });

    it("returns 0 for empty string", () => {
      expect(countParagraphs("")).toBe(0);
    });

    it("returns 1 for single paragraph", () => {
      expect(countParagraphs("single paragraph with multiple lines\nstill same para")).toBe(1);
    });

    it("handles multiple blank lines", () => {
      expect(countParagraphs("para1\n\n\npara2")).toBe(2);
    });
  });

  describe("countSentences", () => {
    it("counts sentences ending with . ! ?", () => {
      expect(countSentences("Hello. World! Test?")).toBe(3);
    });

    it("returns 0 for empty string", () => {
      expect(countSentences("")).toBe(0);
    });

    it("handles multiple punctuation", () => {
      expect(countSentences("Hello... World!")).toBe(2);
    });

    it("filters empty results", () => {
      expect(countSentences("...")).toBe(0);
    });
  });

  describe("avgWordLength", () => {
    it("calculates average word length", () => {
      expect(avgWordLength("hello world")).toBe("5.0");
    });

    it("handles different word lengths", () => {
      expect(avgWordLength("a bb ccc")).toBe("2.0");
    });

    it("returns 0.0 for empty string", () => {
      expect(avgWordLength("")).toBe("0.0");
    });
  });

  describe("readingTime", () => {
    it("calculates reading time in minutes (200 wpm)", () => {
      expect(readingTime("word ".repeat(200).trim())).toBe(1);
    });

    it("rounds up partial minutes", () => {
      expect(readingTime("word ".repeat(201).trim())).toBe(2);
    });

    it("returns 0 for empty text", () => {
      expect(readingTime("")).toBe(0);
    });
  });
});
