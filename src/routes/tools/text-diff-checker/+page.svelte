<script lang="ts">

  interface DiffPart {
    type: "same" | "added" | "removed";
    text: string;
  }

  let text1 = $state("");
  let text2 = $state("");

  // Simple diff implementation
  function computeDiff(oldText: string, newText: string): DiffPart[] {
    const result: DiffPart[] = [];
    const oldLines = oldText.split("\n");
    const newLines = newText.split("\n");

    let i = 0;
    let j = 0;

    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        result.push({ type: "same", text: oldLines[i] });
        i++;
        j++;
      } else {
        // Look ahead to find matching lines
        let matchFound = false;

        // Check if old line was removed
        for (let k = 1; k <= 3 && i + k < oldLines.length; k++) {
          if (oldLines[i + k] === newLines[j]) {
            // Lines between i and i+k were removed
            for (let m = 0; m < k; m++) {
              result.push({ type: "removed", text: oldLines[i] });
              i++;
            }
            matchFound = true;
            break;
          }
        }

        // Check if new line was added
        if (!matchFound) {
          for (let k = 1; k <= 3 && j + k < newLines.length; k++) {
            if (oldLines[i] === newLines[j + k]) {
              // Lines between j and j+k were added
              for (let m = 0; m < k; m++) {
                result.push({ type: "added", text: newLines[j] });
                j++;
              }
              matchFound = true;
              break;
            }
          }
        }

        if (!matchFound) {
          if (i < oldLines.length) {
            result.push({ type: "removed", text: oldLines[i] });
            i++;
          }
          if (j < newLines.length) {
            result.push({ type: "added", text: newLines[j] });
            j++;
          }
        }
      }
    }

    return result;
  }

  let diffResult = $derived(computeDiff(text1, text2));

  function clearAll() {
    text1 = "";
    text2 = "";
  }
</script>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white sm:text-4xl">Text Diff Checker</h1>
        <p class="mt-2 text-zinc-400">Compare two texts and highlight the differences.</p>
      </div>
      <button
        onclick={clearAll}
        class="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
      >
        Clear All
      </button>
    </div>

    <!-- Legend -->
    <div class="mb-6 flex flex-wrap gap-4 text-sm">
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 rounded border border-green-500/50 bg-green-500/20"></div>
        <span class="text-zinc-400">Added</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 rounded border border-red-500/50 bg-red-500/20"></div>
        <span class="text-zinc-400">Removed</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 rounded border border-zinc-700 bg-zinc-800"></div>
        <span class="text-zinc-400">Unchanged</span>
      </div>
    </div>

    <div class="grid items-start gap-8 lg:grid-cols-2">
      <!-- Text 1 -->
      <div>
        <div class="mb-4 flex h-9 items-center justify-between">
          <label for="text1" class="text-sm font-medium text-zinc-300">Original Text</label>
        </div>
        <textarea
          id="text1"
          bind:value={text1}
          placeholder="Enter the original text..."
          class="h-96 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        ></textarea>
        <div class="mt-2 text-sm text-zinc-500">
          {text1.length} character{text1.length !== 1 ? "s" : ""}
        </div>
      </div>

      <!-- Text 2 -->
      <div>
        <div class="mb-4 flex h-9 items-center justify-between">
          <label for="text2" class="text-sm font-medium text-zinc-300">Modified Text</label>
        </div>
        <textarea
          id="text2"
          bind:value={text2}
          placeholder="Enter the modified text..."
          class="h-96 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        ></textarea>
        <div class="mt-2 text-sm text-zinc-500">
          {text2.length} character{text2.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>

    <!-- Diff Result -->
    {#if diffResult.length > 0}
      <div class="mt-8">
        <h2 class="mb-4 text-lg font-semibold text-white">Diff Result</h2>
        <div class="overflow-auto rounded-lg border border-zinc-800 bg-zinc-900">
          <div class="font-mono text-sm">
            {#each diffResult as part}
              <div
                class="px-4 py-1 {part.type === 'added'
                  ? 'border-l-2 border-green-500 bg-green-500/10 text-green-300'
                  : part.type === 'removed'
                    ? 'border-l-2 border-red-500 bg-red-500/10 text-red-300 line-through'
                    : 'text-zinc-300'}"
              >
                {part.text}
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </main>

