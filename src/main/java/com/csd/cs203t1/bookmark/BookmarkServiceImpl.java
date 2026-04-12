package com.csd.cs203t1.bookmark;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.csd.cs203t1.term.Term;
import com.csd.cs203t1.term.TermRepository;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;

@Service
public class BookmarkServiceImpl implements BookmarkService {

    private final UserBookmarkRepository bookmarkRepository;
    private final TermRepository termRepository;
    private final UserService userService;

    public BookmarkServiceImpl(UserBookmarkRepository bookmarkRepository,
                               TermRepository termRepository,
                               UserService userService) {
        this.bookmarkRepository = bookmarkRepository;
        this.termRepository = termRepository;
        this.userService = userService;
    }

    @Override
    public List<Long> getBookmarkIdsForCurrentUser() {
        User user = userService.getCurrentUserReadOnly();
        return bookmarkRepository.findByUser(user).stream()
                .map(b -> b.getTerm().getId())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addBookmarkForCurrentUser(Long termId) {
        User user = userService.getCurrentUserReadOnly();
        if (bookmarkRepository.findByUserAndTermId(user, termId).isPresent()) {
            return;
        }

        Term term = termRepository.findById(termId)
                .orElseThrow(() -> new IllegalArgumentException("Term not found"));

        UserBookmark bookmark = new UserBookmark();
        bookmark.setUser(user);
        bookmark.setTerm(term);
        bookmarkRepository.save(bookmark);
    }

    @Override
    @Transactional
    public void removeBookmarkForCurrentUser(Long termId) {
        User user = userService.getCurrentUserReadOnly();
        bookmarkRepository.deleteByUserAndTermId(user, termId);
    }
}
