<script lang="ts">

  let input = $state("");
  let maxLength = $state(72);

  function toSlug(s: string, max: number): string {
    let out = s
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (out.length > max) {
      out = out.slice(0, max).replace(/-+$/g, "");
    }
    return out;
  }

  let slug = $state("");

  $effect(() => {
    slug = toSlug(input, maxLength);
  });

  function copy() {
    if (slug) void navigator.clipboard.writeText(slug);
  }
</script>

<svelte:head>
  <title>Slug Generator — Alexandria Tools</title>
  <meta name="description" content="Turn titles or phrases into URL-safe slugs." />
</svelte:head>


  <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Slug Generator</h1>
      <p class="mt-2 text-zinc-400">
        Lowercase, strip accents, replace spaces with hyphens, and trim to a max length.
      </p>
    </div>

    <div class="mb-6">
      <label for="title" class="mb-2 block text-sm font-medium text-zinc-300">Title or phrase</label
      >
      <textarea
        id="title"
        bind:value={input}
        rows="3"
        placeholder="My Great Article Title!"
        class="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      ></textarea>
    </div>

    <div class="mb-6">
      <label for="max" class="mb-2 block text-sm font-medium text-zinc-300"
        >Max length ({maxLength})</label
      >
      <input
        id="max"
        type="range"
        min="16"
        max="120"
        bind:value={maxLength}
        class="w-full accent-emerald-500"
      />
    </div>

    <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm font-medium text-zinc-300">Slug</span>
        <button
          type="button"
          onclick={copy}
          disabled={!slug}
          class="text-sm text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
        >
          Copy
        </button>
      </div>
      <code class="block font-mono text-lg break-all text-emerald-300">{slug || "—"}</code>
    </div>
  </main>

