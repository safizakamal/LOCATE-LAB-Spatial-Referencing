import React, { useState } from 'react';
import { MelakaMarker } from './MelakaMarker';
import { CheckCircle2, AlertCircle, Compass, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { MISSION_1_QUESTIONS } from '../data/missionsData';

interface Mission1Props {
  onComplete: (scoreGain: number) => void;
  onNext: () => void;
  isCompleted: boolean;
}

export const Mission1_DecodeCoordinates: React.FC<Mission1Props> = ({
  onComplete,
  onNext,
  isCompleted,
}) => {
  // Step 1: Initial prediction
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [guessAnswered, setGuessAnswered] = useState(false);

  // Step 2: Interactive Coordinate Dial
  const [sliderLat, setSliderLat] = useState<number>(0);
  const [sliderLng, setSliderLng] = useState<number>(0);
  const [isLockedOnMelaka, setIsLockedOnMelaka] = useState(false);

  // Step 3: Check questions
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const handleGuessSubmit = (optionId: string) => {
    setSelectedGuess(optionId);
    setGuessAnswered(true);
  };

  const handleLockMelaka = () => {
    setSliderLat(2.3);
    setSliderLng(102.3);
    setIsLockedOnMelaka(true);
  };

  const handleQuizSelect = (questionId: string, optionId: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setQuizSubmitted((prev) => ({ ...prev, [questionId]: true }));
  };

  const allDone =
    guessAnswered &&
    quizSubmitted['lat_measure'] &&
    quizSubmitted['units_check'];

  // Handle final mission completion
  const handleFinishMission = () => {
    let score = 0;
    if (selectedGuess === 'melaka') score += 10;
    if (quizAnswers['lat_measure'] === 'opt1') score += 10;
    if (quizAnswers['units_check'] === 'opt2') score += 10;
    onComplete(score);
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>MISSION 01 · SOURCES 1–3</span>
              <span>·</span>
              <span className="text-slate-400">DECODE THE COORDINATES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Numbers Alone Are Not Enough
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              A Melaka GIS dataset just arrived in your university lab. It contains numbers: <code className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">(2.30, 102.30)</code>. 
              Before GIS software can place it on a map, we must decode what these numbers mean.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 bg-slate-800/80 border border-sky-400/30 rounded-xl">
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Dataset Mystery</span>
              <div className="text-2xl font-mono font-bold text-amber-400 mt-0.5">(2.30, 102.30)</div>
              <span className="text-[11px] text-teal-400">Where am I?</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Prediction before revelation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold font-mono">
            01
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">First Prediction: Where on Earth is (2.30, 102.30)?</h2>
            <p className="text-xs text-slate-400">Test your geographic intuition before inspecting the coordinates.</p>
          </div>
        </div>

        {/* Choice buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MISSION_1_QUESTIONS.initialGuess.options.map((opt) => {
            const isSelected = selectedGuess === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleGuessSubmit(opt.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/80 text-white shadow-lg shadow-emerald-950/50'
                      : 'bg-rose-950/40 border-rose-500/80 text-white shadow-lg shadow-rose-950/50'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Location Option</span>
                  {isSelected && (
                    <span>
                      {opt.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </span>
                  )}
                </div>
                <div className="font-semibold text-base">{opt.label}</div>
              </button>
            );
          })}
        </div>

        {/* Feedback box when answered */}
        {guessAnswered && (
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {selectedGuess === 'melaka' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  {MISSION_1_QUESTIONS.initialGuess.options.find((o) => o.id === selectedGuess)?.feedback}
                </p>
                <p className="text-xs text-teal-300 mt-2 font-mono">
                  {MISSION_1_QUESTIONS.initialGuess.takeaway}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part 2: Interactive Coordinate Globe Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-bold font-mono">
              02
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Interactive Coordinate Simulator</h2>
              <p className="text-xs text-slate-400">
                Observe how Latitude (North–South) and Longitude (East–West) navigate the Earth.
              </p>
            </div>
          </div>

          <button
            onClick={handleLockMelaka}
            className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Target Melaka (2.30° N, 102.30° E)</span>
          </button>
        </div>

        {/* 2-Zone Sandbox: Stage & Control Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Visual Stage: Interactive Globe & Grid Canvas */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[340px] overflow-hidden">
            {/* Background world map vector silhouette */}
            <svg
              viewBox="0 0 800 400"
              className="w-full h-full max-h-[320px] select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id="globeAtmosphere" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </radialGradient>
              </defs>

              <rect width="800" height="400" fill="url(#globeAtmosphere)" />

              {/* Equator (0° Latitude) */}
              <line x1="0" y1="200" x2="800" y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="12" y="194" fill="#ef4444" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                Equator 0° (Baseline for Latitude)
              </text>

              {/* Prime Meridian (0° Longitude) */}
              <line x1="400" y1="0" x2="400" y2="400" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="406" y="24" fill="#10b981" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                Prime Meridian 0° (Baseline for Longitude)
              </text>

              {/* Latitudinal Graticule Lines */}
              <line x1="0" y1="100" x2="800" y2="100" stroke="#334155" strokeWidth="0.8" />
              <text x="750" y="96" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">+45° N</text>

              <line x1="0" y1="300" x2="800" y2="300" stroke="#334155" strokeWidth="0.8" />
              <text x="750" y="296" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">-45° S</text>

              {/* Longitudinal Graticule Lines */}
              <line x1="200" y1="0" x2="200" y2="400" stroke="#334155" strokeWidth="0.8" />
              <text x="206" y="390" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">-90° W</text>

              <line x1="600" y1="0" x2="600" y2="400" stroke="#334155" strokeWidth="0.8" />
              <text x="606" y="390" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">+90° E</text>

              {/* Approximate simplified world continent blobs */}
              {/* Africa */}
              <path d="M380 150 Q430 180 440 230 Q420 300 390 320 Q360 250 370 180 Z" fill="#1e293b" opacity="0.6" />
              {/* Eurasia */}
              <path d="M380 90 Q480 60 620 90 Q650 160 550 180 Q450 150 400 120 Z" fill="#1e293b" opacity="0.6" />
              {/* Southeast Asia & Malaysia */}
              <path d="M600 180 Q640 190 635 220 Q620 230 610 200 Z" fill="#0f766e" opacity="0.8" />
              {/* Australia */}
              <path d="M640 270 Q720 260 740 310 Q680 340 640 310 Z" fill="#1e293b" opacity="0.6" />
              {/* Americas */}
              <path d="M180 90 Q240 110 230 180 Q190 190 170 140 Z" fill="#1e293b" opacity="0.6" />
              <path d="M220 220 Q280 250 260 330 Q220 350 210 280 Z" fill="#1e293b" opacity="0.6" />

              {/* Dynamic Coordinate Target Point */}
              {/* Mapping: X = 400 + (sliderLng / 180) * 400; Y = 200 - (sliderLat / 90) * 200 */}
              {(() => {
                const targetX = 400 + (sliderLng / 180) * 400;
                const targetY = 200 - (sliderLat / 90) * 200;

                return (
                  <g transform={`translate(${targetX}, ${targetY})`}>
                    {/* Crosshairs */}
                    <line x1="-16" y1="0" x2="16" y2="0" stroke="#38bdf8" strokeWidth="1.5" />
                    <line x1="0" y1="-16" x2="0" y2="16" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-pulse" />
                    <circle cx="0" cy="0" r="3" fill="#38bdf8" />
                  </g>
                );
              })()}
            </svg>

            {/* Melaka Pin Placement overlay */}
            <div
              className="absolute pointer-events-none transition-all duration-300"
              style={{
                left: `${((sliderLng + 180) / 360) * 100}%`,
                top: `${((90 - sliderLat) / 180) * 100}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <MelakaMarker
                label={
                  Math.abs(sliderLat - 2.3) < 3 && Math.abs(sliderLng - 102.3) < 5
                    ? 'Target Locked: Melaka!'
                    : 'Target Location'
                }
                coords={`${sliderLat.toFixed(2)}° ${sliderLat >= 0 ? 'N' : 'S'}, ${sliderLng.toFixed(2)}° ${sliderLng >= 0 ? 'E' : 'W'}`}
                size="md"
              />
            </div>
          </div>

          {/* Control Deck */}
          <div className="lg:col-span-5 bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-400" />
                Angular Coordinates Control
              </h3>
              <p className="text-xs text-slate-400">
                Move sliders to observe how angular degrees define any location on Earth.
              </p>
            </div>

            {/* Latitude slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-400 font-semibold">Latitude (North–South)</span>
                <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700 tabular-nums">
                  {sliderLat >= 0 ? `+${sliderLat.toFixed(2)}° N` : `${sliderLat.toFixed(2)}° S`}
                </span>
              </div>
              <input
                type="range"
                min="-90"
                max="90"
                step="0.1"
                value={sliderLat}
                onChange={(e) => {
                  setSliderLat(parseFloat(e.target.value));
                  setIsLockedOnMelaka(false);
                }}
                className="w-full accent-rose-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-90° (South Pole)</span>
                <span>0° (Equator)</span>
                <span>+90° (North Pole)</span>
              </div>
            </div>

            {/* Longitude slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold">Longitude (East–West)</span>
                <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700 tabular-nums">
                  {sliderLng >= 0 ? `+${sliderLng.toFixed(2)}° E` : `${sliderLng.toFixed(2)}° W`}
                </span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="0.1"
                value={sliderLng}
                onChange={(e) => {
                  setSliderLng(parseFloat(e.target.value));
                  setIsLockedOnMelaka(false);
                }}
                className="w-full accent-emerald-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-180° (West)</span>
                <span>0° (Prime Meridian)</span>
                <span>+180° (East)</span>
              </div>
            </div>

            {/* Insight Callout */}
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700 text-xs space-y-1">
              <div className="font-semibold text-amber-300">Key GIS Concept:</div>
              <p className="text-slate-300">
                Latitude & Longitude are <strong>angles</strong> measured from the Earth&apos;s center, expressed in <strong>degrees (°)</strong>. They are NOT distances in metres.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: Knowledge Check Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold font-mono">
            03
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Check Your Understanding</h2>
            <p className="text-xs text-slate-400">Answer before continuing to Mission 2.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MISSION_1_QUESTIONS.anglesQuiz.map((q) => {
            const chosen = quizAnswers[q.id];
            const isSubmitted = quizSubmitted[q.id];

            return (
              <div key={q.id} className="p-5 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">{q.question}</h4>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isOptionSelected = chosen === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleQuizSelect(q.id, opt.id)}
                          className={`w-full p-3 rounded-lg text-left text-xs transition-all border cursor-pointer ${
                            isOptionSelected
                              ? opt.correct
                                ? 'bg-emerald-950/60 border-emerald-500 text-white font-medium'
                                : 'bg-rose-950/60 border-rose-500 text-white'
                              : 'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:bg-slate-900 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span>{opt.text}</span>
                            {isOptionSelected && (
                              <span>
                                {opt.correct ? (
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
                </div>

                {isSubmitted && (
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-slate-300">
                    {q.options.find((o) => o.id === chosen)?.expl}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleFinishMission}
            disabled={!allDone}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              allDone
                ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{isCompleted ? 'Mission Complete · Continue to Mission 2' : 'Complete Mission 1 & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
