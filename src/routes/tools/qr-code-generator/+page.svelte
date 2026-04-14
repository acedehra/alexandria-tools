<script lang="ts">
  import { browser } from "$app/environment";

  let text = $state("https://example.com");
  let dataUrl = $state("");
  let qrError = $state<string | null>(null);

  $effect(() => {
    const value = text;
    if (!browser) return;
    let cancelled = false;
    qrError = null;
    import("qrcode")
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(value || " ", {
          width: 280,
          margin: 2,
          color: { dark: "#e4e4e7ff", light: "#18181bff" }
        })
      )
      .then((url) => {
        if (!cancelled) dataUrl = url;
      })
      .catch((e: Error) => {
        if (!cancelled) {
          qrError = e.message || "Could not generate QR code";
          dataUrl = "";
        }
      });
    return () => {
      cancelled = true;
    };
  });

  function download() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  }
</script>

<svelte:head>
  <title>QR Code Generator — Alexandria Tools</title>
  <meta name="description" content="Create a QR code image from any text or URL in your browser." />
</svelte:head>


  <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">QR Code Generator</h1>
      <p class="mt-2 text-zinc-400">
        Runs locally. Put a URL, Wi-Fi string, or any short text — a PNG data URL is generated for
        preview and download.
      </p>
    </div>

    <label for="qr-text" class="mb-2 block text-sm font-medium text-zinc-300">Content</label>
    <textarea
      id="qr-text"
      bind:value={text}
      rows="4"
      class="mb-6 w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      placeholder="https://…"
    ></textarea>

    {#if qrError}
      <div
        class="mb-4 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300"
      >
        {qrError}
      </div>
    {/if}

    <div class="flex flex-col items-center rounded-xl border border-zinc-800 bg-zinc-900/40 p-8">
      {#if dataUrl}
        <img src={dataUrl} alt="QR code" class="max-w-full rounded-lg" width="280" height="280" />
        <button
          type="button"
          onclick={download}
          class="mt-6 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          Download PNG
        </button>
      {:else if !qrError}
        <p class="text-zinc-500">Generating…</p>
      {/if}
    </div>
  </main>

