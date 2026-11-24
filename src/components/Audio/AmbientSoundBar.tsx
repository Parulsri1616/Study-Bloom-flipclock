import React, { useState, useEffect } from 'react';
import { AmbientSoundType } from '../../types';
import { soundManager } from '../../utils/audioEngine';
import { Volume2, VolumeX, CloudRain, Waves, BellRing, Wind, Coffee, X } from 'lucide-react';

interface AmbientSoundBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSoundStateChange: (isPlaying: boolean) => void;
}

interface SoundOption {
  type: AmbientSoundType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const SOUND_OPTIONS: SoundOption[] = [
  {
    type: 'rain',
    label: 'Gentle Rain',
    icon: CloudRain,
    description: 'Calming soft rain with subtle drops',
  },
  {
    type: 'waves',
    label: 'Ocean Waves',
    icon: Waves,
    description: 'Slow rolling deep tides',
  },
  {
    type: 'zen-drone',
    label: 'Zen Drone',
    icon: BellRing,
    description: '432Hz harmonic singing frequencies',
  },
  {
    type: 'cafe',
    label: 'Cozy Cafe',
    icon: Coffee,
    description: 'Warm cafe ambiance & gentle clinks',
  },
  {
    type: 'pink-noise',
    label: 'Soft Noise',
    icon: Wind,
    description: 'Low-frequency noise to block distractions',
  },
];

export const AmbientSoundBar: React.FC<AmbientSoundBarProps> = ({
  isOpen,
  onClose,
  onSoundStateChange,
}) => {
  const [activeSound, setActiveSound] = useState<AmbientSoundType>('none');
  const [volume, setVolume] = useState<number>(0.35);

  useEffect(() => {
    soundManager.setVolume(volume);
  }, [volume]);

  const handleSelectSound = (type: AmbientSoundType) => {
    if (activeSound === type) {
      soundManager.stop();
      setActiveSound('none');
      onSoundStateChange(false);
    } else {
      soundManager.play(type);
      setActiveSound(type);
      onSoundStateChange(true);
    }
  };

  const handleToggleMute = () => {
    if (activeSound !== 'none') {
      soundManager.stop();
      setActiveSound('none');
      onSoundStateChange(false);
    } else {
      soundManager.play('rain');
      setActiveSound('rain');
      onSoundStateChange(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-88 p-5 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft-xl backdrop-blur-md transition-all animate-float">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-mono-200 dark:border-mono-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-900 dark:text-mono-100">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-mono-950 dark:text-mono-50">
              Ambient Audio
            </h4>
            <p className="text-[11px] text-mono-500">
              Procedural focus soundscapes
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full text-mono-500 hover:text-black dark:hover:text-white transition-colors"
          title="Close sound panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sound Options List */}
      <div className="grid grid-cols-1 gap-1.5 mb-4 max-h-56 overflow-y-auto pr-1">
        {SOUND_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isSelected = activeSound === item.type;

          return (
            <button
              key={item.type}
              type="button"
              onClick={() => handleSelectSound(item.type)}
              className={`flex items-center justify-between w-full p-2.5 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                  : 'bg-mono-50 dark:bg-mono-900 border-mono-200 dark:border-mono-800 text-mono-900 dark:text-mono-100 hover:border-mono-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-white text-black dark:bg-black dark:text-white'
                      : 'bg-mono-200 dark:bg-mono-800 text-mono-900 dark:text-mono-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-mono-300 dark:text-mono-600' : 'text-mono-500'}`}>
                    {item.description}
                  </div>
                </div>
              </div>

              {isSelected && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Volume Slider & Quick Mute */}
      <div className="pt-3 border-t border-mono-200 dark:border-mono-800 flex items-center gap-3">
        <button
          onClick={handleToggleMute}
          className="p-1.5 rounded-lg text-mono-700 dark:text-mono-300 hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
          title={activeSound === 'none' ? 'Play rain sound' : 'Mute sound'}
        >
          {activeSound === 'none' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-mono-200 dark:bg-mono-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
          title="Ambient Sound Volume"
        />

        <span className="text-[11px] font-clock font-medium text-mono-500 w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
};
