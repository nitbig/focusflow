import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FocusTask, TaskPriority } from '../types';
import { CheckInBar } from './CheckInBar';
import {
  Plus,
  Search,
  Sparkles,
  CalendarClock,
  Edit2,
  Trash2,
  Check,
  Play,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { getLocalTodayStr } from '../utils/storage';

export const PlannerView: React.FC = () => {
  const {
    data,
    currentSuggestion,
    applySuggestedPlan,
    addTaskToPlan,
    removeTaskFromPlan,
    startFocusSession,
    openTaskModal,
    deleteTask,
    toggleTaskComplete,
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const todayStr = getLocalTodayStr();

  // Filter tasks
  const filteredTasks = data.tasks.filter((task) => {
    // 1. Tab filter
    if (activeTabFilter === 'completed') {
      if (task.status !== 'completed') return false;
    } else {
      if (task.status === 'completed') return false;
      if (activeTabFilter === 'today') {
        if (!task.deadline || task.deadline > todayStr) return false;
      } else if (activeTabFilter === 'upcoming') {
        if (!task.deadline || task.deadline <= todayStr) return false;
      }
    }

    // 2. Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchNotes = task.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes) return false;
    }

    return true;
  });

  const confirmDelete = (taskId: string) => {
    deleteTask(taskId);
    setDeletingTaskId(null);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
            Planner
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            Manage your backlog, filter deadlines, and build deterministic daily plans.
          </p>
        </div>

        <button
          onClick={() => openTaskModal()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-lg transition-colors shadow-xs active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Check In Decision Module */}
      <CheckInBar />

      {/* Suggested Strategy Callout */}
      <div className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--forest)] dark:text-[var(--lime)]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Suggested Strategy
            </span>
          </div>
          <p className="text-sm font-medium text-[var(--ink)]">
            {currentSuggestion.rationale}
          </p>
          <p className="text-xs text-[var(--muted)]">
            {currentSuggestion.subtext}
          </p>
        </div>

        <button
          onClick={() => applySuggestedPlan()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-lg transition-colors whitespace-nowrap self-start md:self-auto shadow-xs active:scale-[0.98]"
        >
          <span>Build my plan ({currentSuggestion.suggestedTasks.length} tasks)</span>
        </button>
      </div>

      {/* Task Filters & Workspace */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* Filter bar: Segmented tabs (All / Today / Upcoming / Completed) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-1 bg-[var(--surface-soft)] p-1 rounded-lg">
            {(
              [
                { id: 'all', label: 'All Active' },
                { id: 'today', label: 'Today' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'completed', label: 'Completed' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTabFilter === tab.id
                    ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-xs'
                    : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 sm:w-56 pl-8 pr-3 py-1 text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[var(--forest)]"
              />
            </div>

            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | TaskPriority)}
              className="text-xs bg-[var(--canvas)] border border-[var(--line)] rounded-lg px-2.5 py-1 text-[var(--ink)]"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="normal">Normal Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Task Rows List */}
        <div className="space-y-2 pt-1">
          {filteredTasks.map((task) => {
            const isPlanned = data.planTaskIds.includes(task.id);
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`bg-[var(--surface-soft)]/50 border rounded-xl p-3.5 flex items-center justify-between gap-3 transition-colors ${
                  isCompleted
                    ? 'border-[var(--line)] opacity-70'
                    : 'border-[var(--line)] hover:border-[var(--muted)]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    aria-label={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    className={`w-6 h-6 mt-0.5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      isCompleted
                        ? 'bg-[var(--success)] border-[var(--success)] text-white'
                        : 'border-[var(--line)] bg-[var(--surface)] hover:border-[var(--success)] text-transparent hover:text-[var(--success)]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-medium text-[var(--ink)] truncate ${
                          isCompleted ? 'line-through text-[var(--muted)]' : ''
                        }`}
                      >
                        {task.title}
                      </h4>
                      {isPlanned && !isCompleted && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[var(--lime)] text-[var(--lime-ink)] uppercase tracking-wider shrink-0">
                          In Plan
                        </span>
                      )}
                    </div>

                    {/* Zero-Pill metadata */}
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--muted)] flex-wrap">
                      <span className="font-mono tabular-nums text-[var(--ink-soft)]">
                        {task.estimateMinutes}m
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{task.priority}</span>
                      {task.energyFit !== 'any' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{task.energyFit} energy</span>
                        </>
                      )}
                      {task.deadline && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              task.deadline <= todayStr
                                ? 'text-amber-700 dark:text-amber-400 font-medium'
                                : ''
                            }
                          >
                            Due {task.deadline}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!isCompleted && (
                    <>
                      <button
                        onClick={() => startFocusSession(task.id, task.estimateMinutes)}
                        className="p-1.5 text-[var(--forest)] dark:text-[var(--lime)] hover:bg-[var(--surface-strong)] rounded-md transition-colors"
                        title="Start focus on this task"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {isPlanned ? (
                        <button
                          onClick={() => removeTaskFromPlan(task.id)}
                          className="px-2.5 py-1 text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                        >
                          Remove from plan
                        </button>
                      ) : (
                        <button
                          onClick={() => addTaskToPlan(task.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] border border-[var(--line)] rounded-md transition-colors shadow-2xs"
                        >
                          + Add to Plan
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => openTaskModal(task)}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] rounded transition-colors"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingTaskId(task.id)}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--danger)] rounded transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="py-12 text-center text-xs text-[var(--muted)] space-y-2">
              <p className="font-medium text-[var(--ink)]">No matching tasks found.</p>
              <p>Try switching filters or add a new task to your backlog.</p>
              <button
                onClick={() => openTaskModal()}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-3 h-3" />
                <span>Add Task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-xl space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-[var(--danger)]">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-semibold text-[var(--ink)]">Delete this task?</h3>
            </div>
            <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
              This will permanently delete the task from your backlog and plan.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeletingTaskId(null)}
                className="px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)]"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletingTaskId)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[var(--danger)] hover:opacity-90 rounded-lg transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
