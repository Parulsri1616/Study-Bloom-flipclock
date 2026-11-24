import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useStudyTimer } from './hooks/useStudyTimer';
import { DailyGoal, StudySession } from './types';
import { calculateStreak } from './utils/timeUtils';
import { generateSampleGateSessions } from './utils/demoData';

// Components
import { Header } from './components/Navbar/Header';
import { FlipClock } from './components/FlipClock/FlipClock';
import { StudyTimerControl } from './components/Timer/StudyTimerControl';
import { DailyStats } from './components/Dashboard/DailyStats';
import { DailyQuoteCard } from './components/Quotes/DailyQuoteCard';
import { AestheticCalendar } from './components/Calendar/AestheticCalendar';
import { StudyAnalytics } from './components/Analytics/StudyAnalytics';
import { SessionHistory } from './components/History/SessionHistory';
import { FocusModal } from './components/FocusMode/FocusModal';
import { AmbientSoundBar } from './components/Audio/AmbientSoundBar';
import { QuickSoundStrip } from './components/Audio/QuickSoundStrip';
import { EditGoalModal } from './components/Modals/EditGoalModal';
import { ResetConfirmModal } from './components/Modals/ResetConfirmModal';

import { Clock, BarChart2, History } from 'lucide-react';

const STORAGE_KEY_SESSIONS = 'studybloom_sessions';
const STORAGE_KEY_GOAL = 'studybloom_daily_goal';
const STORAGE_KEY_DARK_MODE = 'studybloom_dark_mode';

export const App: React.FC = () => {
  const [sessions, setSessions] = useLocalStorage<StudySession[]>(STORAGE_KEY_SESSIONS, []);
  const [dailyGoal, setDailyGoal] = useLocalStorage<DailyGoal>(STORAGE_KEY_GOAL, { targetHours: 8 });
  const [darkMode, setDarkMode] = useLocalStorage<boolean>(STORAGE_KEY_DARK_MODE, false);

  const [activeTab, setActiveTab] = useState<'tracker' | 'analytics' | 'history'>('tracker');
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [isSoundBarOpen, setIsSoundBarOpen] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSessionCompleted = (newSession: StudySession) => {
    setSessions((prev) => [newSession, ...prev]);
  };

  const {
    timerState,
    currentSubject,
    currentDurationSeconds,
    notes,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateSubject,
    updateNotes,
  } = useStudyTimer(handleSessionCompleted);

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleClearAllSessions = () => {
    setSessions([]);
  };

  const handleLoadSampleData = () => {
    const samples = generateSampleGateSessions();
    setSessions(samples);
  };

  const streak = calculateStreak(sessions);

  return (
    <div className="relative min-h-screen bg-mono-50 dark:bg-black text-mono-950 dark:text-mono-50 transition-colors duration-200 pb-16 overflow-x-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      
      {/* 1. Minimalist Top Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        streak={streak}
        onOpenFocusMode={() => setIsFocusModeOpen(true)}
        onToggleSoundBar={() => setIsSoundBarOpen((prev) => !prev)}
        isSoundActive={isSoundActive}
        onOpenResetConfirm={() => setIsResetConfirmOpen(true)}
        onLoadSampleData={handleLoadSampleData}
        hasSessions={sessions.length > 0}
      />

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-7 mt-2">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-center">
          <div className="flex items-center p-1.5 rounded-full bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'tracker'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-soft'
                  : 'text-mono-500 hover:text-black dark:text-mono-400 dark:hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Clock & Tracker</span>
              {timerState === 'running' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-soft'
                  : 'text-mono-500 hover:text-black dark:text-mono-400 dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Analytics & Charts</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-soft'
                  : 'text-mono-500 hover:text-black dark:text-mono-400 dark:hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Session Log</span>
              {sessions.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-mono-200 dark:bg-mono-800 text-mono-900 dark:text-mono-100 font-bold">
                  {sessions.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: CLOCK & TRACKER */}
        {activeTab === 'tracker' && (
          <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
            {/* Centerpiece 3D Flip Clock */}
            <FlipClock
              isStudyTimerRunning={timerState === 'running'}
              studyDurationSeconds={currentDurationSeconds}
              studySubject={currentSubject}
              onOpenFocusMode={() => setIsFocusModeOpen(true)}
            />

            {/* Quick 1-Click Ambient Focus Audio Strip */}
            <QuickSoundStrip onSoundChange={(isPlaying) => setIsSoundActive(isPlaying)} />

            {/* Daily Dashboard & Progress Bar */}
            <DailyStats
              sessions={sessions}
              activeTimerDurationSeconds={currentDurationSeconds}
              dailyGoal={dailyGoal}
              onEditGoal={() => setIsEditGoalOpen(true)}
            />

            {/* Functional Study Timer Control */}
            <StudyTimerControl
              timerState={timerState}
              currentSubject={currentSubject}
              durationSeconds={currentDurationSeconds}
              notes={notes}
              onStart={startTimer}
              onPause={pauseTimer}
              onResume={resumeTimer}
              onStop={stopTimer}
              onSubjectChange={updateSubject}
              onNotesChange={updateNotes}
              onOpenFocusMode={() => setIsFocusModeOpen(true)}
            />

            {/* Bottom Row: Daily Quote & Mini Aesthetic Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <DailyQuoteCard />
              <AestheticCalendar sessions={sessions} />
            </div>
          </div>
        )}

        {/* TAB 2: ANALYTICS & CHARTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-7 animate-in fade-in duration-300">
            <StudyAnalytics sessions={sessions} dailyGoal={dailyGoal} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <AestheticCalendar sessions={sessions} />
              <DailyQuoteCard />
            </div>
          </div>
        )}

        {/* TAB 3: SESSION HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-7 animate-in fade-in duration-300">
            <SessionHistory
              sessions={sessions}
              onDeleteSession={handleDeleteSession}
              onClearAll={handleClearAllSessions}
            />
          </div>
        )}

      </main>

      {/* Floating Ambient Sound Panel */}
      <AmbientSoundBar
        isOpen={isSoundBarOpen}
        onClose={() => setIsSoundBarOpen(false)}
        onSoundStateChange={(isPlaying) => setIsSoundActive(isPlaying)}
      />

      {/* Full-Screen Distraction-Free Focus Mode */}
      <FocusModal
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        timerState={timerState}
        currentSubject={currentSubject}
        durationSeconds={currentDurationSeconds}
        onStart={startTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onStop={stopTimer}
      />

      {/* Goal Edit Modal */}
      <EditGoalModal
        isOpen={isEditGoalOpen}
        onClose={() => setIsEditGoalOpen(false)}
        currentGoal={dailyGoal}
        onSave={(newGoal) => setDailyGoal(newGoal)}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirmReset={handleClearAllSessions}
      />

      {/* Minimalist Footer */}
      <footer className="mt-16 text-center text-xs text-mono-400">
        <p className="flex items-center justify-center gap-1.5 font-sans">
          <span>StudyBloom</span>
          <span>•</span>
          <span>Minimalist Monochrome GATE CSE Study Companion</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
