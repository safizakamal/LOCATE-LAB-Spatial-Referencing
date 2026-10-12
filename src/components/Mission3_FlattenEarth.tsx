import React, { useState } from 'react';
import { MelakaMarker } from './MelakaMarker';
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles, RefreshCw, Scissors, Grid } from 'lucide-react';

interface Mission3Props {
  onComplete: (scoreGain: number) => void;
  onNext: () => void;
  isCompleted: boolean;
}

export const Mission3_FlattenEarth: React.FC<Mission3Props> = ({
  onComplete,
  onNext,
  isCompleted,
}) => {
  // Slider: 0 = 3D Curved Globe, 50 = Peel projection unfolding, 100 = 2D Flat Cartesian Map with X/Y
  const [flattenProgress, setFlattenProgress] = useState<number>(30);

  // Active projection family: 'cylindrical' | 'conic' | 'azimuthal' | 'transverse'
  const [activeFamily, setActiveFamily] = useState<'cylindrical' | 'conic' | 'azimuthal' | 'transverse'>('transverse');

  // Distortion tester inspection
  const [inspectedDistortion, setInspectedDistortion] = useState<'shape' | 'area' | 'distance' | 'direction' | null>(null);
  const [distortionsChecked, setDistortionsChecked] = useState<string[]>([]);

  // Mini quiz
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleCheckDistortion = (type: 'shape' | 'area' | 'distance' | 'direction') => {
    setInspectedDistortion(type);
    if (!distortionsChecked.includes(type)) {
      setDistortionsChecked([...distortionsChecked, type]);
    }
  };

  const handleQuiz = (optId: string) => {
    setQuizAnswer(optId);
    setQuizSubmitted(true);
  };

  const canFinish = flattenProgress >= 80 && distortionsChecked.length >= 2 && quizSubmitted;

  const handleFinish = () => {
    let score = 0;
    if (flattenProgress === 100) score += 10;
    if (distortionsChecked.length >= 3) score += 10;
    if (quizAnswer === 'opt_pcs_metres') score += 10;
    onComplete(score);
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/80 border border-amber-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>MISSION 03 · SOURCES 6–7</span>
              <span>·</span>
              <span className="text-slate-400">FLATTEN THE EARTH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Projections & Unavoidable Distortion
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              The Earth is a curved 3D object, but maps, computer screens, and campus blueprints are flat 2D surfaces. 
              How do we convert curved angles into flat linear metres (X/Y)?
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 bg-slate-800/80 border border-amber-400/30 rounded-xl">
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">UTeM Melaka in PCS</span>
              <div className="text-lg font-mono font-bold text-amber-400 mt-0.5">X: 863,320 m</div>
              <div className="text-lg font-mono font-bold text-amber-400">Y: 249,740 m</div>
              <span className="text-[10px] text-teal-300">Units: Metres (m)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Interactive Orange Peel & Projection Morph Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold font-mono">
              01
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">The Orange-Peel Dilemma</h2>
              <p className="text-xs text-slate-400">
                Drag the slider to peel and flatten the curved globe into a 2D Cartesian X/Y coordinate grid.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFlattenProgress(100)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Fully Flatten to X/Y</span>
            </button>
            <button
              onClick={() => setFlattenProgress(0)}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reset to 3D Globe"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Zone Sandbox: Stage & Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Animated Canvas */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 relative min-h-[340px] flex flex-col justify-between items-center overflow-hidden">
            {/* Top State Label */}
            <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>
                  {flattenProgress < 25
                    ? 'State: 3D Curved Globe (Latitude/Longitude in Degrees)'
                    : flattenProgress < 75
                    ? 'State: Projecting & Peeling Surface (Orange Peel Effect)'
                    : 'State: 2D Projected Coordinate System (X & Y in Metres)'}
                </span>
              </span>
              <span className="text-amber-400 font-bold tabular-nums">{flattenProgress}% Flattened</span>
            </div>

            {/* Interactive Morph SVG */}
            <div className="my-auto relative w-full max-w-[420px] h-[220px] flex items-center justify-center">
              <svg viewBox="0 0 400 200" className="w-full h-full select-none">
                <defs>
                  <linearGradient id="peelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>

                {/* Background Grid that fades in as flattenProgress rises */}
                <g opacity={flattenProgress / 100}>
                  {/* Cartesian X/Y Grid */}
                  <rect x="20" y="20" width="360" height="160" fill="#090d16" stroke="#334155" strokeWidth="1" />
                  {/* Grid vertical lines (Eastings) */}
                  {[60, 100, 140, 180, 220, 260, 300, 340].map((x) => (
                    <line key={x} x1={x} y1="20" x2={x} y2="180" stroke="#1e293b" strokeWidth="1" />
                  ))}
                  {/* Grid horizontal lines (Northings) */}
                  {[50, 80, 110, 140, 170].map((y) => (
                    <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="#1e293b" strokeWidth="1" />
                  ))}

                  {/* Red Cartesian Axes */}
                  <line x1="20" y1="180" x2="380" y2="180" stroke="#f43f5e" strokeWidth="2.5" />
                  <text x="330" y="172" fill="#f43f5e" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    X (Easting)
                  </text>
                  <line x1="20" y1="180" x2="20" y2="20" stroke="#10b981" strokeWidth="2.5" />
                  <text x="26" y="32" fill="#10b981" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    Y (Northing)
                  </text>
                </g>

                {/* Orange Peel Gores: Morph between curved circle arcs and flattened gore petals */}
                {/* As flattenProgress goes from 0 to 100, petals spread horizontally */}
                {(() => {
                  const t = flattenProgress / 100;
                  const spread = t * 14;

                  return (
                    <g transform={`translate(${200 - t * 40}, 100)`}>
                      {/* Gore Petal 1 */}
                      <path
                        d={`M${-60 - spread * 2} -70 Q${-45 - spread} 0 ${-60 - spread * 2} 70 Q${-75 - spread * 3} 0 ${-60 - spread * 2} -70 Z`}
                        fill="url(#peelGradient)"
                        opacity="0.85"
                        stroke="#b45309"
                        strokeWidth="1.2"
                      />
                      {/* Gore Petal 2 */}
                      <path
                        d={`M${-20 - spread} -75 Q${-15 - spread * 0.5} 0 ${-20 - spread} 75 Q${-35 - spread * 1.5} 0 ${-20 - spread} -75 Z`}
                        fill="url(#peelGradient)"
                        opacity="0.85"
                        stroke="#b45309"
                        strokeWidth="1.2"
                      />
                      {/* Gore Petal 3 (Center - Melaka focus) */}
                      <path
                        d="M20 -80 Q30 0 20 80 Q0 0 20 -80 Z"
                        fill="#059669"
                        opacity="0.85"
                        stroke="#047857"
                        strokeWidth="1.5"
                      />
                      {/* Gore Petal 4 */}
                      <path
                        d={`M${60 + spread} -75 Q${75 + spread * 1.5} 0 ${60 + spread} 75 Q${50 + spread * 0.5} 0 ${60 + spread} -75 Z`}
                        fill="url(#peelGradient)"
                        opacity="0.85"
                        stroke="#b45309"
                        strokeWidth="1.2"
                      />
                      {/* Gore Petal 5 */}
                      <path
                        d={`M${100 + spread * 2} -70 Q${120 + spread * 3} 0 ${100 + spread * 2} 70 Q${90 + spread} 0 ${100 + spread * 2} -70 Z`}
                        fill="url(#peelGradient)"
                        opacity="0.85"
                        stroke="#b45309"
                        strokeWidth="1.2"
                      />
                    </g>
                  );
                })()}

                {/* Tear lines indicating distortion */}
                {flattenProgress > 20 && flattenProgress < 85 && (
                  <g stroke="#f87171" strokeWidth="1" strokeDasharray="3 2" opacity="0.8">
                    <line x1="120" y1="40" x2="135" y2="70" />
                    <line x1="260" y1="40" x2="250" y2="70" />
                    <text x="140" y="30" fill="#f87171" fontSize="9" fontFamily="JetBrains Mono">
                      Tearing / Stretching!
                    </text>
                  </g>
                )}
              </svg>

              {/* Pin on the target zone */}
              <div
                className="absolute pointer-events-none transition-all duration-300"
                style={{
                  left: `${55 + (flattenProgress / 100) * 8}%`,
                  top: `${48 - (flattenProgress / 100) * 6}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <MelakaMarker
                  label={flattenProgress > 70 ? 'UTeM Melaka (PCS)' : 'Melaka (Globe)'}
                  coords={
                    flattenProgress > 70
                      ? 'X: 863,320 m · Y: 249,740 m'
                      : '2.30° N, 102.30° E'
                  }
                  size="sm"
                />
              </div>
            </div>

            {/* Slider Bar */}
            <div className="w-full space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Curved 3D Globe</span>
                <span className="text-amber-400 font-semibold">Flattening Transition</span>
                <span className="text-emerald-400">Flat 2D Cartesian Grid</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={flattenProgress}
                onChange={(e) => setFlattenProgress(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Control Deck & Concept Cards */}
          <div className="lg:col-span-5 bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                <Scissors className="w-3.5 h-3.5" />
                <span>The Orange Peel Rule</span>
              </div>
              <h3 className="text-base font-bold text-white">Why We Need Map Projections</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Try peeling an orange and flattening its peel on a table. It cannot lie flat without <strong>stretching, tearing, or distorting</strong>!
                A <strong>map projection</strong> is the systematic mathematical equation used to flatten that 3D curved surface.
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700/80 space-y-2">
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-emerald-400" />
                <span>From Angles to Metres (GCS vs PCS)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In a <strong>Geographic Coordinate System (GCS)</strong>, coordinates are angles (degrees). 
                Once projected into a <strong>Projected Coordinate System (PCS)</strong>, coordinates become linear measurements (metres):
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-xs text-amber-300 flex justify-between items-center">
                <span>Easting (X): 863,320 m</span>
                <span>Northing (Y): 249,740 m</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              Formula: <span className="text-teal-300 font-semibold">PCS = GCS + Map Projection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Four Unavoidable Distortions Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm font-bold font-mono">
            02
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Distortion is Unavoidable!</h2>
            <p className="text-xs text-slate-400">
              When flattening a curved surface, at least one spatial property MUST be distorted. Click to inspect:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              id: 'shape' as const,
              label: 'Shape (Conformal)',
              desc: 'Preserves local angles and building contours, but exaggerates areas towards poles.',
              color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
            },
            {
              id: 'area' as const,
              label: 'Area (Equivalent)',
              desc: 'Preserves true square metres/hectares of land, but squishes or shears geometric shapes.',
              color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
            },
            {
              id: 'distance' as const,
              label: 'Distance (Equidistant)',
              desc: 'Preserves scale along specific lines/meridians, but distorts elsewhere.',
              color: 'text-sky-400 border-sky-500/40 bg-sky-950/20',
            },
            {
              id: 'direction' as const,
              label: 'Direction (Azimuthal)',
              desc: 'Preserves true compass bearings from a central point, suitable for navigation/radar.',
              color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
            },
          ].map((d) => {
            const isChecked = distortionsChecked.includes(d.id);
            const isInspected = inspectedDistortion === d.id;

            return (
              <button
                key={d.id}
                onClick={() => handleCheckDistortion(d.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isInspected
                    ? 'ring-2 ring-amber-400 bg-slate-800'
                    : isChecked
                    ? 'bg-slate-800/80 border-slate-700'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Property</span>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <h4 className="font-bold text-sm text-white">{d.label}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{d.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 3: Projection Families (Cylindrical, Conic, Azimuthal, Transverse Mercator) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold font-mono">
            03
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Different Projections for Different Purposes</h2>
            <p className="text-xs text-slate-400">
              Geodesists choose projection surfaces based on latitude and purpose.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              id: 'cylindrical' as const,
              title: 'Cylindrical',
              bestFor: 'Global Mapping',
              note: 'Cylinder wraps around equator. Great for world maps, high polar distortion.',
            },
            {
              id: 'conic' as const,
              title: 'Conic',
              bestFor: 'Mid-Latitude Regions',
              note: 'Cone placed over temperate zones (e.g. USA, Europe). Good for east-west spans.',
            },
            {
              id: 'azimuthal' as const,
              title: 'Azimuthal (Planar)',
              bestFor: 'Polar Regions',
              note: 'Flat plane touches pole. Ideal for Arctic & Antarctic mapping.',
            },
            {
              id: 'transverse' as const,
              title: 'Transverse Mercator',
              bestFor: 'UTM & Malaysia',
              note: 'Cylinder turned 90° sideways! Aligns along north-south strips (UTM zones). Minimal local distortion!',
            },
          ].map((proj) => {
            const isSelected = activeFamily === proj.id;
            return (
              <button
                key={proj.id}
                onClick={() => setActiveFamily(proj.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-950/50 border-teal-400 text-white shadow-md ring-1 ring-teal-400/50'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] font-mono text-teal-400 uppercase tracking-wider mb-1">
                  {proj.bestFor}
                </div>
                <h4 className="font-bold text-sm sm:text-base text-white">{proj.title}</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{proj.note}</p>
              </button>
            );
          })}
        </div>

        {/* Knowledge check */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h4 className="text-sm font-semibold text-white">
            Quick Check: If you need to measure the distance in metres between buildings on a university campus in Melaka, which system must you use?
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'opt_gcs_deg',
                text: 'Geographic Coordinate System (GCS) in angular degrees',
                correct: false,
                expl: 'Degrees are angles! 1 degree of longitude varies from 111 km at the Equator down to 0 km at the poles. You cannot measure metres directly in degrees.',
              },
              {
                id: 'opt_pcs_metres',
                text: 'Projected Coordinate System (PCS) in linear metres',
                correct: true,
                expl: 'Correct! A PCS provides Cartesian X (Easting) and Y (Northing) coordinates in linear metres, enabling accurate Pythagorean distance and polygon area calculations.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleQuiz(opt.id)}
                className={`p-3.5 rounded-xl text-left text-xs border transition-all cursor-pointer ${
                  quizAnswer === opt.id
                    ? opt.correct
                      ? 'bg-emerald-950/60 border-emerald-500 text-white font-medium'
                      : 'bg-rose-950/60 border-rose-500 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span>{opt.text}</span>
                  {quizAnswer === opt.id && (
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
            ))}
          </div>

          {quizSubmitted && (
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 text-xs text-slate-300">
              {quizAnswer === 'opt_pcs_metres'
                ? 'Spot on! PCS converts the curved globe into a metric grid where Euclidean geometry (d = √(Δx² + Δy²)) works reliably.'
                : 'Remember: GCS uses angles (°); PCS uses linear metric units (m). Measurements need a PCS.'}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleFinish}
            disabled={!canFinish}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              canFinish
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{isCompleted ? 'Mission Complete · Continue to Mission 4' : 'Complete Mission 3 & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
