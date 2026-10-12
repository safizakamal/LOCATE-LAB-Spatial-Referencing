import React from 'react';
import { BookOpen, X, CheckCircle2 } from 'lucide-react';

interface GisGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GisGlossaryModal: React.FC<GisGlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const entries = [
    {
      term: 'GCS (Geographic Coordinate System)',
      def: 'Defines locations on curved Earth using angular degrees (latitude and longitude) referenced to a datum (e.g. WGS 84 / EPSG:4326). Units: Degrees (°).',
    },
    {
      term: 'PCS (Projected Coordinate System)',
      def: 'Converts curved Earth to a flat surface using mathematical map projection. Defines locations as X (Easting) and Y (Northing). Units: Metres (m).',
    },
    {
      term: 'Datum',
      def: 'A reference framework connecting coordinates to an Earth mathematical model. WGS 84 is global; GDM2000 is Malaysia’s geocentric datum. Different datums give slightly different positions for identical degree numbers!',
    },
    {
      term: 'UTM Zone 48N (EPSG:32648)',
      def: 'The Projected Coordinate System spanning 102°E–108°E. Melaka is at approx. 102.30°E, meaning Melaka falls in UTM Zone 48N with coordinates in metres.',
    },
    {
      term: 'Assigning CRS vs. Reprojecting',
      def: 'Assigning a CRS only labels the file (without modifying numbers). Reprojecting (Project tool) mathematically recalculates the coordinate numbers into the target system. Never confuse the two!',
    },
    {
      term: 'On-the-Fly (OTF) Transformation',
      def: 'Real-time projection by GIS engines so layers in different CRS (e.g., WGS 84 and UTM 48N) draw on top of each other seamlessly in the map view.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">GIS Quick Reference Field Guide</h3>
              <p className="text-xs text-slate-400">Bachelor of Computer Science — Spatial Data Fundamentals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close reference guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto space-y-4 py-4 pr-1 text-sm">
          {entries.map((item, index) => (
            <div key={index} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="font-semibold text-teal-300 text-sm mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {item.term}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">{item.def}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Got It, Back to Lab
          </button>
        </div>
      </div>
    </div>
  );
};
