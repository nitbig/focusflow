import {
  FocusFlowData,
  FocusSession,
  FocusTask,
  DailyCheckIn,
  ActiveTimerState,
  UserPreferences,
} from '../types';

export const STORAGE_KEY = 'focusflow.data.v1';
const LEGACY_STORAGE_KEY = 'focusflow_state_v1';

export function getLocalTodayStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getInitialSeedData(): FocusFlowData {
  const todayStr = getLocalTodayStr();
  const now = new Date();

  // Tomorrow string
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // In 3 days string
  const inThreeDays = new Date(now);
  inThreeDays.setDate(inThreeDays.getDate() + 3);
  const inThreeDaysStr = inThreeDays.toISOString().slice(0, 10);

  const seedTasks: FocusTask[] = [
    {
      id: 'task-1',
      title: 'Submit project update',
      notes: 'Send 3-bullet summary of sprint deliverables to stakeholders.',
      estimateMinutes: 15,
      priority: 'high',
      deadline: todayStr,
      energyFit: 'any',
      status: 'todo',
      createdAt: new Date(now.getTime() - 3600000 * 6).toISOString(),
      updatedAt: new Date(now.getTime() - 3600000 * 6).toISOString(),
    },
    {
      id: 'task-2',
      title: 'Reply to two client emails',
      notes: 'Clarify timeline for design review and share Figma spec links.',
      estimateMinutes: 15,
      priority: 'normal',
      deadline: todayStr,
      energyFit: 'low',
      status: 'todo',
      createdAt: new Date(now.getTime() - 3600000 * 5).toISOString(),
      updatedAt: new Date(now.getTime() - 3600000 * 5).toISOString(),
    },
    {
      id: 'task-3',
      title: 'Refine landing page hero',
      notes: 'Polish responsive spatial rhythm, typography hierarchy, and primary CTA.',
      estimateMinutes: 30,
      priority: 'high',
      deadline: todayStr,
      energyFit: 'steady',
      status: 'todo',
      createdAt: new Date(now.getTime() - 3600000 * 4).toISOString(),
      updatedAt: new Date(now.getTime() - 3600000 * 4).toISOString(),
    },
    {
      id: 'task-4',
      title: 'Review notes for tomorrow',
      notes: 'Brief scan of workshop agenda and discussion prompts.',
      estimateMinutes: 20,
      priority: 'normal',
      deadline: todayStr,
      energyFit: 'low',
      status: 'todo',
      createdAt: new Date(now.getTime() - 3600000 * 3).toISOString(),
      updatedAt: new Date(now.getTime() - 3600000 * 3).toISOString(),
    },
    {
      id: 'task-5',
      title: 'Prepare portfolio case-study outline',
      notes: 'Draft problem statement, measurable outcomes, and system architecture.',
      estimateMinutes: 45,
      priority: 'high',
      deadline: tomorrowStr,
      energyFit: 'high',
      status: 'todo',
      createdAt: new Date(now.getTime() - 3600000 * 8).toISOString(),
      updatedAt: new Date(now.getTime() - 3600000 * 8).toISOString(),
    },
    {
      id: 'task-6',
      title: 'Organize reference screenshots',
      notes: 'File mobile design patterns into archive folder.',
      estimateMinutes: 25,
      priority: 'low',
      deadline: inThreeDaysStr,
      energyFit: 'any',
      status: 'todo',
      createdAt: new Date(now.getTime() - 3600000 * 12).toISOString(),
      updatedAt: new Date(now.getTime() - 3600000 * 12).toISOString(),
    },
    {
      id: 'task-completed-1',
      title: 'Review sprint deliverables',
      notes: 'Verified bug fixes and visual QA pass before kickoff.',
      estimateMinutes: 20,
      priority: 'normal',
      deadline: todayStr,
      energyFit: 'low',
      status: 'completed',
      createdAt: new Date(now.getTime() - 3600000 * 5).toISOString(),
      updatedAt: new Date(now.getTime() - 3600000 * 2).toISOString(),
      completedAt: new Date(now.getTime() - 3600000 * 2).toISOString(),
    },
    {
      id: 'task-completed-2',
      title: 'Optimize SVG vector assets',
      notes: 'Reduced bundle payload and streamlined icon imports.',
      estimateMinutes: 30,
      priority: 'normal',
      deadline: new Date(now.getTime() - 86400000).toISOString().slice(0, 10),
      energyFit: 'steady',
      status: 'completed',
      createdAt: new Date(now.getTime() - 86400000 * 1.5).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000).toISOString(),
      completedAt: new Date(now.getTime() - 86400000).toISOString(),
    },
    {
      id: 'task-completed-3',
      title: 'Configure Tailwind theme tokens',
      notes: 'Centralized warm paper and botanical ink tokens.',
      estimateMinutes: 45,
      priority: 'high',
      deadline: new Date(now.getTime() - 86400000 * 2).toISOString().slice(0, 10),
      energyFit: 'high',
      status: 'completed',
      createdAt: new Date(now.getTime() - 86400000 * 2.5).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
      completedAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
    },
    {
      id: 'task-completed-4',
      title: 'Fix mobile drawer transition',
      notes: 'Eliminated layout stutter on viewport resizing.',
      estimateMinutes: 25,
      priority: 'normal',
      deadline: new Date(now.getTime() - 86400000 * 2).toISOString().slice(0, 10),
      energyFit: 'steady',
      status: 'completed',
      createdAt: new Date(now.getTime() - 86400000 * 2.8).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 2 + 3600000).toISOString(),
      completedAt: new Date(now.getTime() - 86400000 * 2 + 3600000).toISOString(),
    },
    {
      id: 'task-completed-5',
      title: 'Send weekly progress brief',
      notes: 'Circulated status update to stakeholders.',
      estimateMinutes: 15,
      priority: 'low',
      deadline: new Date(now.getTime() - 86400000 * 3).toISOString().slice(0, 10),
      energyFit: 'low',
      status: 'completed',
      createdAt: new Date(now.getTime() - 86400000 * 3.5).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
      completedAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
    },
    {
      id: 'task-completed-6',
      title: 'Draft user interview questions',
      notes: 'Focused on daily planning hurdles and friction.',
      estimateMinutes: 35,
      priority: 'high',
      deadline: new Date(now.getTime() - 86400000 * 4).toISOString().slice(0, 10),
      energyFit: 'high',
      status: 'completed',
      createdAt: new Date(now.getTime() - 86400000 * 4.5).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
      completedAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
    },
    {
      id: 'task-completed-7',
      title: 'Organize design system components',
      notes: 'Cataloged button, card, and modal patterns.',
      estimateMinutes: 40,
      priority: 'normal',
      deadline: new Date(now.getTime() - 86400000 * 5).toISOString().slice(0, 10),
      energyFit: 'steady',
      status: 'completed',
      createdAt: new Date(now.getTime() - 86400000 * 5.5).toISOString(),
      updatedAt: new Date(now.getTime() - 86400000 * 5).toISOString(),
      completedAt: new Date(now.getTime() - 86400000 * 5).toISOString(),
    },
  ];

  // Seed 7 days of realistic history relative to today
  const seedSessions: FocusSession[] = [];
  const dayMinutes = [40, 50, 30, 75, 45, 60, 20]; // 0 to 6 days ago

  for (let i = 6; i >= 0; i--) {
    const sessionDate = new Date(now);
    sessionDate.setDate(sessionDate.getDate() - i);
    const duration = dayMinutes[6 - i];

    seedSessions.push({
      id: `session-seed-${i}`,
      taskId: i === 0 ? 'task-completed-1' : undefined,
      taskTitleSnapshot: i === 0 ? 'Review sprint deliverables' : 'Focused Work Block',
      plannedMinutes: duration,
      actualSeconds: duration * 60,
      startedAt: new Date(sessionDate.getTime() - duration * 60000).toISOString(),
      endedAt: sessionDate.toISOString(),
      status: 'completed',
    });
  }

  const defaultCheckIn: DailyCheckIn = {
    date: todayStr,
    energy: 'steady',
    availableMinutes: 45,
  };

  const defaultTimer: ActiveTimerState = {
    taskId: 'task-1',
    taskTitle: 'Submit project update',
    plannedMinutes: 15,
    remainingSeconds: 15 * 60,
    actualSeconds: 0,
    status: 'ready',
    endAtMs: null,
    lastTickMs: null,
  };

  const defaultPreferences: UserPreferences = {
    theme: 'light',
    defaultTimerPreset: 25,
    soundEnabled: true,
    ambientSound: 'none',
    ambientVolume: 0.35,
  };

  return {
    version: 1,
    tasks: seedTasks,
    planTaskIds: ['task-1', 'task-2', 'task-3'],
    checkIn: defaultCheckIn,
    activeTimer: defaultTimer,
    sessions: seedSessions,
    reflections: [
      {
        id: 'ref-yesterday',
        date: new Date(now.getTime() - 86400000).toISOString().slice(0, 10),
        wentWell: 'Completed case study research smoothly without distractions.',
        remaining: 'Moved wireframe polishing to tomorrow without stress.',
        note: 'Paced steadily. Protecting focus blocks worked well.',
      },
    ],
    preferences: defaultPreferences,
  };
}

