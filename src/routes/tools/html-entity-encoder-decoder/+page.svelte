<script lang="ts">

  let input = $state("");
  let output = $state("");
  let lastMode = $state<"encode" | "decode" | null>(null);

  function encodeHtml(s: string): string {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function decodeHtml(s: string): string {
    if (typeof document === "undefined") return s;
    const ta = document.createElement("textarea");
    ta.innerHTML = s;
    return ta.value;
  }

  function encode() {
    output = encodeHtml(input);
    lastMode = "encode";
  }

  function decode() {
    output = decodeHtml(input);
    lastMode = "decode";
  }

  function copyOutput() {
    if (output) void navigator.clipboard.writeText(output);
  }
</script>

<svelte:head>
  <title>HTML Entity Encoder/Decoder — Alexandria Tools</title>
  <meta name="description" content="Escape or unescape HTML entities for markup and content." />
</svelte:head>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">HTML Entity Encoder/Decoder</h1>
      <p class="mt-2 text-zinc-400">
        <strong class="text-zinc-300">Encode</strong> turns plain text into safe HTML escapes.
        <strong class="text-zinc-300">Decode</strong> turns entity text (e.g.
        <code class="text-emerald-400">&amp;lt;</code>) back using the browser&apos;s HTML parser.
      </p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <button
        type="button"
        onclick={encode}
        class="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
      >
        Encode
      </button>
      <button
        type="button"
        onclick={decode}
        class="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
      >
        Decode
      </button>
      <button
        type="button"
        onclick={() => {
          input = "";
          output = "";
          lastMode = null;
        }}
        class="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
      >
        Clear
      </button>
    </div>

    {#if lastMode}
      <p class="mb-4 text-sm text-zinc-500">
        Last action: <span class="text-zinc-300">{lastMode === "encode" ? "Encode" : "Decode"}</span
        >
      </p>
    {/if}

    <div class="grid gap-8 lg:grid-cols-2">
      <div>
        <label for="in" class="mb-2 block text-sm font-medium text-zinc-300">Input</label>
        <textarea
          id="in"
          bind:value={input}
          placeholder="Plain text to encode, or entity text to decode…"
          class="h-80 w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        ></textarea>
      </div>
      <div>
        <div class="mb-2 flex items-center justify-between">
          <label for="out" class="text-sm font-medium text-zinc-300">Output</label>
          <button
            type="button"
            onclick={copyOutput}
            disabled={!output}
            class="text-sm text-zinc-500 hover:text-white disabled:opacity-50"
          >
            Copy
          </button>
        </div>
        <textarea
          id="out"
          readonly
          value={output}
          placeholder="Click Encode or Decode…"
          class="h-80 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 text-zinc-200 placeholder-zinc-600"
        ></textarea>
      </div>
    </div>
  </main>

