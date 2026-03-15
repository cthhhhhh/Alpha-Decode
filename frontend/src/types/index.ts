// Lesson is the only frontend type still needed — all others (Term, LessonStep, LessonContent)
// are now replaced by inline interfaces that match backend API responses.

export interface Lesson {
    id: string;
    title: string;
    locked: boolean;
    completed: boolean;
    x: number;
}
