import React, { useState, useEffect } from 'react';
import { AmbientSoundType } from '../../types';
import { soundManager } from '../../utils/audioEngine';
import { Volume2, VolumeX, CloudRain, Waves, BellRing, Coffee, Wind } from 'lucide-react';

interface QuickSoundStripProps {
  onSoundChange?: (isPlaying: boolean) => void;
}

const SOUNDS: { type: AmbientSoundType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: 'rain', label: 'Rain', icon: CloudRain },
  { type: 'waves', label: 'Waves', icon: Waves },
  { type: 'zen-drone', label: 'Zen 432Hz', icon: BellRing },
  { type: 'cafe', label: 'Cafe', icon: Coffee },
  { type: 'pink-noise', label: 'Pink Noise', icon: Wind },
];

export const QuickSoundStrip: React.FC<QuickSoundStripProps> = ({ onSoundChange }) => {
  const [activeSound, setActiveSound] = useState<AmbientSoundType>(() => soundManager.getCurrentType());
  const [volume, setVolume] = useState<number>(() => soundManager.getVolume());

  useEffect(() => {
    soundManager.setVolume(volume);
  }, [volume]);

  const handleToggleSound = (type: AmbientSoundType) => {
    if (activeSound === type) {
      soundManager.stop();
      setActiveSound('none');
      if (onSoundChange) onSoundChange(false);
    } else {
      soundManager.play(type);
      setActiveSound(type);
      if (onSoundChange) onSoundChange(true);
    }
  };

  const handleToggleMute = () => {
    if (activeSound !== 'none') {
      soundManager.stop();
      setActiveSound('none');
      if (onSoundChange) onSoundChange(false);
    } else {
      soundManager.play('rain');
      setActiveSound('rain');
      if (onSoundChange) onSoundChange(true);
    }
  };

  return (
    <div className="w-full p-3 sm:p-4 rounded-2xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
      {/* Title & Status */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-900 dark:text-mono-100 border border-mono-200 dark:border-mono-800">
          <Volume2 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-mono-950 dark:text-mono-50 flex items-center gap-1.5 uppercase tracking-wide">
            Ambient Audio
            {activeSound !== 'none' && (
              <span className="flex items-center gap-0.5 ml-1">
                <span className="w-1 h-2 bg-black dark:bg-white rounded-full animate-pulse" />
                <span className="w-1 h-3.5 bg-black dark:bg-white rounded-full animate-pulse delay-75" />
                <span className="w-1 h-2.5 bg-black dark:bg-white rounded-full animate-pulse delay-150" />
              </span>
            )}
          </span>
          <p className="text-[10px] text-mono-500 dark:text-mono-400">
            {activeSound === 'none' ? 'Procedural focus soundscapes' : `Playing: ${activeSound}`}
          </p>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {SOUNDS.map((s) => {
          const Icon = s.icon;
          const isSelected = activeSound === s.type;

          return (
            <button
              key={s.type}
              type="button"
              onClick={() => handleToggleSound(s.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs scale-102 border border-black dark:border-white'
                  : 'bg-mono-100 dark:bg-mono-900 hover:bg-mono-200 dark:hover:bg-mono-800 text-mono-800 dark:text-mono-200 border border-mono-200 dark:border-mono-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-2 pl-2 border-l border-mono-200 dark:border-mono-800">
        <button
          onClick={handleToggleMute}
          className="p-1 rounded text-mono-600 dark:text-mono-400 hover:text-black dark:hover:text-white transition-colors"
          title={activeSound === 'none' ? 'Play rain sound' : 'Mute audio'}
        >
          {activeSound === 'none' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-black dark:text-white animate-pulse" />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-16 sm:w-20 h-1 bg-mono-200 dark:bg-mono-800 rounded appearance-none cursor-pointer accent-black dark:accent-white"
          title="Ambient Sound Volume"
        />

        <span className="text-[10px] font-clock font-medium text-mono-500 w-7 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};
