export type Axis = 'x' | 'y' | 'z';

export type Position = {
  x: number;
  y: number;
  z: number;
};

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum GameState {
  STARTING = 'starting',
  PLAYING = 'playing',
  END = 'end',
}
