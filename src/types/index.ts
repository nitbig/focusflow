export type EnergyLevel = 'low' | 'steady' | 'high';
export type TaskPriority = 'low' | 'normal' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface FocusTask {
  id: string;
  title: string;
  notes?: string;
  estimateMinutes: number;
  priority: TaskPriority;
  deadline?: string; // ISO date string YYYY-MM-DD
  energyFit: EnergyLevel | 'any';
  status: TaskStatus;
  createdAt: string; // ISO timestamp
  updatedAt: string;
  completedAt?: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitleSnapshot: string;
  plannedMinutes: number;
  actualSeconds: number;
  startedAt: string;
  endedAt?: string;
  status: 'running' | 'paused' | 'completed' | 'abandoned';
  remainingSeconds?: number;
  endAtMs?: number;
}

export interface DailyCheckIn {
  date: string; // local calendar date in YYYY-MM-DD format
  energy: EnergyLevel;
  availableMinutes: number;
}

export interface DailyReflection {
  id: string;
  date: string;
  wentWell?: string;
  remaining?: string;
  note?: string;
}

export interface ActiveTimerState {
  taskId: string | null;
  taskTitle: string;
  plannedMinutes: number;
  remainingSeconds: number;
  actualSeconds: number;
  status: 'ready' | 'running' | 'paused' | 'completed';
  endAtMs: number | null; // stored timestamp to prevent drift on tab throttling
  lastTickMs: number | null;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultTimerPreset: number; // 15, 25, 45, etc.
  soundEnabled: boolean;
  ambientSound: 'none' | 'rain' | 'binaural' | 'whitenoise';
  ambientVolume: number;
}

export interface FocusFlowData {
  version: 1;
  tasks: FocusTask[];
  planTaskIds: string[];
  checkIn: DailyCheckIn;
  activeTimer: ActiveTimerState;
  sessions: FocusSession[];
  reflections: DailyReflection[];
  preferences: UserPreferences;
}

export interface PlanSuggestion {
  suggestedTasks: FocusTask[];
  totalMinutes: number;
  availableMinutes: number;
  rationale: string;
  subtext: string;
  energyLevel: EnergyLevel;
}
