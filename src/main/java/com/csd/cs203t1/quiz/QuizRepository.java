package com.csd.cs203t1.quiz;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    @Query("SELECT d FROM DailyQuiz d")
    List<DailyQuiz> findAllDailyQuizzes();

    @Query("SELECT o FROM OnboardingQuiz o")
    List<OnboardingQuiz> findAllOnboardingQuizzes();

    @Query("SELECT r FROM RevisionQuiz r")
    List<RevisionQuiz> findAllRevisionQuizzes();

    @Query("SELECT r FROM RevisionQuiz r WHERE r.id = :id")
    Optional<RevisionQuiz> findRevisionQuizById(@Param("id") Long id);
}
