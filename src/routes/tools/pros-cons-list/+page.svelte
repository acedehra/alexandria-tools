<script lang="ts">
  import Scale from "~icons/lucide/scale";


  interface Item {
    id: string;
    text: string;
    weight: number;
  }

  interface ProsConsList {
    id: string;
    title: string;
    description: string;
    pros: Item[];
    cons: Item[];
    createdAt: number;
  }

  let lists = $state<ProsConsList[]>(loadLists());
  let showNewListForm = $state(false);
  let newListTitle = $state("");
  let newListDescription = $state("");

  function loadLists(): ProsConsList[] {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("pros-cons-lists");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore errors
    }
    return [];
  }

  function saveLists(): void {
    try {
      localStorage.setItem("pros-cons-lists", JSON.stringify(lists));
    } catch {
      // Ignore errors
    }
  }

  function createList(): void {
    if (!newListTitle.trim()) return;

    const list: ProsConsList = {
      id: Date.now().toString(),
      title: newListTitle.trim(),
      description: newListDescription.trim(),
      pros: [],
      cons: [],
      createdAt: Date.now()
    };

    lists = [list, ...lists];
    newListTitle = "";
    newListDescription = "";
    showNewListForm = false;
    saveLists();
  }

  function deleteList(id: string): void {
    lists = lists.filter((list) => list.id !== id);
    saveLists();
  }

  function addItem(listId: string, type: "pros" | "cons", text: string): void {
    const item: Item = {
      id: Date.now().toString(),
      text: text.trim(),
      weight: 5
    };

    lists = lists.map((list) =>
      list.id === listId ? { ...list, [type]: [...list[type], item] } : list
    );
    saveLists();
  }

  function deleteItem(listId: string, type: "pros" | "cons", itemId: string): void {
    lists = lists.map((list) =>
      list.id === listId
        ? { ...list, [type]: list[type].filter((item) => item.id !== itemId) }
        : list
    );
    saveLists();
  }

  function updateItemWeight(
    listId: string,
    type: "pros" | "cons",
    itemId: string,
    weight: number
  ): void {
    lists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            [type]: list[type].map((item) => (item.id === itemId ? { ...item, weight } : item))
          }
        : list
    );
    saveLists();
  }

  function calculateScore(list: ProsConsList): number {
    const proScore = list.pros.reduce((sum, item) => sum + item.weight, 0);
    const conScore = list.cons.reduce((sum, item) => sum + item.weight, 0);
    return proScore - conScore;
  }

  function getScoreColor(score: number): string {
    if (score > 0) return "text-green-400";
    if (score < 0) return "text-red-400";
    return "text-zinc-400";
  }

  function getScoreLabel(score: number): string {
    if (score > 0) return "Pros outweigh Cons";
    if (score < 0) return "Cons outweigh Pros";
    return "Balanced";
  }
</script>

<svelte:head>
  <title>Pros & Cons List — Alexandria Tools</title>
  <meta
    name="description"
    content="Make balanced decisions with weighted pros and cons analysis."
  />
