import React, { useState } from 'react';
import { MelakaMarker } from './MelakaMarker';
import { CheckCircle2, AlertCircle, ArrowRight, Eye, Info, Sparkles, Layers } from 'lucide-react';

interface Mission2Props {
  onComplete: (scoreGain: number) => void;
  onNext: () => void;
  isCompleted: boolean;
}

export const Mission2_EarthReference: React.FC<Mission2Props> = ({
  onComplete,
  onNext,
  isCompleted,
}) => {
  // Model selector: 'real' | 'sphere' | 'wgs84' | 'gdm2000'
  const [activeModel, setActiveModel] = useState<'real' | 'sphere' | 'wgs84' | 'gdm2000'>('wgs84');

  // Datum shift toggle in Melaka
  const [activeDatum, setActiveDatum] = useState<'wgs84' | 'gdm2000'>('wgs84');

  // Hotspots inspected
  const [visitedHotspots, setVisitedHotspots] = useState<string[]>([]);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>('hs_datum');

  // Mini quiz state
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const hotspots = [
    {
      id: 'hs_coords',
      title: 'Angular Coordinates',
      subtitle: 'Latitude & Longitude in Degrees',
      content: 'Measured in degrees (°), not metres! Latitude from Equator (0° to 90° N/S), Longitude from Prime Meridian (0° to 180° E/W). For Melaka: 2.30° N, 102.30° E.',
      x: 35,
      y: 28,
    },
    {
      id: 'hs_datum',
      title: 'Geodetic Datum',
      subtitle: 'The Reference Framework',
      content: 'A datum defines the position of the ellipsoid relative to the center of the Earth. It anchors coordinate values to real physical ground features.',
      x: 50,
      y: 50,
    },
    {
      id: 'hs_wgs84',
      title: 'WGS 84 (Global Standard)',
      subtitle: 'EPSG:4326',
      content: 'World Geodetic System 1984. Developed by the US Department of Defense, used globally by GPS/GNSS satellites, Google Maps, OpenStreetMap, and international spatial layers.',
      x: 65,
      y: 35,
    },
    {
      id: 'hs_gdm2000',
      title: 'GDM2000 (Malaysian Datum)',
      subtitle: 'Geocentric Datum of Malaysia',
      content: 'Adopted by JUPEM (Department of Survey and Mapping Malaysia). Aligned with international ITRF frames for centimeter-accurate cadastral and engineering surveys across Malaysia.',
      x: 78,
      y: 65,
    },
  ];

  const handleHotspotClick = (id: string) => {
    setActiveHotspotId(id);
    if (!visitedHotspots.includes(id)) {
      setVisitedHotspots([...visitedHotspots, id]);
    }
  };

  const handleQuizOption = (optId: string) => {
    setQuizAnswer(optId);
    setQuizSubmitted(true);
  };

  const canContinue = visitedHotspots.length >= 2 && quizSubmitted;

  const handleFinish = () => {
    let score = 0;
    if (visitedHotspots.length === 4) score += 15;
    else if (visitedHotspots.length >= 2) score += 10;
    if (quizAnswer === 'opt_different') score += 15;
    onComplete(score);
    onNext();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Mission Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>MISSION 02 · SOURCES 4–5</span>
              <span>·</span>
              <span className="text-slate-400">BUILD THE EARTH REFERENCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Using a Model of the Earth
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              The Earth is not a smooth, perfect sphere—it is an irregular shape (geoid). 
              To assign coordinates reliably, we need a mathematical model called an <strong>ellipsoid</strong> and a <strong>datum</strong>.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 bg-slate-800/80 border border-emerald-400/30 rounded-xl">
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Core Standard</span>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">WGS 84 (EPSG:4326)</div>
              <span className="text-[11px] text-teal-300">Geographic Coordinate System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: Earth Models Progression */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold font-mono">
            01
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Compare Earth Models & Datums</h2>
            <p className="text-xs text-slate-400">Select each model below to examine how geodesists approximate the Earth.</p>
          </div>
        </div>

        {/* Model cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              id: 'real',
              label: 'Real Earth',
              desc: 'Irregular Geoid (lumpy surface, mountains, ocean trenches). Too complex for simple math.',
              color: 'from-amber-500/20 to-amber-950/40 border-amber-500/40',
              badge: 'Physical Shape',
            },
            {
              id: 'sphere',
              label: 'Spherical Model',
              desc: 'Simplified sphere. Easy formulas, but inaccurate over large regional distances.',
              color: 'from-slate-500/20 to-slate-950/40 border-slate-500/40',
              badge: 'Simplified',
            },
            {
              id: 'wgs84',
              label: 'WGS 84 (Global Datum)',
              desc: 'Global reference ellipsoid centered at Earth center of mass. Standard for GPS/GNSS.',
              color: 'from-indigo-500/20 to-indigo-950/40 border-indigo-500/40',
              badge: 'Global Standard',
            },
            {
              id: 'gdm2000',
              label: 'GDM2000 (Malaysian)',
              desc: 'Geocentric Datum of Malaysia. Tailored for Peninsular Malaysia, Sabah & Sarawak accuracy.',
              color: 'from-emerald-500/20 to-emerald-950/40 border-emerald-500/40',
              badge: 'Malaysia Standard',
            },
          ].map((m) => {
            const isSelected = activeModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModel(m.id as any)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `bg-gradient-to-b ${m.color} ring-2 ring-emerald-400/50 shadow-lg`
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    {m.badge}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white">{m.label}</h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{m.desc}</p>
                </div>
                <div className="mt-3 text-[11px] font-mono flex items-center gap-1 text-teal-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Active View' : 'Inspect'}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visualizer stage */}
        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[220px]">
          <div className="text-xs font-mono text-slate-400 mb-4">
            Cross-Section Representation: <span className="text-emerald-400 font-bold uppercase">{activeModel}</span>
          </div>

          <div className="relative w-64 h-48 flex items-center justify-center">
            {/* Base grid */}
            <div className="absolute inset-0 border border-dashed border-slate-800 rounded-full opacity-40"></div>

            {/* Earth cross section shape */}
            {activeModel === 'real' && (
              <svg viewBox="0 0 200 200" className="w-44 h-44 animate-in zoom-in-95 duration-200">
                <path
                  d="M100 15 Q135 18 165 45 Q190 85 185 115 Q170 165 130 185 Q75 195 40 160 Q10 120 20 75 Q35 30 100 15 Z"
                  fill="#047857"
                  opacity="0.8"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <circle cx="100" cy="100" r="3" fill="#fbbf24" />
                <text x="106" y="104" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono">Center of Mass</text>
              </svg>
            )}

            {activeModel === 'sphere' && (
              <svg viewBox="0 0 200 200" className="w-44 h-44 animate-in zoom-in-95 duration-200">
                <circle cx="100" cy="100" r="75" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                <line x1="25" y1="100" x2="175" y2="100" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="100" y1="25" x2="100" y2="175" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
            )}

            {activeModel === 'wgs84' && (
              <svg viewBox="0 0 200 200" className="w-44 h-44 animate-in zoom-in-95 duration-200">
                {/* Slightly flattened oblate spheroid: semi-major axis wider at equator */}
                <ellipse cx="100" cy="100" rx="84" ry="76" fill="#4338ca" opacity="0.6" stroke="#818cf8" strokeWidth="2" />
                <line x1="16" y1="100" x2="184" y2="100" stroke="#f43f5e" strokeWidth="1.5" />
                <text x="110" y="94" fill="#f43f5e" fontSize="9" fontFamily="JetBrains Mono">a = 6,378,137 m (Equator)</text>
                <line x1="100" y1="24" x2="100" y2="176" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="105" y="40" fill="#38bdf8" fontSize="9" fontFamily="JetBrains Mono">b = 6,356,752 m (Poles)</text>
              </svg>
            )}

            {activeModel === 'gdm2000' && (
              <svg viewBox="0 0 200 200" className="w-44 h-44 animate-in zoom-in-95 duration-200">
                <ellipse cx="100" cy="100" rx="84" ry="76" fill="#065f46" opacity="0.6" stroke="#34d399" strokeWidth="2" />
                <ellipse cx="102" cy="99" rx="83.8" ry="76.1" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="50" y="105" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono">Optimized Local Fit (Malaysia)</text>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Part 2: Interactive Datum Shift Simulator in Melaka */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold font-mono">
              02
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Why Datum Matters: The Melaka Datum Shift</h2>
              <p className="text-xs text-slate-400">
                Watch what happens to the exact same coordinates (2.30°, 102.30°) under different datums!
              </p>
            </div>
          </div>

          {/* Datum toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setActiveDatum('wgs84')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeDatum === 'wgs84'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              WGS 84 (Global)
            </button>
            <button
              onClick={() => setActiveDatum('gdm2000')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeDatum === 'gdm2000'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GDM2000 (Malaysia)
            </button>
          </div>
        </div>

        {/* Split Sandbox: Visual Map + Datum Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Map canvas */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 relative min-h-[300px] flex flex-col justify-between overflow-hidden">
            {/* Satellite style aerial backdrop pattern */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/60 to-emerald-950/20 pointer-events-none" />

            {/* Simulated Melaka coast & river geometry */}
            <svg viewBox="0 0 500 300" className="w-full h-full max-h-[280px]">
              {/* Strait of Melaka ocean */}
              <path d="M0 160 Q150 180 320 240 L320 300 L0 300 Z" fill="#0369a1" opacity="0.4" />
              {/* Coastline */}
              <path d="M0 160 Q150 180 320 240 L500 270" stroke="#38bdf8" strokeWidth="2" fill="none" />
              {/* Melaka River */}
              <path d="M220 185 Q260 140 280 80 Q300 40 330 0" stroke="#38bdf8" strokeWidth="2.5" fill="none" opacity="0.7" />
              {/* City blocks */}
              <rect x="180" y="110" width="40" height="30" fill="#334155" opacity="0.5" rx="3" />
              <rect x="230" y="100" width="50" height="35" fill="#334155" opacity="0.5" rx="3" />
              <rect x="190" y="150" width="35" height="25" fill="#334155" opacity="0.5" rx="3" />
              <text x="20" y="280" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">Selat Melaka (Straits of Malacca)</text>
              <text x="240" y="50" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">Sungai Melaka</text>
            </svg>

            {/* Melaka Pin Placement with Dynamic Datum Offset */}
            <div
              className="absolute transition-all duration-500 ease-out pointer-events-none"
              style={{
                left: activeDatum === 'wgs84' ? '46%' : '52%',
                top: activeDatum === 'wgs84' ? '45%' : '41%',
                transform: 'translate(-50%, -100%)',
              }}
            >
              <MelakaMarker
                label={activeDatum === 'wgs84' ? 'Melaka in WGS 84' : 'Melaka in GDM2000'}
                coords="2.30° N, 102.30° E"
                size="md"
              />
            </div>

            {/* Static ghost pin of the other datum for direct visual comparison */}
            <div
              className="absolute pointer-events-none opacity-40"
              style={{
                left: activeDatum === 'wgs84' ? '52%' : '46%',
                top: activeDatum === 'wgs84' ? '41%' : '45%',
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="w-4 h-4 rounded-full border-2 border-dashed border-amber-400 bg-amber-400/20" />
            </div>

            {/* Legend */}
            <div className="z-10 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Active Pin: {activeDatum.toUpperCase()}
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full border border-dashed border-amber-400"></span>
                ~18m Datum Offset
              </span>
            </div>
          </div>

          {/* Telemetry card */}
          <div className="lg:col-span-5 bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-mono text-teal-400 uppercase tracking-wider mb-1">
                Geodetic Observation
              </div>
              <h3 className="text-base font-bold text-white">Same Numbers, Different Spot!</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Notice that both markers have the EXACT identical numerical coordinates: <code className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono">(2.30° N, 102.30° E)</code>. 
                Yet on the actual ground in Melaka, they point to locations offset by approx. <strong>18 metres</strong>!
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-700/60">
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-700 text-xs">
                <div className="font-semibold text-sky-400">Why does this occur?</div>
                <div className="text-slate-300 mt-1">
                  Because a <strong>datum</strong> defines where the center of the reference ellipsoid is anchored. Different datums calculate slightly different surface positions.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                <strong>Computer Science Takeaway:</strong> In your software databases, NEVER store raw coordinates without recording the Datum / EPSG identifier!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: GCS Hotspot Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center text-sm font-bold font-mono">
            03
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Explore GCS Hotspots</h2>
            <p className="text-xs text-slate-400">
              Click the hotspots below to master the core elements of a Geographic Coordinate System.
            </p>
          </div>
        </div>

        {/* Hotspots clickable pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {hotspots.map((hs) => {
            const isVisited = visitedHotspots.includes(hs.id);
            const isActive = activeHotspotId === hs.id;
            return (
              <button
                key={hs.id}
                onClick={() => handleHotspotClick(hs.id)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-950/60 border-teal-400 text-white shadow-md'
                    : isVisited
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-teal-400">
                    {isVisited ? 'Explored' : 'Hotspot'}
                  </span>
                  {isVisited && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="font-semibold text-xs sm:text-sm text-slate-100">{hs.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Hotspot Display Panel */}
        {activeHotspotId && (
          <div className="p-5 rounded-xl bg-slate-800/70 border border-teal-500/30 animate-in fade-in duration-200">
            {(() => {
              const hs = hotspots.find((h) => h.id === activeHotspotId);
              if (!hs) return null;
              return (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                    <h4 className="text-base font-bold text-white">{hs.title}</h4>
                    <span className="text-xs font-mono text-teal-300">({hs.subtitle})</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-4">{hs.content}</p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Check question */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h4 className="text-sm font-semibold text-white">
            Quick Check: If two datasets have the same latitude and longitude numbers (2.30, 102.30), but one is WGS 84 and the other is GDM2000, what happens?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'opt_same',
                text: 'They will land on the exact identical millimeter on the ground.',
                correct: false,
                expl: 'Incorrect! Different datums define different reference ellipsoids.',
              },
              {
                id: 'opt_different',
                text: 'They will refer to slightly different physical positions on the ground (~18m offset).',
                correct: true,
                expl: 'Correct! Because they are referenced to different models of the Earth.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleQuizOption(opt.id)}
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
              {quizAnswer === 'opt_different'
                ? 'Excellent understanding! A datum transformation is required when combining datasets created with different datums.'
                : 'Remember: A datum ties coordinate numbers to the physical shape of the Earth. Different datums = slightly different ground spots.'}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleFinish}
            disabled={!canContinue}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              canContinue
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>{isCompleted ? 'Mission Complete · Continue to Mission 3' : 'Complete Mission 2 & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
