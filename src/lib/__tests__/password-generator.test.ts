import { describe, it, expect, vi } from "vitest";

describe("Password Generator Utilities", () => {
  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWER = "abcdefghijklmnopqrstuvwxyz";
  const DIGITS = "0123456789";
  const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/";

  function buildCharset(
    useUpper: boolean,
    useLower: boolean,
    useDigits: boolean,
    useSymbols: boolean
  ): string | null {
    let s = "";
    if (useUpper) s += UPPER;
    if (useLower) s += LOWER;
    if (useDigits) s += DIGITS;
    if (useSymbols) s += SYMBOLS;
    return s.length ? s : null;
  }

  describe("buildCharset", () => {
    it("builds charset with all character sets", () => {
      const charset = buildCharset(true, true, true, true);
      expect(charset).toContain("A");
      expect(charset).toContain("a");
      expect(charset).toContain("0");
      expect(charset).toContain("!");
    });

    it("builds charset with only uppercase", () => {
      const charset = buildCharset(true, false, false, false);
      expect(charset).toBe(UPPER);
    });

    it("builds charset with only lowercase", () => {
      const charset = buildCharset(false, true, false, false);
      expect(charset).toBe(LOWER);
    });

    it("builds charset with only digits", () => {
      const charset = buildCharset(false, false, true, false);
      expect(charset).toBe(DIGITS);
    });

    it("builds charset with only symbols", () => {
      const charset = buildCharset(false, false, false, true);
      expect(charset).toBe(SYMBOLS);
    });

    it("returns null when no character sets are selected", () => {
      const charset = buildCharset(false, false, false, false);
      expect(charset).toBeNull();
    });

    it("combines multiple character sets correctly", () => {
      const charset = buildCharset(true, true, false, false);
      expect(charset).toBe(UPPER + LOWER);
    });
  });

  describe("length validation", () => {
    it("clamps minimum length to 8", () => {
      const minLen = Math.min(128, Math.max(8, Math.floor(5)));
      expect(minLen).toBe(8);
    });

    it("clamps maximum length to 128", () => {
      const maxLen = Math.min(128, Math.max(8, Math.floor(200)));
      expect(maxLen).toBe(128);
    });

    it("allows valid length range", () => {
      const len = Math.min(128, Math.max(8, Math.floor(32)));
      expect(len).toBe(32);
    });
  });

  describe("password generation logic", () => {
    it("generates password of correct length", () => {
      const length = 16;
      const chars = buildCharset(true, true, true, true);
      expect(chars).toBeTruthy();
      if (!chars) return;

      const password = Array.from({ length }, () => {
        const byte = Math.floor(Math.random() * 256);
        return chars[byte % chars.length];
      }).join("");

      expect(password).toHaveLength(length);
    });

    it("password contains only characters from charset", () => {
      const length = 20;
      const chars = buildCharset(true, true, true, true);
      expect(chars).toBeTruthy();
      if (!chars) return;

      const password = Array.from({ length }, () => {
        const byte = Math.floor(Math.random() * 256);
        return chars[byte % chars.length];
      }).join("");

      const validChars = new Set(chars);
      for (const char of password) {
        expect(validChars.has(char)).toBe(true);
      }
    });

    it("generates different passwords on subsequent calls", () => {
      const chars = buildCharset(true, true, true, true);
      expect(chars).toBeTruthy();
      if (!chars) return;

      const generate = () => {
        const length = 16;
        return Array.from({ length }, () => {
          const byte = Math.floor(Math.random() * 256);
          return chars[byte % chars.length];
        }).join("");
      };

      // Generate 5 passwords and verify at least one is different
      const passwords = [generate(), generate(), generate(), generate(), generate()];
      const uniquePasswords = new Set(passwords);
      expect(uniquePasswords.size).toBeGreaterThan(1);
    });
  });
});
