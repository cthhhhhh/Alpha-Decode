export interface Term {
    id: string;
    term: string;
    definition: string;
    example: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
}

export interface Lesson {
    id: string;
    title: string;
    color: string;
    gradient: string;
    locked: boolean;
    completed: boolean;
    x: number;
    chapter: number;
    story: string;
    emoji: string;
}

export interface QuizQuestion {
    q: string;
    options: string[];
    correct: number;
    explanation: string;
}

export interface LessonStep {
    type: 'intro' | 'select' | 'translate';
    title: string;
    content?: string;
    explanation?: string;
    options?: string[];
    correctAnswer?: number;
    wordBank?: string[];
    targetSentence?: string;
}

export interface LessonContent {
    id: string;
    name: string;
    steps: LessonStep[];
}

