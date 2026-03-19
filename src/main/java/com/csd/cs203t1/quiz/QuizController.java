package com.csd.cs203t1.quiz;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizRepository quizRepository;

    public QuizController(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    /** Returns the single DailyQuiz with all its questions */
    @GetMapping("/daily")
    public ResponseEntity<?> getDailyQuiz() {
        return quizRepository.findAll().stream()
                .filter(q -> q instanceof DailyQuiz)
                .findFirst()
                .<ResponseEntity<?>>map(q -> ResponseEntity.ok(q.getQuestions()))
                .orElse(ResponseEntity.notFound().build());
    }

    /** Returns the OnboardingQuiz questions */
    @GetMapping("/onboarding")
    public ResponseEntity<?> getOnboardingQuiz() {
        return quizRepository.findAll().stream()
                .filter(q -> q instanceof OnboardingQuiz)
                .findFirst()
                .<ResponseEntity<?>>map(q -> ResponseEntity.ok(q.getQuestions()))
                .orElse(ResponseEntity.notFound().build());
    }

    /** Returns all RevisionQuizzes with their afterLessonIndex and questions */
    @GetMapping("/revision")
    public ResponseEntity<?> getRevisionQuizzes() {
        List<?> result = quizRepository.findAll().stream()
                .filter(q -> q instanceof RevisionQuiz)
                .map(q -> {
                    RevisionQuiz rq = (RevisionQuiz) q;
                    return Map.of(
                        "id", rq.getId(),
                        "afterLessonIndex", rq.getAfterLessonIndex(),
                        "questions", rq.getQuestions()
                    );
                })
                .toList();
        return ResponseEntity.ok(result);
    }
}
