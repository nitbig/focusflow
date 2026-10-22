import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Volume2,
  VolumeX,
  Plus,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Music,
  ExternalLink,
  Headphones,
} from 'lucide-react';

export const FocusView: React.FC = () => {
  const {
    data,
    setActiveTab,
    startFocusSession,
    pauseFocusTimer,
    resumeFocusTimer,
    resetFocusTimer,
    extendFocusTimer,
    endFocusSessionEarly,
    completeFocusSession,
    setAmbientSound,
    setAmbientVolume,
    toggleSoundEnabled,
  } = useApp();

  const [isEndEarlyModalOpen, setIsEndEarlyModalOpen] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(true);

  const timer = data.activeTimer;
  const isRunning = timer.status === 'running';
  const isPaused = timer.status === 'paused';
  const isCompleted = timer.status === 'completed';
  const isReady = timer.status === 'ready';

  // Format MM:SS
  const mins = Math.floor(timer.remainingSeconds / 60);
  const secs = timer.remainingSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const plannedSecs = timer.plannedMinutes * 60;
  const progressRatio = plannedSecs > 0 ? (plannedSecs - timer.remainingSeconds) / plannedSecs : 0;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - Math.min(1, Math.max(0, progressRatio)) * circumference;

  const currentTask = data.tasks.find((t) => t.id === timer.taskId);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) pauseFocusTimer();
        else resumeFocusTimer();
      } else if (e.code === 'KeyR' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        resetFocusTimer();
      } else if (e.code === 'Escape') {
        setActiveTab('overview');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, pauseFocusTimer, resumeFocusTimer, resetFocusTimer, setActiveTab]);

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6 pb-20">
      {/* Quiet Exit Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('overview')}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Focus</span>
        </button>

        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--forest)] dark:text-[var(--lime)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] animate-pulse" />
              Focusing
            </span>
          )}
          {isPaused && (
            <span className="text-xs text-[var(--warning)] font-medium">
              Paused
            </span>
          )}
          {isReady && (
            <span className="text-xs text-[var(--muted)]">
              Ready
            </span>
          )}
        </div>
      </div>

      {/* Main Focus Panel: Zen Minimalist */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-8 sm:p-12 text-center shadow-xs transition-colors">
        {/* Active Task Selector */}
        <div className="max-w-sm mx-auto mb-6">
          <div className="relative inline-block w-full">
            <select
              value={timer.taskId || ''}
              onChange={(e) => startFocusSession(e.target.value)}
              className="w-full text-base sm:text-lg font-bold text-[var(--ink)] bg-transparent border-b border-dashed border-[var(--line)] pb-1 text-center appearance-none cursor-pointer focus:outline-hidden"
            >
              {data.tasks
                .filter((t) => t.status !== 'completed')
                .map((t) => (
                  <option
                    key={t.id}
                    value={t.id}
                    className="text-[var(--ink)] bg-[var(--surface)]"
                  >
                    {t.title}
                  </option>
                ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)] absolute right-2 top-1.5 pointer-events-none" />
          </div>
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative w-72 h-72 mx-auto flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              className="text-[var(--line)]"
            />
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="text-[var(--forest)] dark:text-[var(--lime)] transition-all duration-300"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-6xl sm:text-7xl font-bold font-mono tabular-nums tracking-tighter text-[var(--ink)]">
              {timeFormatted}
            </span>
            <span className="text-[11px] font-mono text-[var(--muted)] mt-2">
              {isRunning
                ? `${Math.round(timer.actualSeconds / 60)}m elapsed`
                : `${timer.plannedMinutes}m block`}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={resetFocusTimer}
            className="p-2.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-soft)] rounded-full transition-colors"
            title="Reset [R]"
            aria-label="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isRunning ? (
            <button
              onClick={pauseFocusTimer}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-[var(--forest-hover)] shadow-sm active:scale-95 transition-all"
              title="Pause [Space]"
              aria-label="Pause"
            >
              <Pause className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              onClick={resumeFocusTimer}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] shadow-sm active:scale-95 transition-all"
              title="Start [Space]"
              aria-label="Start"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          )}

          <button
            onClick={() => extendFocusTimer(5)}
            className="p-2.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-soft)] rounded-full transition-colors"
            title="Add 5m"
            aria-label="Add 5 minutes"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Presets (when paused or ready) */}
        {!isRunning && (
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => startFocusSession(timer.taskId, mins)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                  timer.plannedMinutes === mins
                    ? 'bg-[var(--forest)] text-white font-medium'
                    : 'bg-[var(--surface-soft)] text-[var(--ink-soft)] hover:bg-[var(--surface-strong)]'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        )}

        {/* Completion & End early actions */}
        <div className="mt-6 pt-5 border-t border-[var(--line)] flex items-center justify-center gap-4 text-xs">
          {timer.taskId && (
            <button
              onClick={() => completeFocusSession(true)}
              className="inline-flex items-center gap-1 font-semibold text-[var(--forest)] dark:text-[var(--lime)] hover:underline"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Done</span>
            </button>
          )}

          {timer.actualSeconds > 30 && (
            <button
              onClick={() => setIsEndEarlyModalOpen(true)}
              className="text-[var(--muted)] hover:text-[var(--danger)] underline"
            >
              End early ({Math.round(timer.actualSeconds / 60)}m)
            </button>
          )}
        </div>
      </div>

      {/* Completion Modal / State */}
      {isCompleted && (
        <div className="bg-[var(--surface)] border border-[var(--success)] rounded-2xl p-5 text-center space-y-3 animate-in fade-in">
          <h3 className="text-sm font-bold text-[var(--ink)]">
            Focus block complete!
          </h3>
          <p className="text-xs text-[var(--muted)]">
            {Math.max(1, Math.round(timer.actualSeconds / 60))} minutes dedicated. Mark task complete?
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={() => completeFocusSession(false)}
              className="px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
            >
              Keep in Backlog
            </button>
            <button
              onClick={() => completeFocusSession(true)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-lg shadow-xs"
            >
              Mark Completed
            </button>
          </div>
        </div>
      )}

      {/* Ambient Sound: Compact Single-Row */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {data.preferences.ambientSound !== 'none' ? (
            <Volume2 className="w-3.5 h-3.5 text-[var(--forest)] dark:text-[var(--lime)]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-[var(--muted)]" />
          )}
          <span className="text-[var(--muted)]">Sound:</span>
          {(['none', 'rain', 'binaural', 'whitenoise'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setAmbientSound(s)}
              className={`px-2 py-0.5 rounded capitalize transition-colors ${
                data.preferences.ambientSound === s
                  ? 'bg-[var(--surface-strong)] text-[var(--ink)] font-semibold'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {s === 'none' ? 'Off' : s}
            </button>
          ))}
        </div>

        <button
          onClick={toggleSoundEnabled}
          className="text-[11px] text-[var(--muted)] hover:text-[var(--ink)] underline"
        >
          {data.preferences.soundEnabled ? 'Chime on' : 'Muted'}
        </button>
      </div>

      {/* Focus Music: Embedded YouTube Soundtrack & Credit */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-4 space-y-3.5 shadow-xs transition-all">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[var(--forest)]/10 dark:bg-[var(--lime)]/15 flex items-center justify-center text-[var(--forest)] dark:text-[var(--lime)] shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--ink)] truncate">Focus Soundtrack</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--lime)]/30 text-[var(--forest)] dark:text-[var(--lime)] shrink-0">
                  Ambient
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted)] truncate">
                Continuous 3-hour deep work & background music
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMusicPlayer((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors px-2.5 py-1 rounded-lg border border-[var(--line)] hover:bg-[var(--surface-strong)] shrink-0"
            aria-label={showMusicPlayer ? 'Collapse player' : 'Expand player'}
          >
            <span>{showMusicPlayer ? 'Collapse' : 'Show Player'}</span>
            {showMusicPlayer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showMusicPlayer && (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/10 border border-[var(--line)] shadow-inner">
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/UtWaBEn_x8c?list=PLbeATXoWD4c-fEHymmr7tPPuDqIDIjEx8"
              title="Atmospheric Ambient Music | Music For Work, Background Music 3 Hours"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}

        {/* Music Attribution & Links */}
        <div className="pt-2 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>Music by</span>
            <a
              href="https://www.youtube.com/@BLUME_Music"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--forest)] dark:text-[var(--lime)] hover:underline inline-flex items-center gap-0.5"
            >
              BLUME
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </a>
            <span className="text-[var(--line)]">|</span>
            <span className="truncate max-w-[200px] sm:max-w-[260px] text-[var(--ink)]" title="Atmospheric Ambient Music | Music For Work">
              Atmospheric Ambient Music
            </span>
          </div>

          <a
            href="https://www.youtube.com/watch?v=UtWaBEn_x8c&list=PLbeATXoWD4c-fEHymmr7tPPuDqIDIjEx8&index=17"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--forest)] dark:text-[var(--lime)] hover:underline font-medium shrink-0"
          >
            <Music className="w-3 h-3" />
            <span>Open Playlist on YouTube</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Confirmation: End early */}
      {isEndEarlyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xl space-y-3 animate-in fade-in zoom-in-95">
            <h4 className="text-sm font-semibold text-[var(--ink)]">
              End session early?
            </h4>
            <p className="text-xs text-[var(--muted)]">
              {Math.round(timer.actualSeconds / 60)} minutes will be logged to your daily stats.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1 text-xs">
              <button
                onClick={() => setIsEndEarlyModalOpen(false)}
                className="px-2.5 py-1 text-[var(--muted)] hover:text-[var(--ink)]"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  setIsEndEarlyModalOpen(false);
                  endFocusSessionEarly(true);
                }}
                className="px-3 py-1.5 font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-lg"
              >
                Save & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
