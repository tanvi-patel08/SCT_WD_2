import React, { useState, useEffect, useRef } from 'react';

const TimerView: React.FC = () => {
  // Mode: 'setup' | 'running' | 'paused' | 'finished'
  const [mode, setMode] = useState<'setup' | 'running' | 'paused' | 'finished'>('setup');
  
  // Input State
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("05");
  const [seconds, setSeconds] = useState<string>("00");

  // Timer State
  const [totalTime, setTotalTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const endTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // Helper to format input
  const formatInput = (val: string, max: number) => {
    let num = parseInt(val.replace(/\D/g, ''));
    if (isNaN(num)) num = 0;
    if (num > max) num = max;
    return num.toString().padStart(2, '0');
  };

  const handleBlur = (setter: React.Dispatch<React.SetStateAction<string>>, val: string, max: number) => {
    setter(formatInput(val, max));
  };

  const startTimer = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const duration = (h * 3600 + m * 60 + s) * 1000;

    if (duration === 0) return;

    setTotalTime(duration);
    setTimeLeft(duration);
    setMode('running');
    
    endTimeRef.current = Date.now() + duration;
    tick();
  };

  const tick = () => {
    const now = Date.now();
    const remaining = Math.max(0, endTimeRef.current - now);
    setTimeLeft(remaining);

    if (remaining <= 0) {
      setMode('finished');
      cancelAnimationFrame(rafRef.current);
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const pauseTimer = () => {
    cancelAnimationFrame(rafRef.current);
    setMode('paused');
  };

  const resumeTimer = () => {
    // Calculate new end time based on remaining time
    endTimeRef.current = Date.now() + timeLeft;
    setMode('running');
    tick();
  };

  const resetTimer = () => {
    cancelAnimationFrame(rafRef.current);
    setMode('setup');
    setTimeLeft(0);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Display Logic
  const displayHours = Math.floor(timeLeft / 3600000).toString().padStart(2, '0');
  const displayMinutes = Math.floor((timeLeft % 3600000) / 60000).toString().padStart(2, '0');
  const displaySeconds = Math.floor((timeLeft % 60000) / 1000).toString().padStart(2, '0');

  // SVG Config
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (timeLeft / totalTime) : 0;
  const dashOffset = circumference - (progress * circumference);

  return (
    <div className="flex-1 w-full max-w-xl flex flex-col items-center justify-center pt-4 pb-20 px-4 animate-slide-in-up">
      
      {mode === 'setup' ? (
        <div className="flex flex-col items-center w-full max-w-sm">
           <h2 className="text-sm font-medium text-indigo-200/50 uppercase tracking-[0.3em] mb-8">Set Duration</h2>
           
           {/* Time Inputs */}
           <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex flex-col items-center gap-2">
                 <input 
                    type="text" 
                    inputMode="numeric"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    onBlur={() => handleBlur(setHours, hours, 99)}
                    className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl text-center text-5xl font-light text-white focus:outline-none focus:bg-white/10 focus:border-indigo-500 transition-all shadow-lg"
                 />
                 <span className="text-[10px] uppercase tracking-wider text-white/40">Hours</span>
              </div>
              <span className="text-4xl font-light text-white/20 -mt-6">:</span>
              <div className="flex flex-col items-center gap-2">
                 <input 
                    type="text" 
                    inputMode="numeric"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    onBlur={() => handleBlur(setMinutes, minutes, 59)}
                    className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl text-center text-5xl font-light text-white focus:outline-none focus:bg-white/10 focus:border-indigo-500 transition-all shadow-lg"
                 />
                 <span className="text-[10px] uppercase tracking-wider text-white/40">Mins</span>
              </div>
              <span className="text-4xl font-light text-white/20 -mt-6">:</span>
              <div className="flex flex-col items-center gap-2">
                 <input 
                    type="text" 
                    inputMode="numeric"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    onBlur={() => handleBlur(setSeconds, seconds, 59)}
                    className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl text-center text-5xl font-light text-white focus:outline-none focus:bg-white/10 focus:border-indigo-500 transition-all shadow-lg"
                 />
                 <span className="text-[10px] uppercase tracking-wider text-white/40">Secs</span>
              </div>
           </div>

           {/* Start Button */}
           <button 
             onClick={startTimer}
             className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-110 transition-transform duration-300 group"
           >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white group-hover:drop-shadow-md">
                 <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
           </button>
        </div>
      ) : (
        <div className="flex flex-col items-center relative">
            {/* SVG Ring Container */}
            <div className={`relative w-[320px] h-[320px] flex items-center justify-center ${mode === 'finished' ? 'animate-pulse' : ''}`}>
               {/* Background Glow */}
               <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full"></div>
               
               <svg
                 height="320"
                 width="320"
                 className="transform -rotate-90 drop-shadow-2xl"
               >
                 <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                 </defs>
                 
                 {/* Background Track */}
                 <circle
                   stroke="rgba(255,255,255,0.05)"
                   strokeWidth="8"
                   fill="transparent"
                   r={radius}
                   cx="160"
                   cy="160"
                 />
                 
                 {/* Progress Ring */}
                 <circle
                   stroke="url(#timerGradient)"
                   strokeWidth="8"
                   strokeLinecap="round"
                   fill="transparent"
                   r={radius}
                   cx="160"
                   cy="160"
                   style={{
                     strokeDasharray: circumference,
                     strokeDashoffset: dashOffset,
                     transition: 'stroke-dashoffset 0.1s linear'
                   }}
                 />
               </svg>

               {/* Digital Time Display */}
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-6xl font-light tabular-nums tracking-tight ${mode === 'finished' ? 'text-red-400' : 'text-white'}`}>
                      {mode === 'finished' ? "00:00:00" : `${displayHours}:${displayMinutes}:${displaySeconds}`}
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/40 mt-2">
                     {mode === 'finished' ? 'Time Up' : 'Remaining'}
                  </span>
               </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 mt-12">
               <button 
                  onClick={resetTimer}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 text-sm font-medium tracking-wide transition-all"
               >
                  Cancel
               </button>

               {mode !== 'finished' && (
                   <button 
                     onClick={mode === 'running' ? pauseTimer : resumeTimer}
                     className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-md"
                   >
                     {mode === 'running' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                           <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                        </svg>
                     ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white ml-1">
                           <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                     )}
                   </button>
               )}
            </div>
        </div>
      )}
    </div>
  );
};

export default TimerView;