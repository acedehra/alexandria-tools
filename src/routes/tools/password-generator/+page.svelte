<script lang="ts">

  let length = $state(16);
  let useUpper = $state(true);
  let useLower = $state(true);
  let useDigits = $state(true);
  let useSymbols = $state(true);

  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWER = "abcdefghijklmnopqrstuvwxyz";
  const DIGITS = "0123456789";
  const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/";

  let password = $state("");
  let genError = $state<string | null>(null);

  function charset(): string | null {
    let s = "";
    if (useUpper) s += UPPER;
    if (useLower) s += LOWER;
    if (useDigits) s += DIGITS;
    if (useSymbols) s += SYMBOLS;
    return s.length ? s : null;
  }

  function generate() {
    genError = null;
    const chars = charset();
    if (!chars) {
      genError = "Select at least one character set.";
      password = "";
      return;
    }
    const len = Math.min(128, Math.max(8, Math.floor(length)));
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    let out = "";
    for (let i = 0; i < len; i++) {
      out += chars[bytes[i]! % chars.length];
    }
    password = out;
  }

  function copy() {
    if (password) void navigator.clipboard.writeText(password);
  }

  generate();
</script>

<svelte:head>
  <title>Password Generator — Alexandria Tools</title>
  <meta
    name="description"
    content="Generate strong random passwords with adjustable length and character sets."
  />
</svelte:head>


  <main class="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Password Generator</h1>
      <p class="mt-2 text-zinc-400">
        Uses <code class="text-emerald-400">crypto.getRandomValues</code> in your browser. Nothing is sent
        to a server.
      </p>
    </div>

    <div class="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <div class="mb-2 flex items-center justify-between gap-2">
        <span class="text-sm font-medium text-zinc-300">Password</span>
        <button
          type="button"
          onclick={copy}
          disabled={!password}
          class="text-sm text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
        >
          Copy
        </button>
      </div>
      <code class="block font-mono text-base break-all text-zinc-100">{password}</code>
    </div>

    {#if genError}
      <div class="mb-4 text-sm text-amber-300">{genError}</div>
    {/if}

    <div class="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div>
        <label for="len" class="mb-2 block text-sm font-medium text-zinc-300"
          >Length ({length})</label
        >
        <input
          id="len"
          type="range"
          min="8"
          max="128"
          bind:value={length}
          class="w-full accent-emerald-500"
        />
      </div>
      <label class="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" bind:checked={useUpper} class="rounded border-zinc-600" />
        Uppercase A–Z
      </label>
      <label class="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" bind:checked={useLower} class="rounded border-zinc-600" />
        Lowercase a–z
      </label>
      <label class="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" bind:checked={useDigits} class="rounded border-zinc-600" />
        Digits 0–9
      </label>
      <label class="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" bind:checked={useSymbols} class="rounded border-zinc-600" />
        Symbols {SYMBOLS}
      </label>
    </div>

    <button
      type="button"
      onclick={generate}
      class="mt-6 w-full rounded-lg bg-emerald-500 py-3 text-sm font-medium text-white hover:bg-emerald-600 sm:w-auto sm:px-8"
    >
      Generate new password
    </button>
  </main>

