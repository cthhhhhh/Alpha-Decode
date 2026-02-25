package com.csd.cs203t1.lesson;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository <Lesson, Long>{
	//this takes a lesson id, gets the associated quiz, and the questions witht the quiz
	@Query("SELECT l FROM Lesson l JOIN FETCH l.quiz q JOIN FETCH q.questions WHERE l.id = :lessonId")
    Optional<Lesson> findByIdWithQuizAndQuestions(@Param("lessonId") Long lessonId);

}

