import React from 'react';
import { MissionId, MissionProgress } from '../types/gis';
import { BookOpen, RotateCcw } from 'lucide-react';

interface HeaderProps {
  progress: MissionProgress;
  onSelectMission: (missionId: MissionId) => void;
  onOpenGlossary: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onSelectMission,
  onOpenGlossary,
  onReset,
}) => {
  const missions = [
    { id: 1 as MissionId, label: '1. Decode' },
    { id: 2 as MissionId, label: '2. Earth Ref' },
    { id: 3 as MissionId, label: '3. Flatten' },
    { id: 4 as MissionId, label: '4. Choose CRS' },
    { id: 5 as MissionId, label: '5. Detective' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectMission(1)}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                LOCATE LAB
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono hidden sm:block whitespace-nowrap">
              Melaka GIS Dataset Mission
            </div>
          </button>
        </div>

        {/* Zone 2: 5 clean single-line navigation step links */}
        <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
          {missions.map((m) => {
            const isCompleted = progress.completedMissions.includes(m.id);
            const isCurrent = progress.currentMission === m.id;

            return (
              <button
                key={m.id}
                onClick={() => onSelectMission(m.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : isCompleted
                    ? 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-400'
                      : isCurrent
                      ? 'bg-teal-400 animate-pulse'
                      : 'bg-slate-600'
                  }`}
                />
                {m.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <span className="text-slate-400">Score:</span>
            <span className="text-teal-400 font-bold tabular-nums">
              {progress.score} / {progress.maxScore}
            </span>
          </div>

          <button
            onClick={onOpenGlossary}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            title="Open GIS Reference Glossary"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">GIS Field Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Restart Lab"
            aria-label="Restart Lab"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Mission Tracker (below 1024px) */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 bg-slate-950/60 border-t border-slate-800/50 overflow-x-auto text-xs">
        {missions.map((m) => {
          const isCurrent = progress.currentMission === m.id;
          const isCompleted = progress.completedMissions.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => onSelectMission(m.id)}
              className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap shrink-0 transition-colors ${
                isCurrent
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40'
                  : isCompleted
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
