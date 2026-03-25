package com.csd.cs203t1.bookmark;

import com.csd.cs203t1.term.Term;
import com.csd.cs203t1.term.TermRepository;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final UserBookmarkRepository bookmarkRepository;
    private final TermRepository termRepository;
    private final UserService userService;

    public BookmarkController(UserBookmarkRepository bookmarkRepository,
                              TermRepository termRepository,
                              UserService userService) {
        this.bookmarkRepository = bookmarkRepository;
        this.termRepository = termRepository;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getBookmarks() {
        try {
            User user = userService.getCurrentUser();
            List<Long> ids = bookmarkRepository.findByUser(user).stream()
                    .map(b -> b.getTerm().getId())
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ids);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PostMapping("/{termId}")
    public ResponseEntity<?> addBookmark(@PathVariable Long termId) {
        try {
            User user = userService.getCurrentUser();
            if (bookmarkRepository.findByUserAndTermId(user, termId).isPresent()) {
                return ResponseEntity.ok().build();
            }
            Term term = termRepository.findById(termId)
                    .orElseThrow(() -> new IllegalArgumentException("Term not found"));
            UserBookmark bookmark = new UserBookmark();
            bookmark.setUser(user);
            bookmark.setTerm(term);
            bookmarkRepository.save(bookmark);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @DeleteMapping("/{termId}")
    @Transactional
    public ResponseEntity<?> removeBookmark(@PathVariable Long termId) {
        try {
            User user = userService.getCurrentUser();
            bookmarkRepository.deleteByUserAndTermId(user, termId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }
}
