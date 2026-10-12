export type MissionId = 1 | 2 | 3 | 4 | 5;

export interface MissionProgress {
  currentMission: MissionId;
  completedMissions: MissionId[];
  score: number;
  maxScore: number;
  missionScores: Record<MissionId, number>;
  hintsUsed: number;
}

export interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  xPercent: number;
  yPercent: number;
  content: string;
  gisTakeaway: string;
}

export interface ScenarioQuestion {
  id: string;
  title: string;
  context: string;
  scale: 'global' | 'regional' | 'local';
  task: string;
  options: {
    id: string;
    label: string;
    crsType: string;
    epsg?: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface DetectiveBug {
  id: string;
  title: string;
  symptom: string;
  sampleCoords: string;
  layerCRS: string;
  mapCRS: string;
  mapVisualState: 'swapped_xy' | 'degrees_as_metres' | 'wrong_zone' | 'datum_shift' | 'correct';
  diagnosticClues: {
    step: string;
    observation: string;
  }[];
  question: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    technicalExplanation: string;
  }[];
}

export interface WorkflowStep {
  id: number;
  name: string;
  shortDesc: string;
  category: 'input' | 'crs' | 'import' | 'qa' | 'overlay' | 'output';
  icon: string;
}
