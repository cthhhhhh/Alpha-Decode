package com.csd.cs203t1.draft;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import com.csd.cs203t1.lesson.Lesson;
import com.csd.cs203t1.lesson.LessonRepository;
import com.csd.cs203t1.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
@DisplayName("DraftServiceImpl Unit Tests")
class DraftServiceImplTest {

    @Mock private DraftRepository draftRepository;
    @Mock private LessonRepository lessonRepository;
    @Mock private UserRepository userRepository;
    @Spy private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private DraftServiceImpl draftService;

    private Draft draft;

    @BeforeEach
    void setUp() {
        draft = Draft.builder()
                .id(1L)
                .contributorId(10L)
                .title("Initial Title")
                .story("Initial Story")
                .emoji("book")
                .colour("#123456")
                .status(DraftStatus.DRAFT)
                .questionsJson("[]")
                .build();
    }

    @Test
    @DisplayName("createDraft: success saves new draft")
    void createDraft_success() {
        DraftDTO.CreateOrUpdateDraftRequest req = new DraftDTO.CreateOrUpdateDraftRequest();
        req.setTitle("New Draft");
        
        when(draftRepository.save(any(Draft.class))).thenAnswer(i -> i.getArgument(0));

        DraftDTO.DraftResponse response = draftService.createDraft(req, 10L);

        assertEquals("New Draft", response.getTitle());
        assertEquals(DraftStatus.DRAFT, response.getStatus());
        verify(draftRepository).save(any(Draft.class));
    }

    @Test
    @DisplayName("updateDraft: success updates fields")
    void updateDraft_success() {
        when(draftRepository.findById(1L)).thenReturn(Optional.of(draft));
        when(draftRepository.save(any(Draft.class))).thenAnswer(i -> i.getArgument(0));

        DraftDTO.CreateOrUpdateDraftRequest req = new DraftDTO.CreateOrUpdateDraftRequest();
        req.setTitle("Updated Title");

        DraftDTO.DraftResponse response = draftService.updateDraft(1L, req, 10L);

        assertEquals("Updated Title", response.getTitle());
        verify(draftRepository).save(draft);
    }

    @Test
    @DisplayName("updateDraft: throws if not owner")
    void updateDraft_wrongOwner_throwsException() {
        when(draftRepository.findById(1L)).thenReturn(Optional.of(draft));

        DraftDTO.CreateOrUpdateDraftRequest req = new DraftDTO.CreateOrUpdateDraftRequest();
        
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, 
            () -> draftService.updateDraft(1L, req, 99L));
        assertEquals("You do not own this draft", ex.getMessage());
    }

    @Test
    @DisplayName("updateDraft: throws if status is not DRAFT")
    void updateDraft_notInDraftStatus_throwsException() {
        draft.setStatus(DraftStatus.PENDING);
        when(draftRepository.findById(1L)).thenReturn(Optional.of(draft));

        DraftDTO.CreateOrUpdateDraftRequest req = new DraftDTO.CreateOrUpdateDraftRequest();
        
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, 
            () -> draftService.updateDraft(1L, req, 10L));
        assertEquals("Only drafts with DRAFT status can be edited", ex.getMessage());
    }

    @Test
    @DisplayName("approveDraft: success creates lesson and marks approved")
    void approveDraft_success() {
        draft.setStatus(DraftStatus.PENDING);
        when(draftRepository.findById(1L)).thenReturn(Optional.of(draft));
        
        Lesson mockLesson = new Lesson();
        mockLesson.setId(100L);
        when(lessonRepository.save(any(Lesson.class))).thenReturn(mockLesson);
        when(draftRepository.save(any(Draft.class))).thenAnswer(i -> i.getArgument(0));

        DraftDTO.DraftResponse response = draftService.approveDraft(1L);

        assertEquals(DraftStatus.APPROVED, response.getStatus());
        assertEquals(100L, response.getApprovedLessonId());
        verify(lessonRepository).save(any(Lesson.class));
    }

    @Test
    @DisplayName("approveDraft: throws if status is not PENDING")
    void approveDraft_notPending_throwsException() {
        draft.setStatus(DraftStatus.DRAFT);
        when(draftRepository.findById(1L)).thenReturn(Optional.of(draft));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, 
            () -> draftService.approveDraft(1L));
        assertEquals("Only pending drafts can be approved", ex.getMessage());
    }

    @Test
    @DisplayName("rejectDraft: success marks rejected with reason")
    void rejectDraft_success() {
        draft.setStatus(DraftStatus.PENDING);
        when(draftRepository.findById(1L)).thenReturn(Optional.of(draft));
        when(draftRepository.save(any(Draft.class))).thenAnswer(i -> i.getArgument(0));

        DraftDTO.DraftResponse response = draftService.rejectDraft(1L, "Bad quality");

        assertEquals(DraftStatus.REJECTED, response.getStatus());
        assertEquals("Bad quality", response.getRejectionReason());
    }
}
