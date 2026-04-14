<script lang="ts">
  import { page } from "$app/stores";
  import favicon from "$lib/assets/favicon.svg";
</script>

<nav class="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a
        href="/"
        class="flex items-center gap-2 text-xl font-bold text-white transition-colors hover:text-emerald-400"
      >
        <img src={favicon} alt="Alexandria Tools" class="h-6 w-6" />
        <span>Alexandria Tools</span>
      </a>

      <!-- Navigation Links -->
      <div class="flex items-center gap-6">
        <a
          href="/"
          class="text-sm font-medium {$page.url.pathname === '/'
            ? 'text-emerald-400'
            : 'text-zinc-400 hover:text-white'} transition-colors"
        >
          Home
        </a>
        <a
          href="/tools"
          class="text-sm font-medium {$page.url.pathname.startsWith('/tools')
            ? 'text-emerald-400'
            : 'text-zinc-400 hover:text-white'} transition-colors"
        >
          Tools
        </a>
        <a
          href="/about"
          class="text-sm font-medium {String($page.url.pathname) === '/about'
            ? 'text-emerald-400'
            : 'text-zinc-400 hover:text-white'} transition-colors"
        >
          About
        </a>
      </div>
    </div>
  </div>
</nav>
