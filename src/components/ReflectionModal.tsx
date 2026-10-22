import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, Sparkles, CheckCircle2, CalendarClock } from 'lucide-react';
import { getLocalTodayStr } from '../utils/storage';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onClose }) => {
  const { data, saveDailyReflection, moveUnfinishedTasksToTomorrow } = useApp();

  const todayStr = getLocalTodayStr();
  const existingReflection = data.reflections.find((r) => r.date === todayStr);

  const [wentWell, setWentWell] = useState(existingReflection?.wentWell || '');
  const [remaining, setRemaining] = useState(existingReflection?.remaining || '');
  const [note, setNote] = useState(existingReflection?.note || '');

  if (!isOpen) return null;

  const unfinishedPlanTasks = data.planTaskIds
    .map((id) => data.tasks.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => !!t && t.status !== 'completed');

  const completedToday = data.tasks.filter(
    (t) => t.status === 'completed' && t.completedAt && t.completedAt.slice(0, 10) === todayStr
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyReflection({
      date: todayStr,
      wentWell: wentWell.trim() || undefined,
      remaining: remaining.trim() || undefined,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reflection-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--forest)] dark:text-[var(--lime)]" />
            <h2 id="reflection-title" className="text-base font-semibold text-[var(--ink)]">
              End-of-Day Reflection
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick summary of today */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[var(--surface-soft)] text-xs">
            <div>
              <span className="text-[var(--muted)]">Tasks Completed Today:</span>
              <span className="block font-semibold font-mono text-sm text-[var(--ink)]">
                {completedToday.length}
              </span>
            </div>
            <div>
              <span className="text-[var(--muted)]">Unfinished in Plan:</span>
              <span className="block font-semibold font-mono text-sm text-[var(--ink)]">
                {unfinishedPlanTasks.length}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1.5">
              What went well today? (optional)
            </label>
            <input
              type="text"
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              placeholder="e.g. Focused deeply on the landing page hero without interruptions"
              className="w-full px-3.5 py-2 text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[var(--forest)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1.5">
              What remains? (optional)
            </label>
            <input
              type="text"
              value={remaining}
              onChange={(e) => setRemaining(e.target.value)}
              placeholder="e.g. Case study outline to pick up tomorrow"
              className="w-full px-3.5 py-2 text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[var(--forest)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1.5">
              Reflection Note (optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A short note on pacing, energy, or what you want to protect tomorrow..."
              className="w-full px-3.5 py-2 text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[var(--forest)]"
            />
          </div>

          {/* Move unfinished tasks option */}
          {unfinishedPlanTasks.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  moveUnfinishedTasksToTomorrow();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[var(--ink)] bg-[var(--surface-soft)] hover:bg-[var(--surface-strong)] border border-[var(--line)] rounded-lg transition-colors"
              >
                <CalendarClock className="w-3.5 h-3.5 text-[var(--forest)] dark:text-[var(--lime)]" />
                <span>Move {unfinishedPlanTasks.length} unfinished tasks to tomorrow</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[var(--line)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>You showed up today. That is enough.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)]"
              >
                Skip
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-lg transition-colors shadow-xs"
              >
                Save Reflection
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
