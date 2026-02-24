export interface SlangTerm {
  id: string;
  term: string;
  definition: string;
  example: string;
  origin?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'reaction' | 'noun' | 'adjective' | 'verb';
}

export interface UserProgress {
  streak: number;
  xp: number;
  level: number;
  completedLessons: string[];
  dailyDone: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type LessonStepType = 'intro' | 'select' | 'translate';

export interface LessonStep {
  type: LessonStepType;
  title: string;
  content?: string;
  options?: string[];
  correctAnswer?: number | string;
  explanation?: string;
  wordBank?: string[];
  targetSentence?: string;
}

export interface LessonContent {
  id: string;
  name: string;
  steps: LessonStep[];
}
