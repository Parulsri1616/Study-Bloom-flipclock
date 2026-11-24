import React from 'react';
import { FlipCard } from './FlipCard';

interface FlipUnitProps {
  value: string; // e.g. "08"
  label: string; // e.g. "HOURS"
  size?: 'normal' | 'giant';
}

export const FlipUnit: React.FC<FlipUnitProps> = ({ value, label, size = 'normal' }) => {
  const padded = value.padStart(2, '0');
  const d1 = padded[0] || '0';
  const d2 = padded[1] || '0';

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <FlipCard digit={d1} size={size} />
        <FlipCard digit={d2} size={size} />
      </div>
      <span
        className={`mt-2 sm:mt-3 font-semibold tracking-widest uppercase font-sans ${
          size === 'giant'
            ? 'text-xs sm:text-sm text-pastel-purpleDark/80 dark:text-pastel-pink/90'
            : 'text-[10px] sm:text-xs text-pastel-purple/80 dark:text-pastel-lavender/80'
        }`}
      >
        {label}
      </span>
    </div>
  );
};
