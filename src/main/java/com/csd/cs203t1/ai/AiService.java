package com.csd.cs203t1.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    @SuppressWarnings("unchecked")
    public FeedbackResponse getLessonFeedback(String lessonTitle, int score) {
        String prompt = "You are a fun, encouraging AI teacher. The user just completed a lesson on '" + lessonTitle + "' and scored " + score + "%. "
                + "Provide exactly two paragraphs separated by a double newline.\n\n"
                + "Paragraph 1: A 1-2 sentence supportive evaluation of their score.\n\n"
                + "Paragraph 2: One completely new, concise example related to the topic of the lesson.";

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", new Object[]{ part });

            Map<String, Object> body = new HashMap<>();
            body.put("contents", new Object[]{ content });
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String text = (String) parts.get(0).get("text");
                        if (text != null) {
                            String[] split = text.split("\n\n");
                            String feedback = split[0];
                            String example = split.length > 1 ? split[1] : "";
                            
                            // fallback formatting adjustment
                            if (split.length == 1 && text.contains("\n")) {
                                split = text.split("\n");
                                feedback = split[0];
                                example = text.substring(feedback.length()).trim();
                            }
                            
                            return new FeedbackResponse(feedback.trim(), example.trim());
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new FeedbackResponse("Great job completing the lesson! Your score was " + score + "%.", "Example: Keep practicing and you will master this topic!");
    }
}
