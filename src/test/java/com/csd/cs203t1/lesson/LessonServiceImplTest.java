package com.csd.cs203t1.lesson;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.csd.cs203t1.draft.DraftService;
import com.csd.cs203t1.question.IntroQuestionDTO;
import com.csd.cs203t1.question.Question;
import com.csd.cs203t1.question.QuestionDTO;

@ExtendWith(MockitoExtension.class)
@DisplayName("LessonServiceImpl Unit Tests")
class LessonServiceImplTest {

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private DraftService draftService;

    @InjectMocks
    private LessonServiceImpl lessonService;

    @Test
    @DisplayName("listLessons: returns repository ordered list")
    void listLessons_returnsOrderedList() {
        Lesson l1 = lesson(1L, "Intro");
        Lesson l2 = lesson(2L, "Advanced");
        when(lessonRepository.findAllOrderedById()).thenReturn(List.of(l1, l2));

        List<Lesson> result = lessonService.listLessons();

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());
    }

    @Test
    @DisplayName("getLesson: returns lesson when found")
    void getLesson_found_returnsLesson() {
        Lesson lesson = lesson(1L, "Topic");
        when(lessonRepository.findById(1L)).thenReturn(Optional.of(lesson));

        Lesson result = lessonService.getLesson(1L);

        assertEquals(1L, result.getId());
        assertEquals("Topic", result.getTitle());
    }

    @Test
    @DisplayName("getLesson: throws when lesson not found")
    void getLesson_missing_throws() {
        when(lessonRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> lessonService.getLesson(99L));
        assertTrue(ex.getMessage().contains("Lesson not found"));
    }

    @Test
    @DisplayName("getLessonWithQuizAndQuestions: throws when lesson not found")
    void getLessonWithQuizAndQuestions_missing_throws() {
        when(lessonRepository.findByIdWithQuizAndQuestions(2L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> lessonService.getLessonWithQuizAndQuestions(2L));
        assertTrue(ex.getMessage().contains("Lesson not found"));
    }

    @Test
    @DisplayName("updateLesson: updates only non-null fields")
    void updateLesson_partialUpdate_onlyMutatesProvidedFields() {
        Lesson existing = lesson(4L, "Old title");
        existing.setColour("blue");
        existing.setStory("old story");
        existing.setEmoji("😀");

        LessonDTO dto = new LessonDTO();
        dto.setTitle("New title");
        dto.setStory("new story");

        when(lessonRepository.findById(4L)).thenReturn(Optional.of(existing));
        when(lessonRepository.save(existing)).thenReturn(existing);

        Lesson updated = lessonService.updateLesson(4L, dto);

        assertEquals("New title", updated.getTitle());
        assertEquals("new story", updated.getStory());
        assertEquals("blue", updated.getColour());
        assertEquals("😀", updated.getEmoji());
        verify(lessonRepository).save(existing);
    }

    @Test
    @DisplayName("deleteLesson: throws and does not delete when lesson does not exist")
    void deleteLesson_missing_throwsAndSkipsDeletion() {
        when(lessonRepository.existsById(404L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> lessonService.deleteLesson(404L));

        assertTrue(ex.getMessage().contains("Lesson not found"));
        verify(draftService, never()).handleLessonDeletion(404L);
        verify(lessonRepository, never()).deleteById(404L);
    }

    @Test
    @DisplayName("deleteLesson: triggers draft cleanup before deleting lesson")
    void deleteLesson_existing_cleansDraftThenDeletes() {
        when(lessonRepository.existsById(5L)).thenReturn(true);

        lessonService.deleteLesson(5L);

        var inOrder = inOrder(draftService, lessonRepository);
        inOrder.verify(draftService).handleLessonDeletion(5L);
        inOrder.verify(lessonRepository).deleteById(5L);
    }

    @Test
    @DisplayName("addLesson: builds lesson with attached quiz and saves it")
    void addLesson_buildsQuizAssociationAndSaves() {
        LessonDTO dto = new LessonDTO();
        dto.setTitle("Slang 101");
        dto.setColour("green");
        dto.setStory("story");
        dto.setEmoji("🔥");

        when(lessonRepository.save(org.mockito.ArgumentMatchers.any(Lesson.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Lesson created = lessonService.addLesson(dto, List.<QuestionDTO>of());

        assertEquals("Slang 101", created.getTitle());
        assertEquals("green", created.getColour());
        assertNotNull(created.getQuiz());
        assertEquals(created, created.getQuiz().getLesson());
        assertTrue(created.getQuiz().getQuestions().isEmpty());
        verify(lessonRepository).save(created);
    }

    @Test
    @DisplayName("addLesson: maps intro question DTO into quiz question list")
    void addLesson_withIntroQuestion_mapsQuestionEntity() {
        LessonDTO dto = new LessonDTO();
        dto.setTitle("Lesson with question");
        dto.setColour("orange");
        dto.setStory("story");
        dto.setEmoji("📘");

        IntroQuestionDTO intro = new IntroQuestionDTO();
        intro.setQuestion_type("INTRO");
        intro.setTitle("What is this?");
        intro.setExplanation("explain");
        intro.setContent("content");

        when(lessonRepository.save(org.mockito.ArgumentMatchers.any(Lesson.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Lesson created = lessonService.addLesson(dto, List.of(intro));

        assertEquals(1, created.getQuiz().getQuestions().size());
        Question mapped = created.getQuiz().getQuestions().get(0);
        assertEquals("What is this?", mapped.getTitle());
        assertEquals("explain", mapped.getExplanation());
        assertEquals(created.getQuiz(), mapped.getQuiz());
    }

    @Test
    @DisplayName("updateLesson: applies all editable fields when provided")
    void updateLesson_allFieldsProvided_updatesEveryField() {
        Lesson existing = lesson(9L, "Old");

        LessonDTO dto = new LessonDTO();
        dto.setTitle("New");
        dto.setColour("purple");
        dto.setStory("new story");
        dto.setEmoji("📗");

        when(lessonRepository.findById(9L)).thenReturn(Optional.of(existing));
        when(lessonRepository.save(existing)).thenReturn(existing);

        Lesson updated = lessonService.updateLesson(9L, dto);

        assertEquals("New", updated.getTitle());
        assertEquals("purple", updated.getColour());
        assertEquals("new story", updated.getStory());
        assertEquals("📗", updated.getEmoji());
    }

    private Lesson lesson(Long id, String title) {
        Lesson lesson = new Lesson();
        lesson.setId(id);
        lesson.setTitle(title);
        lesson.setColour("red");
        lesson.setStory("story");
        lesson.setEmoji("✨");
        return lesson;
    }
}