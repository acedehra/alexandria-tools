<script lang="ts">

  let inputText = $state("");
  let outputText = $derived(encodeURIComponent(inputText));

  function copyOutput() {
    navigator.clipboard.writeText(outputText);
  }

  function copyInput() {
    navigator.clipboard.writeText(inputText);
  }

  function clearAll() {
    inputText = "";
  }
</script>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">URL Encoder/Decoder</h1>
      <p class="mt-2 text-zinc-400">Encode and decode URLs safely for web applications and APIs.</p>
    </div>

    <div class="grid items-start gap-8 lg:grid-cols-2">
      <!-- Input Section -->
      <div>
        <div class="mb-4 flex h-9 items-center justify-between">
          <label for="input" class="text-sm font-medium text-zinc-300">Plain Text / URL</label>
          <div class="flex h-9 items-center gap-2">
            <button
              type="button"
              onclick={clearAll}
              class="inline-flex h-9 shrink-0 items-center justify-center rounded-md px-3 text-sm text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              Clear
            </button>
            <button
              type="button"
              onclick={copyInput}
              disabled={!inputText}
              class="inline-flex h-9 shrink-0 items-center justify-center rounded-md px-3 text-sm text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy
            </button>
          </div>
        </div>
        <textarea
          id="input"
          bind:value={inputText}
          placeholder="Enter your URL or text here..."
          class="h-64 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        ></textarea>
        <div class="mt-2 text-sm text-zinc-500">
          {inputText.length} character{inputText.length !== 1 ? "s" : ""}
        </div>
      </div>

      <!-- Output Section -->
      <div>
        <div class="mb-4 flex h-9 items-center justify-between">
          <label for="output" class="text-sm font-medium text-zinc-300">URL Encoded</label>
          <button
            type="button"
            onclick={copyOutput}
            disabled={!outputText}
            class="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-emerald-500 px-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy
          </button>
        </div>
        <div
          id="output"
          class="h-64 w-full overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm break-all whitespace-pre-wrap text-white"
        >
          {#if outputText}
            {outputText}
          {:else}
            <span class="text-zinc-600">Encoded output will appear here...</span>
          {/if}
        </div>
        <div class="mt-2 text-sm text-zinc-500">
          {outputText.length} character{outputText.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 class="mb-3 text-lg font-semibold text-white">About URL Encoding</h3>
      <div class="space-y-2 text-sm text-zinc-400">
        <p>
          URL encoding (also known as percent-encoding) is a mechanism for encoding information in a
          Uniform Resource Identifier (URI).
        </p>
        <p>
          Special characters are replaced with a % followed by two hexadecimal digits. For example:
        </p>
        <ul class="ml-4 list-disc space-y-1">
          <li>
            Space becomes <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400">%20</code>
          </li>
          <li>
            <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400">?</code> becomes
            <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400">%3F</code>
          </li>
          <li>
            <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400">&</code> becomes
            <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400">%26</code>
          </li>
        </ul>
      </div>
    </div>
  </main>

