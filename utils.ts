import { TimeParts } from './types';

export const formatTime = (ms: number): TimeParts => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: centiseconds.toString().padStart(2, '0'),
  };
};

export const formatTotalSeconds = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  return `TOTAL ${totalSeconds} SECONDS`;
};