package com.csd.cs203t1.draft;

import com.csd.cs203t1.lesson.Lesson;
import com.csd.cs203t1.lesson.LessonDTO;
import com.csd.cs203t1.lesson.LessonService;
import com.csd.cs203t1.question.QuestionDTO;
import com.csd.cs203t1.user.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LessonDraftServiceImpl implements LessonDraftService {

    private final LessonDraftRepository draftRepository;
    private final LessonService lessonService;
    private final ObjectMapper objectMapper;

    public LessonDraftServiceImpl(LessonDraftRepository draftRepository,
                                   LessonService lessonService,
                                   ObjectMapper objectMapper) {
        this.draftRepository = draftRepository;
        this.lessonService = lessonService;
        this.objectMapper = objectMapper;
    }

    // ── Contributor operations ────────────────────────────────────────────────

    @Override
    @Transactional
    public LessonDraftDTO.DraftSummary createDraft(LessonDraftDTO.SaveDraftRequest req, User contributor) {
        LessonDraft draft = LessonDraft.builder()
                .title(req.getTitle())
                .colour(req.getColour())
                .story(req.getStory())
                .emoji(req.getEmoji())
                .contributor(contributor)
                .status(DraftStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        draft = draftRepository.save(draft);
        setQuestions(draft, req.getQuestions());
        return toSummary(draftRepository.save(draft));
    }

    @Override
    @Transactional
    public LessonDraftDTO.DraftSummary updateDraft(Long id, LessonDraftDTO.SaveDraftRequest req, User contributor) {
        LessonDraft draft = loadOwned(id, contributor);
        if (draft.getStatus() != DraftStatus.DRAFT && draft.getStatus() != DraftStatus.REJECTED) {
            throw new IllegalStateException("Only DRAFT or REJECTED drafts can be edited");
        }

        draft.setTitle(req.getTitle());
        draft.setColour(req.getColour());
        draft.setStory(req.getStory());
        draft.setEmoji(req.getEmoji());
        draft.setUpdatedAt(LocalDateTime.now());
        draft.getQuestions().clear();
        setQuestions(draft, req.getQuestions());

        return toSummary(draftRepository.save(draft));
    }

    @Override
    @Transactional
    public void deleteDraft(Long id, User contributor) {
        LessonDraft draft = loadOwned(id, contributor);
        if (draft.getStatus() == DraftStatus.SUBMITTED || draft.getStatus() == DraftStatus.APPROVED) {
            throw new IllegalStateException("Cannot delete a SUBMITTED or APPROVED draft");
        }
        draftRepository.delete(draft);
    }

    @Override
    @Transactional
    public LessonDraftDTO.DraftSummary submitDraft(Long id, User contributor) {
        LessonDraft draft = loadOwned(id, contributor);
        if (draft.getStatus() != DraftStatus.DRAFT && draft.getStatus() != DraftStatus.REJECTED) {
            throw new IllegalStateException("Only DRAFT or REJECTED drafts can be submitted");
        }
        draft.setStatus(DraftStatus.SUBMITTED);
        draft.setRejectionNote(null);
        draft.setUpdatedAt(LocalDateTime.now());
        return toSummary(draftRepository.save(draft));
    }

    @Override
    public List<LessonDraftDTO.DraftSummary> getMyDrafts(User contributor) {
        return draftRepository.findByContributorOrderByUpdatedAtDesc(contributor)
                .stream().map(this::toSummary).collect(Collectors.toList());
    }

    @Override
    public LessonDraftDTO.DraftDetail getDraftDetail(Long id, User contributor) {
        LessonDraft draft = loadOwned(id, contributor);
        return toDetail(draft);
    }

    @Override
    public Map<String, Long> getMyDraftStats(User contributor) {
        Map<String, Long> stats = new LinkedHashMap<>();
        long total = draftRepository.findByContributorOrderByUpdatedAtDesc(contributor).size();
        stats.put("total", total);
        stats.put("draft", draftRepository.countByContributorAndStatus(contributor, DraftStatus.DRAFT));
        stats.put("submitted", draftRepository.countByContributorAndStatus(contributor, DraftStatus.SUBMITTED));
        stats.put("approved", draftRepository.countByContributorAndStatus(contributor, DraftStatus.APPROVED));
        stats.put("rejected", draftRepository.countByContributorAndStatus(contributor, DraftStatus.REJECTED));
        return stats;
    }

    // ── Admin operations ──────────────────────────────────────────────────────

    @Override
    public List<LessonDraftDTO.DraftSummary> getSubmittedDrafts() {
        return draftRepository.findByStatusOrderByUpdatedAtAsc(DraftStatus.SUBMITTED)
                .stream().map(this::toSummary).collect(Collectors.toList());
    }

    @Override
    public LessonDraftDTO.DraftDetail getAnyDraftDetail(Long id) {
        LessonDraft draft = draftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Draft not found"));
        return toDetail(draft);
    }

    @Override
    @Transactional
    public Lesson approveDraft(Long id) {
        LessonDraft draft = draftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Draft not found"));
        if (draft.getStatus() != DraftStatus.SUBMITTED) {
            throw new IllegalStateException("Only SUBMITTED drafts can be approved");
        }

        List<QuestionDTO> questionDTOs = draft.getQuestions().stream()
                .map(dq -> {
                    try {
                        return objectMapper.readValue(dq.getQuestionJson(), QuestionDTO.class);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to deserialize question", e);
                    }
                })
                .collect(Collectors.toList());

        LessonDTO lessonDTO = new LessonDTO();
        lessonDTO.setTitle(draft.getTitle());
        lessonDTO.setColour(draft.getColour());
        lessonDTO.setStory(draft.getStory());
        lessonDTO.setEmoji(draft.getEmoji());

        Lesson lesson = lessonService.addLesson(lessonDTO, questionDTOs);

        draft.setStatus(DraftStatus.APPROVED);
        draft.setUpdatedAt(LocalDateTime.now());
        draftRepository.save(draft);

        return lesson;
    }

    @Override
    @Transactional
    public LessonDraftDTO.DraftSummary rejectDraft(Long id, String rejectionNote) {
        LessonDraft draft = draftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Draft not found"));
        if (draft.getStatus() != DraftStatus.SUBMITTED) {
            throw new IllegalStateException("Only SUBMITTED drafts can be rejected");
        }
        draft.setStatus(DraftStatus.REJECTED);
        draft.setRejectionNote(rejectionNote);
        draft.setUpdatedAt(LocalDateTime.now());
        return toSummary(draftRepository.save(draft));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private LessonDraft loadOwned(Long id, User contributor) {
        LessonDraft draft = draftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Draft not found"));
        if (!draft.getContributor().getId().equals(contributor.getId())) {
            throw new SecurityException("Access denied: not your draft");
        }
        return draft;
    }

    private void setQuestions(LessonDraft draft, List<QuestionDTO> questionDTOs) {
        if (questionDTOs == null) return;
        List<DraftQuestion> draftQuestions = new ArrayList<>();
        for (int i = 0; i < questionDTOs.size(); i++) {
            try {
                String json = objectMapper.writeValueAsString(questionDTOs.get(i));
                DraftQuestion dq = DraftQuestion.builder()
                        .draft(draft)
                        .questionJson(json)
                        .questionOrder(i)
                        .build();
                draftQuestions.add(dq);
            } catch (Exception e) {
                throw new RuntimeException("Failed to serialize question", e);
            }
        }
        draft.getQuestions().addAll(draftQuestions);
    }

    private LessonDraftDTO.DraftSummary toSummary(LessonDraft draft) {
        return LessonDraftDTO.DraftSummary.builder()
                .id(draft.getId())
                .title(draft.getTitle())
                .colour(draft.getColour())
                .emoji(draft.getEmoji())
                .status(draft.getStatus().name())
                .rejectionNote(draft.getRejectionNote())
                .createdAt(draft.getCreatedAt())
                .updatedAt(draft.getUpdatedAt())
                .contributorUsername(draft.getContributor().getUsername())
                .build();
    }

    private LessonDraftDTO.DraftDetail toDetail(LessonDraft draft) {
        List<QuestionDTO> questions = draft.getQuestions().stream()
                .map(dq -> {
                    try {
                        return objectMapper.readValue(dq.getQuestionJson(), QuestionDTO.class);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to deserialize question", e);
                    }
                })
                .collect(Collectors.toList());

        return LessonDraftDTO.DraftDetail.builder()
                .id(draft.getId())
                .title(draft.getTitle())
                .colour(draft.getColour())
                .story(draft.getStory())
                .emoji(draft.getEmoji())
                .status(draft.getStatus().name())
                .rejectionNote(draft.getRejectionNote())
                .createdAt(draft.getCreatedAt())
                .updatedAt(draft.getUpdatedAt())
                .contributorUsername(draft.getContributor().getUsername())
                .questions(questions)
                .build();
    }
}
