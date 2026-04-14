<script>
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>About - Alexandria Tools</title>
  <meta
    name="description"
    content="Learn about Alexandria Tools - A modern collection of utility tools"
  />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
  <h1 class="mb-8 text-4xl font-bold text-white">About Alexandria Tools</h1>

  <div class="prose max-w-none prose-invert prose-zinc">
    <p class="mb-8 text-xl text-zinc-300">
      Alexandria Tools is a modern, open-source collection of utility tools designed to make
      everyday tasks easier and more efficient.
    </p>

    <section class="mb-8">
      <h2 class="mb-4 text-2xl font-semibold text-white">Our Mission</h2>
      <p class="text-zinc-300">
        We believe in providing simple, powerful, and accessible tools that help developers,
        designers, and anyone who needs quick transformations or calculations.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="mb-4 text-2xl font-semibold text-white">Features</h2>
      <ul class="list-inside list-disc space-y-2 text-zinc-300">
        <li>Fast and responsive interface</li>
        <li>No server-side processing - all operations run in your browser</li>
        <li>Privacy-focused - your data never leaves your device</li>
        <li>Open source and community-driven</li>
        <li>Works on all modern browsers and devices</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="mb-4 text-2xl font-semibold text-white">Technology</h2>
      <p class="text-zinc-300">
        Built with modern web technologies including SvelteKit, TypeScript, and Tailwind CSS to
        deliver a smooth and efficient user experience.
      </p>
    </section>

    <section>
      <h2 class="mb-4 text-2xl font-semibold text-white">Open Source</h2>
      <p class="text-zinc-300">
        Alexandria Tools is open source and available on GitHub. We welcome contributions, bug
        reports, and feature requests from community.
      </p>
    </section>
  </div>
</div>
