import React, { useState } from 'react';
import { DailyGoal } from '../../types';
import { Target, X, Check } from 'lucide-react';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: DailyGoal;
  onSave: (newGoal: DailyGoal) => void;
}

export const EditGoalModal: React.FC<EditGoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onSave,
}) => {
  const [hours, setHours] = useState(currentGoal.targetHours);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (hours > 0 && hours <= 24) {
      onSave({ targetHours: hours });
      onClose();
    }
  };

  const presetHours = [4, 6, 8, 10, 12];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft-xl animate-float">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-mono-200 dark:border-mono-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-mono-950 dark:text-mono-50">
              Set Daily Study Goal
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-mono-400 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mono-700 dark:text-mono-300 mb-2">
              Target Hours Per Day
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="20"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 1)}
                className="w-full p-2.5 rounded-xl bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 font-clock text-lg font-bold text-mono-950 dark:text-white text-center outline-none focus:border-black dark:focus:border-white"
              />
              <span className="text-sm font-semibold text-mono-500">
                hours
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-mono-500 block mb-1.5">
              Quick presets:
            </span>
            <div className="flex items-center gap-1.5">
              {presetHours.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    hours === h
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                      : 'bg-mono-50 dark:bg-mono-900 border-mono-200 dark:border-mono-800 text-mono-800 dark:text-mono-200 hover:border-black dark:hover:border-white'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-mono-500 hover:bg-mono-100 dark:hover:bg-mono-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-black hover:bg-mono-800 dark:bg-white dark:hover:bg-mono-200 text-white dark:text-black shadow-soft transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