export function loadStoredData(): FocusFlowData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy key
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        try {
          const parsedLegacy = JSON.parse(legacy);
          const fresh = getInitialSeedData();
          saveStoredData(fresh);
          return fresh;
        } catch {
          // ignore
        }
      }
      const initial = getInitialSeedData();
      saveStoredData(initial);
      return initial;
    }

    const parsed = JSON.parse(raw) as Partial<FocusFlowData>;
    const defaultData = getInitialSeedData();

    // Defensive validation & merge
    const validatedTasks: FocusTask[] = Array.isArray(parsed.tasks)
      ? parsed.tasks.filter((t) => t && typeof t.id === 'string' && typeof t.title === 'string')
      : defaultData.tasks;

    const validatedSessions: FocusSession[] = Array.isArray(parsed.sessions)
      ? parsed.sessions
      : defaultData.sessions;

    const validatedReflections = Array.isArray(parsed.reflections)
      ? parsed.reflections
      : defaultData.reflections;

    const checkIn: DailyCheckIn = {
      date: parsed.checkIn?.date || getLocalTodayStr(),
      energy: parsed.checkIn?.energy || 'steady',
      availableMinutes: Number(parsed.checkIn?.availableMinutes) || 45,
    };

    // Recover timer state defensively
    let activeTimer: ActiveTimerState = defaultData.activeTimer;
    if (parsed.activeTimer) {
      const storedTimer = parsed.activeTimer;
      activeTimer = {
        taskId: storedTimer.taskId || null,
        taskTitle: storedTimer.taskTitle || 'Focus Session',
        plannedMinutes: Number(storedTimer.plannedMinutes) || 25,
        remainingSeconds: Math.max(0, Number(storedTimer.remainingSeconds) || 25 * 60),
        actualSeconds: Math.max(0, Number(storedTimer.actualSeconds) || 0),
        status: storedTimer.status || 'ready',
        endAtMs: storedTimer.endAtMs || null,
        lastTickMs: storedTimer.lastTickMs || null,
      };

      // If timer was running and has an endAtMs, calculate real time difference upon reload!
      if (activeTimer.status === 'running' && activeTimer.endAtMs) {
        const nowMs = Date.now();
        const diffSeconds = Math.round((activeTimer.endAtMs - nowMs) / 1000);
        if (diffSeconds <= 0) {
          activeTimer.remainingSeconds = 0;
          activeTimer.status = 'completed';
          activeTimer.endAtMs = null;
        } else {
          activeTimer.remainingSeconds = diffSeconds;
          if (activeTimer.lastTickMs) {
            const elapsedSinceLast = Math.round((nowMs - activeTimer.lastTickMs) / 1000);
            activeTimer.actualSeconds += Math.max(0, elapsedSinceLast);
          }
          activeTimer.lastTickMs = nowMs;
        }
      }
    }

    return {
      version: 1,
      tasks: validatedTasks,
      planTaskIds: Array.isArray(parsed.planTaskIds) ? parsed.planTaskIds : defaultData.planTaskIds,
      checkIn,
      activeTimer,
      sessions: validatedSessions,
      reflections: validatedReflections,
      preferences: {
        ...defaultData.preferences,
        ...(parsed.preferences || {}),
      },
    };
  } catch {
    const initial = getInitialSeedData();
    saveStoredData(initial);
    return initial;
  }
}

export function saveStoredData(data: FocusFlowData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage quota or private browsing safeguard
  }
}

export function exportDataAsJson(data: FocusFlowData) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `focusflow-backup-${getLocalTodayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
