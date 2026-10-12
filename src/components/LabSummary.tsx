import React, { useState, useEffect } from 'react';
import { MissionProgress } from '../types/gis';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  MapPin,
  Compass,
  Layers,
  Search,
  Printer,
} from 'lucide-react';
import { MelakaMarker } from './MelakaMarker';

interface LabSummaryProps {
  progress: MissionProgress;
  onRestart: () => void;
}

export const LabSummary: React.FC<LabSummaryProps> = ({ progress, onRestart }) => {
  const [studentName, setStudentName] = useState<string>('GIS Student');

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if unavailable
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const percentage = Math.round((progress.score / progress.maxScore) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Victory Card */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 rounded-2xl p-6 sm:p-10 relative overflow-hidden text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LAB MISSION ACCOMPLISHED</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Melaka Dataset Successfully Located!
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Congratulations! You have navigated the entire pipeline from raw coordinate numbers to geodetic datums, 
              map projections, UTM zones, and GIS layer debugging.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-slate-950/80 border border-emerald-400/40 rounded-2xl shadow-xl min-w-[160px]">
            <Award className="w-10 h-10 text-amber-400 mb-2" />
            <div className="text-3xl font-mono font-black text-white tabular-nums">
              {progress.score}
              <span className="text-sm text-slate-400 font-normal"> / {progress.maxScore}</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono mt-1 font-semibold">{percentage}% Score</span>
          </div>
        </div>
      </div>

      {/* Printable Certificate / Student Submission Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Student Laboratory Verification Record
            </h2>
            <p className="text-xs text-slate-400">
              Enter your student details to export or screenshot for Moodle submission.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print / Save as PDF</span>
          </button>
        </div>

        {/* Certificate Box */}
        <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-dashed border-teal-500/40 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono text-teal-400 uppercase tracking-wider">
                Course: Bachelor of Computer Science — GIS
              </div>
              <div className="text-xl font-bold text-white mt-0.5">
                LOCATE LAB: From Coordinates to the Correct Location
              </div>
            </div>
            <div className="text-right">
              <MelakaMarker label="Melaka Layer" coords="UTM Zone 48N" size="sm" />
            </div>
          </div>

          {/* Student Name Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Student Name / ID:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-400"
                placeholder="Enter your student name..."
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Verification Status:</label>
              <div className="px-3 py-2 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-lg text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All 5 Missions Successfully Completed</span>
              </div>
            </div>
          </div>

          {/* Mission Progress Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {[
              { num: 1, title: 'Decode Coords', points: '30/30' },
              { num: 2, title: 'Earth Reference', points: '30/30' },
              { num: 3, title: 'Flatten Earth', points: '30/30' },
              { num: 4, title: 'Choose CRS', points: '32/32' },
              { num: 5, title: 'CRS Detective', points: '50/50' },
            ].map((m) => (
              <div key={m.num} className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] font-mono text-teal-400">Mission {m.num}</div>
                <div className="text-xs font-bold text-white mt-0.5 truncate">{m.title}</div>
                <div className="text-xs font-mono text-emerald-400 mt-1 font-semibold">{m.points}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Knowledge Summary Checklist (From 12 Graphics) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            Core GIS Competencies Mastered
          </h2>
          <p className="text-xs text-slate-400">
            Keep these essential rules of thumb for your coursework, spatial databases, and GIS lab assignments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {[
            {
              title: 'Coordinates Need a Datum & Reference',
              content:
                'Numbers like (2.30, 102.30) are angular degrees measured from the Equator (Latitude) and Prime Meridian (Longitude). Without a defined datum (e.g., WGS 84), numbers cannot be placed in the physical world.',
            },
            {
              title: 'Melaka is Officially UTM Zone 48N',
              content:
                'Melaka sits at 102.30°E, which lies east of the 102°E meridian. Its official projected system is WGS 84 / UTM Zone 48N (EPSG:32648) with linear units in metres.',
            },
            {
              title: 'Degrees vs. Metres (GCS vs. PCS)',
              content:
                'GCS (EPSG:4326) uses angular degrees (°); PCS (EPSG:32648) uses linear metres (m). You must always project data into a PCS before calculating Euclidean distance or polygon areas.',
            },
            {
              title: 'Assigning CRS is NOT Reprojecting!',
              content:
                'Assigning a CRS only relabels the layer metadata without altering coordinates. Reprojecting (Project tool) mathematically transforms every number into new coordinates.',
            },
            {
              title: 'On-the-Fly (OTF) Transformation',
              content:
                'Modern GIS software can display layers with different coordinate systems together seamlessly by projecting them into the active project CRS in real time.',
            },
            {
              title: 'Standard 6-Step GIS Workflow',
              content:
                'Get Coordinates → Choose CRS → Import XY Data → QA Spatial Results → Overlay Base Layers → Export Final Analysis Map.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-white text-xs sm:text-sm">{item.title}</h3>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Restart Button */}
        <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-mono">Ready to test yourself again?</span>
          <button
            onClick={onRestart}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Locate Lab</span>
          </button>
        </div>
      </div>
    </div>
  );
};
