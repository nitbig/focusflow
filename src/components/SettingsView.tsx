import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { FocusFlowData } from '../types';
import {
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    data,
    toggleTheme,
    setTimerPreset,
    setAmbientSound,
    setAmbientVolume,
    toggleSoundEnabled,
    resetToDemo,
    exportBackup,
    importBackup,
    showNotice,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const timerPresets = [15, 25, 30, 45, 60];

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as Partial<FocusFlowData>;

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON format: file does not contain a valid object.');
        }
        if (!Array.isArray(parsed.tasks)) {
          throw new Error('Invalid FocusFlow file: missing tasks array.');
        }

        importBackup(parsed as FocusFlowData);
        showNotice('Backup restored successfully.');
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
          Settings & Preferences
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Configure focus presets, theme appearance, ambient audio, and data portability.
        </p>
      </div>

      {/* Focus Timer Defaults */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--forest)] dark:text-[var(--lime)]" />
          <h3 className="text-base font-semibold text-[var(--ink)]">
            Default Focus Duration
          </h3>
        </div>
        <p className="text-xs text-[var(--muted)]">
          Standard session length applied when starting new focus blocks.
        </p>

        <div className="flex items-center gap-2 flex-wrap pt-1">
          {timerPresets.map((mins) => {
            const isSelected = data.preferences.defaultTimerPreset === mins;
            return (
              <button
                key={mins}
                onClick={() => setTimerPreset(mins)}
                className={`px-4 py-2 text-xs font-mono tabular-nums rounded-lg border transition-colors ${
                  isSelected
                    ? 'bg-[var(--forest)] text-white border-[var(--forest)] font-semibold shadow-xs'
                    : 'bg-[var(--surface-soft)] text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-strong)]'
                }`}
              >
                {mins} minutes
              </button>
            );
          })}
        </div>
      </div>

      {/* Appearance & Theme */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[var(--ink)]">
              Appearance Theme
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Switch between warm paper surfaces and deep botanical slate.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[var(--ink)] bg-[var(--surface-soft)] hover:bg-[var(--surface-strong)] border border-[var(--line)] rounded-lg transition-colors"
          >
            {data.preferences.theme === 'light' ? (
              <>
                <Moon className="w-4 h-4" />
                <span>Switch to Dark Slate</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-[var(--lime)]" />
                <span>Switch to Warm Paper</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audio Preferences */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--ink)]">
            Sound & Ambient Audio
          </h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Calm acoustic cues synthesized 100% natively in your browser via Web Audio.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-soft)]">
            <div>
              <span className="text-xs font-medium text-[var(--ink)]">
                Completion Bell Chime
              </span>
              <p className="text-[11px] text-[var(--muted)]">
                Gentle harmonic bell chord when your timer reaches zero
              </p>
            </div>
            <button
              onClick={toggleSoundEnabled}
              className={`p-2 rounded-lg border transition-colors ${
                data.preferences.soundEnabled
                  ? 'bg-[var(--forest)] text-white border-[var(--forest)]'
                  : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--line)]'
              }`}
              aria-label="Toggle completion bell"
            >
              {data.preferences.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-soft)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--ink)]">
                Ambient Soundscape
              </span>
              {data.preferences.ambientSound !== 'none' && (
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span>Volume:</span>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={data.preferences.ambientVolume}
                    onChange={(e) => setAmbientVolume(Number(e.target.value))}
                    className="w-20 accent-[var(--forest)]"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'none', label: 'Off' },
                  { id: 'rain', label: 'Soft Rain' },
                  { id: 'binaural', label: 'Alpha Waves' },
                  { id: 'whitenoise', label: 'Gentle Noise' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAmbientSound(opt.id)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                    data.preferences.ambientSound === opt.id
                      ? 'bg-[var(--forest)] text-white border-[var(--forest)] font-semibold shadow-xs'
                      : 'bg-[var(--surface)] text-[var(--ink-soft)] border-[var(--line)] hover:bg-[var(--surface-strong)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Local Storage & Data Portability */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--forest)] dark:text-[var(--lime)]" />
          <h3 className="text-base font-semibold text-[var(--ink)]">
            Data Portability & Privacy
          </h3>
        </div>
        <p className="text-xs text-[var(--muted)]">
          FocusFlow stores all data in your browser’s local storage (key: <code className="font-mono text-[var(--ink)]">focusflow.data.v1</code>). No accounts, third-party cookies, or cloud database tracking.
        </p>

        {importError && (
          <div className="flex items-center gap-2 text-xs text-[var(--danger)] bg-[var(--surface-soft)] p-3 rounded-lg border border-[var(--line)]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportBackup}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[var(--ink)] bg-[var(--surface-soft)] hover:bg-[var(--surface-strong)] border border-[var(--line)] rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[var(--ink)] bg-[var(--surface-soft)] hover:bg-[var(--surface-strong)] border border-[var(--line)] rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup (JSON)</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[var(--danger)] hover:bg-[var(--surface-soft)] rounded-lg transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-[var(--warning)]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-semibold text-[var(--ink)]">
                Reset to sample demo data?
              </h3>
            </div>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              This replaces current tasks, plans, and session history with the clean starter workspace. You can export a JSON backup beforehand if you wish.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsResetConfirmOpen(false);
                  resetToDemo();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-lg shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
