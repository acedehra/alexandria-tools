<script lang="ts">

  type SortBy =
    | "alphabetical"
    | "alphabetical-reverse"
    | "length"
    | "length-reverse"
    | "numeric"
    | "numeric-reverse"
    | "random";
  type RemoveOption = "none" | "duplicates" | "empty" | "both";

  let inputText = $state("");
  let sortBy = $state<SortBy>("alphabetical");
  let removeOption = $state<RemoveOption>("none");

  let sortedText = $derived.by(() => {
    let lines = inputText.split("\n");

    // Apply removal options
    if (removeOption === "duplicates" || removeOption === "both") {
      lines = [...new Set(lines)];
    }
    if (removeOption === "empty" || removeOption === "both") {
      lines = lines.filter((line) => line.trim() !== "");
    }

    // Sort based on selected option
    switch (sortBy) {
      case "alphabetical":
        lines.sort((a, b) => a.localeCompare(b));
        break;
      case "alphabetical-reverse":
        lines.sort((a, b) => b.localeCompare(a));
        break;
      case "length":
        lines.sort((a, b) => a.length - b.length);
        break;
      case "length-reverse":
        lines.sort((a, b) => b.length - a.length);
        break;
      case "numeric":
        lines.sort((a, b) => {
          const numA = parseFloat(a) || 0;
          const numB = parseFloat(b) || 0;
          return numA - numB;
        });
        break;
      case "numeric-reverse":
        lines.sort((a, b) => {
          const numA = parseFloat(a) || 0;
          const numB = parseFloat(b) || 0;
          return numB - numA;
        });
        break;
      case "random":
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        break;
    }

    return lines.join("\n");
  });

  let lineCount = $derived.by(() => {
    const lines = inputText.split("\n");
    return lines.length;
  });

  let sortedLineCount = $derived.by(() => {
    return sortedText.split("\n").length;
  });

  function copyToClipboard() {
    navigator.clipboard.writeText(sortedText);
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
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Text Sorter</h1>
      <p class="mt-2 text-zinc-400">
        Sort text lines alphabetically, numerically, by length, or randomly.
      </p>
    </div>

    <!-- Options -->
    <div class="mb-6 grid gap-6 sm:grid-cols-2">
      <!-- Sort By -->
      <div>
        <label for="sortBy" class="mb-2 block text-sm font-medium text-zinc-300"> Sort By </label>
        <select
          id="sortBy"
          bind:value={sortBy}
          class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="alphabetical">Alphabetical (A-Z)</option>
          <option value="alphabetical-reverse">Alphabetical (Z-A)</option>
          <option value="length">Length (Shortest to Longest)</option>
          <option value="length-reverse">Length (Longest to Shortest)</option>
          <option value="numeric">Numeric (Smallest to Largest)</option>
          <option value="numeric-reverse">Numeric (Largest to Smallest)</option>
          <option value="random">Random</option>
        </select>
      </div>

      <!-- Remove Options -->
      <div>
        <label for="removeOption" class="mb-2 block text-sm font-medium text-zinc-300">
          Remove
        </label>
        <select
          id="removeOption"
          bind:value={removeOption}
          class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="none">Nothing</option>
          <option value="duplicates">Duplicate Lines</option>
          <option value="empty">Empty Lines</option>
          <option value="both">Duplicates & Empty Lines</option>
        </select>
      </div>
    </div>

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
          placeholder="Enter your text lines here..."
          class="h-64 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        ></textarea>
        <div class="mt-2 text-sm text-zinc-500">
          {lineCount} line{lineCount !== 1 ? "s" : ""}
        </div>
      </div>

      <!-- Output Section -->
      <div>
        <div class="mb-4 flex h-9 items-center justify-between">
          <label for="output" class="text-sm font-medium text-zinc-300">Sorted Output</label>
          <button
            type="button"
            onclick={copyToClipboard}
            disabled={!sortedText}
            class="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-emerald-500 px-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy
          </button>
        </div>
        <div
          id="output"
          class="h-64 w-full overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm whitespace-pre-wrap text-white"
        >
          {#if sortedText}
            {sortedText}
          {:else}
            <span class="text-zinc-600">Sorted output will appear here...</span>
          {/if}
        </div>
        <div class="mt-2 text-sm text-zinc-500">
          {sortedLineCount} line{sortedLineCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 class="mb-3 text-lg font-semibold text-white">Sorting Options</h3>
      <div class="grid gap-4 text-sm text-zinc-400 sm:grid-cols-2">
        <div>
          <strong class="text-white">Alphabetical:</strong> Sorts lines A-Z or Z-A based on text comparison.
        </div>
        <div>
          <strong class="text-white">Length:</strong> Sorts by character count from shortest to longest
          or vice versa.
        </div>
        <div>
          <strong class="text-white">Numeric:</strong> Sorts lines as numbers. Non-numeric lines are treated
          as 0.
        </div>
        <div>
          <strong class="text-white">Random:</strong> Randomly shuffles all lines.
        </div>
      </div>
    </div>
  </main>

