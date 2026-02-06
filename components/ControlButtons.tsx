import React from 'react';

interface ControlButtonsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  onLap,
}) => {
  return (
    <div className="flex items-center justify-center gap-12 w-full max-w-md mt-4 z-20">
      
      {/* Secondary Button (Lap / Reset) */}
      <button
        onClick={isRunning ? onLap : onReset}
        className="group relative w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300 backdrop-blur-md shadow-lg"
        aria-label={isRunning ? "Lap" : "Reset"}
      >
        <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity"></div>
        <span className="text-xs font-semibold tracking-wider text-indigo-200 group-hover:text-white z-10 uppercase">
          {isRunning ? 'Lap' : 'Reset'}
        </span>
      </button>

      {/* Primary Button (Start / Pause) */}
      <button
        onClick={isRunning ? onPause : onStart}
        className={`group relative w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden ${
            isRunning 
            ? 'bg-gradient-to-tr from-rose-500/20 to-orange-500/20 border border-rose-500/30' 
            : 'bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
        }`}
      >
         {/* Inner Glow Pulse */}
         <div className={`absolute inset-0 opacity-40 blur-xl transition-colors duration-500 ${isRunning ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
         
         <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
             {isRunning ? (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-rose-200 drop-shadow-md">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                 </svg>
             ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-indigo-200 drop-shadow-md ml-1">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
             )}
         </div>
         
         {/* Hover Rim Light */}
         <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/20 group-hover:ring-white/40 transition-all"></div>
      </button>

      {/* Tertiary/Dummy Button for Balance */}
      <button className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 opacity-40 cursor-default">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
         </svg>
      </button>
    </div>
  );
};

export default ControlButtons;