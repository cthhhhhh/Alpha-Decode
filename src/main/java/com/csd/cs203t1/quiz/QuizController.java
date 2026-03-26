package com.csd.cs203t1.quiz;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;

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

    /** Creates a new RevisionQuiz */
    @PostMapping("/revision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevisionQuiz> createRevisionQuiz(@RequestBody RevisionQuiz revisionQuiz) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizRepository.save(revisionQuiz));
    }

    /** Updates an existing RevisionQuiz */
    @PutMapping("/revision/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevisionQuiz> updateRevisionQuiz(@PathVariable Long id, @RequestBody RevisionQuiz details) {
        return quizRepository.findById(id)
                .filter(q -> q instanceof RevisionQuiz)
                .map(q -> {
                    RevisionQuiz rq = (RevisionQuiz) q;
                    rq.setAfterLessonIndex(details.getAfterLessonIndex());
                    return ResponseEntity.ok(quizRepository.save(rq));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /** Deletes a RevisionQuiz */
    @DeleteMapping("/revision/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRevisionQuiz(@PathVariable Long id) {
        if (!quizRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        quizRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