</svelte:head>


  <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8 text-center">
      <div
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400"
      >
        <Scale class="h-8 w-8" />
      </div>
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Pros & Cons List</h1>
      <p class="mt-2 text-zinc-400">
        Make balanced decisions by weighing the advantages and disadvantages of your options.
      </p>
    </div>

    <!-- Create New List Form -->
    {#if showNewListForm}
      <div class="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 class="mb-4 text-lg font-semibold text-white">New Decision</h2>
        <div class="space-y-4">
          <div>
            <label for="newTitle" class="mb-2 block text-sm font-medium text-zinc-300">Title</label>
            <input
              id="newTitle"
              type="text"
              bind:value={newListTitle}
              placeholder="What are you deciding?"
              class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label for="newDescription" class="mb-2 block text-sm font-medium text-zinc-300"
              >Description (optional)</label
            >
            <textarea
              id="newDescription"
              bind:value={newListDescription}
              placeholder="Add some context..."
              rows="2"
              class="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            ></textarea>
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              onclick={createList}
              disabled={!newListTitle.trim()}
              class="rounded-lg bg-emerald-500 px-6 py-2 font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
            >
              Create List
            </button>
            <button
              type="button"
              onclick={() => {
                showNewListForm = false;
                newListTitle = "";
                newListDescription = "";
              }}
              class="rounded-lg border border-zinc-700 px-6 py-2 font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    {:else}
      <button
        type="button"
        onclick={() => (showNewListForm = true)}
        class="mb-8 w-full rounded-lg border-2 border-dashed border-zinc-800 px-6 py-4 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300"
      >
        + New Decision List
      </button>
    {/if}

    <!-- Decision Lists -->
    <div class="space-y-8">
      {#if lists.length === 0}
        <div class="rounded-lg border border-dashed border-zinc-800 p-8 text-center">
          <div
            class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-zinc-500"
          >
            <Scale class="h-6 w-6" />
          </div>
          <p class="mb-2 text-zinc-400">No decisions yet</p>
          <p class="text-sm text-zinc-500">
            Create a new list above to start analyzing your options.
          </p>
        </div>
      {:else}
        {#each lists as list (list.id)}
          {@const score = calculateScore(list)}
          <div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <!-- List Header -->
            <div class="mb-6 flex items-start justify-between gap-4">
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-white">{list.title}</h2>
                {#if list.description}
                  <p class="mt-1 text-sm text-zinc-400">{list.description}</p>
                {/if}
                <p class="mt-2 text-xs text-zinc-500">
                  Created {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold {getScoreColor(score)}">
                  {score > 0 ? "+" : ""}{score}
                </div>
                <div class="text-sm {getScoreColor(score)}">{getScoreLabel(score)}</div>
              </div>
            </div>

            <!-- Add Items Form -->
            <div class="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <form
                  onsubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.querySelector("input");
                    if (input) {
                      addItem(list.id, "pros", input.value);
                      input.value = "";
                    }
                  }}
                >
                  <label class="mb-2 block text-sm font-medium text-green-400"> + Add Pro </label>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      placeholder="What's good about this?"
                      class="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      class="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
              <div>
                <form
                  onsubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.querySelector("input");
                    if (input) {
                      addItem(list.id, "cons", input.value);
                      input.value = "";
                    }
                  }}
                >
                  <label class="mb-2 block text-sm font-medium text-red-400"> + Add Con </label>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      placeholder="What's bad about this?"
                      class="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Pros and Cons Grid -->
            <div class="grid gap-6 sm:grid-cols-2">
              <!-- Pros -->
              <div class="space-y-3">
                <h3 class="font-medium text-green-400">Pros</h3>
                {#if list.pros.length === 0}
                  <p class="text-sm text-zinc-500">No pros added yet</p>
                {:else}
                  {#each list.pros as item (item.id)}
                    <div
                      class="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
                    >
                      <button
                        type="button"
                        onclick={() => deleteItem(list.id, "pros", item.id)}
                        class="rounded p-1 text-zinc-500 hover:text-red-400"
                        aria-label="Delete"
                      >
                        ✕
                      </button>
                      <span class="flex-1 text-white">{item.text}</span>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          onclick={() =>
                            updateItemWeight(
                              list.id,
                              "pros",
                              item.id,
                              Math.max(1, item.weight - 1)
                            )}
                          class="rounded p-1 text-zinc-400 hover:text-zinc-300"
                        >
                          -
                        </button>
                        <span class="w-6 text-center text-sm font-medium text-green-400"
                          >{item.weight}</span
                        >
                        <button
                          type="button"
                          onclick={() =>
                            updateItemWeight(
                              list.id,
                              "pros",
                              item.id,
                              Math.min(10, item.weight + 1)
                            )}
                          class="rounded p-1 text-zinc-400 hover:text-zinc-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  {/each}
                {/if}
              </div>

              <!-- Cons -->
              <div class="space-y-3">
                <h3 class="font-medium text-red-400">Cons</h3>
                {#if list.cons.length === 0}
                  <p class="text-sm text-zinc-500">No cons added yet</p>
                {:else}
                  {#each list.cons as item (item.id)}
                    <div
                      class="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
                    >
                      <button
                        type="button"
                        onclick={() => deleteItem(list.id, "cons", item.id)}
                        class="rounded p-1 text-zinc-500 hover:text-red-400"
                        aria-label="Delete"
                      >
                        ✕
                      </button>
                      <span class="flex-1 text-white">{item.text}</span>
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          onclick={() =>
                            updateItemWeight(
                              list.id,
                              "cons",
                              item.id,
                              Math.max(1, item.weight - 1)
                            )}
                          class="rounded p-1 text-zinc-400 hover:text-zinc-300"
                        >
                          -
                        </button>
                        <span class="w-6 text-center text-sm font-medium text-red-400"
                          >{item.weight}</span
                        >
                        <button
                          type="button"
                          onclick={() =>
                            updateItemWeight(
                              list.id,
                              "cons",
                              item.id,
                              Math.min(10, item.weight + 1)
                            )}
                          class="rounded p-1 text-zinc-400 hover:text-zinc-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  {/each}
                {/if}
              </div>
            </div>

            <!-- Delete List Button -->
            <div class="mt-6 flex justify-end">
              <button
                type="button"
                onclick={() => deleteList(list.id)}
                class="rounded-lg border border-red-900/50 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-900/20"
              >
                Delete this decision
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </main>

