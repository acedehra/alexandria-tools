<script lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-zinc-800 bg-zinc-950">
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <!-- Copyright -->
      <p class="text-sm text-zinc-500">
        © {currentYear} Alexandria Tools. All rights reserved.
      </p>

      <!-- Links -->
      <div class="flex items-center gap-6">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          GitHub
        </a>
        <a href="/about" class="text-sm text-zinc-400 transition-colors hover:text-white">
          About
        </a>
        <a href="/privacy" class="text-sm text-zinc-400 transition-colors hover:text-white">
          Privacy
        </a>
      </div>
    </div>
  </div>
</footer>
