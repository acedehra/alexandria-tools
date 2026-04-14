<script lang="ts">
  interface Props {
    name: string;
    description: string;
    icon: any;
    path: string;
  }

  let { name, description, icon: Icon, path }: Props = $props();
</script>

<a
  href={path}
  class="group relative block rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:bg-zinc-900 hover:shadow-lg hover:shadow-emerald-500/10"
>
  <!-- Icon -->
  <div
    class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20 group-hover:text-emerald-300"
  >
    {#if Icon}
      <Icon class="h-6 w-6" />
    {/if}
  </div>

  <!-- Title -->
  <h3 class="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-emerald-400">
    {name}
  </h3>

  <!-- Description -->
  <p class="text-sm text-zinc-400 transition-colors group-hover:text-zinc-300">
    {description}
  </p>

  <!-- Arrow indicator -->
  <div
    class="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-emerald-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </div>
</a>
