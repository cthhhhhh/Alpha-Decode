package com.csd.cs203t1.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    @Autowired
    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/feedback")
    public ResponseEntity<FeedbackResponse> getFeedback(@RequestBody FeedbackRequest request) {
        FeedbackResponse response = aiService.getLessonFeedback(request.getLessonTitle(), request.getScore(), request.getWrongQuestions());
        return ResponseEntity.ok(response);
    }
}
