import React, { useEffect, useState } from 'react';
import { FlipClock } from '../FlipClock/FlipClock';
import { TimerState, AmbientSoundType } from '../../types';
import { soundManager } from '../../utils/audioEngine';
import { getRandomQuote } from '../../constants/quotes';
import {
  Minimize2,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  CloudRain,
  Waves,
  BellRing,
  Coffee,
  Wind,
} from 'lucide-react';

interface FocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  timerState: TimerState;
  currentSubject: string;
  durationSeconds: number;
  onStart: (subject: string) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const AMBIENT_PRESETS: { type: AmbientSoundType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: 'rain', label: 'Rain', icon: CloudRain },
  { type: 'waves', label: 'Waves', icon: Waves },
  { type: 'zen-drone', label: 'Zen 432Hz', icon: BellRing },
  { type: 'cafe', label: 'Cafe', icon: Coffee },
  { type: 'pink-noise', label: 'Noise', icon: Wind },
];

export const FocusModal: React.FC<FocusModalProps> = ({
  isOpen,
  onClose,
  timerState,
  currentSubject,
  durationSeconds,
  onStart,
  onPause,
  onResume,
  onStop,
}) => {
  const [quote] = useState(() => getRandomQuote());
  const [activeSound, setActiveSound] = useState<AmbientSoundType>(() => soundManager.getCurrentType());
  const [volume, setVolume] = useState<number>(() => soundManager.getVolume());
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => setIsBrowserFullscreen(true)).catch(() => {});
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleExit();
      }
    };

    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isOpen]);

  const handleExit = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    onClose();
  };

  const handleToggleSound = (type: AmbientSoundType) => {
    if (activeSound === type) {
      soundManager.stop();
      setActiveSound('none');
    } else {
      soundManager.play(type);
      setActiveSound(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundManager.setVolume(newVol);
  };

  if (!isOpen) return null;

  const isRunning = timerState === 'running';
  const isPaused = timerState === 'paused';

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white p-4 sm:p-8 md:p-12 transition-colors select-none overflow-hidden">
      
      {/* Subtle Monochrome Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      {/* TOP BAR: Subject Badge, Fullscreen Exit */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-clock font-black text-sm text-white shadow-soft">
            SB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-lg sm:text-xl text-white tracking-tight">
                StudyBloom Focus
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-zinc-900 text-zinc-300 border border-zinc-800">
                <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : isPaused ? 'bg-amber-400' : 'bg-zinc-400'}`} />
                {isRunning ? 'Deep Focus' : isPaused ? 'Paused' : 'Focus Mode'}
              </span>
            </div>
            {currentSubject && (
              <p className="text-xs font-semibold text-zinc-400 truncate max-w-xs sm:max-w-md">
                Subject: {currentSubject}
              </p>
            )}
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs border border-zinc-800 shadow-soft transition-all duration-200 active:scale-95"
          title={isBrowserFullscreen ? 'Exit True Fullscreen & Focus (Esc)' : 'Exit Focus (Esc)'}
        >
          <Minimize2 className="w-4 h-4 text-zinc-300" />
          <span>Exit Focus (Esc)</span>
        </button>
      </div>

      {/* CENTER STAGE: GIANT FLIP CLOCK & TIMER */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4 sm:my-8">
        
        {/* Giant Flip Clock Display */}
        <div className="scale-95 sm:scale-100 transition-transform">
          <FlipClock
            studyDurationSeconds={durationSeconds}
            isStudyTimerRunning={isRunning}
            studySubject={currentSubject}
            size="giant"
            defaultMode="timer"
          />
        </div>

        {/* Main Study Controls Bar */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {timerState === 'idle' ? (
            <button
              onClick={() => onStart(currentSubject)}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white hover:bg-zinc-200 text-black font-bold text-sm sm:text-base shadow-soft-xl hover:scale-105 transition-all duration-200 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Study Session</span>
            </button>
          ) : isRunning ? (
            <button
              onClick={onPause}
              className="flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-sm shadow-soft hover:scale-105 transition-all duration-200 active:scale-95"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Focus</span>
            </button>
          ) : (
            <button
              onClick={onResume}
              className="flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-black font-bold text-sm shadow-soft hover:scale-105 transition-all duration-200 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Resume Focus</span>
            </button>
          )}

          {timerState !== 'idle' && (
            <button
              onClick={() => {
                onStop();
                handleExit();
              }}
              className="flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold text-sm shadow-soft hover:scale-105 transition-all duration-200 active:scale-95"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop & Save Session</span>
            </button>
          )}
        </div>
      </div>

      {/* BOTTOM BAR: Integrated Ambient Sound Strip & Affirmation */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
        
        {/* Ambient Audio Pill Strip */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-soft backdrop-blur-md">
          <span className="text-[11px] font-semibold text-zinc-400 px-2 uppercase tracking-wider flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sound:</span>
          </span>

          {AMBIENT_PRESETS.map((p) => {
            const Icon = p.icon;
            const isSelected = activeSound === p.type;

            return (
              <button
                key={p.type}
                type="button"
                onClick={() => handleToggleSound(p.type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-white text-black shadow-soft scale-105 font-bold'
                    : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping ml-0.5" />
                )}
              </button>
            );
          })}

          {/* Volume Control */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-800">
            <button
              onClick={() => handleToggleSound(activeSound === 'none' ? 'rain' : 'none')}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {activeSound === 'none' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-white animate-pulse" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-white"
              title="Ambient Volume"
            />
          </div>
        </div>

        {/* Motivational Quote */}
        <p className="font-display italic text-xs sm:text-sm text-zinc-400 text-center max-w-xl">
          "{quote.text}" — <span className="font-sans font-normal text-[11px] text-zinc-500">{quote.author}</span>
        </p>

      </div>

    </div>
  );
};
