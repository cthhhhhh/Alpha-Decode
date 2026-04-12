package com.csd.cs203t1.bookmark;

import java.util.List;

public interface BookmarkService {
    List<Long> getBookmarkIdsForCurrentUser();
    void addBookmarkForCurrentUser(Long termId);
    void removeBookmarkForCurrentUser(Long termId);
}
