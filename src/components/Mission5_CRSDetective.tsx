import React, { useState } from 'react';
import { MelakaMarker } from './MelakaMarker';
import { MISSION_5_BUGS, GIS_WORKFLOW_STEPS } from '../data/missionsData';
import { DetectiveBug, WorkflowStep } from '../types/gis';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  FileSpreadsheet,
  Compass,
  CheckCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface Mission5Props {
  onComplete: (scoreGain: number) => void;
  onFinishLab: () => void;
  isCompleted: boolean;
}

export const Mission5_CRSDetective: React.FC<Mission5Props> = ({
  onComplete,
  onFinishLab,
  isCompleted,
}) => {
  // Active Case (0, 1, 2)
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const currentCase: DetectiveBug = MISSION_5_BUGS[activeCaseIdx];

  // Selected diagnoses for cases: caseId -> optionId
  const [diagnoses, setDiagnoses] = useState<Record<string, string>>({});
  const [fixedCases, setFixedCases] = useState<string[]>([]);

  // Workflow builder state: sequence of step IDs (1 to 6)
  const [workflowSequence, setWorkflowSequence] = useState<number[]>([]);
  const [workflowValidated, setWorkflowValidated] = useState<boolean>(false);
  const [workflowError, setWorkflowError] = useState<string | null>(null);

  // Handle case diagnosis selection
  const handleSelectDiagnosis = (caseId: string, optId: string) => {
    setDiagnoses((prev) => ({ ...prev, [caseId]: optId }));
    const opt = currentCase.options.find((o) => o.id === optId);
    if (opt?.isCorrect && !fixedCases.includes(caseId)) {
      setFixedCases([...fixedCases, caseId]);
    }
  };

  // Add step to workflow sequence
  const handleAddWorkflowStep = (stepId: number) => {
    if (workflowSequence.includes(stepId)) return;
    const nextSeq = [...workflowSequence, stepId];
    setWorkflowSequence(nextSeq);
    setWorkflowError(null);
  };

  // Remove step from workflow sequence
  const handleRemoveWorkflowStep = (stepId: number) => {
    setWorkflowSequence(workflowSequence.filter((id) => id !== stepId));
    setWorkflowValidated(false);
    setWorkflowError(null);
  };

  // Reset workflow sequence
  const handleResetWorkflow = () => {
    setWorkflowSequence([]);
    setWorkflowValidated(false);
    setWorkflowError(null);
  };

  // Validate complete workflow order
  const handleValidateWorkflow = () => {
    if (workflowSequence.length !== 6) {
      setWorkflowError('Please add all 6 workflow stages before testing the pipeline.');
      return;
    }

    const isCorrectOrder = workflowSequence.every((val, index) => val === index + 1);
    if (isCorrectOrder) {
      setWorkflowValidated(true);
      setWorkflowError(null);
    } else {
      setWorkflowError('Workflow sequence is incorrect! Review the logical GIS pipeline order from data import to validation.');
    }
  };

  const allCasesFixed = fixedCases.length === MISSION_5_BUGS.length;
  const canFinish = allCasesFixed && workflowValidated;

  const handleFinishMission = () => {
    let score = fixedCases.length * 10;
    if (workflowValidated) score += 20;
    onComplete(score);
    onFinishLab();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-purple-950/80 border border-rose-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>MISSION 05 · SOURCES 11–12</span>
              <span>·</span>
              <span className="text-slate-400">CRS DETECTIVE & PIPELINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Diagnosing Misplaced GIS Layers
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              &ldquo;The coordinates are genuine, but the points are misplaced!&rdquo; 
              Investigate the 5 crucial diagnostic indicators: coordinate magnitude, units, layer CRS, project CRS, and coordinate axis order.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 bg-slate-800/80 border border-rose-400/30 rounded-xl">
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Solved Cases</span>
              <div className="text-xl font-mono font-bold text-rose-400 mt-0.5">
                {fixedCases.length} / {MISSION_5_BUGS.length} Cases
              </div>
              <span className="text-[11px] text-teal-300">
                {workflowValidated ? 'Workflow Built' : 'Pending Workflow'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Interactive GIS Diagnostic Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm font-bold font-mono">
              01
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">GIS Detective Inspection Bay</h2>
              <p className="text-xs text-slate-400">
                Switch between the 3 diagnostic cases and find the root spatial error.
              </p>
            </div>
          </div>

          {/* Case Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700">
            {MISSION_5_BUGS.map((c, i) => {
              const isFixed = fixedCases.includes(c.id);
              const isActive = activeCaseIdx === i;

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCaseIdx(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md'
                      : isFixed
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Case {i + 1}</span>
                  {isFixed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Sandbox: Visual Map Simulator + GIS Inspector Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Map canvas */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 relative min-h-[360px] flex flex-col justify-between overflow-hidden">
            {/* Map title bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2 z-10">
              <span className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    fixedCases.includes(currentCase.id) ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'
                  }`}
                />
                <span>Map Canvas: {currentCase.title}</span>
              </span>
              <span className="text-slate-400">Project CRS: EPSG:32648</span>
            </div>

            {/* Simulated GIS canvas */}
            <div className="relative my-auto w-full h-[240px] flex items-center justify-center">
              <svg viewBox="0 0 500 240" className="w-full h-full select-none">
                {/* Grid */}
                <defs>
                  <pattern id="gisGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="500" height="240" fill="#090d16" />
                <rect width="500" height="240" fill="url(#gisGrid)" />

                {/* Melaka State Boundary Polygon */}
                <path
                  d="M 280 80 
                     Q 360 70 410 110 
                     Q 450 150 420 190 
                     Q 370 210 320 200 
                     Q 260 180 250 140 
                     Q 240 100 280 80 Z"
                  fill="#064e3b"
                  fillOpacity="0.4"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <text x="320" y="145" fill="#34d399" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                  Melaka Study Area
                </text>

                {/* Road network inside Melaka */}
                <path d="M260 130 Q330 140 400 120" stroke="#475569" strokeWidth="1.5" />
                <path d="M310 90 Q330 150 350 200" stroke="#475569" strokeWidth="1.5" />

                {/* Symptom Rendering based on whether case is resolved */}
                {(() => {
                  const isResolved = fixedCases.includes(currentCase.id);

                  if (isResolved) {
                    // School points properly placed inside Melaka boundary
                    return (
                      <g>
                        {/* 8 school location dots */}
                        {[
                          [300, 110],
                          [330, 125],
                          [360, 140],
                          [310, 160],
                          [380, 165],
                          [340, 175],
                          [290, 140],
                          [370, 115],
                        ].map(([cx, cy], i) => (
                          <g key={i}>
                            <circle cx={cx} cy={cy} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                            <circle cx={cx} cy={cy} r="8" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
                          </g>
                        ))}
                      </g>
                    );
                  }

                  // Misplaced symptoms
                  if (currentCase.mapVisualState === 'swapped_xy') {
                    // Points appear way off to the left in Somalia / Indian Ocean
                    return (
                      <g>
                        <rect x="20" y="30" width="130" height="90" fill="#450a0a" opacity="0.5" rx="6" />
                        <text x="30" y="55" fill="#f87171" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                          POINTS IN OCEAN!
                        </text>
                        <text x="30" y="70" fill="#fca5a5" fontSize="9" fontFamily="JetBrains Mono">
                          (Off Somalia Coast)
                        </text>
                        {[
                          [40, 90],
                          [60, 100],
                          [80, 95],
                          [100, 105],
                        ].map(([cx, cy], i) => (
                          <circle key={i} cx={cx} cy={cy} r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                        ))}
                      </g>
                    );
                  }

                  if (currentCase.mapVisualState === 'degrees_as_metres') {
                    // Points collapsed into a tiny cluster near (0,0) null island
                    return (
                      <g>
                        <circle cx="50" cy="190" r="14" fill="#450a0a" opacity="0.6" />
                        <circle cx="50" cy="190" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                        <text x="70" y="194" fill="#f87171" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                          Collapsed at (0,0) Null Island
                        </text>
                      </g>
                    );
                  }

                  if (currentCase.mapVisualState === 'datum_shift') {
                    // Points slightly shifted by 25px outside boundary into river
                    return (
                      <g>
                        {[
                          [275, 110],
                          [305, 125],
                          [335, 140],
                          [285, 160],
                          [355, 165],
                        ].map(([cx, cy], i) => (
                          <g key={i}>
                            <circle cx={cx} cy={cy} r="5" fill="#ef4444" stroke="#fbbf24" strokeWidth="1.5" />
                            <line x1={cx} y1={cy} x2={cx + 25} y2={cy} stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
                          </g>
                        ))}
                        <text x="240" y="60" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono">
                          ~18m Systematic Datum Offset
                        </text>
                      </g>
                    );
                  }

                  return null;
                })()}
              </svg>
            </div>

            {/* Map footer status */}
            <div className="z-10 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">
                {fixedCases.includes(currentCase.id) ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Correctly Realigned to Melaka!
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Layer Misplaced: {currentCase.symptom}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Inspector Panel */}
          <div className="lg:col-span-5 bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-1">
                Diagnostic File Properties
              </div>
              <h3 className="text-base font-bold text-white">{currentCase.title}</h3>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-700 mt-2 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sample Row:</span>
                  <span className="text-amber-300 truncate max-w-[200px]">{currentCase.sampleCoords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Layer CRS:</span>
                  <span className="text-rose-300">{currentCase.layerCRS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Map CRS:</span>
                  <span className="text-teal-300">{currentCase.mapCRS}</span>
                </div>
              </div>

              {/* Clues */}
              <div className="mt-3 space-y-1.5">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Clues Identified:</div>
                {currentCase.diagnosticClues.map((clue, idx) => (
                  <div key={idx} className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/50 text-xs">
                    <span className="font-semibold text-sky-400">{clue.step}: </span>
                    <span className="text-slate-300">{clue.observation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnosis Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-700/60">
              <div className="text-xs font-bold text-white">{currentCase.question}</div>
              <div className="space-y-2">
                {currentCase.options.map((opt) => {
                  const isSelected = diagnoses[currentCase.id] === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectDiagnosis(currentCase.id, opt.id)}
                      className={`w-full p-2.5 rounded-lg text-left text-xs border transition-all cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500 text-white font-medium'
                            : 'bg-rose-950/60 border-rose-500 text-white font-medium'
                          : 'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span>{opt.label}</span>
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
                    </button>
                  );
                })}
              </div>

              {diagnoses[currentCase.id] && (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 leading-relaxed">
                  {currentCase.options.find((o) => o.id === diagnoses[currentCase.id])?.technicalExplanation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Golden Rule Callout */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Crucial GIS Rule: Assigning CRS ≠ Reprojecting!</strong>
            <p className="mt-1 text-slate-300 text-xs leading-relaxed">
              <strong>Assigning a CRS</strong> simply tells GIS what coordinate reference system the numbers were recorded in (like labeling a file). It does NOT change the numbers. 
              <strong>Reprojecting</strong> (using the <em>Project</em> tool in QGIS/ArcGIS) executes mathematical equations that recalculate every coordinate into the new coordinate reference system.
            </p>
          </div>
        </div>
      </div>

      {/* Part 2: Interactive 6-Stage GIS Workflow Builder */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold font-mono">
              02
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Construct the Complete GIS Workflow</h2>
              <p className="text-xs text-slate-400">
                Arrange the 6 essential steps in chronological order to place Melaka data with spatial precision.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetWorkflow}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Workflow</span>
          </button>
        </div>

        {/* Available blocks palette */}
        <div>
          <div className="text-xs font-mono text-slate-400 mb-2">Available Workflow Blocks (Click to add to sequence):</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GIS_WORKFLOW_STEPS.map((step) => {
              const isUsed = workflowSequence.includes(step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => handleAddWorkflowStep(step.id)}
                  disabled={isUsed}
                  className={`p-3.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                    isUsed
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-600 opacity-50 cursor-not-allowed'
                      : 'bg-slate-800/70 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-teal-500/50 cursor-pointer'
                  }`}
                >
                  <div className="font-semibold text-sm text-white mb-1 flex items-center justify-between">
                    <span>{step.name}</span>
                    <span className="text-[10px] font-mono text-teal-400 uppercase">{step.category}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{step.shortDesc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Sequence Construction Runway */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-teal-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Your Assembled Pipeline ({workflowSequence.length} of 6 stages):</span>
            </div>
            {workflowValidated && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCheck className="w-4 h-4" /> Valid Production Pipeline!
              </span>
            )}
          </div>

          {workflowSequence.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono border-2 border-dashed border-slate-800 rounded-xl">
              Click the blocks above to assemble the step-by-step GIS pipeline.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {workflowSequence.map((stepId, orderIndex) => {
                const step = GIS_WORKFLOW_STEPS.find((s) => s.id === stepId)!;
                return (
                  <div
                    key={stepId}
                    className="p-3 bg-slate-900 rounded-xl border border-teal-500/40 flex items-start justify-between gap-2 relative group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold font-mono flex items-center justify-center">
                          {orderIndex + 1}
                        </span>
                        <span className="text-xs font-bold text-white">{step.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{step.shortDesc}</p>
                    </div>

                    <button
                      onClick={() => handleRemoveWorkflowStep(stepId)}
                      className="text-slate-500 hover:text-rose-400 text-xs p-1 transition-colors cursor-pointer"
                      title="Remove stage"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Validation Error / Success message */}
          {workflowError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{workflowError}</span>
            </div>
          )}

          {workflowValidated && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Outstanding! Step 1 (Get Coordinates) → Step 2 (Choose CRS) → Step 3 (Import XY) → Step 4 (Check QA) → Step 5 (Overlay) → Step 6 (Final Map).
              </span>
            </div>
          )}

          {/* Test & Validate Pipeline Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleValidateWorkflow}
              disabled={workflowSequence.length !== 6}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                workflowSequence.length === 6
                  ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Test & Validate Pipeline
            </button>
          </div>
        </div>

        {/* Final Mission Completion Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleFinishMission}
            disabled={!canFinish}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              canFinish
                ? 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-lg shadow-rose-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>Complete Mission 5 & View Lab Summary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
