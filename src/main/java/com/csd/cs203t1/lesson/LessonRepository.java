package com.csd.cs203t1.lesson;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository <Lesson, Long>{
	//this takes a lesson id, gets the associated quiz, and the questions witht the quiz
	@Query("SELECT l FROM Lesson l LEFT JOIN FETCH l.quiz q LEFT JOIN FETCH q.questions WHERE l.id = :lessonId")
    Optional<Lesson> findByIdWithQuizAndQuestions(@Param("lessonId") Long lessonId);

	@Query("SELECT l FROM Lesson l ORDER BY l.id ASC")
	List<Lesson> findAllOrderedById();

}

