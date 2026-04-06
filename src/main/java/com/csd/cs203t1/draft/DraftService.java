package com.csd.cs203t1.draft;

import java.util.List;

public interface DraftService {
    DraftDTO.DraftResponse createDraft(DraftDTO.CreateOrUpdateDraftRequest req, Long contributorId);
    DraftDTO.DraftResponse updateDraft(Long draftId, DraftDTO.CreateOrUpdateDraftRequest req, Long contributorId);
    DraftDTO.DraftResponse submitDraft(Long draftId, Long contributorId);
    void deleteDraft(Long draftId, Long contributorId);
    List<DraftDTO.DraftResponse> getDraftsForContributor(Long contributorId);
    List<DraftDTO.DraftResponse> getPendingDrafts();
    DraftDTO.DraftResponse approveDraft(Long draftId);
    DraftDTO.DraftResponse rejectDraft(Long draftId, String reason);
    void handleLessonDeletion(Long lessonId);
}
