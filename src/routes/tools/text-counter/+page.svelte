<script lang="ts">

  let inputText = $state("");

  let counts = $state({
    chars: 0,
    charsNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    sentences: 0,
    avgWordLength: "0.0",
    readingTime: 0
  });

  $effect(() => {
    const text = inputText;

    // Character count
    counts.chars = text.length;

    // Character count (no spaces)
    counts.charsNoSpaces = text.replace(/\s/g, "").length;

    // Word count
    counts.words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    // Line count
    counts.lines = text === "" ? 0 : text.split("\n").length;

    // Paragraph count
    counts.paragraphs =
      text.trim() === ""
        ? 0
        : text
            .trim()
            .split(/\n\s*\n/)
            .filter((p) => p.trim()).length;

    // Sentence count
    counts.sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim()).length;

    // Average word length
    counts.avgWordLength =
      counts.words > 0 ? (counts.charsNoSpaces / counts.words).toFixed(1) : "0.0";

    // Reading time (average 200 words per minute)
    counts.readingTime = Math.ceil(counts.words / 200);
  });

  function clearAll() {
    inputText = "";
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(inputText);
  }
</script>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Text Counter</h1>
      <p class="mt-2 text-zinc-400">Count characters, words, lines, and paragraphs in your text.</p>
    </div>

    <div class="grid gap-8 lg:grid-cols-3">
      <!-- Input Section -->
      <div class="lg:col-span-2">
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
              onclick={copyToClipboard}
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
          placeholder="Enter or paste your text here..."
          class="h-96 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        ></textarea>
      </div>

      <!-- Stats Section -->
      <div class="space-y-4">
        <div class="flex h-9 items-center">
          <h2 class="text-lg leading-none font-semibold text-white">Statistics</h2>
        </div>

        <div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div class="text-3xl font-bold text-emerald-400">{counts.chars}</div>
          <div class="text-sm text-zinc-400">Characters</div>
        </div>

        <div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div class="text-3xl font-bold text-emerald-400">{counts.charsNoSpaces}</div>
          <div class="text-sm text-zinc-400">Characters (no spaces)</div>
        </div>

        <div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div class="text-3xl font-bold text-emerald-400">{counts.words}</div>
          <div class="text-sm text-zinc-400">Words</div>
        </div>

        <div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div class="text-3xl font-bold text-emerald-400">{counts.lines}</div>
          <div class="text-sm text-zinc-400">Lines</div>
        </div>

        <div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div class="text-3xl font-bold text-emerald-400">{counts.paragraphs}</div>
          <div class="text-sm text-zinc-400">Paragraphs</div>
        </div>

        <div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div class="text-3xl font-bold text-emerald-400">{counts.sentences}</div>
          <div class="text-sm text-zinc-400">Sentences</div>
        </div>

        <div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div class="text-3xl font-bold text-emerald-400">{counts.avgWordLength}</div>
          <div class="text-sm text-zinc-400">Avg Word Length</div>
        </div>

        <div class="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div class="text-3xl font-bold text-emerald-400">{counts.readingTime} min</div>
          <div class="text-sm text-zinc-400">Reading Time</div>
        </div>
      </div>
    </div>
  </main>

