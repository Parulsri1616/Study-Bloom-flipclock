import React, { useEffect, useRef } from 'react';
import { DailyGoal, StudySession } from '../../types';
import {
  calculateTodaySeconds,
  calculateTodaySessionsCount,
  calculateThisWeekSeconds,
  formatDurationFriendly,
} from '../../utils/timeUtils';
import { Target, Flame, CheckCircle2, Clock, Calendar, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyStatsProps {
  sessions: StudySession[];
  activeTimerDurationSeconds: number;
  dailyGoal: DailyGoal;
  onEditGoal: () => void;
}

export const DailyStats: React.FC<DailyStatsProps> = ({
  sessions,
  activeTimerDurationSeconds,
  dailyGoal,
  onEditGoal,
}) => {
  const targetSeconds = dailyGoal.targetHours * 3600;
  const completedTodaySeconds = calculateTodaySeconds(sessions);
  const totalTodaySeconds = completedTodaySeconds + activeTimerDurationSeconds;
  const sessionsCount = calculateTodaySessionsCount(sessions);
  const weekSeconds = calculateThisWeekSeconds(sessions) + activeTimerDurationSeconds;

  const progressPercent = Math.min(100, Math.round((totalTodaySeconds / targetSeconds) * 100));
  const remainingSeconds = Math.max(0, targetSeconds - totalTodaySeconds);

  const hasCelebrated = useRef(false);

  useEffect(() => {
    if (progressPercent >= 100 && !hasCelebrated.current) {
      hasCelebrated.current = true;
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#000000', '#FFFFFF', '#71717A', '#A1A1AA'],
        });
      } catch {
        // ignore
      }
    }
  }, [progressPercent]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Main Daily Goal Progress Card */}
      <div className="md:col-span-2 p-6 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-mono-950 dark:text-mono-50">
                  Daily Study Goal
                </h3>
                <p className="text-xs text-mono-500">
                  Target: {dailyGoal.targetHours} hours/day
                </p>
              </div>
            </div>

            <button
              onClick={onEditGoal}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-mono-800 dark:text-mono-200 bg-mono-100 hover:bg-mono-200 dark:bg-mono-800 dark:hover:bg-mono-700 rounded-full transition-colors border border-mono-200 dark:border-mono-700"
            >
              <Edit3 className="w-3 h-3" />
              <span>Change Goal</span>
            </button>
          </div>

          {/* Progress Overview Numbers */}
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-3xl sm:text-4xl font-clock font-bold text-mono-950 dark:text-white tracking-tight">
                {formatDurationFriendly(totalTodaySeconds)}
              </span>
              <span className="text-xs text-mono-500 ml-2">
                completed today
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-bold font-clock text-mono-950 dark:text-mono-50">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Minimalist Monochrome Progress Bar */}
          <div className="w-full h-3.5 bg-mono-100 dark:bg-mono-900 rounded-full overflow-hidden p-0.5 border border-mono-200 dark:border-mono-800">
            <div
              className="h-full bg-black dark:bg-white rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Bottom micro stats */}
        <div className="mt-5 pt-4 border-t border-mono-200 dark:border-mono-800 flex items-center justify-between text-xs text-mono-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-mono-900 dark:text-mono-100" />
            <span>
              {remainingSeconds === 0 ? (
                <span className="text-black dark:text-white font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Goal achieved today!
                </span>
              ) : (
                <>
                  <span className="font-semibold text-mono-950 dark:text-mono-50">
                    {formatDurationFriendly(remainingSeconds)}
                  </span>{' '}
                  remaining
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-mono-900 dark:text-mono-100" />
            <span>
              <span className="font-semibold text-mono-950 dark:text-mono-50">
                {sessionsCount}
              </span>{' '}
              {sessionsCount === 1 ? 'session' : 'sessions'} today
            </span>
          </div>
        </div>
      </div>

      {/* 2. Side Weekly Summary */}
      <div className="p-6 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-mono-950 dark:text-mono-50">
                Weekly Total
              </h3>
              <p className="text-xs text-mono-500">
                Monday to Sunday
              </p>
            </div>
          </div>

          <div className="my-2">
            <div className="text-3xl font-clock font-bold text-mono-950 dark:text-white">
              {formatDurationFriendly(weekSeconds)}
            </div>
            <p className="text-xs text-mono-500 mt-1">
              Invested into your GATE CSE preparation this week
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-mono-200 dark:border-mono-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-mono-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-mono-900 dark:text-mono-100 fill-current" />
              Daily consistency:
            </span>
            <span className="font-semibold text-mono-950 dark:text-mono-100">
              {((weekSeconds / (targetSeconds * 7)) * 100).toFixed(0)}% of weekly goal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
