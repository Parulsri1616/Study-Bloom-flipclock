import { StudySession } from '../types';
import { padZero } from './timeUtils';

export const generateSampleGateSessions = (): StudySession[] => {
  const sessions: StudySession[] = [];
  const now = new Date();

  const subjectsWithNotes = [
    { subject: 'Algorithms', note: 'Dijkstra, Bellman-Ford, & Dynamic Programming memoization' },
    { subject: 'Operating Systems', note: 'Virtual memory paging algorithms & CPU round-robin scheduling' },
    { subject: 'DBMS', note: 'B+ Tree indexing, normalization (3NF/BCNF), and SQL queries' },
    { subject: 'Computer Networks', note: 'TCP sliding window, congestion control, subnetting calculations' },
    { subject: 'Theory of Computation', note: 'DFA minimization, Chomsky hierarchy, Turing decidability' },
    { subject: 'Engineering Mathematics', note: 'Eigenvalues, linear algebra matrix ranks, Poisson distribution' },
    { subject: 'Computer Organization', note: 'Pipeline hazard stalls, cache mapping (direct & set-associative)' },
    { subject: 'Programming in C', note: 'Pointers arithmetic, recursion stack frames, bitwise manipulation' },
    { subject: 'General Revision', note: 'Previous year GATE CSE questions (2018-2023)' },
  ];

  // Generate sessions across the past 7 days
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - i);

    const year = targetDate.getFullYear();
    const month = padZero(targetDate.getMonth() + 1);
    const day = padZero(targetDate.getDate());
    const dateKey = `${year}-${month}-${day}`;

    // 2-3 sessions per day
    const numSessions = i === 0 ? 2 : (i % 2 === 0 ? 3 : 2);
    
    // Vary study hours (between 5h and 9h per day)
    let sessionBaseHour = 9; // starts 9 AM

    for (let s = 0; s < numSessions; s++) {
      const item = subjectsWithNotes[(i * 2 + s) % subjectsWithNotes.length];
      const durationHours = 1.5 + (s * 0.8) + (i % 2 === 0 ? 0.7 : 0.2);
      const durationSeconds = Math.round(durationHours * 3600);

      const startTime = new Date(year, targetDate.getMonth(), targetDate.getDate(), sessionBaseHour, 0, 0).getTime();
      const endTime = startTime + durationSeconds * 1000;

      sessions.push({
        id: `sample_${i}_${s}_${Date.now()}`,
        subject: item.subject,
        startTime,
        endTime,
        durationSeconds,
        date: dateKey,
        notes: item.note,
      });

      sessionBaseHour += Math.ceil(durationHours) + 1; // gap between sessions
    }
  }

  return sessions;
};
