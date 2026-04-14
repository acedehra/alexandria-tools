<script lang="ts">

  let useMs = $state(false);
  /** Single source of truth for the selected instant */
  let msValue = $state<number | null>(null);

  function pad(n: number) {
    return String(n).padStart(2, "0");
  }

  function toLocalString(d: Date) {
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    const s = pad(d.getSeconds());
    return `${y}-${m}-${day}T${h}:${min}:${s}`;
  }

  function toUtcString(d: Date) {
    const y = d.getUTCFullYear();
    const m = pad(d.getUTCMonth() + 1);
    const day = pad(d.getUTCDate());
    const h = pad(d.getUTCHours());
    const min = pad(d.getUTCMinutes());
    const s = pad(d.getUTCSeconds());
    return `${y}-${m}-${day}T${h}:${min}:${s}`;
  }

  let epochInput = $state("");
  let localInput = $state("");
  let utcInput = $state("");

  function pushFieldsFromMs(ms: number) {
    const d = new Date(ms);
    epochInput = useMs ? String(ms) : String(Math.floor(ms / 1000));
    localInput = toLocalString(d);
    utcInput = toUtcString(d);
  }

  function onEpochInput() {
    const raw = epochInput.trim();
    if (!raw) {
      msValue = null;
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    msValue = useMs ? n : n * 1000;
    if (msValue !== null) {
      const d = new Date(msValue);
      localInput = toLocalString(d);
      utcInput = toUtcString(d);
    }
  }

  function onLocalInput() {
    const raw = localInput.trim();
    if (!raw) {
      msValue = null;
      return;
    }
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return;
    msValue = d.getTime();
    if (msValue !== null) pushFieldsFromMs(msValue);
  }

  function onUtcInput() {
    const raw = utcInput.trim();
    if (!raw) {
      msValue = null;
      return;
    }
    const d = new Date(raw.endsWith("Z") ? raw : `${raw}Z`);
    if (Number.isNaN(d.getTime())) return;
    msValue = d.getTime();
    if (msValue !== null) pushFieldsFromMs(msValue);
  }

  function setNow() {
    msValue = Date.now();
    if (msValue !== null) pushFieldsFromMs(msValue);
  }

  $effect(() => {
    useMs;
    if (msValue !== null) pushFieldsFromMs(msValue);
  });
</script>

<svelte:head>
  <title>Unix Timestamp Converter — Alexandria Tools</title>
  <meta
    name="description"
    content="Convert between Unix epoch time and local or UTC datetime strings."
  />
</svelte:head>


  <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Unix Timestamp Converter</h1>
      <p class="mt-2 text-zinc-400">
        Epoch values are interpreted in your local timezone for the datetime fields. The UTC field
        shows the same instant as UTC.
      </p>
    </div>

    <div class="mb-6 flex flex-wrap items-center gap-4">
      <label class="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" bind:checked={useMs} class="rounded border-zinc-600" />
        Milliseconds (instead of seconds)
      </label>
      <button
        type="button"
        onclick={setNow}
        class="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
      >
        Now
      </button>
    </div>

    <div class="space-y-6">
      <div>
        <label for="epoch" class="mb-2 block text-sm font-medium text-zinc-300"
          >Unix {useMs ? "time (ms)" : "time (s)"}</label
        >
        <input
          id="epoch"
          type="text"
          bind:value={epochInput}
          oninput={onEpochInput}
          placeholder={useMs ? "1735689600000" : "1735689600"}
          class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="local" class="mb-2 block text-sm font-medium text-zinc-300"
          >Local datetime</label
        >
        <input
          id="local"
          type="datetime-local"
          step="1"
          bind:value={localInput}
          oninput={onLocalInput}
          class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="utc" class="mb-2 block text-sm font-medium text-zinc-300"
          >UTC (<code class="text-emerald-400">YYYY-MM-DDTHH:mm:ss</code>)</label
        >
        <input
          id="utc"
          type="text"
          bind:value={utcInput}
          oninput={onUtcInput}
          placeholder="2025-01-01T00:00:00"
          class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
      </div>
    </div>

    <p class="mt-8 text-sm text-zinc-500">
      UTC input is parsed as UTC (append <code class="text-zinc-400">Z</code> if you paste an ISO string
      without a zone).
    </p>
  </main>

