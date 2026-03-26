// Lesson is the only frontend type still needed — all others (Term, LessonStep, LessonContent)
// are now replaced by inline interfaces that match backend API responses.

export interface Lesson {
    id: string;
    title: string;
    locked: boolean;
    completed: boolean;
    x: number;
}

export interface RevisionQuizQuestion {
    id: number;
    question_type: string;
    title: string;
    content?: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    target?: string;
    wordbank?: string[];
}

export interface RevisionQuiz {
    id: string;
    title?: string;
    afterLessonIndex: number; // 0-based
    questions: RevisionQuizQuestion[];
}
