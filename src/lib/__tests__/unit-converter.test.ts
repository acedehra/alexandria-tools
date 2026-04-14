import { describe, it, expect } from "vitest";

describe("Unit Converter Utilities", () => {
  type Kind = "temp" | "length" | "mass";

  function toBase(kind: Kind, unit: string, v: number): number {
    if (kind === "temp") {
      if (unit === "c") return v;
      if (unit === "f") return ((v - 32) * 5) / 9;
      if (unit === "k") return v - 273.15;
      return v;
    }
    if (kind === "length") {
      if (unit === "m") return v;
      if (unit === "ft") return v * 0.3048;
      if (unit === "in") return v * 0.0254;
      if (unit === "km") return v * 1000;
      if (unit === "mi") return v * 1609.344;
      return v;
    }
    if (kind === "mass") {
      if (unit === "kg") return v;
      if (unit === "g") return v / 1000;
      if (unit === "lb") return v * 0.45359237;
      if (unit === "oz") return v * 0.028349523125;
      return v;
    }
    return v;
  }

  function fromBase(kind: Kind, unit: string, base: number): number {
    if (kind === "temp") {
      if (unit === "c") return base;
      if (unit === "f") return (base * 9) / 5 + 32;
      if (unit === "k") return base + 273.15;
      return base;
    }
    if (kind === "length") {
      if (unit === "m") return base;
      if (unit === "ft") return base / 0.3048;
      if (unit === "in") return base / 0.0254;
      if (unit === "km") return base / 1000;
      if (unit === "mi") return base / 1609.344;
      return base;
    }
    if (kind === "mass") {
      if (unit === "kg") return base;
      if (unit === "g") return base * 1000;
      if (unit === "lb") return base / 0.45359237;
      if (unit === "oz") return base / 0.028349523125;
      return base;
    }
    return base;
  }

  function convert(kind: Kind, fromUnit: string, toUnit: string, valueIn: string): string {
    const n = Number(String(valueIn).replace(/,/g, "").trim());
    if (!Number.isFinite(n)) {
      return "—";
    }
    const base = toBase(kind, fromUnit, n);
    const out = fromBase(kind, toUnit, base);
    const decimals = kind === "temp" ? 4 : 6;
    return Number.isFinite(out) ? out.toFixed(decimals).replace(/\.?0+$/, "") : "—";
  }

  describe("Temperature conversions", () => {
    it("converts Celsius to Fahrenheit", () => {
      expect(convert("temp", "c", "f", "0")).toBe("32");
      expect(convert("temp", "c", "f", "100")).toBe("212");
      expect(convert("temp", "c", "f", "37")).toBe("98.6");
    });

    it("converts Fahrenheit to Celsius", () => {
      expect(convert("temp", "f", "c", "32")).toBe("0");
      expect(convert("temp", "f", "c", "212")).toBe("100");
    });

    it("converts Celsius to Kelvin", () => {
      expect(convert("temp", "c", "k", "0")).toBe("273.15");
      expect(convert("temp", "c", "k", "100")).toBe("373.15");
    });

    it("converts Kelvin to Celsius", () => {
      expect(convert("temp", "k", "c", "273.15")).toBe("0");
      expect(convert("temp", "k", "c", "0")).toBe("-273.15");
    });

    it("handles same unit conversion", () => {
      expect(convert("temp", "c", "c", "25")).toBe("25");
      expect(convert("temp", "f", "f", "77")).toBe("77");
    });
  });

  describe("Length conversions", () => {
    it("converts meters to feet", () => {
      expect(convert("length", "m", "ft", "1")).toBe("3.28084");
    });

    it("converts feet to meters", () => {
      expect(convert("length", "ft", "m", "1")).toBe("0.3048");
    });

    it("converts kilometers to miles", () => {
      expect(convert("length", "km", "mi", "1")).toBe("0.621371");
    });

    it("converts miles to kilometers", () => {
      expect(convert("length", "mi", "km", "1")).toBe("1.609344");
    });

    it("converts inches to centimeters", () => {
      expect(convert("length", "in", "m", "10")).toBe("0.254");
    });
  });

  describe("Mass conversions", () => {
    it("converts kilograms to pounds", () => {
      expect(convert("mass", "kg", "lb", "1")).toBe("2.204623");
    });

    it("converts pounds to kilograms", () => {
      expect(convert("mass", "lb", "kg", "1")).toBe("0.453592");
    });

    it("converts grams to kilograms", () => {
      expect(convert("mass", "g", "kg", "1000")).toBe("1");
    });

    it("converts kilograms to grams", () => {
      expect(convert("mass", "kg", "g", "1")).toBe("1000");
    });

    it("converts ounces to kilograms", () => {
      expect(convert("mass", "oz", "kg", "1")).toBe("0.02835");
    });
  });

  describe("Edge cases", () => {
    it("handles invalid input", () => {
      expect(convert("temp", "c", "f", "abc")).toBe("—");
      expect(convert("length", "m", "ft", "")).toBe("0"); // Empty string converts to 0
    });

    it("handles comma-separated numbers", () => {
      expect(convert("length", "m", "ft", "1,000")).toBe("3280.839895");
    });

    it("handles zero", () => {
      expect(convert("temp", "c", "f", "0")).toBe("32");
      expect(convert("length", "m", "ft", "0")).toBe("0");
      expect(convert("mass", "kg", "lb", "0")).toBe("0");
    });

    it("handles negative numbers", () => {
      expect(convert("temp", "c", "f", "-40")).toBe("-40"); // -40C = -40F
      expect(convert("length", "m", "ft", "-1")).toBe("-3.28084");
    });

    it("handles decimal input", () => {
      expect(convert("temp", "c", "f", "37.5")).toBe("99.5");
      expect(convert("length", "m", "ft", "1.5")).toBe("4.92126");
    });
  });
});
