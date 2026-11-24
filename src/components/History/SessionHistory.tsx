import React, { useState } from 'react';
import { StudySession } from '../../types';
import { formatDurationFriendly, formatTimeDisplay } from '../../utils/timeUtils';
import { History, Trash2, Search, Filter, Download, FileText, AlertCircle } from 'lucide-react';

interface SessionHistoryProps {
  sessions: StudySession[];
  onDeleteSession: (sessionId: string) => void;
  onClearAll: () => void;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  onDeleteSession,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [sessionToDelete, setSessionToDelete] = useState<StudySession | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredSessions = sessions
    .filter((s) => {
      const matchesSearch =
        s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.date.includes(searchTerm);

      const matchesSubject =
        selectedSubjectFilter === 'ALL' || s.subject.toLowerCase() === selectedSubjectFilter.toLowerCase();

      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => b.startTime - a.startTime);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `studybloom_sessions_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Subject', 'Duration (Minutes)', 'Duration (Seconds)', 'Start Time', 'End Time', 'Notes'];
    const rows = sessions.map((s) => [
      s.date,
      `"${s.subject.replace(/"/g, '""')}"`,
      Math.round(s.durationSeconds / 60),
      s.durationSeconds,
      new Date(s.startTime).toISOString(),
      new Date(s.endTime).toISOString(),
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `studybloom_sessions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-mono-100 dark:bg-mono-900 flex items-center justify-center text-mono-950 dark:text-mono-50 border border-mono-200 dark:border-mono-800">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-mono-950 dark:text-mono-50">
              Study Log History
            </h3>
            <p className="text-xs text-mono-500">
              {sessions.length} total study {sessions.length === 1 ? 'session' : 'sessions'} recorded
            </p>
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-mono-900 dark:text-mono-100 bg-mono-100 hover:bg-mono-200 dark:bg-mono-900 dark:hover:bg-mono-800 transition-colors border border-mono-200 dark:border-mono-700"
              title="Export as CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-mono-900 dark:text-mono-100 bg-mono-100 hover:bg-mono-200 dark:bg-mono-900 dark:hover:bg-mono-800 transition-colors border border-mono-200 dark:border-mono-700"
              title="Export as JSON backup"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-mono-900 dark:text-mono-100 bg-mono-100 hover:bg-mono-200 dark:bg-mono-900 dark:hover:bg-mono-800 transition-colors border border-mono-300 dark:border-mono-700"
              title="Clear all session history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mono-400" />
          <input
            type="text"
            placeholder="Search by subject, topic notes, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 focus:border-black dark:focus:border-white outline-none text-mono-950 dark:text-mono-50 placeholder:text-mono-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-mono-400 shrink-0" />
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="w-full sm:w-48 py-2 px-3 text-xs rounded-xl bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 text-mono-950 dark:text-mono-50 outline-none"
          >
            <option value="ALL">All Subjects</option>
            <option value="Algorithms">Algorithms</option>
            <option value="Operating Systems">Operating Systems</option>
            <option value="DBMS">DBMS</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="Theory of Computation">Theory of Computation</option>
            <option value="Computer Organization">Computer Organization</option>
            <option value="Engineering Mathematics">Engineering Mathematics</option>
            <option value="Programming in C">Programming in C</option>
            <option value="General Revision">General Revision</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-mono-200 dark:border-mono-800 text-mono-500 text-xs">
          {sessions.length === 0
            ? 'No study sessions recorded yet. Start studying with the timer above!'
            : 'No sessions found matching your search filter.'}
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-2xl bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 hover:border-black dark:hover:border-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-black text-white dark:bg-white dark:text-black">
                    {session.subject}
                  </span>

                  <span className="text-xs text-mono-500">
                    {session.date}
                  </span>

                  <span className="text-[11px] text-mono-400">
                    • {formatTimeDisplay(session.startTime)} – {formatTimeDisplay(session.endTime)}
                  </span>
                </div>

                {session.notes && (
                  <p className="text-xs text-mono-700 dark:text-mono-300 italic truncate pl-1">
                    "{session.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="text-right">
                  <span className="font-clock font-bold text-sm sm:text-base text-mono-950 dark:text-white">
                    {formatDurationFriendly(session.durationSeconds)}
                  </span>
                </div>

                <button
                  onClick={() => setSessionToDelete(session)}
                  className="p-1.5 rounded-lg text-mono-400 hover:text-black dark:hover:text-white hover:bg-mono-200 dark:hover:bg-mono-800 transition-colors opacity-80 group-hover:opacity-100"
                  title="Delete this session record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft-xl animate-float">
            <div className="flex items-center gap-2.5 text-mono-950 dark:text-mono-50 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h4 className="font-bold text-base">Delete Session?</h4>
            </div>
            <p className="text-xs text-mono-600 dark:text-mono-400 mb-5 leading-relaxed">
              Remove the <span className="font-bold text-mono-950 dark:text-mono-50">{formatDurationFriendly(sessionToDelete.durationSeconds)}</span> session on <span className="font-semibold">{sessionToDelete.subject}</span>?
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-mono-500 hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteSession(sessionToDelete.id);
                  setSessionToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black shadow-soft transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-mono-card border border-mono-200 dark:border-mono-800 shadow-soft-xl animate-float">
            <div className="flex items-center gap-2.5 text-mono-950 dark:text-mono-50 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h4 className="font-bold text-base">Clear All History?</h4>
            </div>
            <p className="text-xs text-mono-600 dark:text-mono-400 mb-5 leading-relaxed">
              This will remove all {sessions.length} study sessions from your log history.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-mono-500 hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black shadow-soft transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
