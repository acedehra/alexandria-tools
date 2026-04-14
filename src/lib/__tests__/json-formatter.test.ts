import { describe, it, expect } from "vitest";

describe("JSON Formatter Utilities", () => {
  function formatJson(input: string, pretty: boolean): { output: string; error: string | null } {
    const trimmed = input.trim();
    if (!trimmed) {
      return { output: "", error: null };
    }
    try {
      const parsed = JSON.parse(trimmed);
      const output = pretty ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
      return { output, error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }

  describe("formatJson - pretty formatting", () => {
    it("prettifies valid JSON with 2-space indentation", () => {
      const result = formatJson('{"name":"test","value":123}', true);
      expect(result.error).toBeNull();
      expect(result.output).toBe('{\n  "name": "test",\n  "value": 123\n}');
    });

    it("handles nested objects", () => {
      const result = formatJson('{"outer":{"inner":"value"}}', true);
      expect(result.error).toBeNull();
      expect(result.output).toBe('{\n  "outer": {\n    "inner": "value"\n  }\n}');
    });

    it("handles arrays", () => {
      const result = formatJson("[1,2,3]", true);
      expect(result.error).toBeNull();
      expect(result.output).toBe("[\n  1,\n  2,\n  3\n]");
    });

    it("handles empty objects and arrays", () => {
      expect(formatJson("{}", true).output).toBe("{}");
      expect(formatJson("[]", true).output).toBe("[]");
    });
  });

  describe("formatJson - minify", () => {
    it("minifies JSON without whitespace", () => {
      const result = formatJson('{\n  "name": "test",\n  "value": 123\n}', false);
      expect(result.error).toBeNull();
      expect(result.output).toBe('{"name":"test","value":123}');
    });

    it("handles already minified JSON", () => {
      const result = formatJson('{"test":123}', false);
      expect(result.error).toBeNull();
      expect(result.output).toBe('{"test":123}');
    });
  });

  describe("formatJson - error handling", () => {
    it("returns empty output and error message for invalid JSON", () => {
      const result = formatJson("{invalid}", true);
      expect(result.output).toBe("");
      expect(result.error).toBeTruthy();
      expect(result.error).toBeDefined();
    });

    it("handles trailing commas (invalid JSON)", () => {
      const result = formatJson('{"key":"value",}', true);
      expect(result.output).toBe("");
      expect(result.error).toBeTruthy();
    });

    it("handles unquoted keys (invalid JSON)", () => {
      const result = formatJson('{key:"value"}', true);
      expect(result.output).toBe("");
      expect(result.error).toBeTruthy();
    });

    it("handles single quotes (invalid JSON)", () => {
      const result = formatJson("{'key':'value'}", true);
      expect(result.output).toBe("");
      expect(result.error).toBeTruthy();
    });
  });

  describe("formatJson - edge cases", () => {
    it("returns empty output for empty input", () => {
      const result = formatJson("", true);
      expect(result.output).toBe("");
      expect(result.error).toBeNull();
    });

    it("returns empty output for whitespace only", () => {
      const result = formatJson("   \n\t  ", true);
      expect(result.output).toBe("");
      expect(result.error).toBeNull();
    });

    it("handles JSON with special characters", () => {
      const result = formatJson('{"text":"Hello\\nWorld\\t!"}', true);
      expect(result.error).toBeNull();
      expect(result.output).toBe('{\n  "text": "Hello\\nWorld\\t!"\n}');
    });

    it("handles Unicode characters", () => {
      const result = formatJson('{"emoji":"🎉","chinese":"你好"}', true);
      expect(result.error).toBeNull();
      expect(result.output).toContain("🎉");
      expect(result.output).toContain("你好");
    });

    it("handles null, boolean, and number values", () => {
      const result = formatJson('{"null":null,"bool":true,"num":42.5}', true);
      expect(result.error).toBeNull();
      expect(result.output).toBe('{\n  "null": null,\n  "bool": true,\n  "num": 42.5\n}');
    });
  });
});
