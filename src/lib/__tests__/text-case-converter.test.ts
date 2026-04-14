import { describe, it, expect } from "vitest";

describe("Text Case Converter Utilities", () => {
  function toCamelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
      .replace(/^(.)/, (char) => char.toLowerCase());
  }

  function toPascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
      .replace(/^(.)/, (char) => char.toUpperCase());
  }

  function toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  }

  function toSnakeCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[\s-]+/g, "_")
      .toLowerCase();
  }

  function toUpperCase(str: string): string {
    return str.toUpperCase().replace(/\s+/g, "_");
  }

  function toLowerCase(str: string): string {
    return str.toLowerCase().replace(/\s+/g, "_");
  }

  function toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  function toSentenceCase(str: string): string {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  }

  describe("toCamelCase", () => {
    it("converts space-separated words to camelCase", () => {
      expect(toCamelCase("hello world")).toBe("helloWorld");
    });

    it("converts kebab-case to camelCase", () => {
      expect(toCamelCase("hello-world")).toBe("helloWorld");
    });

    it("converts snake_case to camelCase", () => {
      expect(toCamelCase("hello_world")).toBe("helloWorld");
    });

    it("handles multiple spaces and separators", () => {
      expect(toCamelCase("hello--world__test")).toBe("helloWorldTest");
    });

    it("returns empty string for empty input", () => {
      expect(toCamelCase("")).toBe("");
    });
  });

  describe("toPascalCase", () => {
    it("converts space-separated words to PascalCase", () => {
      expect(toPascalCase("hello world")).toBe("HelloWorld");
    });

    it("converts kebab-case to PascalCase", () => {
      expect(toPascalCase("hello-world")).toBe("HelloWorld");
    });

    it("converts snake_case to PascalCase", () => {
      expect(toPascalCase("hello_world")).toBe("HelloWorld");
    });
  });

  describe("toKebabCase", () => {
    it("converts camelCase to kebab-case", () => {
      expect(toKebabCase("helloWorld")).toBe("hello-world");
    });

    it("converts spaces to kebab-case", () => {
      expect(toKebabCase("hello world")).toBe("hello-world");
    });

    it("converts snake_case to kebab-case", () => {
      expect(toKebabCase("hello_world")).toBe("hello-world");
    });
  });

  describe("toSnakeCase", () => {
    it("converts camelCase to snake_case", () => {
      expect(toSnakeCase("helloWorld")).toBe("hello_world");
    });

    it("converts spaces to snake_case", () => {
      expect(toSnakeCase("hello world")).toBe("hello_world");
    });

    it("converts kebab-case to snake_case", () => {
      expect(toSnakeCase("hello-world")).toBe("hello_world");
    });
  });

  describe("toUpperCase", () => {
    it("converts to uppercase with underscores for spaces", () => {
      expect(toUpperCase("hello world")).toBe("HELLO_WORLD");
    });

    it("handles multiple spaces", () => {
      expect(toUpperCase("hello  world")).toBe("HELLO_WORLD");
    });
  });

  describe("toLowerCase", () => {
    it("converts to lowercase with underscores for spaces", () => {
      expect(toLowerCase("HELLO WORLD")).toBe("hello_world");
    });

    it("handles multiple spaces", () => {
      expect(toLowerCase("HELLO  WORLD")).toBe("hello_world");
    });
  });

  describe("toTitleCase", () => {
    it("converts to title case", () => {
      expect(toTitleCase("hello world")).toBe("Hello World");
    });

    it("handles ALL CAPS", () => {
      expect(toTitleCase("HELLO WORLD")).toBe("Hello World");
    });

    it("preserves non-word characters", () => {
      expect(toTitleCase("hello-world_test")).toBe("Hello-world_test");
    });
  });

  describe("toSentenceCase", () => {
    it("converts to sentence case", () => {
      expect(toSentenceCase("HELLO WORLD")).toBe("Hello world");
    });

    it("capitalizes after sentence endings", () => {
      expect(toSentenceCase("hello. world. test")).toBe("Hello. World. Test");
    });

    it("handles exclamation and question marks", () => {
      expect(toSentenceCase("hello! world? test."))?.toBe("Hello! World? Test.");
    });

    it("handles leading spaces", () => {
      expect(toSentenceCase("  hello world")).toBe("  Hello world");
    });
  });
});
