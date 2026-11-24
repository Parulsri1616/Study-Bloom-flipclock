import React, { useEffect, useState, useRef } from 'react';
import { soundManager } from '../../utils/audioEngine';

interface FlipCardProps {
  digit: string;
  size?: 'normal' | 'giant';
}

export const FlipCard: React.FC<FlipCardProps> = ({ digit, size = 'normal' }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [previousDigit, setPreviousDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (digit !== currentDigit) {
      setPreviousDigit(currentDigit);
      setCurrentDigit(digit);
      setIsFlipping(true);

      // Play soft mechanical tick
      soundManager.playFlipTick();

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsFlipping(false);
        setPreviousDigit(digit);
      }, 500);
    }

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [digit, currentDigit]);

  const sizeClasses =
    size === 'giant'
      ? 'w-16 h-28 sm:w-24 sm:h-40 md:w-32 md:h-52 lg:w-40 lg:h-64 xl:w-48 xl:h-76 mx-1 sm:mx-1.5 rounded-2xl sm:rounded-3xl'
      : 'w-12 h-20 sm:w-16 sm:h-26 md:w-20 md:h-32 lg:w-24 lg:h-36 mx-0.5 sm:mx-1 rounded-xl sm:rounded-2xl';

  const fontClasses =
    size === 'giant'
      ? 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl'
      : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl';

  return (
    <div
      className={`flip-unit-container relative ${sizeClasses} shadow-[0_12px_32px_rgba(0,0,0,0.4)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.9)] select-none border border-zinc-800/80`}
    >
      {/* 1. UPPER STATIC (Shows new/current digit) */}
      <div className="flip-card-upper bg-gradient-to-b from-[#1C1C1E] via-[#141416] to-[#0A0A0C] text-white border-t border-l border-r border-zinc-700/60 shadow-inner">
        <span
          className={`digit-upper font-clock font-extrabold ${fontClasses} tracking-tight text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]`}
        >
          {currentDigit}
        </span>
      </div>

      {/* 2. LOWER STATIC (Shows old/previous digit until covered) */}
      <div className="flip-card-lower bg-gradient-to-b from-[#0A0A0C] via-[#060608] to-[#000000] text-white border-b border-l border-r border-zinc-800/80 shadow-md">
        <span
          className={`digit-lower font-clock font-extrabold ${fontClasses} tracking-tight text-zinc-100 drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]`}
        >
          {previousDigit}
        </span>
      </div>

      {/* 3. FLIPPING TOP LEAF (Rotates down from 0 to -90deg, showing previous digit) */}
      {isFlipping && (
        <div className="flip-leaf-front animate-flip-top bg-gradient-to-b from-[#1C1C1E] via-[#141416] to-[#0A0A0C] border-t border-l border-r border-zinc-700/60 shadow-inner">
          <span
            className={`digit-upper font-clock font-extrabold ${fontClasses} tracking-tight text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]`}
          >
            {previousDigit}
          </span>
        </div>
      )}

      {/* 4. FLIPPING BOTTOM LEAF (Rotates down from 90deg to 0, showing current digit) */}
      {isFlipping && (
        <div className="flip-leaf-back animate-flip-bottom bg-gradient-to-b from-[#0A0A0C] via-[#060608] to-[#000000] border-b border-l border-r border-zinc-800/80 shadow-md">
          <span
            className={`digit-lower font-clock font-extrabold ${fontClasses} tracking-tight text-zinc-100 drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]`}
          >
            {currentDigit}
          </span>
        </div>
      )}

      {/* Center Split Horizontal Line & Inset Groove */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1.5px] bg-black/90 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.8)] pointer-events-none" />
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[0.5px] bg-white/20 z-10 pointer-events-none" />

      {/* Precision Silver Side Clips */}
      <div className="absolute top-1/2 -left-1 sm:-left-1.5 -translate-y-1/2 w-2 h-3 sm:w-3 sm:h-4 bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-500 dark:to-zinc-600 rounded-r-sm z-20 border-r border-y border-black/40 shadow-xs pointer-events-none" />
      <div className="absolute top-1/2 -right-1 sm:-right-1.5 -translate-y-1/2 w-2 h-3 sm:w-3 sm:h-4 bg-gradient-to-l from-zinc-300 to-zinc-400 dark:from-zinc-500 dark:to-zinc-600 rounded-l-sm z-20 border-l border-y border-black/40 shadow-xs pointer-events-none" />
    </div>
  );
};
