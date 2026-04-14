<script lang="ts">

  let uuids = $state<string[]>([]);
  const count = 5;

  function generate() {
    const next: string[] = [];
    for (let i = 0; i < count; i++) {
      next.push(crypto.randomUUID());
    }
    uuids = next;
  }

  function copyOne(u: string) {
    void navigator.clipboard.writeText(u);
  }

  function copyAll() {
    if (uuids.length) void navigator.clipboard.writeText(uuids.join("\n"));
  }

  generate();
</script>

<svelte:head>
  <title>UUID Generator — Alexandria Tools</title>
  <meta name="description" content="Generate random UUID v4 identifiers in your browser." />
</svelte:head>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">UUID Generator</h1>
      <p class="mt-2 text-zinc-400">
        Generates RFC 4122 version 4 UUIDs using the browser&apos;s cryptographically strong random
        source.
      </p>
    </div>

    <div class="mb-8 flex flex-wrap gap-2">
      <button
        type="button"
        onclick={generate}
        class="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
      >
        Generate new set
      </button>
      <button
        type="button"
        onclick={copyAll}
        disabled={!uuids.length}
        class="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Copy all
      </button>
    </div>

    <ul class="space-y-3">
      {#each uuids as u (u)}
        <li
          class="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <code class="font-mono text-sm break-all text-emerald-300">{u}</code>
          <button
            type="button"
            onclick={() => copyOne(u)}
            class="shrink-0 text-sm text-zinc-400 hover:text-white"
          >
            Copy
          </button>
        </li>
      {/each}
    </ul>
  </main>

