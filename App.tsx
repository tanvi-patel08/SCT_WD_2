import React, { useState, useRef, useEffect, useCallback } from 'react';
import StopwatchView from './components/StopwatchView';
import AlarmView from './components/AlarmView';
import TimerView from './components/TimerView';
import WorldClockView from './components/WorldClockView';
import { Lap } from './types';

type ViewType = 'stopwatch' | 'alarm' | 'world' | 'timer';

const App: React.FC = () => {
  // Navigation State
  const [activeView, setActiveView] = useState<ViewType>('stopwatch');

  // Stopwatch State
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  const startTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  const animate = useCallback(() => {
    const now = Date.now();
    setTime(now - startTimeRef.current + previousTimeRef.current);
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
    requestRef.current = requestAnimationFrame(animate);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    previousTimeRef.current += Date.now() - startTimeRef.current;
  };

  const handleReset = () => {
    // 1. Stop the clock immediately
    setIsRunning(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    // 2. Trigger the visual reset animation
    setIsResetting(true);

    // 3. Reset data halfway through animation (when opacity is lowest)
    setTimeout(() => {
      setTime(0);
      previousTimeRef.current = 0;
      setLaps([]);
    }, 300); // 300ms matches halfway point of 0.6s animation

    // 4. End animation state
    setTimeout(() => {
      setIsResetting(false);
    }, 600);
  };

  const handleLap = () => {
    const currentTotalTime = time;
    const previousLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
    const splitTime = currentTotalTime - previousLapTime;

    const newLap: Lap = {
      id: Date.now(),
      time: currentTotalTime,
      split: splitTime,
    };

    setLaps((prevLaps) => [...prevLaps, newLap]);
  };

  const handleLogoClick = () => {
    setActiveView('stopwatch');
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden bg-[#020617] text-white font-sans selection:bg-pink-500/30">
      
      {/* 1. Animated Galactic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep Space Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050510] to-[#0a0a20]"></div>

        {/* Stars Layer 1 (Static background) */}
        <div className="absolute inset-0 stars-pattern opacity-40"></div>
        
        {/* Stars Layer 2 (Twinkling) */}
        <div className="absolute inset-0 stars-pattern opacity-60 animate-twinkle" style={{ backgroundPosition: '50px 50px', transform: 'scale(1.1)' }}></div>

        {/* Nebula/Galaxy Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen animate-spin-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-spin-slower"></div>
        
        {/* Subtle Center Highlights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-overlay"></div>

        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* 2. Top Bar */}
      <div className="relative z-10 w-full px-8 py-6 flex justify-between items-center">
         <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group focus:outline-none transition-transform active:scale-95"
            aria-label="Chrona Home"
         >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="flex flex-col items-start">
                <span className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-100 transition-colors">Chrona</span>
            </div>
        </button>
      </div>

      {/* 3. Main Stage Content */}
      <div className="relative z-10 flex-1 flex w-full justify-center">
        {activeView === 'stopwatch' && (
           <StopwatchView 
             time={time}
             isRunning={isRunning}
             isResetting={isResetting}
             laps={laps}
             onStart={handleStart}
             onPause={handlePause}
             onReset={handleReset}
             onLap={handleLap}
           />
        )}

        {activeView === 'alarm' && (
            <AlarmView />
        )}

        {activeView === 'timer' && (
            <TimerView />
        )}
        
        {activeView === 'world' && (
            <WorldClockView />
        )}
      </div>

      {/* 4. Bottom Floating Dock */}
      <div className="relative z-10 w-full px-6 pb-8">
        <div className="mx-auto max-w-[280px] bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex justify-between items-center shadow-2xl shadow-black/20">
            <NavIcon icon="alarm" active={activeView === 'alarm'} onClick={() => setActiveView('alarm')} />
            <NavIcon icon="globe" active={activeView === 'world'} onClick={() => setActiveView('world')} />
            <NavIcon icon="stopwatch" active={activeView === 'stopwatch'} onClick={() => setActiveView('stopwatch')} />
            <NavIcon icon="timer" active={activeView === 'timer'} onClick={() => setActiveView('timer')} />
        </div>
      </div>
    </div>
  );
};

// Helper for Dock Icons
const NavIcon: React.FC<{ icon: string; active?: boolean; onClick: () => void }> = ({ icon, active, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`p-3 rounded-2xl transition-all duration-300 ${active ? 'bg-white/20 text-white shadow-inner scale-110' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
             <div className="w-5 h-5">
                 {/* Alarm: Bell Icon */}
                 {icon === 'alarm' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={active ? 0 : 2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                 )}
                 
                 {/* World Clock: Globe Icon */}
                 {icon === 'globe' && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0-18a18 18 0 0118 18" />
                    </svg>
                 )}
                 
                 {/* Stopwatch: Icon with pushers */}
                 {icon === 'stopwatch' && (
                     <svg xmlns="http://www.w3.org/2000/svg" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={active ? 0 : 2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 2h4" />
                     </svg>
                 )}
                 
                 {/* Timer: Hourglass Icon */}
                 {icon === 'timer' && (
                     <svg xmlns="http://www.w3.org/2000/svg" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={active ? 0 : 2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v4l4 4-4 4v4h8v-4l-4-4 4-4V3H8z" />
                     </svg>
                 )}
             </div>
        </button>
    )
}

export default App;