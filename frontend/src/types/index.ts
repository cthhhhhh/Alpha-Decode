export interface Term {
    id: string;
    term: string;
    definition: string;
    example: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Lesson {
    id: string;
    title: string;
    locked: boolean;
    completed: boolean;
    x: number;
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

