export interface Lap {
  id: number;
  time: number; // in milliseconds
  split: number; // time since last lap
}

export interface TimeParts {
  minutes: string;
  seconds: string;
  milliseconds: string;
}