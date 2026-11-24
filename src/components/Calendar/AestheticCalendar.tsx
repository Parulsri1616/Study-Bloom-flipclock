import React, { useState } from 'react';
import { StudySession } from '../../types';
import { formatDurationFriendly, padZero } from '../../utils/timeUtils';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface AestheticCalendarProps {
  sessions: StudySession[];
}

export const AestheticCalendar: React.FC<AestheticCalendarProps> = ({ sessions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const sessionsByDate = React.useMemo(() => {
    const map: Record<string, { seconds: number; count: number; subjects: string[] }> = {};
    for (const s of sessions) {
      if (!map[s.date]) {
        map[s.date] = { seconds: 0, count: 0, subjects: [] };
      }
      map[s.date].seconds += s.durationSeconds;
      map[s.date].count += 1;
      if (!map[s.date].subjects.includes(s.subject)) {
        map[s.date].subjects.push(s.subject);
      }
    }
    return map;
  }, [sessions]);

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDateKey(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDateKey(null);
  };

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(today.getDate())}`;

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${padZero(month + 1)}-${padZero(d)}`;
    days.push({ dayNumber: d, dateKey });
  }

  const selectedDetails = selectedDateKey ? sessionsByDate[selectedDateKey] : null;

  return (
    <div className="w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-mono-950 dark:text-mono-50">
              Consistency Calendar
            </h3>
            <p className="text-xs text-mono-500">
              Monthly study footprint
            </p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg text-mono-500 hover:text-black dark:hover:text-white hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-mono-950 dark:text-mono-100 min-w-[110px] text-center">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg text-mono-500 hover:text-black dark:hover:text-white hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w, idx) => (
          <div
            key={idx}
            className="text-[11px] font-bold text-mono-400 uppercase"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((item, idx) => {
          if (!item) {
            return <div key={`empty-${idx}`} className="h-8 sm:h-9" />;
          }

          const hasData = sessionsByDate[item.dateKey];
          const isToday = item.dateKey === todayKey;
          const isSelected = selectedDateKey === item.dateKey;

          return (
            <button
              key={item.dateKey}
              type="button"
              onClick={() => setSelectedDateKey(isSelected ? null : item.dateKey)}
              className={`h-8 sm:h-9 rounded-xl flex flex-col items-center justify-center relative text-xs font-semibold transition-all duration-150 ${
                isSelected
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-soft scale-105 z-10'
                  : isToday
                  ? 'border-2 border-black dark:border-white bg-mono-100 dark:bg-mono-900 text-mono-950 dark:text-mono-50'
                  : hasData
                  ? 'bg-mono-100 dark:bg-mono-800 text-mono-950 dark:text-mono-100 hover:bg-mono-200 dark:hover:bg-mono-700'
                  : 'text-mono-600 dark:text-mono-400 hover:bg-mono-50 dark:hover:bg-mono-900'
              }`}
            >
              <span>{item.dayNumber}</span>
              {hasData && (
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isSelected
                      ? 'bg-white dark:bg-black'
                      : 'bg-black dark:bg-white'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Insight Popup */}
      {selectedDateKey && (
        <div className="mt-4 p-3 rounded-2xl bg-mono-100 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 text-xs animate-float">
          {selectedDetails ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between font-bold text-mono-950 dark:text-mono-50">
                <span>{selectedDateKey}</span>
                <span className="font-clock">{formatDurationFriendly(selectedDetails.seconds)}</span>
              </div>
              <p className="text-[11px] text-mono-500">
                {selectedDetails.count} study {selectedDetails.count === 1 ? 'session' : 'sessions'} in:{' '}
                <span className="font-semibold text-mono-800 dark:text-mono-200">
                  {selectedDetails.subjects.join(', ')}
                </span>
              </p>
            </div>
          ) : (
            <div className="text-center text-mono-500 py-1">
              No sessions recorded on {selectedDateKey}.
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-mono-200 dark:border-mono-800 flex items-center justify-between text-[11px] text-mono-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-mono-400" />
          <span>&lt;4h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-mono-700 dark:bg-mono-300" />
          <span>4-8h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
          <span>&gt;8h Goal</span>
        </div>
      </div>
    </div>
  );
};
