import React from 'react';
import CircularDisplay from './CircularDisplay';
import ControlButtons from './ControlButtons';
import LapList from './LapList';
import { Lap } from '../types';

interface StopwatchViewProps {
  time: number;
  isRunning: boolean;
  isResetting: boolean;
  laps: Lap[];
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
}

const StopwatchView: React.FC<StopwatchViewProps> = ({
  time,
  isRunning,
  isResetting,
  laps,
  onStart,
  onPause,
  onReset,
  onLap,
}) => {
  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-4 gap-12 md:gap-24 transition-all duration-500 animate-slide-in-up">
      {/* Timer Component (Left/Top) */}
      <div className="flex-shrink-0 transform scale-100 md:scale-110 transition-transform duration-500">
        <CircularDisplay time={time} isRunning={isRunning} isResetting={isResetting} />
      </div>

      {/* Controls & List Container (Right/Bottom) */}
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Controls */}
        <ControlButtons
          isRunning={isRunning}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
          onLap={onLap}
        />

        {/* Laps List */}
        <LapList laps={laps} />
      </div>
    </div>
  );
};

export default StopwatchView;