package com.csd.cs203t1.quiz;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    // Uses findAll() + instanceof filtering in QuizController for polymorphic queries
}
