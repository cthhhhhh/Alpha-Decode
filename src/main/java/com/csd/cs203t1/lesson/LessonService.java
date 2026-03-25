package com.csd.cs203t1.lesson;
import java.util.List;



import com.csd.cs203t1.question.QuestionDTO;


public interface LessonService {
	List<Lesson> listLessons();

	Lesson getLesson(Long id);

	Lesson getLessonWithQuizAndQuestions(Long id);

	/**
     * Creates a new lesson in the system.
     * 
     * @param lesson the lesson to be added
     * @return the newly created lesson with assigned ID
     */
    Lesson addLesson(LessonDTO lessonDTO, List<QuestionDTO> questionDTOs);

    Lesson updateLesson(Long id, LessonDTO dto);

    void deleteLesson(Long id);
}
