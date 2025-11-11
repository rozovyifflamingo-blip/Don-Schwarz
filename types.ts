export interface ScoreEntry {
  id: number;
  value: number;
  timestamp: number;
}

export type ParticipantMode = 'blue' | 'brightBlue' | 'purple';

export interface Participant {
  id: number;
  name:string;
  scores: ScoreEntry[];
  mode?: ParticipantMode;
}

export type TeamId = 'left' | 'right';

export interface Team {
  id: TeamId;
  name: string;
  participants: Participant[];
}