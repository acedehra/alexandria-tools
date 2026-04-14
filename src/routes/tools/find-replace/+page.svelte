<script lang="ts">

  let inputText = $state("");
  let findText = $state("");
  let replaceText = $state("");
  let useRegex = $state(false);
  let caseSensitive = $state(false);
  let globalReplace = $state(true);

  let outputText = $derived(() => {
    if (!findText) return inputText;

    try {
      let flags = "";
      if (!caseSensitive) flags += "i";
      if (globalReplace) flags += "g";

      if (useRegex) {
        const regex = new RegExp(findText, flags);
        return inputText.replace(regex, replaceText);
      } else {
        const escapedFind = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedFind, flags);
        return inputText.replace(regex, replaceText.replace(/\$/g, "$$$$"));
      }
    } catch (e) {
      return inputText;
    }
  });

  let outputHtml = $derived(() => {
    if (!findText) return inputText;

    try {
      let flags = "";
      if (!caseSensitive) flags += "i";
      if (globalReplace) flags += "g";

      const regex = useRegex
        ? new RegExp(findText, flags)
        : new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);

      if (replaceText) {
        // Replace mode: return plain text
        return outputText();
      } else {
        // Highlight mode: return HTML with marks
        return inputText.replace(regex, "<mark>$&</mark>");
      }
    } catch (e) {
      return inputText;
    }
  });

  let plainOutput = $derived(() => {
    return outputText();
  });

  let matchCount = $derived(() => {
    if (!findText) return 0;

    try {
      let flags = "";
      if (!caseSensitive) flags += "i";
      if (globalReplace) flags += "g";

      if (useRegex) {
        const regex = new RegExp(findText, flags);
        const matches = inputText.match(regex);
        return matches ? matches.length : 0;
      } else {
        const escapedFind = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escapedFind, flags);
        const matches = inputText.match(regex);
        return matches ? matches.length : 0;
      }
    } catch (e) {
      return 0;
    }
  });

  function copyOutput() {
    navigator.clipboard.writeText(plainOutput());
  }

  function copyInput() {
    navigator.clipboard.writeText(inputText);
  }

  function clearAll() {
    inputText = "";
    findText = "";
    replaceText = "";
  }
</script>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Find and Replace</h1>
      <p class="mt-2 text-zinc-400">Find and replace text patterns with support for regex.</p>
    </div>

    <!-- Options -->
    <div class="mb-6 flex flex-wrap gap-4">
      <label class="flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          bind:checked={useRegex}
          class="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950"
        />
        Use Regular Expression
      </label>
      <label class="flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          bind:checked={caseSensitive}
          class="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950"
        />
        Case Sensitive
      </label>
      <label class="flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          bind:checked={globalReplace}
          class="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950"
        />
        Replace All
      </label>
    </div>

    <!-- Find and Replace Inputs -->
    <div class="mb-6 grid gap-4 sm:grid-cols-2">
      <div>
        <label for="find" class="mb-2 block text-sm font-medium text-zinc-300"> Find </label>
        <input
          id="find"
          type="text"
          bind:value={findText}
          placeholder="Text to find..."
          class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
      </div>
      <div>
        <label for="replace" class="mb-2 block text-sm font-medium text-zinc-300">
          Replace with
        </label>
        <input
          id="replace"
          type="text"
          bind:value={replaceText}
          placeholder="Replacement text..."
          class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
      </div>
    </div>

    <!-- Match Count -->
    {#if findText}
      <div
        class="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300"
      >
        Found {matchCount()} match{matchCount() !== 1 ? "es" : ""}
      </div>
    {/if}

    <div class="grid items-start gap-8 lg:grid-cols-2">
      <!-- Input Section -->
      <div>
        <div class="mb-4 flex h-9 items-center justify-between">
          <label for="input" class="text-sm font-medium text-zinc-300">Input Text</label>
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
          placeholder="Enter your text here..."
          class="h-64 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        ></textarea>
        <div class="mt-2 text-sm text-zinc-500">
          {inputText.length} character{inputText.length !== 1 ? "s" : ""}
        </div>
      </div>

      <!-- Output Section -->
      <div>
        <div class="mb-4 flex h-9 items-center justify-between">
          <label for="output" class="text-sm font-medium text-zinc-300">Output</label>
          <button
            type="button"
            onclick={copyOutput}
            disabled={!plainOutput() || plainOutput() === inputText}
            class="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-emerald-500 px-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy
          </button>
        </div>
        <div
          id="output"
          class="h-64 w-full overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm break-words whitespace-pre-wrap text-white"
        >
          {#if inputText || findText}
            {@html outputHtml()}
          {:else}
            <span class="text-zinc-600">Output will appear here...</span>
          {/if}
        </div>
        <div class="mt-2 text-sm text-zinc-500">
          {plainOutput().length} character{plainOutput().length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 class="mb-3 text-lg font-semibold text-white">Tips</h3>
      <div class="space-y-2 text-sm text-zinc-400">
        <p>
          <strong>Regular Expressions:</strong> Enable to use regex patterns like
          <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400">\d+</code> for numbers.
        </p>
        <p>
          <strong>Replace Groups:</strong> Use
          <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400">$1</code>,
          <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400">$2</code>, etc. in the
          replacement text to reference capture groups.
        </p>
        <p>
          <strong>Example:</strong> Find
          <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400">(\w+)-(\w+)</code>
          and replace with
          <code class="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400">$2 $1</code> to swap words separated
          by hyphens.
        </p>
      </div>
    </div>
  </main>


<style>
  :global(mark) {
    background-color: #3b82f6;
    color: white;
    padding: 0 2px;
    border-radius: 2px;
  }
</style>
