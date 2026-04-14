<script lang="ts">

  type Kind = "temp" | "length" | "mass";

  let kind = $state<Kind>("temp");
  let valueIn = $state("1");
  let fromUnit = $state("c");
  let toUnit = $state("f");

  const units: Record<Kind, { id: string; label: string }[]> = {
    temp: [
      { id: "c", label: "Celsius (°C)" },
      { id: "f", label: "Fahrenheit (°F)" },
      { id: "k", label: "Kelvin (K)" }
    ],
    length: [
      { id: "m", label: "Meters (m)" },
      { id: "ft", label: "Feet (ft)" },
      { id: "in", label: "Inches (in)" },
      { id: "km", label: "Kilometers (km)" },
      { id: "mi", label: "Miles (mi)" }
    ],
    mass: [
      { id: "kg", label: "Kilograms (kg)" },
      { id: "g", label: "Grams (g)" },
      { id: "lb", label: "Pounds (lb)" },
      { id: "oz", label: "Ounces (oz)" }
    ]
  };

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

  let result = $state("");

  function convert() {
    const n = Number(String(valueIn).replace(/,/g, "").trim());
    if (!Number.isFinite(n)) {
      result = "—";
      return;
    }
    const base = toBase(kind, fromUnit, n);
    const out = fromBase(kind, toUnit, base);
    const decimals = kind === "temp" ? 4 : 6;
    result = Number.isFinite(out) ? out.toFixed(decimals).replace(/\.?0+$/, "") : "—";
  }

  $effect(() => {
    kind;
    valueIn;
    fromUnit;
    toUnit;
    convert();
  });

  $effect(() => {
    const u = units[kind];
    if (!u.some((x) => x.id === fromUnit)) fromUnit = u[0].id;
    if (!u.some((x) => x.id === toUnit)) toUnit = u[1]?.id ?? u[0].id;
    if (fromUnit === toUnit && u.length > 1) {
      const other = u.find((x) => x.id !== fromUnit);
      if (other) toUnit = other.id;
    }
  });
</script>

<svelte:head>
  <title>Unit Converter — Alexandria Tools</title>
  <meta name="description" content="Convert temperature, length, and mass with common units." />
</svelte:head>


  <main class="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Unit Converter</h1>
      <p class="mt-2 text-zinc-400">Temperature, length, and mass — conversions in your browser.</p>
    </div>

    <div class="mb-6">
      <span class="mb-2 block text-sm font-medium text-zinc-300">Category</span>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          onclick={() => (kind = "temp")}
          class="rounded-lg px-3 py-1.5 text-sm font-medium {kind === 'temp'
            ? 'bg-emerald-500 text-white'
            : 'border border-zinc-700 text-zinc-300 hover:bg-zinc-900'}"
        >
          Temperature
        </button>
        <button
          type="button"
          onclick={() => (kind = "length")}
          class="rounded-lg px-3 py-1.5 text-sm font-medium {kind === 'length'
            ? 'bg-emerald-500 text-white'
            : 'border border-zinc-700 text-zinc-300 hover:bg-zinc-900'}"
        >
          Length
        </button>
        <button
          type="button"
          onclick={() => (kind = "mass")}
          class="rounded-lg px-3 py-1.5 text-sm font-medium {kind === 'mass'
            ? 'bg-emerald-500 text-white'
            : 'border border-zinc-700 text-zinc-300 hover:bg-zinc-900'}"
        >
          Mass
        </button>
      </div>
    </div>

    <div class="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div>
        <label for="val" class="mb-2 block text-sm font-medium text-zinc-300">Value</label>
        <input
          id="val"
          type="text"
          bind:value={valueIn}
          class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="from" class="mb-2 block text-sm font-medium text-zinc-300">From</label>
          <select
            id="from"
            bind:value={fromUnit}
            class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white"
          >
            {#each units[kind] as u (u.id)}
              <option value={u.id}>{u.label}</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="to" class="mb-2 block text-sm font-medium text-zinc-300">To</label>
          <select
            id="to"
            bind:value={toUnit}
            class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white"
          >
            {#each units[kind] as u (u.id)}
              <option value={u.id}>{u.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="border-t border-zinc-800 pt-4">
        <div class="text-sm text-zinc-400">Result</div>
        <div class="mt-1 text-2xl font-semibold text-emerald-400">{result}</div>
      </div>
    </div>
  </main>

