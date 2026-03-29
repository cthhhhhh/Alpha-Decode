package com.csd.cs203t1.draft;

import com.csd.cs203t1.lesson.Lesson;
import com.csd.cs203t1.user.User;

import java.util.List;
import java.util.Map;

public interface LessonDraftService {

    // Contributor operations
    LessonDraftDTO.DraftSummary createDraft(LessonDraftDTO.SaveDraftRequest req, User contributor);

    LessonDraftDTO.DraftSummary updateDraft(Long id, LessonDraftDTO.SaveDraftRequest req, User contributor);

    void deleteDraft(Long id, User contributor);

    LessonDraftDTO.DraftSummary submitDraft(Long id, User contributor);

    List<LessonDraftDTO.DraftSummary> getMyDrafts(User contributor);

    List<LessonDraftDTO.DraftSummary> getMyApprovedDrafts(User contributor);

    LessonDraftDTO.DraftDetail getDraftDetail(Long id, User contributor);

    Map<String, Long> getMyDraftStats(User contributor);

    // Admin operations
    List<LessonDraftDTO.DraftSummary> getSubmittedDrafts();

    LessonDraftDTO.DraftDetail getAnyDraftDetail(Long id);

    Lesson approveDraft(Long id);

    LessonDraftDTO.DraftSummary rejectDraft(Long id, String rejectionNote);
}
