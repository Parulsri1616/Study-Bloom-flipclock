import { StudySession } from '../types';

export const padZero = (n: number): string => {
  return n.toString().padStart(2, '0');
};

export const formatDurationHMS = (totalSeconds: number): { hours: string; minutes: string; seconds: string } => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  return {
    hours: padZero(h),
    minutes: padZero(m),
    seconds: padZero(s),
  };
};

export const formatDurationFriendly = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
};

export const formatDurationHoursDecimal = (totalSeconds: number): string => {
  const hours = totalSeconds / 3600;
  return hours.toFixed(1);
};

export const getTodayDateKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = padZero(now.getMonth() + 1);
  const day = padZero(now.getDate());
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTimeDisplay = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const getDayGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 5) return "Quiet night study session ✨";
  if (hour < 12) return "Good morning, scholar 🌸";
  if (hour < 17) return "A little progress every day ✨";
  if (hour < 21) return "Evening deep focus 🍵";
  return "Peaceful nighttime revision 🌙";
};

// Calculations for sessions
export const calculateTodaySeconds = (sessions: StudySession[]): number => {
  const today = getTodayDateKey();
  return sessions
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + s.durationSeconds, 0);
};

export const calculateTodaySessionsCount = (sessions: StudySession[]): number => {
  const today = getTodayDateKey();
  return sessions.filter((s) => s.date === today).length;
};

export const calculateThisWeekSeconds = (sessions: StudySession[]): number => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday
  const distanceToMonday = (currentDay + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const startOfWeekTime = monday.getTime();

  return sessions
    .filter((s) => s.startTime >= startOfWeekTime)
    .reduce((sum, s) => sum + s.durationSeconds, 0);
};

export const calculateThisMonthSeconds = (sessions: StudySession[]): number => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  return sessions
    .filter((s) => s.startTime >= startOfMonth)
    .reduce((sum, s) => sum + s.durationSeconds, 0);
};

export const calculateStreak = (sessions: StudySession[]): number => {
  if (sessions.length === 0) return 0;

  // Set of dates with study activity
  const activeDates = new Set(sessions.map((s) => s.date));
  
  const today = new Date();
  const todayStr = getTodayDateKey();

  let streak = 0;
  let checkDate = new Date(today);

  // If didn't study today yet, check if studied yesterday to keep streak active
  if (!activeDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const y = checkDate.getFullYear();
    const m = padZero(checkDate.getMonth() + 1);
    const d = padZero(checkDate.getDate());
    const dateKey = `${y}-${m}-${d}`;

    if (activeDates.has(dateKey)) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const calculateBestStudyDay = (
  sessions: StudySession[]
): { dateStr: string; durationFormatted: string; seconds: number } => {
  if (sessions.length === 0) {
    return { dateStr: 'None yet', durationFormatted: '0h', seconds: 0 };
  }

  const totalsByDate: Record<string, number> = {};
  for (const s of sessions) {
    totalsByDate[s.date] = (totalsByDate[s.date] || 0) + s.durationSeconds;
  }

  let bestDate = '';
  let maxSeconds = 0;

  for (const [date, secs] of Object.entries(totalsByDate)) {
    if (secs > maxSeconds) {
      maxSeconds = secs;
      bestDate = date;
    }
  }

  if (!bestDate) {
    return { dateStr: 'None yet', durationFormatted: '0h', seconds: 0 };
  }

  // Format date nicely
  const parts = bestDate.split('-');
  const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return {
    dateStr: formattedDate,
    durationFormatted: formatDurationFriendly(maxSeconds),
    seconds: maxSeconds,
  };
};

export const getPastDaysData = (
  sessions: StudySession[],
  daysCount: number = 7
): { dateKey: string; label: string; dayName: string; seconds: number; hours: number }[] => {
  const result = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const y = d.getFullYear();
    const m = padZero(d.getMonth() + 1);
    const day = padZero(d.getDate());
    const dateKey = `${y}-${m}-${day}`;

    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const totalSecs = sessions
      .filter((s) => s.date === dateKey)
      .reduce((sum, s) => sum + s.durationSeconds, 0);

    result.push({
      dateKey,
      label,
      dayName,
      seconds: totalSecs,
      hours: Number((totalSecs / 3600).toFixed(1)),
    });
  }

  return result;
};

export const getSubjectBreakdown = (
  sessions: StudySession[]
): { subject: string; seconds: number; percentage: number; count: number }[] => {
  const subjectMap: Record<string, { seconds: number; count: number }> = {};
  let totalSecs = 0;

  for (const s of sessions) {
    if (!subjectMap[s.subject]) {
      subjectMap[s.subject] = { seconds: 0, count: 0 };
    }
    subjectMap[s.subject].seconds += s.durationSeconds;
    subjectMap[s.subject].count += 1;
    totalSecs += s.durationSeconds;
  }

  return Object.entries(subjectMap)
    .map(([subject, data]) => ({
      subject,
      seconds: data.seconds,
      percentage: totalSecs > 0 ? Math.round((data.seconds / totalSecs) * 100) : 0,
      count: data.count,
    }))
    .sort((a, b) => b.seconds - a.seconds);
};
