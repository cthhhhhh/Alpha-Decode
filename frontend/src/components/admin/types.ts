export interface AdminStats {
  totalUsers: number;
  contributors: number;
  activeSessions: number;
  systemHealth: string;
  message: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  level: number;
  xp: number;
  enabled: boolean;
  isOnline: boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lessonsCompleted: number;
  dailyQuizzesTaken: number;
  lastActive: string;
}

export interface FlagItem {
  id: number;
  reason: string;
  details: string;
  status: string;
  createdAt: string;
  reportedBy: string;
  contentType: string;
  contentId: number;
  contentContext?: string;
}

export interface Lesson {
  id: number;
  title: string;
  story?: string;
  emoji?: string;
}

export interface Question {
  id: number;
  question_type: 'INTRO' | 'SELECT' | 'TRANSLATE';
  title: string;
  content?: string;
  explanation: string;
  // SELECT
  options?: string[];
  correctAnswer?: number;
  // TRANSLATE
  wordbank?: string[];
  target?: string;
}

export interface LessonWithQuestions extends Lesson {
  quiz: { id: number; questions: Question[] };
}

export interface Term {
  id: number;
  term: string;
  definition: string;
  example: string;
  difficulty: string;
  category: string;
}

export interface RevisionQuiz {
  id: number;
  afterLessonIndex: number;
  questions: Question[];
}

export type Tab = 'dashboard' | 'users' | 'reports' | 'content';
