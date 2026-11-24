import React from 'react';
import { Moon, Sun, Maximize2, RotateCcw, Volume2, VolumeX, Flame, Sparkles } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  streak: number;
  onOpenFocusMode: () => void;
  onToggleSoundBar: () => void;
  isSoundActive: boolean;
  onOpenResetConfirm: () => void;
  onLoadSampleData: () => void;
  hasSessions: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  streak,
  onOpenFocusMode,
  onToggleSoundBar,
  isSoundActive,
  onOpenResetConfirm,
  onLoadSampleData,
  hasSessions,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto pt-6 pb-4 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="w-11 h-11 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-soft font-clock font-black text-lg select-none">
          SB
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl sm:text-3xl text-mono-950 dark:text-white tracking-tight">
              StudyBloom
            </h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-mono-100 dark:bg-mono-900 text-mono-900 dark:text-mono-200 border border-mono-300 dark:border-mono-800">
              GATE CSE
            </span>
          </div>
          <p className="text-xs text-mono-500 dark:text-mono-400 font-sans">
            Minimalist Flip Clock & Study Tracker
          </p>
        </div>
      </div>

      {/* Action Buttons & Utilities */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {/* Streak Pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mono-100 dark:bg-mono-900 border border-mono-300 dark:border-mono-800 shadow-xs"
          title={`Current Study Streak: ${streak} consecutive days`}
        >
          <Flame className="w-4 h-4 text-mono-900 dark:text-mono-100 fill-current" />
          <span className="font-clock font-bold text-xs sm:text-sm text-mono-900 dark:text-mono-100">
            {streak} {streak === 1 ? 'day' : 'days'} streak
          </span>
        </div>

        {/* Ambient Sound Toggle */}
        <button
          onClick={onToggleSoundBar}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
            isSoundActive
              ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
              : 'bg-white dark:bg-mono-card border-mono-200 dark:border-mono-800 text-mono-600 dark:text-mono-400 hover:border-black dark:hover:border-white'
          }`}
          title="Ambient Study Sounds"
        >
          {isSoundActive ? (
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
          <span className="hidden md:inline">{isSoundActive ? 'Sound On' : 'Ambient'}</span>
        </button>

        {/* Focus Mode Launcher */}
        <button
          onClick={onOpenFocusMode}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black hover:bg-mono-800 dark:bg-white dark:hover:bg-mono-200 text-white dark:text-black border border-black dark:border-white shadow-xs transition-all duration-200 active:scale-95"
          title="Full-Screen Distraction-Free Focus Mode"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Focus Mode</span>
        </button>

        {/* Dark / Light Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 text-mono-800 dark:text-mono-200 hover:bg-mono-100 dark:hover:bg-mono-800 transition-all shadow-xs"
          title={darkMode ? 'Switch to Light Monochrome' : 'Switch to Dark Monochrome'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-mono-100" /> : <Moon className="w-4 h-4 text-mono-900" />}
        </button>

        {/* Sample Data or Reset */}
        {!hasSessions ? (
          <button
            onClick={onLoadSampleData}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-mono-100 hover:bg-mono-200 dark:bg-mono-900 dark:hover:bg-mono-800 text-mono-900 dark:text-mono-100 border border-mono-300 dark:border-mono-700 transition-colors shadow-xs"
            title="Load sample GATE CSE study sessions to see analytics"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Demo Data</span>
          </button>
        ) : (
          <button
            onClick={onOpenResetConfirm}
            className="p-2 rounded-full bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 text-mono-500 hover:text-black dark:hover:text-white transition-colors shadow-xs"
            title="Reset All Tracker Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
