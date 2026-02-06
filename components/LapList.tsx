import React from 'react';
import { Lap } from '../types';
import { formatTime } from '../utils';

interface LapListProps {
  laps: Lap[];
}

const LapList: React.FC<LapListProps> = ({ laps }) => {
  if (laps.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center opacity-30 gap-2">
         <div className="w-12 h-1 bg-white/20 rounded-full"></div>
         <div className="w-8 h-1 bg-white/20 rounded-full"></div>
         <span className="text-xs font-light text-white tracking-widest mt-2 uppercase">Ready to start</span>
      </div>
    );
  }

  // Reverse to show newest first
  const reversedLaps = [...laps].reverse();

  return (
    <div className="mt-8 w-full max-w-sm flex flex-col gap-3 max-h-[280px] overflow-y-auto px-4 py-2 mask-gradient">
      {reversedLaps.map((lap, index) => {
        const totalParts = formatTime(lap.time);
        const splitParts = formatTime(lap.split);
        
        const lapNumber = laps.length - index;
        const isNewest = index === 0;

        return (
          <div key={lap.id} className="animate-slide-in-up">
            <div 
              className={`group flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-500 ${
                  isNewest 
                  ? 'bg-gradient-to-r from-white/10 to-white/5 border-white/20 shadow-lg translate-y-0 scale-100' 
                  : 'bg-white/5 border-white/5 opacity-60 scale-95 hover:opacity-100 hover:scale-[0.98]'
              }`}
            >
               <div className="flex items-center gap-4">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${isNewest ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-white/10 text-white/50'}`}>
                      {lapNumber}
                   </div>
               </div>

               <div className="flex flex-col items-end">
                  <span className="font-light text-white text-lg tracking-tight tabular-nums">
                      {totalParts.minutes}:{totalParts.seconds}.<span className="text-sm text-pink-200/80">{totalParts.milliseconds}</span>
                  </span>
                  <span className={`text-[10px] tracking-wider uppercase font-medium ${isNewest ? 'text-indigo-300' : 'text-slate-400'}`}>
                      Split +{splitParts.minutes}:{splitParts.seconds}.{splitParts.milliseconds}
                  </span>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LapList;