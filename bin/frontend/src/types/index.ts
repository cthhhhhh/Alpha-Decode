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
    question_type: string;
    title: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface RevisionQuiz {
    id: string;
    afterLessonIndex: number; // 0-based
    questions: RevisionQuizQuestion[];
}
