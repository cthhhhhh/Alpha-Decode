package com.csd.cs203t1.draft;

import com.csd.cs203t1.lesson.Lesson;
import com.csd.cs203t1.lesson.LessonDTO;
import com.csd.cs203t1.lesson.LessonService;
import com.csd.cs203t1.question.QuestionDTO;
import com.csd.cs203t1.user.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DraftServiceImpl implements DraftService {

    private final DraftRepository draftRepository;
    private final LessonService lessonService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public DraftServiceImpl(DraftRepository draftRepository,
                            LessonService lessonService,
                            UserRepository userRepository,
                            ObjectMapper objectMapper) {
        this.draftRepository = draftRepository;
        this.lessonService = lessonService;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public DraftDTO.DraftResponse createDraft(DraftDTO.CreateOrUpdateDraftRequest req, Long contributorId) {
        Draft draft = Draft.builder()
                .contributorId(contributorId)
                .title(req.getTitle())
                .story(req.getStory())
                .emoji(req.getEmoji())
                .colour(req.getColour())
                .questionsJson(req.getQuestionsJson() != null ? req.getQuestionsJson() : "[]")
                .status(DraftStatus.DRAFT)
                .build();
        return toResponse(draftRepository.save(draft));
    }

    @Override
    public DraftDTO.DraftResponse updateDraft(Long draftId, DraftDTO.CreateOrUpdateDraftRequest req, Long contributorId) {
        Draft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new IllegalArgumentException("Draft not found"));
        if (!draft.getContributorId().equals(contributorId)) {
            throw new IllegalArgumentException("You do not own this draft");
        }
        if (draft.getStatus() != DraftStatus.DRAFT) {
            throw new IllegalArgumentException("Only drafts with DRAFT status can be edited");
        }
        if (req.getTitle() != null) draft.setTitle(req.getTitle());
        if (req.getStory() != null) draft.setStory(req.getStory());
        if (req.getEmoji() != null) draft.setEmoji(req.getEmoji());
        if (req.getColour() != null) draft.setColour(req.getColour());
        if (req.getQuestionsJson() != null) draft.setQuestionsJson(req.getQuestionsJson());
        return toResponse(draftRepository.save(draft));
    }

    @Override
    public DraftDTO.DraftResponse submitDraft(Long draftId, Long contributorId) {
        Draft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new IllegalArgumentException("Draft not found"));
        if (!draft.getContributorId().equals(contributorId)) {
            throw new IllegalArgumentException("You do not own this draft");
        }
        if (draft.getStatus() != DraftStatus.DRAFT) {
            throw new IllegalArgumentException("Only drafts with DRAFT status can be submitted");
        }
        draft.setStatus(DraftStatus.PENDING);
        return toResponse(draftRepository.save(draft));
    }

    @Override
    public void deleteDraft(Long draftId, Long contributorId) {
        Draft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new IllegalArgumentException("Draft not found"));
        if (!draft.getContributorId().equals(contributorId)) {
            throw new IllegalArgumentException("You do not own this draft");
        }
        draftRepository.delete(draft);
    }

    @Override
    public List<DraftDTO.DraftResponse> getDraftsForContributor(Long contributorId) {
        return draftRepository.findByContributorId(contributorId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<DraftDTO.DraftResponse> getPendingDrafts() {
        return draftRepository.findByStatus(DraftStatus.PENDING)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public DraftDTO.DraftResponse approveDraft(Long draftId) {
        Draft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new IllegalArgumentException("Draft not found"));
        if (draft.getStatus() != DraftStatus.PENDING) {
            throw new IllegalArgumentException("Only pending drafts can be approved");
        }
        try {
            List<QuestionDTO> questions = objectMapper.readValue(
                    draft.getQuestionsJson(), new TypeReference<List<QuestionDTO>>() {});
            LessonDTO lessonDTO = new LessonDTO();
            lessonDTO.setTitle(draft.getTitle());
            lessonDTO.setStory(draft.getStory());
            lessonDTO.setEmoji(draft.getEmoji());
            lessonDTO.setColour(draft.getColour());
            Lesson lesson = lessonService.addLesson(lessonDTO, questions);
            draft.setApprovedLessonId(lesson.getId());
            draft.setStatus(DraftStatus.APPROVED);
            return toResponse(draftRepository.save(draft));
        } catch (Exception e) {
            throw new RuntimeException("Failed to create lesson from draft: " + e.getMessage(), e);
        }
    }

    @Override
    public DraftDTO.DraftResponse rejectDraft(Long draftId, String reason) {
        Draft draft = draftRepository.findById(draftId)
                .orElseThrow(() -> new IllegalArgumentException("Draft not found"));
        if (draft.getStatus() != DraftStatus.PENDING) {
            throw new IllegalArgumentException("Only pending drafts can be rejected");
        }
        draft.setStatus(DraftStatus.REJECTED);
        draft.setRejectionReason(reason);
        return toResponse(draftRepository.save(draft));
    }

    @Override
    public void handleLessonDeletion(Long lessonId) {
        draftRepository.findByApprovedLessonId(lessonId).ifPresent(draft -> {
            draft.setStatus(DraftStatus.DELETED);
            draftRepository.save(draft);
        });
    }

    private DraftDTO.DraftResponse toResponse(Draft draft) {
        DraftDTO.DraftResponse response = new DraftDTO.DraftResponse();
        response.setId(draft.getId());
        response.setContributorId(draft.getContributorId());
        response.setTitle(draft.getTitle());
        response.setStory(draft.getStory());
        response.setEmoji(draft.getEmoji());
        response.setColour(draft.getColour());
        response.setQuestionsJson(draft.getQuestionsJson());
        response.setStatus(draft.getStatus());
        response.setRejectionReason(draft.getRejectionReason());
        response.setApprovedLessonId(draft.getApprovedLessonId());
        response.setCreatedAt(draft.getCreatedAt());
        response.setUpdatedAt(draft.getUpdatedAt());
        userRepository.findById(draft.getContributorId())
                .ifPresent(u -> response.setContributorUsername(u.getUsername()));
        return response;
    }
}
