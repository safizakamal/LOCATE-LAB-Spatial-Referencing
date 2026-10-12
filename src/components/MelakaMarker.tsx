import React from 'react';

interface MelakaMarkerProps {
  label?: string;
  coords?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const MelakaMarker: React.FC<MelakaMarkerProps> = ({
  label = 'Melaka, Malaysia',
  coords = '2.30° N, 102.30° E',
  size = 'md',
  animated = true,
  className = '',
}) => {
  const pinSizeClass = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  return (
    <div className={`inline-flex flex-col items-center group relative select-none ${className}`}>
      {/* Tooltip / Label */}
      {label && (
        <div className="mb-1 px-2.5 py-1 bg-slate-900/95 border border-sky-500/40 text-slate-100 rounded-md shadow-lg shadow-black/40 text-xs backdrop-blur-sm flex flex-col items-center whitespace-nowrap">
          <span className="font-semibold text-amber-300 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {label}
          </span>
          {coords && <span className="text-[10px] text-slate-300 font-mono">{coords}</span>}
        </div>
      )}

      {/* Pin graphic */}
      <div className={`relative ${pinSizeClass} flex items-center justify-center`}>
        {/* Pulsing beacon wave */}
        {animated && (
          <span className="absolute -inset-1 rounded-full bg-rose-500/30 animate-ping opacity-75"></span>
        )}
        
        {/* SVG Marker styled like the infographics: Red tear-drop with white target circle */}
        <svg
          viewBox="0 0 36 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <path
            d="M18 0C8.05887 0 0 8.05887 0 18C0 29.5 15.5 46.5 17.1 47.7C17.6 48.1 18.4 48.1 18.9 47.7C20.5 46.5 36 29.5 36 18C36 8.05887 27.9411 0 18 0Z"
            fill="url(#pinGradient)"
          />
          {/* Inner white circular border */}
          <circle cx="18" cy="18" r="9" fill="white" />
          {/* Inner red core */}
          <circle cx="18" cy="18" r="5" fill="#E11D48" />
          <defs>
            <linearGradient id="pinGradient" x1="0" y1="0" x2="36" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E" />
              <stop offset="1" stopColor="#BE123C" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
