import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  ActiveTimerState,
  DailyCheckIn,
  DailyReflection,
  EnergyLevel,
  FocusFlowData,
  FocusSession,
  FocusTask,
  PlanSuggestion,
  TaskPriority,
  TaskStatus,
} from '../types';
import { soundEngine } from '../utils/audio';
import { generatePlanSuggestion } from '../utils/planner';
import {
  exportDataAsJson,
  getInitialSeedData,
  getLocalTodayStr,
  loadStoredData,
  saveStoredData,
} from '../utils/storage';

export type ActiveTab = 'overview' | 'planner' | 'focus' | 'insights' | 'settings';

interface AppContextValue {
  data: FocusFlowData;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  // Check in
  setEnergy: (energy: EnergyLevel) => void;
  setAvailableMinutes: (minutes: number) => void;
  currentSuggestion: PlanSuggestion;
  applySuggestedPlan: (customTasks?: FocusTask[]) => void;
  reorderPlan: (fromIndex: number, toIndex: number) => void;
  addTaskToPlan: (taskId: string) => void;
  removeTaskFromPlan: (taskId: string) => void;
  // Task management
  createTask: (params: {
    title: string;
    notes?: string;
    estimateMinutes: number;
    priority: TaskPriority;
    deadline?: string;
    energyFit?: EnergyLevel | 'any';
    addToPlan?: boolean;
  }) => FocusTask | null;
  updateTask: (taskId: string, updates: Partial<FocusTask>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  moveUnfinishedTasksToTomorrow: () => void;
  // Focus Timer
  startFocusSession: (taskId: string | null, customMinutes?: number) => void;
  pauseFocusTimer: () => void;
  resumeFocusTimer: () => void;
  resetFocusTimer: () => void;
  extendFocusTimer: (minutes: number) => void;
  endFocusSessionEarly: (markTaskComplete?: boolean) => void;
  completeFocusSession: (markTaskComplete?: boolean) => void;
  // Reflection
  saveDailyReflection: (reflection: Omit<DailyReflection, 'id'>) => void;
  // Settings & Storage
  resetToDemo: () => void;
  exportBackup: () => void;
  importBackup: (newData: FocusFlowData) => void;
  toggleTheme: () => void;
  setTimerPreset: (mins: number) => void;
  setAmbientSound: (sound: 'none' | 'rain' | 'binaural' | 'whitenoise') => void;
  setAmbientVolume: (vol: number) => void;
  toggleSoundEnabled: () => void;
  // Task modal helper
  isTaskModalOpen: boolean;
  editingTask: FocusTask | null;
  openTaskModal: (task?: FocusTask) => void;
  closeTaskModal: () => void;
  // Mobile sidebar drawer
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  // Toast notifications
  notice: string | null;
  showNotice: (msg: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<FocusFlowData>(() => loadStoredData());
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FocusTask | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync to local storage with throttling to prevent thrashing
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveStoredData(data);
    }, 300);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [data]);

  // Sync dark mode class to document
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Sync ambient sound
  useEffect(() => {
    if (data.preferences.ambientSound !== 'none') {
      soundEngine.startAmbient(data.preferences.ambientSound, data.preferences.ambientVolume);
    } else {
      soundEngine.stopAmbient();
    }
    return () => {
      soundEngine.stopAmbient();
    };
  }, [data.preferences.ambientSound, data.preferences.ambientVolume]);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // High-accuracy timer tick loop based on endAtMs
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (data.activeTimer.status === 'running') {
      interval = setInterval(() => {
        const nowMs = Date.now();
        setData((prev) => {
          if (prev.activeTimer.status !== 'running' || !prev.activeTimer.endAtMs) {
            return prev;
          }

          const diffSeconds = Math.round((prev.activeTimer.endAtMs - nowMs) / 1000);
          const lastTick = prev.activeTimer.lastTickMs || nowMs;
          const deltaSecs = Math.max(0, Math.round((nowMs - lastTick) / 1000));

          if (diffSeconds <= 0) {
            // Reached zero!
            if (prev.preferences.soundEnabled) {
              soundEngine.playChime(true);
            }
            return {
              ...prev,
              activeTimer: {
                ...prev.activeTimer,
                remainingSeconds: 0,
                actualSeconds: prev.activeTimer.actualSeconds + deltaSecs,
                status: 'completed',
                endAtMs: null,
                lastTickMs: null,
              },
            };
          }

          return {
            ...prev,
            activeTimer: {
              ...prev.activeTimer,
              remainingSeconds: diffSeconds,
              actualSeconds: prev.activeTimer.actualSeconds + deltaSecs,
              lastTickMs: nowMs,
            },
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [data.activeTimer.status, data.preferences.soundEnabled]);

  // Current suggested plan
  const currentSuggestion = generatePlanSuggestion(
    data.tasks,
    data.checkIn.energy,
    data.checkIn.availableMinutes
  );

  const setEnergy = (energy: EnergyLevel) => {
    setData((prev) => ({
      ...prev,
      checkIn: { ...prev.checkIn, energy },
    }));
  };

  const setAvailableMinutes = (minutes: number) => {
    setData((prev) => ({
      ...prev,
      checkIn: { ...prev.checkIn, availableMinutes: Math.max(5, Math.min(480, minutes)) },
    }));
  };

  const applySuggestedPlan = (customTasks?: FocusTask[]) => {
    const tasksToApply = customTasks || currentSuggestion.suggestedTasks;
    const taskIds = tasksToApply.map((t) => t.id);

    setData((prev) => ({
      ...prev,
      planTaskIds: taskIds,
    }));

    showNotice(`Plan built with ${taskIds.length} tasks for your ${data.checkIn.availableMinutes}m window.`);
  };

  const reorderPlan = (fromIndex: number, toIndex: number) => {
    setData((prev) => {
      const copy = [...prev.planTaskIds];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return {
        ...prev,
        planTaskIds: copy,
      };
    });
  };

  const addTaskToPlan = (taskId: string) => {
    setData((prev) => {
      if (prev.planTaskIds.includes(taskId)) return prev;
      return {
        ...prev,
        planTaskIds: [...prev.planTaskIds, taskId],
      };
    });
    showNotice('Added task to today’s plan.');
  };

  const removeTaskFromPlan = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      planTaskIds: prev.planTaskIds.filter((id) => id !== taskId),
    }));
    showNotice('Removed from plan (saved in backlog).');
  };

  const createTask = (params: {
    title: string;
    notes?: string;
    estimateMinutes: number;
    priority: TaskPriority;
    deadline?: string;
    energyFit?: EnergyLevel | 'any';
    addToPlan?: boolean;
  }): FocusTask | null => {
    const trimmedTitle = params.title.trim();
    if (!trimmedTitle) {
      return null;
    }
    const mins = Math.max(5, Math.min(480, Number(params.estimateMinutes) || 25));
    const now = new Date().toISOString();

    const newTask: FocusTask = {
      id: `task-${Date.now()}`,
      title: trimmedTitle,
      notes: params.notes?.trim() || '',
      estimateMinutes: mins,
      priority: params.priority || 'normal',
      deadline: params.deadline || getLocalTodayStr(),
      energyFit: params.energyFit || 'any',
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    };

    setData((prev) => {
      const tasks = [newTask, ...prev.tasks];
      const planTaskIds = params.addToPlan ? [newTask.id, ...prev.planTaskIds] : prev.planTaskIds;
      return {
        ...prev,
        tasks,
        planTaskIds,
      };
    });

    showNotice(`Created “${newTask.title}”.`);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<FocusTask>) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    }));
    showNotice('Task updated.');
  };

  const deleteTask = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
      planTaskIds: prev.planTaskIds.filter((id) => id !== taskId),
      activeTimer:
        prev.activeTimer.taskId === taskId
          ? {
              ...prev.activeTimer,
              taskId: null,
              taskTitle: 'Focus Session',
              status: 'ready',
              endAtMs: null,
            }
          : prev.activeTimer,
    }));
    showNotice('Task removed.');
  };

  const toggleTaskComplete = (taskId: string) => {
    setData((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId);
      if (!task) return prev;
      const isCompleting = task.status !== 'completed';
      const now = new Date().toISOString();

      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: (isCompleting ? 'completed' : 'todo') as TaskStatus,
              completedAt: isCompleting ? now : undefined,
              updatedAt: now,
            }
          : t
      );

      // If completed, remove from active plan
      const planTaskIds = isCompleting
        ? prev.planTaskIds.filter((id) => id !== taskId)
        : prev.planTaskIds;

      return {
        ...prev,
        tasks: updatedTasks,
        planTaskIds,
      };
    });

    showNotice('Task status updated.');
  };

  const moveUnfinishedTasksToTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    setData((prev) => {
      const unfinishedPlanTaskIds = prev.planTaskIds.filter((id) => {
        const t = prev.tasks.find((task) => task.id === id);
        return t && t.status !== 'completed';
      });

      const updatedTasks = prev.tasks.map((t) => {
        if (unfinishedPlanTaskIds.includes(t.id)) {
          return {
            ...t,
            deadline: tomorrowStr,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });

      return {
        ...prev,
        tasks: updatedTasks,
        planTaskIds: [], // Clears active queue for the fresh day
      };
    });

    showNotice('Moved unfinished tasks to tomorrow.');
  };

  // Timer controls
  const startFocusSession = (taskId: string | null, customMinutes?: number) => {
    const task = taskId ? data.tasks.find((t) => t.id === taskId) : null;
    const durationMins =
      customMinutes || task?.estimateMinutes || data.preferences.defaultTimerPreset || 25;
    const durationSeconds = durationMins * 60;
    const nowMs = Date.now();

    setData((prev) => ({
      ...prev,
      activeTimer: {
        taskId: task?.id || null,
        taskTitle: task?.title || 'Focused Block',
        plannedMinutes: durationMins,
        remainingSeconds: durationSeconds,
        actualSeconds: 0,
        status: 'running',
        endAtMs: nowMs + durationSeconds * 1000,
        lastTickMs: nowMs,
      },
    }));

    setActiveTab('focus');
  };

  const pauseFocusTimer = () => {
    setData((prev) => {
      if (prev.activeTimer.status !== 'running') return prev;
      const nowMs = Date.now();
      const remainingSeconds = prev.activeTimer.endAtMs
        ? Math.max(0, Math.round((prev.activeTimer.endAtMs - nowMs) / 1000))
        : prev.activeTimer.remainingSeconds;

      return {
        ...prev,
        activeTimer: {
          ...prev.activeTimer,
          status: 'paused',
          remainingSeconds,
          endAtMs: null,
          lastTickMs: null,
        },
      };
    });
  };

  const resumeFocusTimer = () => {
    setData((prev) => {
      if (prev.activeTimer.status !== 'paused' && prev.activeTimer.status !== 'ready') return prev;
      const nowMs = Date.now();
      return {
        ...prev,
        activeTimer: {
          ...prev.activeTimer,
          status: 'running',
          endAtMs: nowMs + prev.activeTimer.remainingSeconds * 1000,
          lastTickMs: nowMs,
        },
      };
    });
  };

  const resetFocusTimer = () => {
    setData((prev) => ({
      ...prev,
      activeTimer: {
        ...prev.activeTimer,
        status: 'ready',
        remainingSeconds: prev.activeTimer.plannedMinutes * 60,
        actualSeconds: 0,
        endAtMs: null,
        lastTickMs: null,
      },
    }));
  };

  const extendFocusTimer = (minutes: number) => {
    setData((prev) => {
      const extraSeconds = minutes * 60;
      const newRemaining = prev.activeTimer.remainingSeconds + extraSeconds;
      const nowMs = Date.now();
      return {
        ...prev,
        activeTimer: {
          ...prev.activeTimer,
          plannedMinutes: prev.activeTimer.plannedMinutes + minutes,
          remainingSeconds: newRemaining,
          endAtMs:
            prev.activeTimer.status === 'running'
              ? (prev.activeTimer.endAtMs || nowMs) + extraSeconds * 1000
              : null,
        },
      };
    });
  };

  const completeFocusSession = (markTaskComplete = true) => {
    const timer = data.activeTimer;
    const now = new Date().toISOString();
    const actualMinutes = Math.max(1, Math.round(timer.actualSeconds / 60));

    const newSession: FocusSession = {
      id: `session-${Date.now()}`,
      taskId: timer.taskId || undefined,
      taskTitleSnapshot: timer.taskTitle,
      plannedMinutes: timer.plannedMinutes,
      actualSeconds: timer.actualSeconds,
      startedAt: new Date(Date.now() - timer.actualSeconds * 1000).toISOString(),
      endedAt: now,
      status: 'completed',
    };

    setData((prev) => {
      let updatedTasks = prev.tasks;
      let planTaskIds = prev.planTaskIds;

      if (timer.taskId && markTaskComplete) {
        updatedTasks = prev.tasks.map((t) =>
          t.id === timer.taskId
            ? { ...t, status: 'completed' as TaskStatus, completedAt: now, updatedAt: now }
            : t
        );
        planTaskIds = prev.planTaskIds.filter((id) => id !== timer.taskId);
      }

      return {
        ...prev,
        tasks: updatedTasks,
        planTaskIds,
        sessions: [newSession, ...prev.sessions],
        activeTimer: {
          ...prev.activeTimer,
          status: 'ready',
          remainingSeconds: prev.activeTimer.plannedMinutes * 60,
          actualSeconds: 0,
          endAtMs: null,
          lastTickMs: null,
        },
      };
    });

    if (data.preferences.soundEnabled) {
      soundEngine.playChime(true);
    }
    showNotice(`Logged ${actualMinutes}m focus session.`);
  };

  const endFocusSessionEarly = (markTaskComplete = false) => {
    const timer = data.activeTimer;
    const now = new Date().toISOString();
    const actualMinutes = Math.max(1, Math.round(timer.actualSeconds / 60));

    const newSession: FocusSession = {
      id: `session-${Date.now()}`,
      taskId: timer.taskId || undefined,
      taskTitleSnapshot: timer.taskTitle,
      plannedMinutes: timer.plannedMinutes,
      actualSeconds: timer.actualSeconds,
      startedAt: new Date(Date.now() - timer.actualSeconds * 1000).toISOString(),
      endedAt: now,
      status: 'abandoned',
    };

    setData((prev) => {
      let updatedTasks = prev.tasks;
      let planTaskIds = prev.planTaskIds;

      if (timer.taskId && markTaskComplete) {
        updatedTasks = prev.tasks.map((t) =>
          t.id === timer.taskId
            ? { ...t, status: 'completed' as TaskStatus, completedAt: now, updatedAt: now }
            : t
        );
        planTaskIds = prev.planTaskIds.filter((id) => id !== timer.taskId);
      }

      return {
        ...prev,
        tasks: updatedTasks,
        planTaskIds,
        sessions: [newSession, ...prev.sessions],
        activeTimer: {
          ...prev.activeTimer,
          status: 'ready',
          remainingSeconds: prev.activeTimer.plannedMinutes * 60,
          actualSeconds: 0,
          endAtMs: null,
          lastTickMs: null,
        },
      };
    });

    showNotice(`Session ended early (${actualMinutes}m logged).`);
  };

  const saveDailyReflection = (reflection: Omit<DailyReflection, 'id'>) => {
    const newRef: DailyReflection = {
      id: `ref-${Date.now()}`,
      ...reflection,
    };
    setData((prev) => ({
      ...prev,
      reflections: [newRef, ...prev.reflections.filter((r) => r.date !== reflection.date)],
    }));
    showNotice('Reflection saved. Rest well.');
  };

  const resetToDemo = () => {
    const seed = getInitialSeedData();
    saveStoredData(seed);
    setData(seed);
    showNotice('Reset to initial starter workspace.');
  };

  const exportBackup = () => {
    exportDataAsJson(data);
    showNotice('Exported FocusFlow backup.');
  };

  const importBackup = (newData: FocusFlowData) => {
    saveStoredData(newData);
    setData(newData);
    showNotice('Backup imported successfully.');
  };

  const toggleTheme = () => {
    setData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: prev.preferences.theme === 'light' ? 'dark' : 'light',
      },
    }));
  };

  const setTimerPreset = (mins: number) => {
    setData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        defaultTimerPreset: mins,
      },
    }));
  };

  const setAmbientSound = (sound: 'none' | 'rain' | 'binaural' | 'whitenoise') => {
    setData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ambientSound: sound,
      },
    }));
  };

  const setAmbientVolume = (vol: number) => {
    const v = Math.max(0, Math.min(1, vol));
    setData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ambientVolume: v,
      },
    }));
    soundEngine.setAmbientVolume(v);
  };

  const toggleSoundEnabled = () => {
    setData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        soundEnabled: !prev.preferences.soundEnabled,
      },
    }));
  };

  const openTaskModal = (task?: FocusTask) => {
    setEditingTask(task || null);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        data,
        activeTab,
        setActiveTab,
        setEnergy,
        setAvailableMinutes,
        currentSuggestion,
        applySuggestedPlan,
        reorderPlan,
        addTaskToPlan,
        removeTaskFromPlan,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        moveUnfinishedTasksToTomorrow,
        startFocusSession,
        pauseFocusTimer,
        resumeFocusTimer,
        resetFocusTimer,
        extendFocusTimer,
        endFocusSessionEarly,
        completeFocusSession,
        saveDailyReflection,
        resetToDemo,
        exportBackup,
        importBackup,
        toggleTheme,
        setTimerPreset,
        setAmbientSound,
        setAmbientVolume,
        toggleSoundEnabled,
        isTaskModalOpen,
        editingTask,
        openTaskModal,
        closeTaskModal,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        notice,
        showNotice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
