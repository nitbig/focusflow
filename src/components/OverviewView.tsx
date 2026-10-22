import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeroSection } from './HeroSection';
import {
  Play,
  Check,
  ChevronUp,
  ChevronDown,
  Clock,
  ArrowRight,
  Plus,
  ShieldCheck,
  Zap,
  Sparkles,
  Timer,
  CheckCircle2,
  HelpCircle,
  MoonStar,
  Brain,
  SlidersHorizontal,
  Compass,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { getLocalTodayStr } from '../utils/storage';
import { ReflectionModal } from './ReflectionModal';

export const OverviewView: React.FC = () => {
  const {
    data,
    startFocusSession,
    toggleTaskComplete,
    reorderPlan,
    addTaskToPlan,
    removeTaskFromPlan,
    openTaskModal,
    setActiveTab,
    createTask,
    moveUnfinishedTasksToTomorrow,
  } = useApp();

  const [quickTitle, setQuickTitle] = useState('');
  const [quickMinutes, setQuickMinutes] = useState(25);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const todayStr = getLocalTodayStr();

  // Active plan tasks in ordered sequence
  const activePlanTasks = data.planTaskIds
    .map((id) => data.tasks.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => !!t && t.status !== 'completed');

  // Next up task
  const nextTask = activePlanTasks[0];

  // Completed today
  const completedToday = data.tasks.filter(
    (t) =>
      t.status === 'completed' &&
      t.completedAt &&
      t.completedAt.slice(0, 10) === todayStr
  );

  // Backlog pool
  const backlogTasks = data.tasks.filter(
    (t) => t.status !== 'completed' && !data.planTaskIds.includes(t.id)
  );

  // Today focus sessions
  const todaySessions = data.sessions.filter(
    (s) => s.endedAt && s.endedAt.slice(0, 10) === todayStr
  );
  const totalFocusMinutesToday = Math.round(
    todaySessions.reduce((acc, s) => acc + s.actualSeconds, 0) / 60
  );

  const totalPlannedMinutes = activePlanTasks.reduce((acc, t) => acc + t.estimateMinutes, 0);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    createTask({
      title: quickTitle.trim(),
      estimateMinutes: Number(quickMinutes) || 25,
      priority: 'normal',
      energyFit: data.checkIn.energy,
      deadline: todayStr,
      addToPlan: true,
    });
    setQuickTitle('');
  };

  const faqItems = [
    {
      q: 'How does energy-based planning work?',
      a: 'Instead of forcing you to follow a rigid calendar block, FocusFlow matches tasks to your current mental energy (Low, Steady, or High). When your energy is Low, it suggests gentle administrative tasks and quick wins. When High, it prioritizes complex, deep problem-solving.',
    },
    {
      q: 'What happens if I don’t finish all planned tasks today?',
      a: 'Nothing bad happens. There are no penalty scores, red alert warnings, or broken streaks. Unfinished tasks can be carried forward to tomorrow with a single click during your evening reflection.',
    },
    {
      q: 'Where is my task data stored and is it private?',
      a: '100% of your data is stored locally in your browser’s localStorage. FocusFlow does not use external user tracking, third-party analytics, or cloud databases. Your plans, notes, and reflections stay on your device.',
    },
    {
      q: 'How does the Focus Mode timer avoid drifting?',
      a: 'Our focus timer uses an end-timestamp calculation rather than simple recurring intervals. Even if your browser suspends or throttles the tab in the background, your remaining time and logged minutes remain accurate.',
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Section with Energy & Available Time Check-In */}
      <HeroSection onOpenReflection={() => setIsReflectionOpen(true)} />

      {/* 2. Immediate Next Step: Next Up Focus Hero */}
      {nextTask ? (
        <section
          aria-label="Current Next Focus Task"
          className="bg-[var(--surface)] border-2 border-[var(--forest)]/20 dark:border-[var(--lime)]/30 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all"
        >
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-[var(--lime)] animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--forest)] dark:text-[var(--lime)]">
                Recommended Next Action
              </span>
              <span className="text-xs text-[var(--muted)]">·</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--surface-soft)] text-[var(--ink)]">
                {nextTask.estimateMinutes}m estimate
              </span>
              <span className="text-xs text-[var(--muted)]">·</span>
              <span className="text-xs text-[var(--muted)] capitalize">
                {nextTask.priority} priority
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-tight truncate">
              {nextTask.title}
            </h2>
            {nextTask.notes && (
              <p className="text-xs text-[var(--muted)] line-clamp-1 max-w-2xl">
                {nextTask.notes}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => startFocusSession(nextTask.id, nextTask.estimateMinutes)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] active:scale-[0.98] rounded-xl transition-all shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Focus ({nextTask.estimateMinutes}m)</span>
            </button>

            <button
              onClick={() => toggleTaskComplete(nextTask.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--surface-soft)] rounded-xl border border-[var(--line)] transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-[var(--success)]" />
              <span>Mark Done</span>
            </button>
          </div>
        </section>
      ) : (
        <section
          aria-label="No active task planned"
          className="bg-[var(--surface)] border border-dashed border-[var(--line)] rounded-2xl p-6 text-center space-y-2"
        >
          <p className="text-sm font-medium text-[var(--ink)]">No tasks scheduled in your active plan.</p>
          <p className="text-xs text-[var(--muted)]">
            Click &ldquo;Build My Plan&rdquo; above to automatically select tasks based on your {data.checkIn.energy} energy, or add one below.
          </p>
        </section>
      )}

      {/* 3. Main Grid: Daily Plan & Supporting Stats/Backlog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Your Plan (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[var(--line)]/60">
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2">
                <span>Today’s Plan</span>
                <span className="text-xs font-mono font-normal text-[var(--muted)]">
                  ({activePlanTasks.length} {activePlanTasks.length === 1 ? 'task' : 'tasks'})
                </span>
              </h3>
            </div>
            <span className="text-xs font-mono tabular-nums text-[var(--muted)]">
              {totalPlannedMinutes}m total focus time
            </span>
          </div>

          <div className="space-y-2">
            {activePlanTasks.map((task, index) => (
              <div
                key={task.id}
                className="group bg-[var(--surface)] border border-[var(--line)] rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-[var(--forest)]/40 hover:shadow-2xs transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    aria-label={`Mark ${task.title} complete`}
                    className="w-5 h-5 rounded border border-[var(--line)] hover:border-[var(--success)] flex items-center justify-center text-transparent hover:text-[var(--success)] transition-colors shrink-0"
                  >
                    <Check className="w-3 h-3" />
                  </button>

                  <div className="min-w-0 flex-1 flex items-baseline gap-2">
                    <span className="text-xs font-medium text-[var(--ink)] truncate">
                      {task.title}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-[var(--muted)] shrink-0">
                      {task.estimateMinutes}m
                    </span>
                    {task.priority === 'high' && (
                      <span className="text-[10px] uppercase font-bold text-[var(--warning)] px-1 rounded bg-[var(--surface-soft)]">
                        High
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startFocusSession(task.id, task.estimateMinutes)}
                    className="p-1.5 text-[var(--forest)] dark:text-[var(--lime)] hover:bg-[var(--surface-soft)] rounded-md transition-colors"
                    title="Launch Focus Session"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <button
                    disabled={index === 0}
                    onClick={() => reorderPlan(index, index - 1)}
                    className="p-1 text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-20 rounded"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    disabled={index === activePlanTasks.length - 1}
                    onClick={() => reorderPlan(index, index + 1)}
                    className="p-1 text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-20 rounded"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => removeTaskFromPlan(task.id)}
                    className="text-[11px] text-[var(--muted)] hover:text-[var(--ink)] px-2 py-0.5 rounded hover:bg-[var(--surface-soft)]"
                    title="Remove from today's plan"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))}

            {activePlanTasks.length === 0 && (
              <div className="py-8 text-center text-xs text-[var(--muted)] border border-dashed border-[var(--line)] rounded-2xl bg-[var(--surface)]/50">
                All scheduled tasks completed or moved. Great work!
              </div>
            )}
          </div>

          {/* Quick Add Form: Instant Entry */}
          <form
            onSubmit={handleQuickAdd}
            className="flex items-center gap-2 pt-2"
          >
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Add a new task to today's plan..."
              className="flex-1 px-3.5 py-2 text-xs bg-[var(--surface)] border border-[var(--line)] rounded-xl text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-hidden focus:ring-1 focus:ring-[var(--forest)] shadow-2xs"
            />
            <select
              value={quickMinutes}
              onChange={(e) => setQuickMinutes(Number(e.target.value))}
              className="bg-[var(--surface)] border border-[var(--line)] rounded-xl px-2.5 py-2 text-xs font-mono text-[var(--ink)] shadow-2xs"
            >
              <option value={15}>15m</option>
              <option value={25}>25m</option>
              <option value={30}>30m</option>
              <option value={45}>45m</option>
              <option value={60}>60m</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Supporting Column: Daily Momentum & Backlog (4 Columns) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Daily Metrics: Done, Focused, Sessions */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Today’s Momentum
            </h4>
            <div className="grid grid-cols-3 divide-x divide-[var(--line)] text-center pt-1">
              <div>
                <span className="block text-2xl font-bold font-mono tabular-nums text-[var(--ink)]">
                  {completedToday.length}
                </span>
                <span className="text-[11px] text-[var(--muted)]">Completed</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-mono tabular-nums text-[var(--ink)]">
                  {totalFocusMinutesToday}m
                </span>
                <span className="text-[11px] text-[var(--muted)]">Focused</span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-mono tabular-nums text-[var(--ink)]">
                  {todaySessions.length}
                </span>
                <span className="text-[11px] text-[var(--muted)]">Sessions</span>
              </div>
            </div>
          </div>

          {/* Backlog Quick Glance */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--ink)]">
                Backlog Pool ({backlogTasks.length})
              </span>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-[11px] text-[var(--forest)] dark:text-[var(--lime)] hover:underline flex items-center gap-0.5 font-medium"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
              {backlogTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-2.5 rounded-xl bg-[var(--surface-soft)] flex items-center justify-between gap-2 text-xs"
                >
                  <span className="truncate text-[var(--ink)] flex-1">{task.title}</span>
                  <span className="font-mono text-[10px] text-[var(--muted)] shrink-0">
                    {task.estimateMinutes}m
                  </span>
                  <button
                    onClick={() => addTaskToPlan(task.id)}
                    className="text-[11px] font-semibold text-[var(--forest)] dark:text-[var(--lime)] hover:underline shrink-0 ml-1"
                  >
                    +Plan
                  </button>
                </div>
              ))}
            </div>

            {activePlanTasks.length > 0 && (
              <button
                onClick={moveUnfinishedTasksToTomorrow}
                className="w-full text-center text-xs text-[var(--muted)] hover:text-[var(--ink)] pt-1 transition-colors"
              >
                Move unfinished tasks to tomorrow →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Visual Workflow: Meaningful 3-Step Process Graphic */}
      <section
        aria-label="How FocusFlow Works"
        className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
      >
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--forest)] dark:text-[var(--lime)] font-bold">
            The Humane Workflow
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
            From mental clutter to single-task clarity in 3 steps
          </h3>
          <p className="text-xs text-[var(--muted)]">
            A sustainable daily ritual built to keep you moving forward without burnout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-[var(--surface-soft)]/60 border border-[var(--line)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--forest)]/10 dark:bg-[var(--lime)]/15 flex items-center justify-center text-[var(--forest)] dark:text-[var(--lime)] font-mono font-bold text-sm">
              01
            </div>
            <h4 className="text-sm font-bold text-[var(--ink)]">
              Check Energy & Time
            </h4>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Honest input beats unrealistic to-do lists. Tell FocusFlow whether you are feeling low, steady, or high energy, and how much time you actually have.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-[var(--surface-soft)]/60 border border-[var(--line)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--forest)]/10 dark:bg-[var(--lime)]/15 flex items-center justify-center text-[var(--forest)] dark:text-[var(--lime)] font-mono font-bold text-sm">
              02
            </div>
            <h4 className="text-sm font-bold text-[var(--ink)]">
              Auto-Shape Realistic Plan
            </h4>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Our deterministic local engine matches high-effort tasks to high energy, and light tasks to low energy. You get an ordered plan that fits your exact budget.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-[var(--surface-soft)]/60 border border-[var(--line)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--forest)]/10 dark:bg-[var(--lime)]/15 flex items-center justify-center text-[var(--forest)] dark:text-[var(--lime)] font-mono font-bold text-sm">
              03
            </div>
            <h4 className="text-sm font-bold text-[var(--ink)]">
              Deep Focus & Reflection
            </h4>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Launch into the distraction-free focus timer with continuous ambient study audio. End the day with a 60-second reflection to celebrate wins and close open loops.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Show Benefits, Not Just Features */}
      <section
        aria-label="Core Benefits"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 space-y-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-[var(--forest)]/10 dark:bg-[var(--lime)]/20 flex items-center justify-center text-[var(--forest)] dark:text-[var(--lime)]">
            <Brain className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[var(--ink)]">
            Banish Task Paralysis
          </h4>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Stop staring at an intimidating 40-item task backlog. FocusFlow isolates the single next best action so you never hesitate before starting.
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 space-y-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-[var(--forest)]/10 dark:bg-[var(--lime)]/20 flex items-center justify-center text-[var(--forest)] dark:text-[var(--lime)]">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[var(--ink)]">
            Honor Mental Energy Cycles
          </h4>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Brainpower fluctuates throughout the day. Work with your natural rhythm by matching hard cognitive tasks to peak energy and low friction when tired.
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 space-y-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-[var(--forest)]/10 dark:bg-[var(--lime)]/20 flex items-center justify-center text-[var(--forest)] dark:text-[var(--lime)]">
            <Heart className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[var(--ink)]">
            No Guilt, No Broken Streaks
          </h4>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Didn’t get everything done? Move unfinished tasks to tomorrow in one click. We believe humane tools should relieve anxiety, not amplify it.
          </p>
        </div>
      </section>

      {/* 6. Trust & Credibility Reassurance Bar */}
      <section
        aria-label="Trust and Privacy Signals"
        className="bg-[var(--surface-soft)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[var(--forest)] dark:text-[var(--lime)] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--ink)]">
              Built on Privacy, Sovereignty & Calm
            </h4>
            <p className="text-[11px] text-[var(--muted)]">
              Zero telemetry · No account or credit card required · 100% offline-ready local storage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('settings')}
            className="px-3 py-1.5 font-medium text-[var(--ink)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] rounded-lg border border-[var(--line)] transition-colors"
          >
            Manage Storage & Settings
          </button>
        </div>
      </section>

      {/* 7. Answers to the Visitor’s Biggest Questions (FAQ Accordion) */}
      <section
        aria-label="Frequently Asked Questions"
        className="bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs"
      >
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--forest)] dark:text-[var(--lime)] font-bold">
            Questions & Answers
          </span>
          <h3 className="text-xl font-bold text-[var(--ink)]">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-[var(--muted)]">
            Everything you need to know about how FocusFlow handles your time and data.
          </p>
        </div>

        <div className="divide-y divide-[var(--line)] pt-2">
          {faqItems.map((item, idx) => {
            const isOpen = expandedFaqIndex === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 text-xs sm:text-sm font-semibold text-[var(--ink)] hover:text-[var(--forest)] dark:hover:text-[var(--lime)] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className="text-[var(--muted)] p-1 rounded hover:bg-[var(--surface-soft)]">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed pr-6 animate-in fade-in duration-150">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. End of Day Call to Action */}
      <section
        aria-label="Evening Reflection Call to Action"
        className="bg-gradient-to-r from-[var(--surface-soft)] to-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5"
      >
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base sm:text-lg font-bold text-[var(--ink)]">
            Ready to end your workday?
          </h4>
          <p className="text-xs text-[var(--muted)] max-w-md">
            Take a 60-second evening reflection to note what went well and smoothly carry unfinished tasks over to tomorrow.
          </p>
        </div>

        <button
          onClick={() => setIsReflectionOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--forest)] hover:bg-[var(--forest-hover)] active:scale-[0.98] rounded-xl transition-all shadow-xs shrink-0"
        >
          <MoonStar className="w-4 h-4 text-[var(--lime)]" />
          <span>Open Evening Reflection</span>
        </button>
      </section>

      {/* Reflection Modal */}
      <ReflectionModal
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
      />
    </div>
  );
};
