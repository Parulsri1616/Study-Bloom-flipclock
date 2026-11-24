export type TimerState = 'idle' | 'running' | 'paused';

export interface StudySession {
  id: string;
  subject: string;
  startTime: number; // timestamp in ms
  endTime: number; // timestamp in ms
  durationSeconds: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface ActiveTimerData {
  state: TimerState;
  subject: string;
  sessionStartTime: number; // when session was first started
  lastStartTime: number; // when last unpaused
  accumulatedMs: number; // milliseconds accumulated before current run
  notes?: string;
}

export interface SubjectConfig {
  id: string;
  name: string;
  color: string;
  textColor: string;
  borderColor: string;
  iconName: string;
}

export interface DailyGoal {
  targetHours: number; // default 8
}

export type ClockDisplayMode = 'time' | 'timer';

export interface Quote {
  text: string;
  author: string;
}

export type AmbientSoundType = 'none' | 'rain' | 'waves' | 'zen-drone' | 'pink-noise' | 'cafe';
