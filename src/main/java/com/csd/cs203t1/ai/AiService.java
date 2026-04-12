package com.csd.cs203t1.ai;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private Supplier<RestTemplate> restTemplateSupplier = RestTemplate::new;

    // Test seam to avoid real network calls in unit tests.
    void setRestTemplateSupplier(Supplier<RestTemplate> restTemplateSupplier) {
        this.restTemplateSupplier = restTemplateSupplier;
    }

    @SuppressWarnings("unchecked")
    public FeedbackResponse getLessonFeedback(String lessonTitle, int score, List<WrongQuestion> wrongQuestions) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are a fun, encouraging AI teacher. The user just completed a lesson on '")
                .append(lessonTitle).append("' and scored ").append(score).append("%. ");
                
        boolean hasWrongQuestions = wrongQuestions != null && !wrongQuestions.isEmpty();
        
        if (hasWrongQuestions) {
            promptBuilder.append("Provide exactly three paragraphs separated by a double newline.\n\n")
                    .append("Paragraph 1: A 1-2 sentence supportive evaluation of their score.\n\n")
                    .append("Paragraph 2: One completely new, concise example related to the topic of the lesson.\n\n")
                    .append("Paragraph 3: Give targeted, friendly feedback on their mistakes. Suggest how to solve them for future attempts. Format your feedback strictly like this:\n")
                    .append("Question [number]: [Your feedback]\n\n")
                    .append("Here are the mistakes they made:\n");
            for (WrongQuestion wq : wrongQuestions) {
                promptBuilder.append("- Question ").append(wq.getQuestionNumber()).append(": ").append(wq.getQuestionText())
                        .append(" | Their Answer: ").append(wq.getUserAnswer())
                        .append(" | Correct Answer: ").append(wq.getCorrectAnswer()).append("\n");
            }
        } else {
            promptBuilder.append("Provide exactly two paragraphs separated by a double newline.\n\n")
                    .append("Paragraph 1: A 1-2 sentence supportive evaluation of their score.\n\n")
                    .append("Paragraph 2: One completely new, concise example related to the topic of the lesson.");
        }

        String prompt = promptBuilder.toString();

        try {
            RestTemplate restTemplate = restTemplateSupplier.get();
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
                            String wrongFeedback = null;
                            
                            if (hasWrongQuestions && split.length > 2) {
                                StringBuilder wrBuilder = new StringBuilder();
                                for (int i = 2; i < split.length; i++) {
                                    wrBuilder.append(split[i]);
                                    if (i < split.length - 1) wrBuilder.append("\n\n");
                                }
                                wrongFeedback = wrBuilder.toString();
                            }
                            
                            // fallback formatting adjustment
                            if (split.length == 1 && text.contains("\n")) {
                                split = text.split("\n");
                                feedback = split[0];
                                example = text.substring(feedback.length()).trim();
                            }
                            
                            return new FeedbackResponse(feedback.trim(), example.trim(), wrongFeedback != null ? wrongFeedback.trim() : null);
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new FeedbackResponse("Great job completing the lesson! Your score was " + score + "%.", "Example: Keep practicing and you will master this topic!", null);
    }
}
