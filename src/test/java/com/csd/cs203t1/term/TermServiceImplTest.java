package com.csd.cs203t1.term;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.csd.cs203t1.lesson.Lesson;
import com.csd.cs203t1.lesson.LessonRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("TermServiceImpl Unit Tests")
class TermServiceImplTest {

    @Mock
    private TermRepository termRepository;

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private TermServiceImpl termService;

    @Test
    @DisplayName("addTerm throws when lesson not found")
    void addTerm_lessonMissing_throws() {
        when(lessonRepository.findById(3L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> termService.addTerm(3L, new Term()));

        assertEquals("lesson not found", ex.getMessage());
    }

    @Test
    @DisplayName("addTerm binds lesson and saves term")
    void addTerm_success_setsLessonAndSaves() {
        Lesson lesson = new Lesson();
        lesson.setId(2L);
        when(lessonRepository.findById(2L)).thenReturn(Optional.of(lesson));
        when(termRepository.save(any(Term.class))).thenAnswer(inv -> inv.getArgument(0));

        Term incoming = new Term();
        incoming.setTerm("gyatt");
        incoming.setDefinition("definition");
        incoming.setExample("example");
        incoming.setDifficulty(Difficulty.MEDIUM);
        incoming.setCategory(Category.NOUN);

        Term saved = termService.addTerm(2L, incoming);

        assertEquals(lesson, saved.getLesson());
        verify(termRepository).save(incoming);
    }

    @Test
    @DisplayName("updateTerm only updates non-null fields")
    void updateTerm_partialUpdate() {
        Term existing = new Term();
        existing.setId(1L);
        existing.setTerm("old");
        existing.setDefinition("old def");
        existing.setExample("old ex");
        existing.setDifficulty(Difficulty.EASY);
        existing.setCategory(Category.ADJECTIVE);

        Term incoming = new Term();
        incoming.setTerm("new");
        incoming.setExample("new ex");
        incoming.setDifficulty(Difficulty.HARD);

        when(termRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(termRepository.save(any(Term.class))).thenAnswer(inv -> inv.getArgument(0));

        Term updated = termService.updateTerm(1L, incoming);

        assertEquals("new", updated.getTerm());
        assertEquals("old def", updated.getDefinition());
        assertEquals("new ex", updated.getExample());
        assertEquals(Difficulty.HARD, updated.getDifficulty());
        assertEquals(Category.ADJECTIVE, updated.getCategory());
    }

    @Test
    @DisplayName("deleteTerm throws when term does not exist")
    void deleteTerm_missing_throws() {
        when(termRepository.existsById(55L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> termService.deleteTerm(55L));

        assertEquals("Term not found", ex.getMessage());
    }
}
