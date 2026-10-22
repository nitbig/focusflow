import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TaskPriority, EnergyLevel, FocusTask } from '../types';
import { X, Clock, AlertCircle } from 'lucide-react';
import { getLocalTodayStr } from '../utils/storage';

export const TaskFormModal: React.FC = () => {
  const { isTaskModalOpen, closeTaskModal, editingTask, createTask, updateTask, data } = useApp();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [estimateMinutes, setEstimateMinutes] = useState(25);
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [energyFit, setEnergyFit] = useState<EnergyLevel | 'any'>('any');
  const [deadline, setDeadline] = useState(getLocalTodayStr());
  const [addToPlan, setAddToPlan] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const durationPresets = [15, 25, 30, 45, 60];

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setNotes(editingTask.notes || '');
      setEstimateMinutes(editingTask.estimateMinutes);
      setPriority(editingTask.priority);
      setEnergyFit(editingTask.energyFit);
      setDeadline(editingTask.deadline || getLocalTodayStr());
      setAddToPlan(data.planTaskIds.includes(editingTask.id));
    } else {
      setTitle('');
      setNotes('');
      setEstimateMinutes(data.preferences.defaultTimerPreset || 25);
      setPriority('normal');
      setEnergyFit('any');
      setDeadline(getLocalTodayStr());
      setAddToPlan(true);
    }
    setError(null);
  }, [editingTask, isTaskModalOpen, data.preferences.defaultTimerPreset, data.planTaskIds]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Please provide a task title.');
      return;
    }

    if (trimmedTitle.length > 140) {
      setError('Task title must be 140 characters or fewer.');
      return;
    }

    const mins = Number(estimateMinutes);
    if (isNaN(mins) || mins < 5 || mins > 480) {
      setError('Estimated duration must be between 5 and 480 minutes.');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: trimmedTitle,
        notes: notes.trim(),
        estimateMinutes: mins,
        priority,
        energyFit,
        deadline,
      });
    } else {
      createTask({
        title: trimmedTitle,
        notes: notes.trim(),
        estimateMinutes: mins,
        priority,
        energyFit,
        deadline,
        addToPlan,
      });
    }

    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-dialog-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)]">
          <h2 id="task-dialog-title" className="text-base font-semibold text-[var(--ink)]">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={closeTaskModal}
            aria-label="Close dialog"
            className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-xs text-[var(--danger)] bg-[var(--surface-soft)] p-3 rounded-lg border border-[var(--line)]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1.5">
              Task Title <span className="text-[var(--danger)]">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              maxLength={140}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Refine landing page hero"
              className="w-full px-3.5 py-2 text-sm bg-[var(--canvas)] border border-[var(--line)] rounded-lg text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[var(--forest)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1.5">
              Estimated Duration (5 to 480 mins)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {durationPresets.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setEstimateMinutes(mins)}
                  className={`px-3 py-1.5 text-xs font-mono tabular-nums rounded-md border transition-colors ${
                    estimateMinutes === mins
                      ? 'bg-[var(--forest)] text-white border-[var(--forest)] font-semibold shadow-xs'
                      : 'bg-[var(--surface-soft)] text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface-strong)]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
              <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                <Clock className="w-3.5 h-3.5" />
                <input
                  type="number"
                  min="5"
                  max="480"
                  step="5"
                  value={estimateMinutes}
                  onChange={(e) => setEstimateMinutes(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs font-mono tabular-nums rounded-md border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] text-center focus:outline-hidden"
                />
                <span>min</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--ink)] mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-1.5 text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg text-[var(--ink)]"
              >
                <option value="high">High priority</option>
                <option value="normal">Normal priority</option>
                <option value="low">Low priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--ink)] mb-1.5">
                Energy Fit
              </label>
              <select
                value={energyFit}
                onChange={(e) => setEnergyFit(e.target.value as EnergyLevel | 'any')}
                className="w-full px-3 py-1.5 text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg text-[var(--ink)]"
              >
                <option value="any">Any energy</option>
                <option value="low">Low (light, lower friction)</option>
                <option value="steady">Steady (balanced pacing)</option>
                <option value="high">High (demands deep focus)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1.5">
              Target Deadline (optional)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg text-[var(--ink)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--ink)] mb-1.5">
              Notes or First Step (optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Draft 3 alternative headlines before touching layout..."
              className="w-full px-3 py-2 text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden"
            />
          </div>

          {!editingTask && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="addToPlan"
                checked={addToPlan}
                onChange={(e) => setAddToPlan(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--line)] text-[var(--forest)] focus:ring-0"
              />
              <label
                htmlFor="addToPlan"
                className="text-xs text-[var(--ink)] cursor-pointer"
              >
                Add directly to today’s active plan
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-lg transition-colors shadow-xs"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
