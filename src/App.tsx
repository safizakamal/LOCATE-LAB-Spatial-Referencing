/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MissionId, MissionProgress } from './types/gis';
import { Header } from './components/Header';
import { Mission1_DecodeCoordinates } from './components/Mission1_DecodeCoordinates';
import { Mission2_EarthReference } from './components/Mission2_EarthReference';
import { Mission3_FlattenEarth } from './components/Mission3_FlattenEarth';
import { Mission4_ChooseCRS } from './components/Mission4_ChooseCRS';
import { Mission5_CRSDetective } from './components/Mission5_CRSDetective';
import { LabSummary } from './components/LabSummary';
import { GisGlossaryModal } from './components/GisGlossaryModal';
import { MelakaMarker } from './components/MelakaMarker';
import { Sparkles, Compass, CheckCircle2, ChevronRight } from 'lucide-react';
import { MISSION_METADATA } from './data/missionsData';

export default function App() {
  const [progress, setProgress] = useState<MissionProgress>({
    currentMission: 1,
    completedMissions: [],
    score: 0,
    maxScore: 172,
    missionScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    hintsUsed: 0,
  });

  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // Handle completing a mission
  const handleMissionComplete = (missionId: MissionId, scoreGain: number) => {
    setProgress((prev) => {
      const alreadyCompleted = prev.completedMissions.includes(missionId);
      const updatedCompleted = alreadyCompleted
        ? prev.completedMissions
        : [...prev.completedMissions, missionId];

      const prevMissionScore = prev.missionScores[missionId] || 0;
      const newScore = prev.score - prevMissionScore + scoreGain;

      return {
        ...prev,
        completedMissions: updatedCompleted,
        score: newScore,
        missionScores: {
          ...prev.missionScores,
          [missionId]: scoreGain,
        },
      };
    });
  };

  // Switch mission tab
  const handleSelectMission = (missionId: MissionId) => {
    setShowSummary(false);
    setProgress((prev) => ({ ...prev, currentMission: missionId }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Advance to next mission
  const handleNextMission = () => {
    if (progress.currentMission < 5) {
      const next = (progress.currentMission + 1) as MissionId;
      handleSelectMission(next);
    } else {
      setShowSummary(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset entire activity
  const handleResetLab = () => {
    if (window.confirm('Restart LOCATE LAB from Mission 1?')) {
      setProgress({
        currentMission: 1,
        completedMissions: [],
        score: 0,
        maxScore: 172,
        missionScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        hintsUsed: 0,
      });
      setShowSummary(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentMeta = MISSION_METADATA.find((m) => m.id === progress.currentMission);
  const overallPercentage = Math.round((progress.completedMissions.length / 5) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
      <Header
        progress={progress}
        onSelectMission={handleSelectMission}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onReset={handleResetLab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Continuous Mission Context Strip */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
              <MelakaMarker label="" coords="" size="sm" animated={false} />
            </div>
            <div>
              <div className="text-[11px] font-mono text-teal-400 uppercase tracking-wider flex items-center gap-2">
                <span>Continuous Lab Mission</span>
                <span>·</span>
                <span className="text-slate-400">Target: Melaka, Malaysia</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                &ldquo;A Melaka GIS dataset has coordinates. Help place the data correctly on the map.&rdquo;
              </p>
            </div>
          </div>

          {/* Overall Progress Meter */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-36 sm:w-48 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
            <span className="text-xs font-mono text-slate-300 font-semibold tabular-nums">
              {progress.completedMissions.length} / 5 Done
            </span>
          </div>
        </div>

        {/* View Switcher: Lab Summary or Active Mission */}
        {showSummary ? (
          <LabSummary progress={progress} onRestart={handleResetLab} />
        ) : (
          <>
            {/* Active Mission Render */}
            {progress.currentMission === 1 && (
              <Mission1_DecodeCoordinates
                onComplete={(score) => handleMissionComplete(1, score)}
                onNext={handleNextMission}
                isCompleted={progress.completedMissions.includes(1)}
              />
            )}

            {progress.currentMission === 2 && (
              <Mission2_EarthReference
                onComplete={(score) => handleMissionComplete(2, score)}
                onNext={handleNextMission}
                isCompleted={progress.completedMissions.includes(2)}
              />
            )}

            {progress.currentMission === 3 && (
              <Mission3_FlattenEarth
                onComplete={(score) => handleMissionComplete(3, score)}
                onNext={handleNextMission}
                isCompleted={progress.completedMissions.includes(3)}
              />
            )}

            {progress.currentMission === 4 && (
              <Mission4_ChooseCRS
                onComplete={(score) => handleMissionComplete(4, score)}
                onNext={handleNextMission}
                isCompleted={progress.completedMissions.includes(4)}
              />
            )}

            {progress.currentMission === 5 && (
              <Mission5_CRSDetective
                onComplete={(score) => handleMissionComplete(5, score)}
                onFinishLab={() => {
                  setShowSummary(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isCompleted={progress.completedMissions.includes(5)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">LOCATE LAB</span>
            <span>·</span>
            <span>From Coordinates to the Correct Location</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>UTeM Melaka Reference</span>
            <span>·</span>
            <span>WGS 84 / UTM Zone 48N (EPSG:32648)</span>
          </div>
        </div>
      </footer>

      {/* Glossary Modal */}
      <GisGlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </div>
  );
}
