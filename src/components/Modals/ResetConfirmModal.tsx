import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [confirmInput, setConfirmInput] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmInput.trim().toLowerCase() === 'reset') {
      onConfirmReset();
      setConfirmInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft-xl animate-float">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-mono-200 dark:border-mono-800">
          <div className="flex items-center gap-2 text-mono-950 dark:text-mono-50">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold">Reset Tracker?</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-mono-400 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-mono-600 dark:text-mono-400 mb-4 leading-relaxed">
          This will permanently erase all your saved study sessions, daily logs, and streak history.
          Type <strong className="text-mono-950 dark:text-mono-50 font-bold">reset</strong> below to proceed:
        </p>

        <input
          type="text"
          placeholder="Type 'reset' to confirm"
          value={confirmInput}
          onChange={(e) => setConfirmInput(e.target.value)}
          className="w-full p-2.5 mb-5 rounded-xl bg-mono-50 dark:bg-mono-900 border border-mono-300 dark:border-mono-700 text-xs text-mono-950 dark:text-mono-50 outline-none focus:border-black dark:focus:border-white"
        />

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-mono-500 hover:bg-mono-100 dark:hover:bg-mono-800"
          >
            Keep Data
          </button>
          <button
            type="button"
            disabled={confirmInput.trim().toLowerCase() !== 'reset'}
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-black hover:bg-mono-800 dark:bg-white dark:hover:bg-mono-200 disabled:opacity-30 text-white dark:text-black shadow-soft transition-colors"
          >
            Erase Everything
          </button>
        </div>
      </div>
    </div>
  );
};
