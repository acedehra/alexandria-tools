<script lang="ts">

  let fg = $state("#e4e4e7");
  let bg = $state("#18181b");

  function normalizeHex(hex: string): string | null {
    const h = hex.trim();
    const m3 = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(h);
    if (m3) {
      return `#${m3[1]}${m3[1]}${m3[2]}${m3[2]}${m3[3]}${m3[3]}`.toLowerCase();
    }
    const m6 = /^#?([a-f\d]{6})$/i.exec(h);
    if (m6) return `#${m6[1].toLowerCase()}`;
    return null;
  }

  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const n = normalizeHex(hex);
    if (!n) return null;
    const r = parseInt(n.slice(1, 3), 16);
    const g = parseInt(n.slice(3, 5), 16);
    const b = parseInt(n.slice(5, 7), 16);
    return { r, g, b };
  }

  function relativeLuminance(r: number, g: number, b: number): number {
    const lin = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  }

  function contrastRatio(a: string, b: string): number | null {
    const A = hexToRgb(a);
    const B = hexToRgb(b);
    if (!A || !B) return null;
    const L1 = relativeLuminance(A.r, A.g, A.b);
    const L2 = relativeLuminance(B.r, B.g, B.b);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  let ratio = $state<number | null>(null);
  let ratioStr = $state("—");

  $effect(() => {
    const r = contrastRatio(fg, bg);
    ratio = r;
    ratioStr = r !== null ? r.toFixed(2) : "—";
  });

  function passAA(r: number | null, large: boolean) {
    if (r === null) return false;
    return large ? r >= 3 : r >= 4.5;
  }

  function passAAA(r: number | null, large: boolean) {
    if (r === null) return false;
    return large ? r >= 4.5 : r >= 7;
  }
</script>

<svelte:head>
  <title>Color Contrast Checker — Alexandria Tools</title>
  <meta name="description" content="Compute WCAG 2 contrast ratio between two hex colors." />
</svelte:head>


  <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Color Contrast Checker</h1>
      <p class="mt-2 text-zinc-400">
        Enter foreground and background as hex colors. Ratio uses WCAG 2 relative luminance (sRGB).
      </p>
    </div>

    <div
      class="mb-8 rounded-xl border border-zinc-800 p-8"
      style="background-color: {normalizeHex(bg) ?? '#18181b'}; color: {normalizeHex(fg) ??
        '#e4e4e7'};"
    >
      <p class="text-lg font-medium">Sample text on background</p>
      <p class="mt-2 text-sm opacity-90">The quick brown fox jumps over the lazy dog. 0123456789</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      <div>
        <label for="fg" class="mb-2 block text-sm font-medium text-zinc-300"
          >Text (foreground)</label
        >
        <div class="flex gap-2">
          <input
            id="fg"
            type="color"
            bind:value={fg}
            class="h-11 w-14 cursor-pointer rounded border border-zinc-700 bg-zinc-900"
          />
          <input
            type="text"
            bind:value={fg}
            placeholder="#e4e4e7"
            class="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-white"
          />
        </div>
      </div>
      <div>
        <label for="bg" class="mb-2 block text-sm font-medium text-zinc-300">Background</label>
        <div class="flex gap-2">
          <input
            id="bg"
            type="color"
            bind:value={bg}
            class="h-11 w-14 cursor-pointer rounded border border-zinc-700 bg-zinc-900"
          />
          <input
            type="text"
            bind:value={bg}
            placeholder="#18181b"
            class="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-sm text-white"
          />
        </div>
      </div>
    </div>

    <div class="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <div class="text-4xl font-bold text-emerald-400">{ratioStr}</div>
      <div class="text-sm text-zinc-400">Contrast ratio</div>
      {#if ratio === null}
        <p class="mt-4 text-sm text-amber-300">Enter valid hex colors (e.g. #fff or #336699).</p>
      {:else}
        <ul class="mt-6 space-y-2 text-sm">
          <li class="flex justify-between gap-4">
            <span class="text-zinc-400">WCAG AA — normal text</span>
            <span class={passAA(ratio, false) ? "text-green-400" : "text-red-400"}>
              {passAA(ratio, false) ? "Pass" : "Fail"} (≥ 4.5:1)
            </span>
          </li>
          <li class="flex justify-between gap-4">
            <span class="text-zinc-400">WCAG AA — large text</span>
            <span class={passAA(ratio, true) ? "text-green-400" : "text-red-400"}>
              {passAA(ratio, true) ? "Pass" : "Fail"} (≥ 3:1)
            </span>
          </li>
          <li class="flex justify-between gap-4">
            <span class="text-zinc-400">WCAG AAA — normal text</span>
            <span class={passAAA(ratio, false) ? "text-green-400" : "text-red-400"}>
              {passAAA(ratio, false) ? "Pass" : "Fail"} (≥ 7:1)
            </span>
          </li>
          <li class="flex justify-between gap-4">
            <span class="text-zinc-400">WCAG AAA — large text</span>
            <span class={passAAA(ratio, true) ? "text-green-400" : "text-red-400"}>
              {passAAA(ratio, true) ? "Pass" : "Fail"} (≥ 4.5:1)
            </span>
          </li>
        </ul>
      {/if}
    </div>
  </main>

