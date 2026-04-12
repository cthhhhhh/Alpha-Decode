package com.csd.cs203t1.quiz;

import java.time.LocalDate;
import java.util.List;

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

    private final QuizService quizService;
    private final UserService userService;

    public QuizController(QuizService quizService, UserService userService) {
        this.quizService = quizService;
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
            User user = userService.getCurrentUserReadOnly();
            if (user.getDailyQuizLastDate() != null && user.getDailyQuizLastDate().equals(LocalDate.now())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Daily quiz already completed today");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        List<Question> questions = quizService.getDailyQuizQuestions();
        if (questions == null || questions.size() < 3) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(questions);
    }

    /** Returns the OnboardingQuiz questions */
    @GetMapping("/onboarding")
    public ResponseEntity<?> getOnboardingQuiz() {
        List<Question> questions = quizService.getOnboardingQuizQuestions();
        if (questions == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(questions);
    }

    /** Returns all RevisionQuizzes with their afterLessonIndex and questions */
    @GetMapping("/revision")
    public ResponseEntity<?> getRevisionQuizzes() {
        return ResponseEntity.ok(quizService.getRevisionQuizzes());
    }

    /** Creates a new RevisionQuiz */
    @PostMapping("/revision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevisionQuiz> createRevisionQuiz(@RequestBody RevisionQuiz revisionQuiz) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizService.createRevisionQuiz(revisionQuiz));
    }

    /** Updates an existing RevisionQuiz */
    @PutMapping("/revision/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RevisionQuiz> updateRevisionQuiz(@PathVariable Long id, @RequestBody RevisionQuiz details) {
        return quizService.updateRevisionQuiz(id, details)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Deletes a RevisionQuiz */
    @DeleteMapping("/revision/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRevisionQuiz(@PathVariable Long id) {
        if (!quizService.revisionQuizExists(id)) {
            return ResponseEntity.notFound().build();
        }
        quizService.deleteRevisionQuiz(id);
        return ResponseEntity.noContent().build();
    }
}
