<script lang="ts">

  type Phase = "work" | "shortBreak" | "longBreak";

  interface Settings {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
    soundEnabled: boolean;
    autoStartBreaks: boolean;
    autoStartWork: boolean;
  }

  interface Stats {
    todayCompletedSessions: number;
    totalFocusTime: number;
    currentStreak: number;
    lastSessionDate: string | null;
  }

  const DEFAULT_SETTINGS: Settings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    soundEnabled: true,
    autoStartBreaks: false,
    autoStartWork: false
  };

  const DEFAULT_STATS: Stats = {
    todayCompletedSessions: 0,
    totalFocusTime: 0,
    currentStreak: 0,
    lastSessionDate: null
  };

  let settings = $state<Settings>(loadSettings());
  let stats = $state<Stats>(loadStats());
  let timeRemaining = $state(settings.workDuration * 60);
  let isRunning = $state(false);
  let phase = $state<Phase>("work");
  let completedSessionsInCycle = $state(0);
  let currentTask = $state("");
  let showSettings = $state(false);
  let flashTimer = $state(false);

  let intervalId: number | null = null;

  // Get phase color class
  function getPhaseColorClass(): string {
    switch (phase) {
      case "work":
        return "bg-red-500";
      case "shortBreak":
        return "bg-green-500";
      case "longBreak":
        return "bg-blue-500";
    }
  }

  function getPhaseTextClass(): string {
    switch (phase) {
      case "work":
        return "text-red-400";
      case "shortBreak":
        return "text-green-400";
      case "longBreak":
        return "text-blue-400";
    }
  }

  function getPhaseName(): string {
    switch (phase) {
      case "work":
        return "Work";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
    }
  }

  // Format time as MM:SS
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Load settings from localStorage
  function loadSettings(): Settings {
    if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
    try {
      const saved = localStorage.getItem("pomodoro-settings");
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore errors
    }
    return { ...DEFAULT_SETTINGS };
  }

  // Save settings to localStorage
  function saveSettings(): void {
    try {
      localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
    } catch {
      // Ignore errors
    }
  }

  // Load stats from localStorage
  function loadStats(): Stats {
    if (typeof window === "undefined") return { ...DEFAULT_STATS };
    try {
      const saved = localStorage.getItem("pomodoro-stats");
      if (saved) {
        const loaded = JSON.parse(saved);
        // Reset today's sessions if it's a new day
        const today = new Date().toDateString();
        if (loaded.lastSessionDate !== today) {
          // Check if yesterday was the last session (for streak)
          if (loaded.lastSessionDate) {
            const lastDate = new Date(loaded.lastSessionDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastDate.toDateString() !== yesterday.toDateString()) {
              loaded.currentStreak = 0;
            }
          }
          loaded.todayCompletedSessions = 0;
        }
        return { ...DEFAULT_STATS, ...loaded };
      }
    } catch {
      // Ignore errors
    }
    return { ...DEFAULT_STATS };
  }

  // Save stats to localStorage
  function saveStats(): void {
    try {
      localStorage.setItem("pomodoro-stats", JSON.stringify(stats));
    } catch {
      // Ignore errors
    }
  }

  // Update stats when a work session completes
  function updateStats(duration: number): void {
    const today = new Date().toDateString();
    stats.todayCompletedSessions++;
    stats.totalFocusTime += duration;
    stats.lastSessionDate = today;

    // Update streak
    if (stats.todayCompletedSessions === 1) {
      // First session today - check if it's consecutive
      if (stats.lastSessionDate) {
        const lastDate = new Date(stats.lastSessionDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate.toDateString() === yesterday.toDateString()) {
          stats.currentStreak++;
        } else if (lastDate.toDateString() !== today) {
          stats.currentStreak = 1;
        }
      } else {
        stats.currentStreak = 1;
      }
    }

    saveStats();
  }

  // Play notification sound using Web Audio API
  function playNotification(): void {
    if (!settings.soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      // Create a pleasant chime effect
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      // Ignore audio errors
    }
  }

  // Update browser tab title
  function updateTitle(): void {
    const icon = phase === "work" ? "●" : "○";
    const phaseText = phase === "work" ? "Work" : "Break";
    document.title = `${formatTime(timeRemaining)} - ${icon} ${phaseText} | Pomodoro Timer`;
  }

  // Get total duration for current phase
  function getPhaseDuration(): number {
    switch (phase) {
      case "work":
        return settings.workDuration;
      case "shortBreak":
        return settings.shortBreakDuration;
      case "longBreak":
        return settings.longBreakDuration;
    }
  }

  // Calculate progress percentage
  function getProgress(): number {
    const total = getPhaseDuration() * 60;
    return ((total - timeRemaining) / total) * 100;
  }

  // Start the timer
  function startTimer(): void {
    if (isRunning) return;
    isRunning = true;
    intervalId = window.setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
      } else {
        completePhase();
      }
    }, 1000);
  }

  // Pause the timer
  function pauseTimer(): void {
    isRunning = false;
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Complete current phase and transition
  function completePhase(): void {
    pauseTimer();
    playNotification();
    flashTimer = true;
    setTimeout(() => (flashTimer = false), 1000);

    if (phase === "work") {
      // Update stats for completed work session
      updateStats(settings.workDuration);
      completedSessionsInCycle++;

      // Determine next phase
      if (completedSessionsInCycle >= settings.sessionsBeforeLongBreak) {
        // Long break after completing required sessions
        phase = "longBreak";
        completedSessionsInCycle = 0;
      } else {
        // Short break
        phase = "shortBreak";
      }

      if (settings.autoStartBreaks) {
        setTimeout(startTimer, 500);
      }
    } else {
      // Break complete, back to work
      phase = "work";
      if (settings.autoStartWork) {
        setTimeout(startTimer, 500);
      }
    }

    // Reset time for new phase
    timeRemaining = getPhaseDuration() * 60;
  }

  // Skip to next phase
  function skipPhase(): void {
    pauseTimer();
    if (phase === "work") {
      completedSessionsInCycle++;
      if (completedSessionsInCycle >= settings.sessionsBeforeLongBreak) {
        phase = "longBreak";
        completedSessionsInCycle = 0;
      } else {
        phase = "shortBreak";
      }
    } else {
      phase = "work";
    }
    timeRemaining = getPhaseDuration() * 60;
  }

  // Reset the timer
  function resetTimer(): void {
    pauseTimer();
    completedSessionsInCycle = 0;
    phase = "work";
    timeRemaining = settings.workDuration * 60;
  }

  // Effect to handle timer updates and title changes
  $effect(() => {
    if (isRunning && intervalId === null) {
      // Timer was started externally
      startTimer();
    } else if (!isRunning && intervalId !== null) {
      // Timer was paused externally
      clearInterval(intervalId);
      intervalId = null;
    }
    updateTitle();
  });

  // Effect to save settings when they change
  $effect(() => {
    settings;
    saveSettings();
  });

  // Effect to update timer when settings change (only if not running)
  $effect(() => {
    if (!isRunning) {
      timeRemaining = getPhaseDuration() * 60;
    }
  });

  // Cleanup interval on unmount
  $effect(() => {
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  });

  // Format focus time
  function formatFocusTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
</script>

<svelte:head>
  <title>Pomodoro Timer — Alexandria Tools</title>
  <meta
    name="description"
    content="Boost productivity with timed work sessions and breaks using the Pomodoro technique."
  />
</svelte:head>


  <main class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white sm:text-4xl">Pomodoro Timer</h1>
      <p class="mt-2 text-zinc-400">
        Focus on work sessions with timed breaks for maximum productivity.
      </p>
    </div>

    <!-- Task Input -->
    <div class="mb-6">
      <label for="task" class="mb-2 block text-sm font-medium text-zinc-300"
        >Current Task (optional)</label
      >
      <input
        id="task"
        type="text"
        bind:value={currentTask}
        placeholder="What are you working on?"
        class="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
      />
    </div>

    <!-- Timer Display -->
    <div
      class="relative mb-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center transition-colors {flashTimer
        ? 'bg-zinc-800'
        : ''}"
    >
      <!-- Progress Bar -->
      <div class="absolute top-0 right-0 left-0 h-1 bg-zinc-800">
        <div
          class="h-full transition-all duration-1000 {getPhaseColorClass()}"
          style="width: {getProgress()}%"
        ></div>
      </div>

      <!-- Phase Indicator -->
      <div class="mb-4">
        <span class="text-sm font-medium tracking-wider uppercase {getPhaseTextClass()}"
          >{getPhaseName()}</span
        >
      </div>

      <!-- Time Display -->
      <div class="font-mono text-8xl font-bold text-white sm:text-9xl">
        {formatTime(timeRemaining)}
      </div>

      <!-- Current Task Display -->
      {#if currentTask}
        <div class="mt-4 text-sm text-zinc-400">
          <span class="font-medium">Working on:</span>
          {currentTask}
        </div>
      {/if}
    </div>

    <!-- Controls -->
    <div class="mb-8 flex flex-wrap justify-center gap-3">
      <button
        type="button"
        onclick={() => (isRunning ? pauseTimer() : startTimer())}
        class="flex min-w-32 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
      >
        {isRunning ? "⏸ Pause" : "▶ Start"}
      </button>
      <button
        type="button"
        onclick={skipPhase}
        class="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
      >
        Skip
      </button>
      <button
        type="button"
        onclick={resetTimer}
        class="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
      >
        Reset
      </button>
      <button
        type="button"
        onclick={() => (showSettings = !showSettings)}
        class="rounded-lg border border-zinc-700 px-4 py-3 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
        aria-label="Settings"
      >
        ⚙️
      </button>
    </div>

    <!-- Session Progress Dots -->
    <div class="mb-8 flex justify-center gap-2">
      {#each Array(settings.sessionsBeforeLongBreak) as _, i}
        <div
          class="h-3 w-3 rounded-full {i < completedSessionsInCycle
            ? getPhaseColorClass()
            : 'bg-zinc-700'}"
        ></div>
      {/each}
    </div>

    <!-- Settings Panel -->
    {#if showSettings}
      <div class="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all">
        <h3 class="mb-4 text-lg font-semibold text-white">Settings</h3>

        <div class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="workDuration" class="mb-2 block text-sm font-medium text-zinc-300"
                >Work Duration (minutes)</label
              >
              <input
                id="workDuration"
                type="number"
                min="1"
                max="60"
                bind:value={settings.workDuration}
                class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label for="shortBreakDuration" class="mb-2 block text-sm font-medium text-zinc-300"
                >Short Break (minutes)</label
              >
              <input
                id="shortBreakDuration"
                type="number"
                min="1"
                max="30"
                bind:value={settings.shortBreakDuration}
                class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label for="longBreakDuration" class="mb-2 block text-sm font-medium text-zinc-300"
                >Long Break (minutes)</label
              >
              <input
                id="longBreakDuration"
                type="number"
                min="1"
                max="60"
                bind:value={settings.longBreakDuration}
                class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                for="sessionsBeforeLongBreak"
                class="mb-2 block text-sm font-medium text-zinc-300"
                >Sessions Before Long Break</label
              >
              <input
                id="sessionsBeforeLongBreak"
                type="number"
                min="2"
                max="10"
                bind:value={settings.sessionsBeforeLongBreak}
                class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div class="space-y-3 pt-2">
            <label class="flex items-center gap-3">
              <input
                type="checkbox"
                bind:checked={settings.soundEnabled}
                class="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
              />
              <span class="text-sm text-zinc-300">Enable sound notifications</span>
            </label>
            <label class="flex items-center gap-3">
              <input
                type="checkbox"
                bind:checked={settings.autoStartBreaks}
                class="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
              />
              <span class="text-sm text-zinc-300">Auto-start breaks</span>
            </label>
            <label class="flex items-center gap-3">
              <input
                type="checkbox"
                bind:checked={settings.autoStartWork}
                class="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
              />
              <span class="text-sm text-zinc-300">Auto-start work sessions</span>
            </label>
          </div>
        </div>
      </div>
    {/if}

    <!-- Statistics Panel -->
    <div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h3 class="mb-4 text-lg font-semibold text-white">Today's Statistics</h3>
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="text-center">
          <div class="text-3xl font-bold text-emerald-400">{stats.todayCompletedSessions}</div>
          <div class="text-sm text-zinc-400">Sessions Completed</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-400">
            {formatFocusTime(stats.totalFocusTime)}
          </div>
          <div class="text-sm text-zinc-400">Total Focus Time</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-orange-400">{stats.currentStreak}</div>
          <div class="text-sm text-zinc-400">Day Streak</div>
        </div>
      </div>
    </div>
  </main>

