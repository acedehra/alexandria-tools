<script lang="ts">

  let inputText = $state("");
  let mode = $state<"encode" | "decode">("encode");
  let outputText = $state("");
  let error = $state("");

  $effect(() => {
    error = "";
    try {
      if (mode === "encode") {
        outputText = btoa(unescape(encodeURIComponent(inputText)));
      } else {
        outputText = decodeURIComponent(escape(atob(inputText)));
      }
    } catch (e) {
      error = mode === "encode" ? "" : "Invalid Base64 string. Please check your input.";
      outputText = "";
    }
  });

  function copyOutput() {
    navigator.clipboard.writeText(outputText);
  }

  function copyInput() {
    navigator.clipboard.writeText(inputText);
  }

  function clearAll() {
    inputText = "";
    outputText = "";
    error = "";
  }
</script>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Base64 Encoder/Decoder</h1>
      <p class="mt-2 text-zinc-400">Encode and decode text to and from Base64 format.</p>
    </div>

    <!-- Mode Toggle -->
    <div class="mb-6 flex gap-2">
      <button
        onclick={() => {
          mode = "encode";
          clearAll();
        }}
        class="rounded-lg px-4 py-2 font-medium transition-colors {mode === 'encode'
          ? 'bg-emerald-500 text-white'
          : 'bg-zinc-900 text-zinc-400 hover:text-white'}"
      >
        Encode
      </button>
      <button
        onclick={() => {
          mode = "decode";
          clearAll();
        }}
        class="rounded-lg px-4 py-2 font-medium transition-colors {mode === 'decode'
          ? 'bg-emerald-500 text-white'
          : 'bg-zinc-900 text-zinc-400 hover:text-white'}"
      >
        Decode
      </button>
    </div>

    <div class="grid items-start gap-8 lg:grid-cols-2">
      <!-- Input Section -->
      <div>
        <div class="mb-4 flex h-9 items-center justify-between">
          <label for="input" class="text-sm font-medium text-zinc-300">
            {mode === "encode" ? "Plain Text" : "Base64"}
          </label>
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
          placeholder={mode === "encode"
            ? "Enter your text to encode..."
            : "Enter Base64 string to decode..."}
          class="h-64 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        ></textarea>
        <div class="mt-2 text-sm text-zinc-500">
          {inputText.length} character{inputText.length !== 1 ? "s" : ""}
        </div>
      </div>

      <!-- Output Section -->
      <div>
        <div class="mb-4 flex h-9 items-center justify-between">
          <label for="output" class="text-sm font-medium text-zinc-300">
            {mode === "encode" ? "Base64" : "Decoded Text"}
          </label>
          <button
            type="button"
            onclick={copyOutput}
            disabled={!outputText || !!error}
            class="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-emerald-500 px-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy
          </button>
        </div>
        <div
          id="output"
          class="h-64 w-full overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm break-all whitespace-pre-wrap"
        >
          {#if error}
            <div class="text-red-400">{error}</div>
          {:else if outputText}
            <div class="text-white">{outputText}</div>
          {:else}
            <span class="text-zinc-600">
              {mode === "encode" ? "Encoded output" : "Decoded output"} will appear here...
            </span>
          {/if}
        </div>
        <div class="mt-2 text-sm text-zinc-500">
          {outputText.length} character{outputText.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 class="mb-3 text-lg font-semibold text-white">About Base64</h3>
      <div class="space-y-2 text-sm text-zinc-400">
        <p>
          Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string
          format.
        </p>
        <p>Common use cases include:</p>
        <ul class="ml-4 list-disc space-y-1">
          <li>Embedding images in HTML/CSS</li>
          <li>Transmitting binary data over text-based protocols</li>
          <li>Storing complex data in URLs</li>
          <li>Email attachments (MIME)</li>
        </ul>
      </div>
    </div>
  </main>

