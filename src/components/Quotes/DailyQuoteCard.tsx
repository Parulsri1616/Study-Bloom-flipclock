import React, { useState } from 'react';
import { Quote } from '../../types';
import { getRandomQuote, MOTIVATIONAL_QUOTES } from '../../constants/quotes';
import { RefreshCw, Quote as QuoteIcon } from 'lucide-react';

export const DailyQuoteCard: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(() => getRandomQuote());
  const [isRotating, setIsRotating] = useState(false);

  const handleShuffle = () => {
    setIsRotating(true);
    let nextQuote = currentQuote;
    while (nextQuote.text === currentQuote.text && MOTIVATIONAL_QUOTES.length > 1) {
      const randIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      nextQuote = MOTIVATIONAL_QUOTES[randIndex];
    }
    setCurrentQuote(nextQuote);
    setTimeout(() => setIsRotating(false), 400);
  };

  return (
    <div className="relative overflow-hidden w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md">
      <QuoteIcon className="absolute -top-3 -right-3 w-24 h-24 text-mono-100 dark:text-mono-900 pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-mono-500 dark:text-mono-400">
            <span>Daily Inspiration</span>
          </div>

          <button
            onClick={handleShuffle}
            className="p-1.5 rounded-full text-mono-400 hover:text-black dark:hover:text-white hover:bg-mono-100 dark:hover:bg-mono-800 transition-all duration-200"
            title="Read another quote"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <p className="font-display italic text-base sm:text-lg text-mono-950 dark:text-mono-50 leading-relaxed mb-3">
          "{currentQuote.text}"
        </p>

        <div className="flex items-center justify-between text-xs">
          <span className="font-sans font-medium text-mono-500">
            — {currentQuote.author}
          </span>
          <span className="text-[11px] font-semibold text-mono-400">
            GATE CSE Focus
          </span>
        </div>
      </div>
    </div>
  );
};
