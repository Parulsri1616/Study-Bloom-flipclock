import { useState, useEffect, useRef, useCallback } from 'react';
import { ActiveTimerData, StudySession, TimerState } from '../types';
import { DEFAULT_SUBJECT } from '../constants/subjects';
import { getTodayDateKey } from '../utils/timeUtils';
import { soundManager } from '../utils/audioEngine';

const STORAGE_KEY_ACTIVE_TIMER = 'studybloom_active_timer';

const initialTimerData: ActiveTimerData = {
  state: 'idle',
  subject: DEFAULT_SUBJECT,
  sessionStartTime: 0,
  lastStartTime: 0,
  accumulatedMs: 0,
  notes: '',
};

export function useStudyTimer(onSessionCompleted: (session: StudySession) => void) {
  const [timerData, setTimerData] = useState<ActiveTimerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TIMER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load active timer from localStorage', e);
    }
    return initialTimerData;
  });

  const [currentDurationSeconds, setCurrentDurationSeconds] = useState<number>(() => {
    if (timerData.state === 'running') {
      const elapsed = timerData.accumulatedMs + (Date.now() - timerData.lastStartTime);
      return Math.floor(elapsed / 1000);
    } else if (timerData.state === 'paused') {
      return Math.floor(timerData.accumulatedMs / 1000);
    }
    return 0;
  });

  // Sync timerData with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TIMER, JSON.stringify(timerData));
    } catch (e) {
      console.error('Failed to save active timer to localStorage', e);
    }
  }, [timerData]);

  // Interval for updating the display seconds using real timestamp diff
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerData.state === 'running') {
      const updateTimer = () => {
        const now = Date.now();
        const totalMs = timerData.accumulatedMs + (now - timerData.lastStartTime);
        setCurrentDurationSeconds(Math.floor(totalMs / 1000));
      };

      // update immediately
      updateTimer();

      // tick every 250ms for snappy responsiveness
      intervalRef.current = window.setInterval(updateTimer, 250);

      // Also listen to visibilitychange for instant catch-up when tab becomes visible
      const handleVisibilityChange = () => {
        if (!document.hidden && timerData.state === 'running') {
          updateTimer();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else if (timerData.state === 'paused') {
      setCurrentDurationSeconds(Math.floor(timerData.accumulatedMs / 1000));
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      setCurrentDurationSeconds(0);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [timerData.state, timerData.lastStartTime, timerData.accumulatedMs]);

  const startTimer = useCallback((subject: string, notes?: string) => {
    const now = Date.now();
    soundManager.playChime(false);
    setTimerData({
      state: 'running',
      subject: subject || DEFAULT_SUBJECT,
      sessionStartTime: now,
      lastStartTime: now,
      accumulatedMs: 0,
      notes: notes || '',
    });
  }, []);

  const pauseTimer = useCallback(() => {
    soundManager.playChime(false);
    setTimerData((prev) => {
      if (prev.state !== 'running') return prev;
      const now = Date.now();
      const newAccumulated = prev.accumulatedMs + (now - prev.lastStartTime);
      return {
        ...prev,
        state: 'paused',
        lastStartTime: 0,
        accumulatedMs: newAccumulated,
      };
    });
  }, []);

  const resumeTimer = useCallback(() => {
    soundManager.playChime(false);
    setTimerData((prev) => {
      if (prev.state !== 'paused') return prev;
      const now = Date.now();
      return {
        ...prev,
        state: 'running',
        lastStartTime: now,
      };
    });
  }, []);

  const stopTimer = useCallback(() => {
    soundManager.playChime(true);
    const now = Date.now();
    let totalMs = timerData.accumulatedMs;
    if (timerData.state === 'running') {
      totalMs += now - timerData.lastStartTime;
    }

    const durationSeconds = Math.max(1, Math.round(totalMs / 1000));

    // Save session if at least 5 seconds
    if (durationSeconds >= 5) {
      const session: StudySession = {
        id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        subject: timerData.subject,
        startTime: timerData.sessionStartTime || (now - durationSeconds * 1000),
        endTime: now,
        durationSeconds,
        date: getTodayDateKey(),
        notes: timerData.notes,
      };
      onSessionCompleted(session);
    }

    // Reset to idle
    const resetData: ActiveTimerData = {
      state: 'idle',
      subject: timerData.subject,
      sessionStartTime: 0,
      lastStartTime: 0,
      accumulatedMs: 0,
      notes: '',
    };
    setTimerData(resetData);
    setCurrentDurationSeconds(0);
    try {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_TIMER);
    } catch {
      // ignore
    }

    return durationSeconds;
  }, [timerData, onSessionCompleted]);

  const updateSubject = useCallback((subject: string) => {
    setTimerData((prev) => ({
      ...prev,
      subject,
    }));
  }, []);

  const updateNotes = useCallback((notes: string) => {
    setTimerData((prev) => ({
      ...prev,
      notes,
    }));
  }, []);

  return {
    timerState: timerData.state as TimerState,
    currentSubject: timerData.subject,
    sessionStartTime: timerData.sessionStartTime,
    currentDurationSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateSubject,
    updateNotes,
    notes: timerData.notes || '',
  };
}
