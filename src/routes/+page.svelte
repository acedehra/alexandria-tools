<script lang="ts">
  import ToolCard from "$lib/components/ToolCard.svelte";
  import { toolCategories, allTools, type ToolEntry } from "$lib/tools";
  import Zap from "~icons/lucide/zap";
  import Shield from "~icons/lucide/shield";
  import Ban from "~icons/lucide/ban";
  import Code from "~icons/lucide/code";

  const features = [
    {
      title: "Lightning Fast",
      description: "All tools run locally in your browser for instant results.",
      icon: Zap
    },
    {
      title: "Privacy First",
      description: "No data is sent to servers. Everything stays on your device.",
      icon: Shield
    },
    {
      title: "No Ads",
      description: "Clean, distraction-free interface without any advertisements.",
      icon: Ban
    },
    {
      title: "Open Source",
      description: "Free and open source tools that you can trust.",
      icon: Code
    }
  ];

  let searchQuery = $state("");
  let showDropdown = $state(false);
  let selectedIndex = $state(-1);

  let filteredTools = $derived.by(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query)
    );
  });

  let isSearchActive = $derived(searchQuery.trim().length > 0);

  function selectTool(tool: ToolEntry) {
    window.location.href = tool.path;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!showDropdown || filteredTools.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, filteredTools.length - 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredTools.length) {
          selectTool(filteredTools[selectedIndex]);
        }
        break;
      case "Escape":
        showDropdown = false;
        selectedIndex = -1;
        break;
    }
  }

  // Close dropdown when clicking outside
  let searchContainer: HTMLDivElement;

  // Handle click outside to close dropdown
  function handleClickOutside(event: MouseEvent) {
    if (searchContainer && !searchContainer.contains(event.target as Node)) {
      showDropdown = false;
      selectedIndex = -1;
    }
  }

  // Use a simple document click listener instead of on:clickoutside
  $effect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
</script>

<!-- Hero Section -->
  <section class="relative bg-gradient-to-b from-zinc-900/50 to-transparent">
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-zinc-950 to-zinc-950"
    ></div>
    <div class="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Your Modern
          <span
            class="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent"
          >
            Alexandria
          </span>
        </h1>
        <p class="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl">
          Like the Great Library of Alexandria that once stood as a beacon of knowledge, this
          collection gathers essential tools for developers, designers, and creators.
        </p>
        <a
          href="https://en.wikipedia.org/wiki/Library_of_Alexandria"
          target="_blank"
          rel="noopener noreferrer"
          class="mx-auto mt-4 inline-flex items-center gap-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Learn about the ancient Library of Alexandria
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
        <div class="mt-8 flex flex-col items-center gap-4">
          <div bind:this={searchContainer} class="relative w-full max-w-xl">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tools..."
              bind:value={searchQuery}
              onfocus={() => {
                if (searchQuery.trim()) showDropdown = true;
              }}
              oninput={() => {
                showDropdown = searchQuery.trim().length > 0;
                selectedIndex = -1;
              }}
              onkeydown={handleKeydown}
              class="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 pr-10 pl-12 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            {#if searchQuery}
              <button
                onclick={() => {
                  searchQuery = "";
                  showDropdown = false;
                  selectedIndex = -1;
                }}
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-white"
                type="button"
                aria-label="Clear search"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            {/if}

            <!-- Autocomplete Dropdown -->
            {#if showDropdown && isSearchActive}
              <div
                class="absolute z-[100] mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl"
              >
                {#if filteredTools.length > 0}
                  {#each filteredTools as tool, index (tool.path)}
                    <button
                      onclick={() => selectTool(tool)}
                      onmouseenter={() => (selectedIndex = index)}
                      class="w-full px-4 py-3 text-left hover:bg-zinc-800 focus:bg-zinc-800 focus:outline-none"
                      class:bg-zinc-800={selectedIndex === index}
                    >
                      <div class="flex items-center gap-3">
                        <div class="text-emerald-400">
                          {#if tool.icon}
                            {@const Icon = tool.icon}
                            <Icon class="h-5 w-5" />
                          {/if}
                        </div>
                        <div>
                          <div class="font-medium text-white">{tool.name}</div>
                          <div class="text-sm text-zinc-400">{tool.description}</div>
                        </div>
                      </div>
                    </button>
                  {/each}
                {:else}
                  <div class="px-4 py-3 text-zinc-400">No tools found</div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Tools Section -->
  <section id="tools" class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <!-- Tools by category -->
    {#each toolCategories as category, i (category.id)}
      <div
        id="category-{category.id}"
        class:pt-0={i === 0}
        class:pt-16={i > 0}
        class:border-t={i > 0}
        class:border-zinc-800={i > 0}
      >
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-white sm:text-4xl">{category.title}</h2>
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
      </div>
    {/each}
  </section>

  <!-- Features Section -->
  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mb-12">
      <h2 class="text-3xl font-bold text-white sm:text-4xl">Why Choose Alexandria Tools?</h2>
      <p class="mt-2 text-zinc-400">
        Built with modern web technologies for the best possible experience.
      </p>
    </div>

    <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {#each features as feature}
        <div class="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <div class="mb-4 text-emerald-400">
            {#if feature.icon}
              {@const Icon = feature.icon}
              <Icon class="h-10 w-10" />
            {/if}
          </div>
          <h3 class="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
          <p class="text-sm text-zinc-400">{feature.description}</p>
        </div>
      {/each}
    </div>
  </section>
