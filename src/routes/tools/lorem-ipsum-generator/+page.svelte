<script lang="ts">

  const loremWords = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "enim",
    "ad",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "aliquip",
    "ex",
    "ea",
    "commodo",
    "consequat",
    "duis",
    "aute",
    "irure",
    "in",
    "reprehenderit",
    "voluptate",
    "velit",
    "esse",
    "cillum",
    "fugiat",
    "nulla",
    "pariatur",
    "excepteur",
    "sint",
    "occaecat",
    "cupidatat",
    "non",
    "proident",
    "sunt",
    "culpa",
    "qui",
    "officia",
    "deserunt",
    "mollit",
    "anim",
    "id",
    "est",
    "laborum"
  ];

  let paragraphs = $state(3);
  let sentencesPerParagraph = $state(5);
  let startWithLorem = $state(true);
  let generatedText = $state("");

  function generateLoremIpsum(): string {
    const result: string[] = [];

    for (let p = 0; p < paragraphs; p++) {
      const paragraphSentences: string[] = [];

      for (let s = 0; s < sentencesPerParagraph; s++) {
        // Random sentence length between 5 and 15 words
        const sentenceLength = Math.floor(Math.random() * 11) + 5;
        const sentenceWords: string[] = [];

        for (let w = 0; w < sentenceLength; w++) {
          const word = loremWords[Math.floor(Math.random() * loremWords.length)];
          if (w === 0) {
            sentenceWords.push(word.charAt(0).toUpperCase() + word.slice(1));
          } else {
            sentenceWords.push(word);
          }
        }

        paragraphSentences.push(sentenceWords.join(" ") + ".");
      }

      result.push(paragraphSentences.join(" "));
    }

    let finalText = result.join("\n\n");

    if (startWithLorem) {
      finalText = "Lorem ipsum dolor sit amet, " + finalText;
    }

    return finalText;
  }

  function generate() {
    generatedText = generateLoremIpsum();
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(generatedText);
  }

  // Generate on load
  generate();

  $effect(() => {
    generate();
  });
</script>


  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Lorem Ipsum Generator</h1>
      <p class="mt-2 text-zinc-400">Generate placeholder text for your designs and mockups.</p>
    </div>

    <div class="grid gap-8 lg:grid-cols-3">
      <!-- Settings -->
      <div class="space-y-6">
        <h2 class="text-lg font-semibold text-white">Settings</h2>

        <!-- Paragraphs -->
        <div>
          <label for="paragraphs" class="mb-2 block text-sm font-medium text-zinc-300">
            Paragraphs: {paragraphs}
          </label>
          <input
            id="paragraphs"
            type="range"
            min="1"
            max="20"
            bind:value={paragraphs}
            class="w-full accent-emerald-500"
          />
          <div class="mt-1 text-xs text-zinc-500">Number of paragraphs to generate</div>
        </div>

        <!-- Sentences per Paragraph -->
        <div>
          <label for="sentences" class="mb-2 block text-sm font-medium text-zinc-300">
            Sentences per Paragraph: {sentencesPerParagraph}
          </label>
          <input
            id="sentences"
            type="range"
            min="1"
            max="15"
            bind:value={sentencesPerParagraph}
            class="w-full accent-emerald-500"
          />
          <div class="mt-1 text-xs text-zinc-500">Average sentences per paragraph</div>
        </div>

        <!-- Start with Lorem -->
        <div class="flex items-center gap-3">
          <input
            id="startWithLorem"
            type="checkbox"
            bind:checked={startWithLorem}
            class="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950"
          />
          <label for="startWithLorem" class="text-sm text-zinc-300">
            Start with "Lorem ipsum"
          </label>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            onclick={generate}
            class="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-600"
          >
            Regenerate
          </button>
          <button
            onclick={copyToClipboard}
            disabled={!generatedText}
            class="flex-1 rounded-lg border border-zinc-700 px-4 py-2 font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy
          </button>
        </div>
      </div>

      <!-- Output -->
      <div class="lg:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <label class="text-sm font-medium text-zinc-300">Generated Text</label>
          <div class="text-sm text-zinc-500">
            {generatedText.split(/\s+/).length} words
          </div>
        </div>
        <div
          class="h-96 w-full overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-zinc-300"
        >
          {#each generatedText.split("\n\n") as paragraph, _index}
            <p class="mb-4 last:mb-0">
              {paragraph}
            </p>
          {/each}
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <h3 class="mb-3 text-lg font-semibold text-white">About Lorem Ipsum</h3>
      <div class="space-y-2 text-sm text-zinc-400">
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the
          industry's standard dummy text ever since the 1500s.
        </p>
        <p>Use this generator to create placeholder text for:</p>
        <ul class="ml-4 list-disc space-y-1">
          <li>Website mockups and wireframes</li>
          <li>Graphic design layouts</li>
          <li>Print design proofs</li>
          <li>Typography testing</li>
        </ul>
      </div>
    </div>
  </main>

