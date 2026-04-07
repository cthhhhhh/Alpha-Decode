package com.csd.cs203t1.quiz;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csd.cs203t1.question.Question;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizRepository quizRepository;
    private final UserService userService;

    public QuizController(QuizRepository quizRepository, UserService userService) {
        this.quizRepository = quizRepository;
        this.userService = userService;
    }

    /**
     * Returns 3 questions for today's daily quiz.
     * They are drawn from the DailyQuiz question bank, and rotated deterministically
     * by calendar day so the set changes every day but remains stable within the day.
     */
    @GetMapping("/daily")
    public ResponseEntity<?> getDailyQuiz() {
        try {
            User user = userService.getCurrentUser();
            if (user.getDailyQuizLastDate() != null && user.getDailyQuizLastDate().equals(LocalDate.now())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Daily quiz already completed today");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        List<Question> bank = quizRepository.findAll().stream()
                .filter(q -> q instanceof DailyQuiz)
                .findFirst()
                .map(Quiz::getQuestions)
                .orElse(null);
        if (bank == null || bank.size() < 3) {
            return ResponseEntity.notFound().build();
        }
        List<Question> copy = new ArrayList<>(bank);
        long seed = LocalDate.now().toEpochDay();
        ThreadLocalRandom rng = ThreadLocalRandom.current();
        // Deterministic shuffle-by-day: simple seeded swap for first k positions.
        int k = Math.min(3, copy.size());
        for (int i = 0; i < k; i++) {
            int j = (int) ((seed + i * 31) % copy.size());
            Question tmp = copy.get(i);
            copy.set(i, copy.get(j));
            copy.set(j, tmp);
        }
        return ResponseEntity.ok(copy.subList(0, 3));
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
                    // Random-sample a subset each request (checkpoint quiz should feel fresh).
                    // Keep it bounded to avoid huge payloads if the pool grows.
                    var questions = rq.getQuestions();
                    int sampleSize = Math.min(10, questions == null ? 0 : questions.size());
                    List<?> sampled;
                    if (questions == null || questions.isEmpty() || sampleSize == questions.size()) {
                        sampled = questions;
                    } else {
                        List<Object> copy = new ArrayList<>(questions);
                        // Fisher–Yates shuffle for first k positions
                        for (int i = 0; i < sampleSize; i++) {
                            int j = ThreadLocalRandom.current().nextInt(i, copy.size());
                            Object tmp = copy.get(i);
                            copy.set(i, copy.get(j));
                            copy.set(j, tmp);
                        }
                        sampled = copy.subList(0, sampleSize);
                    }
                    return Map.of(
                        "id", rq.getId(),
                        "afterLessonIndex", rq.getAfterLessonIndex(),
                        "questions", sampled
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
