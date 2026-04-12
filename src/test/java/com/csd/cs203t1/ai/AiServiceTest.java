package com.csd.cs203t1.ai;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

@ExtendWith(MockitoExtension.class)
@DisplayName("AiService Unit Tests")
class AiServiceTest {

    @Mock
    private RestTemplate restTemplate;

    private AiService aiService;

    @BeforeEach
    void setUp() {
        aiService = new AiService();
        aiService.setRestTemplateSupplier(() -> restTemplate);
        ReflectionTestUtils.setField(aiService, "geminiApiKey", "test-api-key");
    }

    @Test
    @DisplayName("getLessonFeedback: with wrong questions parses all sections and includes mistakes in prompt")
    void getLessonFeedback_withWrongQuestions_parsesSectionsAndPrompt() {
        Map<String, Object> responseBody = Map.of(
                "candidates", List.of(Map.of(
                        "content", Map.of(
                                "parts", List.of(Map.of(
                                        "text", "Great effort.\n\nTry this fresh example.\n\nQuestion 1: Focus on tense consistency."
                                ))
                        )
                ))
        );

        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(responseBody));

        WrongQuestion wrongQuestion = new WrongQuestion(1, "What is rizz?", "Charm", "Style");

        FeedbackResponse result = aiService.getLessonFeedback("Slang Basics", 78, List.of(wrongQuestion));

        assertEquals("Great effort.", result.getFeedback());
        assertEquals("Try this fresh example.", result.getExample());
        assertEquals("Question 1: Focus on tense consistency.", result.getWrongAnswersFeedback());

                ArgumentCaptor<HttpEntity<?>> entityCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate).postForEntity(anyString(), entityCaptor.capture(), eq(Map.class));

                Object bodyObj = entityCaptor.getValue().getBody();
                if (!(bodyObj instanceof Map<?, ?> body)) {
                        fail("Expected request body map");
                        return;
                }

                Object[] contents = (Object[]) body.get("contents");
                if (contents.length == 0 || !(contents[0] instanceof Map<?, ?> content)) {
                        fail("Expected prompt content");
                        return;
                }

                Object[] parts = (Object[]) content.get("parts");
                if (parts.length == 0 || !(parts[0] instanceof Map<?, ?> part)) {
                        fail("Expected prompt part");
                        return;
                }

                String prompt = (String) part.get("text");

        assertTrue(prompt.contains("Here are the mistakes they made"));
        assertTrue(prompt.contains("Question 1"));
        assertTrue(prompt.contains("Their Answer: Charm"));
    }

    @Test
    @DisplayName("getLessonFeedback: without wrong questions returns two-paragraph response")
    void getLessonFeedback_withoutWrongQuestions_parsesTwoParagraphs() {
        Map<String, Object> responseBody = Map.of(
                "candidates", List.of(Map.of(
                        "content", Map.of(
                                "parts", List.of(Map.of(
                                        "text", "Nice work today.\n\nUse this phrase in a conversation."
                                ))
                        )
                ))
        );

        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(responseBody));

        FeedbackResponse result = aiService.getLessonFeedback("Gen Alpha", 90, List.of());

        assertEquals("Nice work today.", result.getFeedback());
        assertEquals("Use this phrase in a conversation.", result.getExample());
        assertNull(result.getWrongAnswersFeedback());
    }

    @Test
    @DisplayName("getLessonFeedback: single-newline response uses fallback split")
    void getLessonFeedback_singleNewlineResponse_usesFallbackSplit() {
        Map<String, Object> responseBody = Map.of(
                "candidates", List.of(Map.of(
                        "content", Map.of(
                                "parts", List.of(Map.of(
                                        "text", "Great job\nTry using this in a daily sentence."
                                ))
                        )
                ))
        );

        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(ResponseEntity.ok(responseBody));

        FeedbackResponse result = aiService.getLessonFeedback("Grammar", 65, null);

        assertEquals("Great job", result.getFeedback());
        assertEquals("Try using this in a daily sentence.", result.getExample());
        assertNull(result.getWrongAnswersFeedback());
    }

    @Test
    @DisplayName("getLessonFeedback: rest call failure returns deterministic fallback")
    void getLessonFeedback_restFailure_returnsFallback() {
        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(new RuntimeException("network error"));

        FeedbackResponse result = aiService.getLessonFeedback("Revision", 55, List.of());

        assertNotNull(result);
        assertTrue(result.getFeedback().contains("55%"));
        assertEquals("Example: Keep practicing and you will master this topic!", result.getExample());
        assertNull(result.getWrongAnswersFeedback());
    }
}