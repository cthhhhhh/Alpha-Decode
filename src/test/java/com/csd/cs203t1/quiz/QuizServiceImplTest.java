package com.csd.cs203t1.quiz;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.csd.cs203t1.question.IntroQuestion;
import com.csd.cs203t1.question.Question;

@ExtendWith(MockitoExtension.class)
@DisplayName("QuizServiceImpl Unit Tests")
class QuizServiceImplTest {

    @Mock
    private QuizRepository quizRepository;

    @InjectMocks
    private QuizServiceImpl quizService;

    private IntroQuestion q(int i) {
        return IntroQuestion.builder()
                .title("t" + i)
                .explanation("e" + i)
                .content("c" + i)
                .build();
    }

    @Test
    @DisplayName("getDailyQuizQuestions returns null when no daily quiz exists")
    void getDailyQuizQuestions_noQuiz_returnsNull() {
        when(quizRepository.findAllDailyQuizzes()).thenReturn(List.of());

        assertNull(quizService.getDailyQuizQuestions());
    }

    @Test
    @DisplayName("getDailyQuizQuestions returns null when bank has less than 3 questions")
    void getDailyQuizQuestions_bankTooSmall_returnsNull() {
        DailyQuiz dailyQuiz = new DailyQuiz(LocalDate.now());
        dailyQuiz.setQuestions(List.of(q(1), q(2)));
        when(quizRepository.findAllDailyQuizzes()).thenReturn(List.of(dailyQuiz));

        assertNull(quizService.getDailyQuizQuestions());
    }

    @Test
    @DisplayName("getDailyQuizQuestions returns 3 unique questions from the bank")
    void getDailyQuizQuestions_validBank_returnsThreeUnique() {
        List<Question> bank = List.of(q(1), q(2), q(3), q(4));
        DailyQuiz dailyQuiz = new DailyQuiz(LocalDate.now());
        dailyQuiz.setQuestions(bank);
        when(quizRepository.findAllDailyQuizzes()).thenReturn(List.of(dailyQuiz));

        List<Question> result = quizService.getDailyQuizQuestions();

        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(3, new HashSet<>(result).size());
        assertTrue(bank.containsAll(result));
    }

    @Test
    @DisplayName("getOnboardingQuizQuestions returns null when no onboarding quiz exists")
    void getOnboardingQuizQuestions_noQuiz_returnsNull() {
        when(quizRepository.findAllOnboardingQuizzes()).thenReturn(List.of());

        assertNull(quizService.getOnboardingQuizQuestions());
    }

    @Test
    @DisplayName("getOnboardingQuizQuestions returns first onboarding quiz question list")
    void getOnboardingQuizQuestions_found_returnsQuestions() {
        OnboardingQuiz onboardingQuiz = new OnboardingQuiz();
        onboardingQuiz.setQuestions(List.of(q(1), q(2)));
        when(quizRepository.findAllOnboardingQuizzes()).thenReturn(List.of(onboardingQuiz));

        List<Question> result = quizService.getOnboardingQuizQuestions();

        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("getRevisionQuizzes limits sampled question list to 10")
    void getRevisionQuizzes_moreThanTen_limitsToTen() {
        RevisionQuiz revisionQuiz = new RevisionQuiz();
        revisionQuiz.setId(10L);
        revisionQuiz.setAfterLessonIndex(2);
        revisionQuiz.setQuestions(IntStream.rangeClosed(1, 12)
                .mapToObj(this::q)
                .map(x -> (Question) x)
                .toList());

        when(quizRepository.findAllRevisionQuizzes()).thenReturn(List.of(revisionQuiz));

        List<Map<String, Object>> out = quizService.getRevisionQuizzes();

        assertEquals(1, out.size());
        Map<String, Object> row = out.get(0);
        assertEquals(10L, row.get("id"));
        assertEquals(2, row.get("afterLessonIndex"));
        List<?> sampled = (List<?>) row.get("questions");
        assertEquals(10, sampled.size());
    }

    @Test
    @DisplayName("createRevisionQuiz delegates to repository save")
    void createRevisionQuiz_delegatesSave() {
        RevisionQuiz revisionQuiz = new RevisionQuiz();
        revisionQuiz.setAfterLessonIndex(3);
        when(quizRepository.save(revisionQuiz)).thenReturn(revisionQuiz);

        RevisionQuiz out = quizService.createRevisionQuiz(revisionQuiz);

        assertSame(revisionQuiz, out);
        verify(quizRepository).save(revisionQuiz);
    }

    @Test
    @DisplayName("updateRevisionQuiz updates afterLessonIndex when quiz exists")
    void updateRevisionQuiz_found_updates() {
        RevisionQuiz existing = new RevisionQuiz();
        existing.setAfterLessonIndex(1);
        RevisionQuiz details = new RevisionQuiz();
        details.setAfterLessonIndex(9);

        when(quizRepository.findRevisionQuizById(5L)).thenReturn(Optional.of(existing));
        when(quizRepository.save(any(RevisionQuiz.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<RevisionQuiz> out = quizService.updateRevisionQuiz(5L, details);

        assertTrue(out.isPresent());
        assertEquals(9, out.get().getAfterLessonIndex());
        verify(quizRepository).save(existing);
    }

    @Test
    @DisplayName("updateRevisionQuiz returns empty when quiz does not exist")
    void updateRevisionQuiz_missing_returnsEmpty() {
        when(quizRepository.findRevisionQuizById(99L)).thenReturn(Optional.empty());

        Optional<RevisionQuiz> out = quizService.updateRevisionQuiz(99L, new RevisionQuiz());

        assertTrue(out.isEmpty());
        verify(quizRepository, never()).save(any());
    }
}