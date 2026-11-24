import React, { useState, useEffect } from 'react';
import { FlipUnit } from './FlipUnit';
import { ClockDisplayMode } from '../../types';
import { formatDateDisplay, formatDurationHMS, getDayGreeting, padZero } from '../../utils/timeUtils';
import { Clock, Timer, Sparkles, Maximize2 } from 'lucide-react';

interface FlipClockProps {
  studyDurationSeconds?: number;
  isStudyTimerRunning?: boolean;
  studySubject?: string;
  onOpenFocusMode?: () => void;
  size?: 'normal' | 'giant';
  defaultMode?: ClockDisplayMode;
}

export const FlipClock: React.FC<FlipClockProps> = ({
  studyDurationSeconds = 0,
  isStudyTimerRunning = false,
  studySubject = '',
  onOpenFocusMode,
  size = 'normal',
  defaultMode = 'time',
}) => {
  const [displayMode, setDisplayMode] = useState<ClockDisplayMode>(defaultMode);
  const [use12Hour, setUse12Hour] = useState<boolean>(true);
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  let hoursVal = time.getHours();
  let ampm = '';
  if (use12Hour) {
    ampm = hoursVal >= 12 ? 'PM' : 'AM';
    hoursVal = hoursVal % 12 || 12;
  }
  const liveHours = padZero(hoursVal);
  const liveMinutes = padZero(time.getMinutes());
  const liveSeconds = padZero(time.getSeconds());

  const timerHMS = formatDurationHMS(studyDurationSeconds);

  const displayHours = displayMode === 'time' ? liveHours : timerHMS.hours;
  const displayMinutes = displayMode === 'time' ? liveMinutes : timerHMS.minutes;
  const displaySeconds = displayMode === 'time' ? liveSeconds : timerHMS.seconds;

  const colonSize =
    size === 'giant'
      ? 'w-3 h-3 sm:w-4 sm:h-4 bg-black dark:bg-white'
      : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-black dark:bg-white';

  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
        size === 'giant'
          ? 'p-4 sm:p-8 md:p-12 w-full max-w-5xl mx-auto'
          : 'p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md'
      }`}
    >
      {/* Top Bar inside Clock Card */}
      <div className="w-full flex items-center justify-between mb-5 sm:mb-7">
        <div className="flex items-center gap-1.5 p-1 bg-mono-100 dark:bg-mono-900 rounded-full border border-mono-200 dark:border-mono-800 text-xs font-medium">
          <button
            onClick={() => setDisplayMode('time')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
              displayMode === 'time'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold'
                : 'text-mono-500 hover:text-black dark:text-mono-400 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Live Clock</span>
          </button>

          <button
            onClick={() => setDisplayMode('timer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
              displayMode === 'timer'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-semibold'
                : 'text-mono-500 hover:text-black dark:text-mono-400 dark:hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Study Timer</span>
            {isStudyTimerRunning && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {displayMode === 'time' && (
            <button
              onClick={() => setUse12Hour((prev) => !prev)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-mono-700 dark:text-mono-300 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors border border-mono-200 dark:border-mono-700"
              title="Toggle 12h/24h format"
            >
              {use12Hour ? ampm : '24H'}
            </button>
          )}

          {onOpenFocusMode && (
            <button
              onClick={onOpenFocusMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-black dark:text-white bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 transition-all border border-mono-200 dark:border-mono-700"
              title="Enter Full-Screen Focus Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fullscreen Focus</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Flip Clock Units */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 my-2">
        <FlipUnit value={displayHours} label="Hours" size={size} />

        {/* Separator Colons */}
        <div className="flex flex-col justify-center items-center gap-2 sm:gap-3 py-4 sm:py-6 select-none">
          <span className={`${colonSize} rounded-full shadow-xs animate-pulse-subtle`} />
          <span className={`${colonSize} rounded-full shadow-xs animate-pulse-subtle`} />
        </div>

        <FlipUnit value={displayMinutes} label="Minutes" size={size} />

        {/* Separator Colons */}
        <div className="flex flex-col justify-center items-center gap-2 sm:gap-3 py-4 sm:py-6 select-none">
          <span className={`${colonSize} rounded-full shadow-xs animate-pulse-subtle`} />
          <span className={`${colonSize} rounded-full shadow-xs animate-pulse-subtle`} />
        </div>

        <FlipUnit value={displaySeconds} label="Seconds" size={size} />
      </div>

      {/* Underneath: Date, Day & Greeting */}
      <div className="mt-6 sm:mt-8 flex flex-col items-center text-center">
        <p className="text-sm sm:text-base font-semibold tracking-wide text-mono-950 dark:text-mono-100">
          {formatDateDisplay(time)}
        </p>

        <div className="mt-1.5 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-mono-600 dark:text-mono-400">
          <Sparkles className="w-3.5 h-3.5 text-mono-800 dark:text-mono-200 animate-pulse" />
          <span>{getDayGreeting()}</span>
        </div>

        {displayMode === 'timer' && studySubject && (
          <div className="mt-3 px-3.5 py-1 rounded-full bg-mono-100 dark:bg-mono-800 text-xs font-semibold text-mono-950 dark:text-mono-50 border border-mono-300 dark:border-mono-700 shadow-xs">
            Focusing on: {studySubject}
          </div>
        )}
      </div>
    </div>
  );
};
