package com.csd.cs203t1.bookmark;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    public ResponseEntity<?> getBookmarks() {
        try {
            return ResponseEntity.ok(bookmarkService.getBookmarkIdsForCurrentUser());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PostMapping("/{termId}")
    public ResponseEntity<?> addBookmark(@PathVariable Long termId) {
        try {
            bookmarkService.addBookmarkForCurrentUser(termId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @DeleteMapping("/{termId}")
    public ResponseEntity<?> removeBookmark(@PathVariable Long termId) {
        try {
            bookmarkService.removeBookmarkForCurrentUser(termId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }
}
