<script lang="ts">

  let token = $state("");
  let headerJson = $state("");
  let payloadJson = $state("");
  let decodeError = $state<string | null>(null);

  function base64UrlDecode(segment: string): string {
    let b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    if (pad) b64 += "=".repeat(4 - pad);
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function decode() {
    decodeError = null;
    headerJson = "";
    payloadJson = "";
    const t = token.trim();
    if (!t) return;
    const parts = t.split(".");
    if (parts.length < 2) {
      decodeError = "Expected a JWT with at least header and payload segments.";
      return;
    }
    try {
      const headerRaw = base64UrlDecode(parts[0]);
      const payloadRaw = base64UrlDecode(parts[1]);
      headerJson = JSON.stringify(JSON.parse(headerRaw), null, 2);
      payloadJson = JSON.stringify(JSON.parse(payloadRaw), null, 2);
    } catch {
      decodeError = "Could not decode Base64URL or parse JSON. Check that the token is valid.";
    }
  }

  $effect(() => {
    token;
    decode();
  });
</script>

<svelte:head>
  <title>JWT Decoder — Alexandria Tools</title>
  <meta
    name="description"
    content="Decode JWT header and payload to formatted JSON. Signatures are not verified."
  />
</svelte:head>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">JWT Decoder</h1>
      <p class="mt-2 text-zinc-400">
        Paste a JWT to inspect the header and payload. This tool does not verify signatures and must
        not be used alone to trust a token.
      </p>
    </div>

    <div
      class="mb-6 rounded-lg border border-amber-900/40 bg-amber-950/30 p-4 text-sm text-amber-200/90"
    >
      <strong class="text-amber-100">Security note:</strong> decoding runs locally in your browser. Never
      paste production secrets into untrusted sites.
    </div>

    <label for="jwt" class="mb-2 block text-sm font-medium text-zinc-300">JWT</label>
    <textarea
      id="jwt"
      bind:value={token}
      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      class="mb-6 h-32 w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
    ></textarea>

    {#if decodeError}
      <div
        class="mb-6 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300"
      >
        {decodeError}
      </div>
    {/if}

    <div class="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 class="mb-2 text-lg font-semibold text-white">Header</h2>
        <pre
          class="max-h-96 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 font-mono text-sm text-zinc-200">{headerJson ||
            "—"}</pre>
      </div>
      <div>
        <h2 class="mb-2 text-lg font-semibold text-white">Payload</h2>
        <pre
          class="max-h-96 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 font-mono text-sm text-zinc-200">{payloadJson ||
            "—"}</pre>
      </div>
    </div>
  </main>

