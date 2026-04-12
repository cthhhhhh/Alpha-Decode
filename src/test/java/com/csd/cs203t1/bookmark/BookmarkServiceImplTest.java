package com.csd.cs203t1.bookmark;

import com.csd.cs203t1.term.Term;
import com.csd.cs203t1.term.TermRepository;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;
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
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookmarkServiceImpl Unit Tests")
class BookmarkServiceImplTest {

    @Mock
    private UserBookmarkRepository bookmarkRepository;

    @Mock
    private TermRepository termRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private BookmarkServiceImpl bookmarkService;

    @Test
    @DisplayName("getBookmarkIdsForCurrentUser maps bookmark terms to ids")
    void getBookmarkIdsForCurrentUser_mapsIds() {
        User user = new User();
        when(userService.getCurrentUserReadOnly()).thenReturn(user);

        Term t1 = new Term();
        t1.setId(3L);
        Term t2 = new Term();
        t2.setId(8L);

        UserBookmark b1 = new UserBookmark();
        b1.setTerm(t1);
        UserBookmark b2 = new UserBookmark();
        b2.setTerm(t2);
        when(bookmarkRepository.findByUser(user)).thenReturn(List.of(b1, b2));

        List<Long> result = bookmarkService.getBookmarkIdsForCurrentUser();

        assertEquals(List.of(3L, 8L), result);
    }

    @Test
    @DisplayName("addBookmarkForCurrentUser skips save when bookmark already exists")
    void addBookmark_existing_noop() {
        User user = new User();
        when(userService.getCurrentUserReadOnly()).thenReturn(user);
        when(bookmarkRepository.findByUserAndTermId(user, 7L)).thenReturn(Optional.of(new UserBookmark()));

        bookmarkService.addBookmarkForCurrentUser(7L);

        verify(termRepository, never()).findById(any());
        verify(bookmarkRepository, never()).save(any());
    }

    @Test
    @DisplayName("addBookmarkForCurrentUser throws when term is missing")
    void addBookmark_missingTerm_throws() {
        User user = new User();
        when(userService.getCurrentUserReadOnly()).thenReturn(user);
        when(bookmarkRepository.findByUserAndTermId(user, 10L)).thenReturn(Optional.empty());
        when(termRepository.findById(10L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> bookmarkService.addBookmarkForCurrentUser(10L));

        assertEquals("Term not found", ex.getMessage());
    }

    @Test
    @DisplayName("removeBookmarkForCurrentUser delegates with current user")
    void removeBookmark_delegates() {
        User user = new User();
        when(userService.getCurrentUserReadOnly()).thenReturn(user);

        bookmarkService.removeBookmarkForCurrentUser(4L);

        verify(bookmarkRepository).deleteByUserAndTermId(user, 4L);
    }
}
