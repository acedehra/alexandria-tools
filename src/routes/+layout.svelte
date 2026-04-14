<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <title>Alexandria Tools</title>
  <link rel="icon" href={favicon} type="image/svg+xml" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="description"
    content="Alexandria Tools — fast, secure, and free online tools for developers, designers, and anyone who needs to get things done quickly."
  />
</svelte:head>

<div class="min-h-screen bg-zinc-950">
  <Navbar />

  <div class="flex-1">
    {@render children()}
  </div>

  <Footer />
</div>
