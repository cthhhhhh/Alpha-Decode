package com.csd.cs203t1.quiz;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
@DisplayName("QuizRepository Integration Tests")
class QuizRepositoryTest {

    @Autowired
    private QuizRepository quizRepository;

    @Test
    void saveAndFind_dailyQuiz_returnsDailyQuiz() {
        // Arrange
        DailyQuiz dailyQuiz = new DailyQuiz(LocalDate.of(2026, 4, 7));
        quizRepository.save(dailyQuiz);

        // Act
        Quiz found = quizRepository.findById(dailyQuiz.getId()).orElse(null);

        // Assert
        assertNotNull(found);
        assertTrue(found instanceof DailyQuiz);
        DailyQuiz dq = (DailyQuiz) found;
        assertEquals(LocalDate.of(2026, 4, 7), dq.getDate());
    }

    @Test
    void saveAndFind_revisionQuiz_returnsRevisionQuiz() {
        // Arrange
        RevisionQuiz revQuiz = new RevisionQuiz();
        revQuiz.setAfterLessonIndex(2);
        quizRepository.save(revQuiz);

        // Act
        Quiz found = quizRepository.findById(revQuiz.getId()).orElse(null);

        // Assert
        assertNotNull(found);
        assertTrue(found instanceof RevisionQuiz);
        RevisionQuiz rq = (RevisionQuiz) found;
        assertEquals(2, rq.getAfterLessonIndex());
    }

    @Test
    void saveAndFind_onboardingQuiz_returnsOnboardingQuiz() {
        // Arrange
        OnboardingQuiz onboardingQuiz = new OnboardingQuiz();
        quizRepository.save(onboardingQuiz);

        // Act
        Quiz found = quizRepository.findById(onboardingQuiz.getId()).orElse(null);

        // Assert
        assertNotNull(found);
        assertTrue(found instanceof OnboardingQuiz);
    }
}
