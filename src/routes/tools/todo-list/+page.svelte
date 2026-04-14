<script lang="ts">

  interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
  }

  let todos = $state<TodoItem[]>(loadTodos());
  let newTodo = $state("");
  let filter = $state<"all" | "active" | "completed">("all");

  function loadTodos(): TodoItem[] {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("todo-list");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore errors
    }
    return [];
  }

  function saveTodos(): void {
    try {
      localStorage.setItem("todo-list", JSON.stringify(todos));
    } catch {
      // Ignore errors
    }
  }

  function addTodo(): void {
    if (!newTodo.trim()) return;

    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: Date.now()
    };

    todos = [todo, ...todos];
    newTodo = "";
    saveTodos();
  }

  function toggleTodo(id: string): void {
    todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    saveTodos();
  }

  function deleteTodo(id: string): void {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
  }

  function editTodo(id: string, newText: string): void {
    todos = todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo));
    saveTodos();
  }

  function clearCompleted(): void {
    todos = todos.filter((todo) => !todo.completed);
    saveTodos();
  }

  function getFilteredTodos(): TodoItem[] {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }

  function getStats(): { total: number; active: number; completed: number } {
    return {
      total: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length
    };
  }

  const stats = $derived(getStats());
  const filteredTodos = $derived(getFilteredTodos());
</script>

<svelte:head>
  <title>To-Do List — Alexandria Tools</title>
  <meta name="description" content="Simple and effective to-do list for tracking your tasks." />
</svelte:head>


  <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">To-Do List</h1>
      <p class="mt-2 text-zinc-400">
        Track your tasks and stay organized. All data is saved locally in your browser.
      </p>
    </div>

    <!-- Add Todo Form -->
    <div class="mb-6 flex gap-3">
      <input
        type="text"
        bind:value={newTodo}
        onkeydown={(e) => e.key === "Enter" && addTodo()}
        placeholder="What needs to be done?"
        class="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      />
      <button
        type="button"
        onclick={addTodo}
        class="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-600"
      >
        Add
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-6 flex gap-2">
      <button
        type="button"
        onclick={() => (filter = "all")}
        class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {filter === 'all'
          ? 'bg-emerald-500 text-white'
          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-300'}"
      >
        All ({stats.total})
      </button>
      <button
        type="button"
        onclick={() => (filter = "active")}
        class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {filter === 'active'
          ? 'bg-emerald-500 text-white'
          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-300'}"
      >
        Active ({stats.active})
      </button>
      <button
        type="button"
        onclick={() => (filter = "completed")}
        class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {filter === 'completed'
          ? 'bg-emerald-500 text-white'
          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-300'}"
      >
        Completed ({stats.completed})
      </button>
    </div>

    <!-- Todo List -->
    <div class="space-y-2">
      {#if filteredTodos.length === 0}
        <div class="rounded-lg border border-dashed border-zinc-800 p-8 text-center">
          <p class="text-zinc-500">
            {filter === "all" && stats.total === 0
              ? "No tasks yet. Add one above!"
              : `No ${filter} tasks.`}
          </p>
        </div>
      {:else}
        {#each filteredTodos as todo (todo.id)}
          <div
            class="group flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 transition-colors hover:bg-zinc-900/60"
          >
            <input
              type="checkbox"
              bind:checked={todo.completed}
              onchange={() => toggleTodo(todo.id)}
              class="mt-1 h-5 w-5 flex-shrink-0 cursor-pointer rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
            />
            <div class="min-w-0 flex-1">
              {#if todo.isEditing}
                <input
                  type="text"
                  bind:value={todo.text}
                  onblur={() => editTodo(todo.id, todo.text)}
                  onkeydown={(e) => e.key === "Enter" && editTodo(todo.id, todo.text)}
                  class="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              {:else}
                <p class="break-words text-white {todo.completed ? 'line-through opacity-60' : ''}">
                  {todo.text}
                </p>
                <p class="mt-1 text-xs text-zinc-500">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </p>
              {/if}
            </div>
            <div class="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onclick={() => editTodo(todo.id, prompt("Edit task:", todo.text) || todo.text)}
                class="rounded p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                aria-label="Edit"
              >
                ✏️
              </button>
              <button
                type="button"
                onclick={() => deleteTodo(todo.id)}
                class="rounded p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-red-400"
                aria-label="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Clear Completed Button -->
    {#if stats.completed > 0}
      <div class="mt-6 flex justify-center">
        <button
          type="button"
          onclick={clearCompleted}
          class="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
        >
          Clear completed ({stats.completed})
        </button>
      </div>
    {/if}

    <!-- Empty State Message -->
    {#if stats.total === 0}
      <div class="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/40 p-8 text-center">
        <p class="mb-4 text-4xl">📝</p>
        <p class="mb-2 text-zinc-400">Your to-do list is empty</p>
        <p class="text-sm text-zinc-500">Add your first task above to get started!</p>
      </div>
    {/if}
  </main>

