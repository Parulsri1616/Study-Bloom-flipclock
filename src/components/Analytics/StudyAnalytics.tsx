import React, { useState } from 'react';
import { StudySession, DailyGoal } from '../../types';
import {
  calculateThisMonthSeconds,
  calculateBestStudyDay,
  calculateStreak,
  getPastDaysData,
  getSubjectBreakdown,
  formatDurationFriendly,
} from '../../utils/timeUtils';
import { BarChart3, PieChart, Trophy, Flame, Calendar, BookOpen, Clock } from 'lucide-react';

interface StudyAnalyticsProps {
  sessions: StudySession[];
  dailyGoal: DailyGoal;
}

export const StudyAnalytics: React.FC<StudyAnalyticsProps> = ({ sessions, dailyGoal }) => {
  const [selectedDaysRange, setSelectedDaysRange] = useState<7 | 14>(7);
  const [hoveredDay, setHoveredDay] = useState<{ label: string; hours: number; seconds: number } | null>(null);

  const pastDaysData = getPastDaysData(sessions, selectedDaysRange);
  const subjectBreakdown = getSubjectBreakdown(sessions);

  const thisMonthSeconds = calculateThisMonthSeconds(sessions);
  const bestDay = calculateBestStudyDay(sessions);
  const streak = calculateStreak(sessions);
  const totalAllTimeSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);

  const targetHours = dailyGoal.targetHours;

  const maxHoursInPastDays = Math.max(
    targetHours,
    ...pastDaysData.map((d) => d.hours)
  );
  const chartYMax = Math.ceil(maxHoursInPastDays + 1);

  // Grayscale shades for distribution
  const grayShades = [
    '#000000',
    '#27272A',
    '#3F3F46',
    '#52525B',
    '#71717A',
    '#A1A1AA',
    '#D4D4D8',
    '#E4E4E7',
  ];

  return (
    <div className="w-full space-y-6">
      {/* 1. Top Key Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Month Total */}
        <div className="p-5 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-mono-500">
              This Month
            </p>
            <h4 className="font-clock font-bold text-xl sm:text-2xl text-mono-950 dark:text-white">
              {formatDurationFriendly(thisMonthSeconds)}
            </h4>
          </div>
        </div>

        {/* Best Study Day */}
        <div className="p-5 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-mono-500">
              Best Day ({bestDay.dateStr})
            </p>
            <h4 className="font-clock font-bold text-xl sm:text-2xl text-mono-950 dark:text-white">
              {bestDay.durationFormatted}
            </h4>
          </div>
        </div>

        {/* Study Streak */}
        <div className="p-5 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-mono-500">
              Consistency Streak
            </p>
            <h4 className="font-clock font-bold text-xl sm:text-2xl text-mono-950 dark:text-white">
              {streak} {streak === 1 ? 'day' : 'days'}
            </h4>
          </div>
        </div>

        {/* All-Time Study */}
        <div className="p-5 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-mono-500">
              All-Time ({sessions.length} sessions)
            </p>
            <h4 className="font-clock font-bold text-xl sm:text-2xl text-mono-950 dark:text-white">
              {formatDurationFriendly(totalAllTimeSeconds)}
            </h4>
          </div>
        </div>
      </div>

      {/* 2. Main Daily Study Hours Chart (Past 7 / 14 Days) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-mono-950 dark:text-mono-50">
                Daily Study Hours Trend
              </h3>
              <p className="text-xs text-mono-500">
                Visualizing consistency against your {targetHours}h daily goal
              </p>
            </div>
          </div>

          {/* Time range switch */}
          <div className="flex items-center bg-mono-100 dark:bg-mono-900 p-1 rounded-full border border-mono-200 dark:border-mono-800">
            <button
              onClick={() => setSelectedDaysRange(7)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                selectedDaysRange === 7
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-mono-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setSelectedDaysRange(14)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                selectedDaysRange === 14
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-mono-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Past 14 Days
            </button>
          </div>
        </div>

        {/* Hover details pill */}
        <div className="h-6 mb-2">
          {hoveredDay ? (
            <div className="text-xs text-mono-950 dark:text-mono-50 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {hoveredDay.label}: <strong className="font-clock">{formatDurationFriendly(hoveredDay.seconds)}</strong> ({hoveredDay.hours} hrs)
              </span>
            </div>
          ) : (
            <div className="text-xs text-mono-500">
              Hover over any day bar to inspect exact study hours
            </div>
          )}
        </div>

        {/* The Bar Chart Canvas */}
        <div className="relative h-56 sm:h-64 pt-6 pb-2">
          {/* Target Goal Dotted Line */}
          <div
            className="absolute left-0 right-0 border-b-2 border-dashed border-mono-400 dark:border-mono-600 z-10 pointer-events-none flex items-center justify-end"
            style={{
              bottom: `${(targetHours / chartYMax) * 100}%`,
            }}
          >
            <span className="bg-white dark:bg-mono-card text-[10px] font-bold text-mono-900 dark:text-mono-100 px-2 py-0.5 rounded-full border border-mono-300 dark:border-mono-700 -translate-y-1/2">
              Goal: {targetHours}h
            </span>
          </div>

          {/* Bars Container */}
          <div className="h-full flex items-end justify-between gap-1 sm:gap-2 px-1">
            {pastDaysData.map((day) => {
              const heightPercent = Math.min(100, (day.hours / chartYMax) * 100);
              const reachedGoal = day.hours >= targetHours;

              return (
                <div
                  key={day.dateKey}
                  onMouseEnter={() => setHoveredDay({ label: `${day.dayName}, ${day.label}`, hours: day.hours, seconds: day.seconds })}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  <div className="w-full max-w-[40px] flex flex-col justify-end items-center relative">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 text-[10px] font-clock font-bold bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 rounded-md shadow-xs pointer-events-none z-20 whitespace-nowrap">
                      {day.hours}h
                    </span>

                    <div
                      style={{ height: `${Math.max(4, heightPercent)}%` }}
                      className={`w-full rounded-t-xl transition-all duration-300 group-hover:scale-105 shadow-xs ${
                        reachedGoal
                          ? 'bg-black dark:bg-white'
                          : day.hours > 0
                          ? 'bg-mono-500 dark:bg-mono-400'
                          : 'bg-mono-100 dark:bg-mono-800'
                      }`}
                    />
                  </div>

                  <div className="mt-2 text-center">
                    <p className="text-[10px] sm:text-[11px] font-bold text-mono-900 dark:text-mono-100 uppercase">
                      {day.dayName}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-mono-500">
                      {day.label.split(' ')[1]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Subject-Wise Time Distribution */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-mono-950 dark:text-mono-50">
              GATE CSE Subject Distribution
            </h3>
            <p className="text-xs text-mono-500">
              Where your study hours are focused
            </p>
          </div>
        </div>

        {subjectBreakdown.length === 0 ? (
          <div className="text-center py-8 text-mono-500 text-xs">
            No study sessions recorded yet. Start your first session to see your subject breakdown!
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-full h-4 rounded-full overflow-hidden flex border border-mono-200 dark:border-mono-800 p-0.5 bg-mono-100 dark:bg-mono-900">
              {subjectBreakdown.map((item, idx) => (
                <div
                  key={item.subject}
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: grayShades[idx % grayShades.length],
                  }}
                  title={`${item.subject}: ${item.percentage}%`}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {subjectBreakdown.map((item, idx) => (
                <div
                  key={item.subject}
                  className="p-3.5 rounded-2xl bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-mono-400"
                      style={{ backgroundColor: grayShades[idx % grayShades.length] }}
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-mono-950 dark:text-mono-50 truncate">
                        {item.subject}
                      </p>
                      <p className="text-[11px] text-mono-500">
                        {item.count} {item.count === 1 ? 'session' : 'sessions'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <p className="text-xs font-clock font-bold text-mono-950 dark:text-white">
                      {formatDurationFriendly(item.seconds)}
                    </p>
                    <p className="text-[10px] font-semibold text-mono-500">
                      {item.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
