package com.csd.cs203t1.question;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/")
    public List<Question> getQuestions() {
        return questionService.listQuestions();
    }

    @GetMapping("/{id}")
    public Question getQuestion(@PathVariable Long id) {
        return questionService.getQuestion(id);
    }

    @PreAuthorize("hasAnyRole('CONTRIBUTOR','ADMIN')")
    @PostMapping("/quiz/{quizId}")
    public ResponseEntity<Question> addQuestion(@PathVariable Long quizId, @RequestBody QuestionDTO dto) {
        Question saved = questionService.addQuestion(quizId, dto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('CONTRIBUTOR','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO dto) {
        Question updated = questionService.updateQuestion(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasAnyRole('CONTRIBUTOR','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
