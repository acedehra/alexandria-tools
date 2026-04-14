<script lang="ts">
  import ToolCard from "$lib/components/ToolCard.svelte";
  import { toolCategories } from "$lib/tools";
</script>

<svelte:head>
  <title>All tools — Alexandria Tools</title>
  <meta
    name="description"
    content="Browse all Alexandria Tools by category: string, developer, date and time, encoding, color, QR, calculators, writing, and security."
  />
</svelte:head>

<main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-12">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">All tools</h1>
      <p class="mt-2 max-w-2xl text-zinc-400">
        Every utility on Alexandria Tools, grouped by category. All processing happens in your
        browser.
      </p>
      <p class="mt-4">
        <a href="/#tools" class="text-sm font-medium text-emerald-400 hover:text-emerald-300">
          ← Back to home
        </a>
      </p>
    </div>

    {#each toolCategories as category (category.id)}
      <section id={category.id} class="mb-16 last:mb-0">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-white sm:text-3xl">{category.title}</h2>
          <p class="mt-2 text-zinc-400">{category.description}</p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {#each category.tools as tool (tool.path)}
            <ToolCard
              name={tool.name}
              description={tool.description}
              icon={tool.icon}
              path={tool.path}
            />
          {/each}
        </div>
      </section>
    {/each}
  </main>
