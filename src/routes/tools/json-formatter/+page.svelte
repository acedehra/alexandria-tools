<script lang="ts">

  let input = $state("");
  let error = $state<string | null>(null);
  let output = $state("");

  function format(pretty: boolean) {
    error = null;
    const trimmed = input.trim();
    if (!trimmed) {
      output = "";
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      output = pretty ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
    } catch (e) {
      error = e instanceof Error ? e.message : "Invalid JSON";
      output = "";
    }
  }

  function copyOutput() {
    if (output) void navigator.clipboard.writeText(output);
  }
</script>

<svelte:head>
  <title>JSON Formatter — Alexandria Tools</title>
  <meta
    name="description"
    content="Validate, prettify, or minify JSON in your browser with instant feedback."
  />
</svelte:head>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">JSON Formatter</h1>
      <p class="mt-2 text-zinc-400">
        Paste JSON, then prettify (indent) or minify. Invalid JSON shows an error below.
      </p>
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <button
        type="button"
        onclick={() => format(true)}
        class="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
      >
        Prettify
      </button>
      <button
        type="button"
        onclick={() => format(false)}
        class="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
      >
        Minify
      </button>
      <button
        type="button"
        onclick={() => {
          input = "";
          output = "";
          error = null;
        }}
        class="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
      >
        Clear
      </button>
    </div>

    <div class="grid gap-8 lg:grid-cols-2">
      <div>
        <label for="json-in" class="mb-2 block text-sm font-medium text-zinc-300">Input</label>
        <textarea
          id="json-in"
          bind:value={input}
          placeholder="Paste JSON here"
          class="h-96 w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        ></textarea>
      </div>
      <div>
        <div class="mb-2 flex items-center justify-between">
          <span class="text-sm font-medium text-zinc-300">Result</span>
          <button
            type="button"
            onclick={copyOutput}
            disabled={!output}
            class="text-sm text-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy
          </button>
        </div>
        {#if error}
          <div
            class="mb-2 rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300"
          >
            {error}
          </div>
        {/if}
        <textarea
          readonly
          value={output}
          placeholder="Formatted JSON appears here…"
          class="h-96 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 font-mono text-sm text-zinc-200 placeholder-zinc-600"
        ></textarea>
      </div>
    </div>
  </main>

