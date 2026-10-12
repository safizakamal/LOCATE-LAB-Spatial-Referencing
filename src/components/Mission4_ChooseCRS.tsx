import React, { useState } from 'react';
import { MelakaMarker } from './MelakaMarker';
import { MISSION_4_SCENARIOS } from '../data/missionsData';
import { ArrowRight, CheckCircle2, AlertCircle, Compass, MapPin, Info } from 'lucide-react';

interface Mission4Props {
  onComplete: (scoreGain: number) => void;
  onNext: () => void;
  isCompleted: boolean;
}

export const Mission4_ChooseCRS: React.FC<Mission4Props> = ({
  onComplete,
  onNext,
  isCompleted,
}) => {
  // Selected town on the Malaysia UTM map
  const [selectedTown, setSelectedTown] = useState<string>('melaka');

  // Scenario answers: scenarioId -> optionId
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, string>>({});
  const [scenarioEvaluations, setScenarioEvaluations] = useState<Record<string, boolean>>({});

  const malaysiaLocations = [
    {
      id: 'kangar',
      name: 'Kangar (Perlis)',
      lng: 100.2,
      lat: 6.4,
      zone: 'Zone 47N',
      epsg: 'EPSG:32647',
      xPct: 18,
      yPct: 22,
      reason: 'Long. 100.2° E is between 96°E–102°E, strictly inside UTM Zone 47N.',
    },
    {
      id: 'penang',
      name: 'George Town (Penang)',
      lng: 100.3,
      lat: 5.4,
      zone: 'Zone 47N',
      epsg: 'EPSG:32647',
      xPct: 20,
      yPct: 35,
      reason: 'Long. 100.3° E is west of the 102°E meridian, so it falls in UTM Zone 47N.',
    },
    {
      id: 'kl',
      name: 'Kuala Lumpur',
      lng: 101.7,
      lat: 3.1,
      zone: 'Zone 47N',
      epsg: 'EPSG:32647',
      xPct: 32,
      yPct: 65,
      reason: 'Long. 101.7° E is west of 102°E, placing the capital inside UTM Zone 47N.',
    },
    {
      id: 'melaka',
      name: 'Melaka (Our Dataset!)',
      lng: 102.3,
      lat: 2.3,
      zone: 'Zone 48N',
      epsg: 'EPSG:32648',
      xPct: 40,
      yPct: 78,
      reason: 'Long. 102.30° E crosses east of the 102°E meridian! Melaka is officially in UTM Zone 48N.',
    },
    {
      id: 'kuantan',
      name: 'Kuantan (Pahang)',
      lng: 103.3,
      lat: 3.8,
      zone: 'Zone 48N',
      epsg: 'EPSG:32648',
      xPct: 55,
      yPct: 56,
      reason: 'Long. 103.3° E is well inside the 102°E–108°E strip, belonging to UTM Zone 48N.',
    },
  ];

  const handleScenarioSelect = (scenarioId: string, optionId: string) => {
    setScenarioAnswers((prev) => ({ ...prev, [scenarioId]: optionId }));
    setScenarioEvaluations((prev) => ({ ...prev, [scenarioId]: true }));
  };

  const answeredCount = Object.keys(scenarioEvaluations).length;
  const allScenariosAnswered = answeredCount === MISSION_4_SCENARIOS.length;

  const handleFinish = () => {
    let score = 0;
    MISSION_4_SCENARIOS.forEach((sc) => {
      const chosenOpt = sc.options.find((o) => o.id === scenarioAnswers[sc.id]);
      if (chosenOpt?.isCorrect) {
        score += 8;
      }
    });
    onComplete(score);
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/80 border border-blue-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>MISSION 04 · SOURCES 8–10</span>
              <span>·</span>
              <span className="text-slate-400">CHOOSE THE RIGHT CRS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              UTM Zones & Real-World GIS Scenarios
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              There is no single &ldquo;best&rdquo; coordinate system for all projects. The choice depends on 
              <strong> area size</strong>, <strong>study purpose</strong>, and <strong>required accuracy</strong>.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 bg-slate-800/80 border border-cyan-400/30 rounded-xl">
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Designated CRS</span>
              <div className="text-xl font-mono font-bold text-cyan-400 mt-0.5">UTM Zone 48N</div>
              <span className="text-[11px] text-teal-300">EPSG:32648 (Melaka)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Interactive UTM Zone Map of Malaysia */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold font-mono">
            01
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Malaysia Sits Across Two UTM Zones</h2>
            <p className="text-xs text-slate-400">
              The 102°E Meridian divides Peninsular Malaysia into <strong>Zone 47N</strong> (West) and <strong>Zone 48N</strong> (East).
            </p>
          </div>
        </div>

        {/* 2-Zone Sandbox: Interactive Malaysia Map + Town Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Map canvas */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 relative min-h-[360px] flex flex-col justify-between overflow-hidden">
            <svg viewBox="0 0 500 380" className="w-full h-full max-h-[340px] select-none">
              {/* Zone 47N background tint */}
              <rect x="0" y="0" width="250" height="380" fill="#0f172a" opacity="0.6" />
              {/* Zone 48N background tint */}
              <rect x="250" y="0" width="250" height="380" fill="#132338" opacity="0.6" />

              {/* Meridian 102°E boundary line */}
              <line x1="250" y1="0" x2="250" y2="380" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" />
              <text x="256" y="24" fill="#f59e0b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                102°E Meridian (Zone Divider)
              </text>

              {/* Zone labels */}
              <text x="60" y="40" fill="#38bdf8" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">
                ZONE 47N (96°E – 102°E)
              </text>
              <text x="290" y="40" fill="#34d399" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">
                ZONE 48N (102°E – 108°E)
              </text>

              {/* Peninsular Malaysia Outline */}
              <path
                d="M120 70 
                   Q180 60 260 80 
                   Q330 110 320 200 
                   Q300 280 270 330 
                   Q240 320 200 300 
                   Q150 240 140 180 
                   Q110 130 120 70 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Town Markers */}
              {malaysiaLocations.map((loc) => {
                const isSelected = selectedTown === loc.id;
                // SVG coordinates scaled from loc.xPct and loc.yPct
                const cx = (loc.xPct / 100) * 500;
                const cy = (loc.yPct / 100) * 380;

                return (
                  <g
                    key={loc.id}
                    onClick={() => setSelectedTown(loc.id)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 9 : 6}
                      fill={loc.zone === 'Zone 48N' ? '#10b981' : '#0ea5e9'}
                      stroke={isSelected ? '#ffffff' : '#0f172a'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    <text
                      x={cx + 12}
                      y={cy + 4}
                      fill={isSelected ? '#ffffff' : '#94a3b8'}
                      fontSize={isSelected ? '11' : '10'}
                      fontFamily="JetBrains Mono"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {loc.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Melaka Pin placed if selected */}
            {selectedTown === 'melaka' && (
              <div
                className="absolute pointer-events-none transition-all duration-300"
                style={{
                  left: '40%',
                  top: '78%',
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <MelakaMarker
                  label="Melaka Dataset"
                  coords="102.30° E · Zone 48N"
                  size="sm"
                />
              </div>
            )}

            {/* Bottom Map Note */}
            <div className="z-10 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="text-amber-400">Click towns on map to inspect UTM assignment</span>
              <span className="text-slate-400">Each UTM Zone is 6° wide</span>
            </div>
          </div>

          {/* Location Inspection Deck */}
          <div className="lg:col-span-5 bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
                Selected Geographic Location
              </div>
              {(() => {
                const loc = malaysiaLocations.find((l) => l.id === selectedTown) || malaysiaLocations[3];
                return (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-rose-400" />
                      {loc.name}
                    </h3>
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700 space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Longitude:</span>
                        <span className="text-amber-300 font-bold">{loc.lng.toFixed(2)}° E</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Designated UTM Zone:</span>
                        <span className="text-teal-400 font-bold">{loc.zone}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Standard EPSG Code:</span>
                        <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {loc.epsg}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                      {loc.reason}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Quick Town Selectors */}
            <div className="pt-2 border-t border-slate-700/60">
              <div className="text-[11px] font-mono text-slate-400 mb-2">Switch Town:</div>
              <div className="flex flex-wrap gap-1.5">
                {malaysiaLocations.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedTown(l.id)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                      selectedTown === l.id
                        ? 'bg-cyan-600 text-white font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {l.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Real GIS Scenarios (Decisions & Instant Feedback) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold font-mono">
            02
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Make the CRS Decision in 4 Real GIS Projects</h2>
            <p className="text-xs text-slate-400">
              Evaluate each project need. Select the appropriate coordinate system to receive immediate feedback explaining WHY.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {MISSION_4_SCENARIOS.map((sc, idx) => {
            const chosenId = scenarioAnswers[sc.id];
            const isAnswered = scenarioEvaluations[sc.id];

            return (
              <div
                key={sc.id}
                className="p-5 sm:p-6 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400">
                      Scale: {sc.scale.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{sc.title}</h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    Step {idx + 1} of 4
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <strong>Context:</strong> {sc.context}
                </p>
                <p className="text-xs font-semibold text-amber-300">
                  {sc.task}
                </p>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sc.options.map((opt) => {
                    const isSelected = chosenId === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleScenarioSelect(sc.id, opt.id)}
                        className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-950/60 border-emerald-500 text-white font-medium ring-1 ring-emerald-500/50'
                              : 'bg-rose-950/60 border-rose-500 text-white font-medium ring-1 ring-rose-500/50'
                            : 'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:bg-slate-900 hover:border-slate-500'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-mono uppercase text-slate-400">
                              {opt.crsType}
                            </span>
                            {isSelected && (
                              <span>
                                {opt.isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                )}
                              </span>
                            )}
                          </div>
                          <div className="font-semibold text-xs sm:text-sm text-white">{opt.label}</div>
                        </div>

                        {opt.epsg && (
                          <div className="mt-2 text-[10px] font-mono text-teal-400">
                            Identifier: {opt.epsg}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback with technical WHY */}
                {isAnswered && (
                  <div
                    className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed animate-in fade-in duration-200 ${
                      sc.options.find((o) => o.id === chosenId)?.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-100'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {sc.options.find((o) => o.id === chosenId)?.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Why this is correct:</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                          <span>Why this choice fails:</span>
                        </>
                      )}
                    </div>
                    <p>{sc.options.find((o) => o.id === chosenId)?.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleFinish}
            disabled={!allScenariosAnswered}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              allScenariosAnswered
                ? 'bg-blue-500 hover:bg-blue-400 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>
              {isCompleted ? 'Mission Complete · Continue to Mission 5' : `Complete Mission 4 (${answeredCount}/4 Scenarios)`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
