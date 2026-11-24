import React, { useState } from 'react';
import { GATE_CSE_SUBJECTS } from '../../constants/subjects';
import { TimerState } from '../../types';
import { formatDurationHMS } from '../../utils/timeUtils';
import { Play, Pause, Square, BookOpen, PenLine, Sparkles, Maximize2 } from 'lucide-react';

interface StudyTimerControlProps {
  timerState: TimerState;
  currentSubject: string;
  durationSeconds: number;
  notes: string;
  onStart: (subject: string, notes?: string) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSubjectChange: (subject: string) => void;
  onNotesChange: (notes: string) => void;
  onOpenFocusMode?: () => void;
}

export const StudyTimerControl: React.FC<StudyTimerControlProps> = ({
  timerState,
  currentSubject,
  durationSeconds,
  notes,
  onStart,
  onPause,
  onResume,
  onStop,
  onSubjectChange,
  onNotesChange,
  onOpenFocusMode,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(currentSubject);
  const [customSubject, setCustomSubject] = useState('');
  const [sessionNotes, setSessionNotes] = useState(notes);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const { hours, minutes, seconds } = formatDurationHMS(durationSeconds);

  const isRunning = timerState === 'running';
  const isPaused = timerState === 'paused';
  const isIdle = timerState === 'idle';

  const handleStart = () => {
    const finalSubject = selectedSubject === 'Other' && customSubject.trim() ? customSubject.trim() : selectedSubject;
    onStart(finalSubject, sessionNotes);
  };

  const handleConfirmStop = () => {
    setShowStopConfirm(false);
    onStop();
  };

  return (
    <div className="w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-mono-950 dark:text-mono-50">
              Study Session
            </h2>
            <p className="text-xs text-mono-500">
              {isRunning
                ? 'Deep focus in progress...'
                : isPaused
                ? 'Session paused'
                : 'Select your GATE subject & start tracking'}
            </p>
          </div>
        </div>

        {/* Live Timer Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-mono-100 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 shadow-inner-soft">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isRunning ? 'bg-emerald-400 animate-ping' : isPaused ? 'bg-amber-400' : 'bg-mono-400'
            }`}
          />
          <span className="font-clock font-bold text-base sm:text-lg text-mono-950 dark:text-mono-50 tracking-wider">
            {hours}:{minutes}:{seconds}
          </span>
        </div>
      </div>

      {/* Subject Selector */}
      <div className="space-y-3 mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-mono-700 dark:text-mono-300">
          GATE CSE Subject
        </label>

        {isIdle ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {GATE_CSE_SUBJECTS.map((sub) => {
              const isSelected = selectedSubject === sub.name;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(sub.name);
                    onSubjectChange(sub.name);
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left transition-all duration-200 truncate ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs scale-[1.02]'
                      : 'bg-mono-50 dark:bg-mono-900 border-mono-200 dark:border-mono-800 text-mono-800 dark:text-mono-200 hover:border-black dark:hover:border-white'
                  }`}
                  title={sub.name}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-mono-100 dark:bg-mono-900 border border-mono-200 dark:border-mono-800">
            <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white" />
            <span className="text-sm font-bold text-mono-950 dark:text-mono-50">
              {currentSubject}
            </span>
            <span className="text-xs text-mono-500 ml-auto">
              (Active Subject)
            </span>
          </div>
        )}

        {/* Custom Subject Input if 'Other' is selected */}
        {isIdle && selectedSubject === 'Other' && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Enter custom topic or subject name..."
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-mono-950 dark:text-mono-50"
            />
          </div>
        )}
      </div>

      {/* Session Notes / Goal */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-1.5">
          <PenLine className="w-3.5 h-3.5 text-mono-500" />
          <label className="text-xs font-bold uppercase tracking-wider text-mono-700 dark:text-mono-300">
            Session Goal / Topic Note (Optional)
          </label>
        </div>
        <input
          type="text"
          placeholder="e.g., Solving PYQs on Paging, Deadlocks, SQL Joins..."
          value={sessionNotes}
          disabled={!isIdle && isRunning}
          onChange={(e) => {
            setSessionNotes(e.target.value);
            onNotesChange(e.target.value);
          }}
          className="w-full px-3.5 py-2 text-sm rounded-xl bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-mono-950 dark:text-mono-50 disabled:opacity-75"
        />
      </div>

      {/* Control Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {isIdle ? (
          <>
            <button
              type="button"
              onClick={handleStart}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-7 py-3 rounded-2xl bg-black hover:bg-mono-800 dark:bg-white dark:hover:bg-mono-200 text-white dark:text-black font-bold text-sm shadow-soft transition-all duration-200 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Study Session</span>
            </button>

            {onOpenFocusMode && (
              <button
                type="button"
                onClick={onOpenFocusMode}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-mono-100 hover:bg-mono-200 dark:bg-mono-900 dark:hover:bg-mono-800 border border-mono-200 dark:border-mono-800 text-mono-950 dark:text-mono-50 font-bold text-sm shadow-soft transition-all duration-200 active:scale-95"
                title="Open Fullscreen Focus Mode"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Fullscreen Focus</span>
              </button>
            )}
          </>
        ) : (
          <>
            {isRunning ? (
              <button
                type="button"
                onClick={onPause}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-mono-100 dark:bg-mono-900 border border-mono-300 dark:border-mono-700 text-mono-950 dark:text-mono-50 font-semibold text-sm hover:bg-mono-200 dark:hover:bg-mono-800 transition-all active:scale-95"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onResume}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm shadow-soft transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowStopConfirm(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-mono-100 hover:bg-mono-200 dark:bg-mono-900 dark:hover:bg-mono-800 border border-mono-300 dark:border-mono-700 text-mono-950 dark:text-mono-50 font-semibold text-sm transition-all active:scale-95"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop & Save Session</span>
            </button>

            {onOpenFocusMode && (
              <button
                type="button"
                onClick={onOpenFocusMode}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-mono-100 hover:bg-mono-200 dark:bg-mono-900 dark:hover:bg-mono-800 border border-mono-200 dark:border-mono-800 text-mono-950 dark:text-mono-50 font-semibold text-xs shadow-soft transition-all duration-200 active:scale-95"
                title="Switch to Fullscreen Focus View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </button>
            )}
          </>
        )}

        <div className="text-xs text-mono-500 italic flex items-center gap-1 sm:ml-auto">
          <Sparkles className="w-3.5 h-3.5 text-mono-400" />
          <span>Hours persist automatically across tabs</span>
        </div>
      </div>

      {/* Stop Session Confirmation Modal */}
      {showStopConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft-xl animate-float">
            <h3 className="text-base font-bold text-mono-950 dark:text-mono-50 mb-2">
              Finish Study Session?
            </h3>
            <p className="text-sm text-mono-600 dark:text-mono-400 mb-5">
              You’ve studied for <span className="font-bold text-mono-950 dark:text-mono-50">{hours}h {minutes}m {seconds}s</span> on <span className="font-semibold">{currentSubject}</span>. Save this to your records?
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowStopConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-mono-600 dark:text-mono-400 hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
              >
                Keep Studying
              </button>
              <button
                type="button"
                onClick={handleConfirmStop}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black shadow-soft transition-colors"
              >
                Save & Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
