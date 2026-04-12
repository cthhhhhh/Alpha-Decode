package com.csd.cs203t1.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/feedback")
    public ResponseEntity<FeedbackResponse> getFeedback(@RequestBody FeedbackRequest request) {
        FeedbackResponse response = aiService.getLessonFeedback(request.getLessonTitle(), request.getScore(), request.getWrongQuestions());
        return ResponseEntity.ok(response);
    }
}
