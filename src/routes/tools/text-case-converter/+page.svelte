<script lang="ts">

  let inputText = $state("");
  let activeCase = $state("camelCase");

  const cases = [
    { id: "UPPERCASE", label: "UPPERCASE" },
    { id: "lowercase", label: "lowercase" },
    { id: "camelCase", label: "camelCase" },
    { id: "Title Case", label: "Title Case" },
    { id: "sentence case", label: "sentence case" },
    { id: "PascalCase", label: "PascalCase" },
    { id: "kebab-case", label: "kebab-case" },
    { id: "snake_case", label: "snake_case" },
    { id: "UPPER_CASE", label: "UPPER_CASE" },
    { id: "lower_case", label: "lower_case" }
  ];

  function toCamelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
      .replace(/^(.)/, (char) => char.toLowerCase());
  }

  function toPascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ""))
      .replace(/^(.)/, (char) => char.toUpperCase());
  }

  function toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  }

  function toSnakeCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[\s-]+/g, "_")
      .toLowerCase();
  }

  function toUpperCase(str: string): string {
    return str.toUpperCase().replace(/\s+/g, "_");
  }

  function toLowerCase(str: string): string {
    return str.toLowerCase().replace(/\s+/g, "_");
  }

  function toTitleCase(str: string): string {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  function toSentenceCase(str: string): string {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  }

  function convertText(str: string, targetCase: string): string {
    if (!str) return "";

    switch (targetCase) {
      case "camelCase":
        return toCamelCase(str);
      case "PascalCase":
        return toPascalCase(str);
      case "kebab-case":
        return toKebabCase(str);
      case "snake_case":
        return toSnakeCase(str);
      case "UPPER_CASE":
        return toUpperCase(str);
      case "lower_case":
        return toLowerCase(str);
      case "Title Case":
        return toTitleCase(str);
      case "sentence case":
        return toSentenceCase(str);
      case "UPPERCASE":
        return str.toUpperCase();
      case "lowercase":
        return str.toLowerCase();
      default:
        return str;
    }
  }

  let outputText = $derived(convertText(inputText, activeCase));

  function copyToClipboard() {
    navigator.clipboard.writeText(outputText);
  }

  function clearAll() {
    inputText = "";
  }
</script>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Text Case Converter</h1>
      <p class="mt-2 text-zinc-400">Convert text between different cases instantly.</p>
    </div>

    <div class="grid items-start gap-8 lg:grid-cols-2">
      <!-- Input Section -->
      <div>
        <div class="mb-4 flex h-9 items-center justify-between">
          <label for="input" class="text-sm font-medium text-zinc-300">Input Text</label>
          <button
            type="button"
            onclick={clearAll}
            class="inline-flex h-9 shrink-0 items-center justify-center rounded-md px-3 text-sm text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Clear
          </button>
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
            onclick={copyToClipboard}
            disabled={!outputText}
            class="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-emerald-500 px-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy
          </button>
        </div>
        <div
          id="output"
          class="h-64 w-full overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm break-words whitespace-pre-wrap text-white"
        >
          {#if outputText}
            {outputText}
          {:else}
            <span class="text-zinc-600">Output will appear here...</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Case Selection -->
    <div class="mt-8">
      <h2 class="mb-4 text-lg font-semibold text-white">Select Case</h2>
      <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {#each cases as c}
          <button
            onclick={() => (activeCase = c.id)}
            class="rounded-lg border p-3 text-left transition-all {activeCase === c.id
              ? 'border-emerald-500 bg-emerald-500/10 text-white'
              : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-white'}"
          >
            <div class="font-mono text-sm">{c.label}</div>
          </button>
        {/each}
      </div>
    </div>
  </main>

