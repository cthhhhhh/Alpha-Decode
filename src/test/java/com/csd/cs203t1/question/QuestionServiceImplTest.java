package com.csd.cs203t1.question;

import com.csd.cs203t1.quiz.QuizRepository;
import com.csd.cs203t1.quiz.RevisionQuiz;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("QuestionServiceImpl Unit Tests")
class QuestionServiceImplTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private QuizRepository quizRepository;

    @InjectMocks
    private QuestionServiceImpl questionService;

    @Test
    @DisplayName("addQuestion throws when quiz is missing")
    void addQuestion_quizMissing_throws() {
        when(quizRepository.findById(2L)).thenReturn(Optional.empty());

        IntroQuestionDTO dto = IntroQuestionDTO.builder()
                .question_type("INTRO")
                .title("t")
                .content("c")
                .explanation("e")
                .build();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> questionService.addQuestion(2L, dto));

        assertEquals("Quiz not found", ex.getMessage());
    }

    @Test
    @DisplayName("updateQuestion updates select question specific fields")
    void updateQuestion_select_updatesSelectFields() {
        SelectQuestion existing = SelectQuestion.builder()
                .explanation("old")
                .title("old title")
                .content("old content")
                .options(List.of("a", "b"))
                .correctAnswer(0)
                .build();
        existing.setId(1L);

        SelectQuestionDTO dto = SelectQuestionDTO.builder()
                .question_type("SELECT")
                .explanation("new explanation")
                .title("new title")
                .content("new content")
                .options(List.of("x", "y", "z"))
                .correctAnswer(2)
                .build();

        when(questionRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(questionRepository.save(any(Question.class))).thenAnswer(inv -> inv.getArgument(0));

        Question result = questionService.updateQuestion(1L, dto);

        SelectQuestion updated = (SelectQuestion) result;
        assertEquals("new explanation", updated.getExplanation());
        assertEquals("new title", updated.getTitle());
        assertEquals(List.of("x", "y", "z"), updated.getOptions());
        assertEquals(2, updated.getCorrectAnswer());
    }

    @Test
    @DisplayName("updateQuestion updates translate question specific fields")
    void updateQuestion_translate_updatesTranslateFields() {
        TranslateQuestion existing = TranslateQuestion.builder()
                .explanation("old")
                .title("old title")
                .content("old content")
                .target("old target")
                .wordbank(List.of("one", "two"))
                .build();
        existing.setId(4L);

        TranslateQuestionDTO dto = TranslateQuestionDTO.builder()
                .question_type("TRANSLATE")
                .explanation("new")
                .title("new title")
                .content("new content")
                .target("new target")
                .wordbank(List.of("alpha", "beta"))
                .build();

        when(questionRepository.findById(4L)).thenReturn(Optional.of(existing));
        when(questionRepository.save(any(Question.class))).thenAnswer(inv -> inv.getArgument(0));

        Question result = questionService.updateQuestion(4L, dto);

        TranslateQuestion updated = (TranslateQuestion) result;
        assertEquals("new target", updated.getTarget());
        assertEquals(List.of("alpha", "beta"), updated.getWordbank());
        assertEquals("new", updated.getExplanation());
    }

    @Test
    @DisplayName("deleteQuestion throws when id does not exist")
    void deleteQuestion_missing_throws() {
        when(questionRepository.existsById(99L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> questionService.deleteQuestion(99L));

        assertEquals("question not found", ex.getMessage());
    }

    @Test
    @DisplayName("addQuestion saves mapped entity when quiz exists")
    void addQuestion_success_savesMappedQuestion() {
        RevisionQuiz quiz = new RevisionQuiz();
        when(quizRepository.findById(8L)).thenReturn(Optional.of(quiz));
        when(questionRepository.save(any(Question.class))).thenAnswer(inv -> {
            Question q = inv.getArgument(0);
            q.setId(15L);
            return q;
        });

        IntroQuestionDTO dto = IntroQuestionDTO.builder()
                .question_type("INTRO")
                .title("Intro")
                .explanation("Explain")
                .content("Content")
                .build();

        Question saved = questionService.addQuestion(8L, dto);

        assertEquals(15L, saved.getId());
        verify(questionRepository).save(any(Question.class));
    }
}
