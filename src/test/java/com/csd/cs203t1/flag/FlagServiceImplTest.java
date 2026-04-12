package com.csd.cs203t1.flag;

import com.csd.cs203t1.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("FlagServiceImpl Unit Tests")
class FlagServiceImplTest {

    @Mock
    private FlagRepository flagRepository;

    @InjectMocks
    private FlagServiceImpl flagService;

    @Test
    @DisplayName("createFlag rejects invalid content type")
    void createFlag_invalidContentType_throws() {
        FlagDTO.CreateFlagRequest req = new FlagDTO.CreateFlagRequest("bad_type", 1L, "spam", "d", "ctx");
        User reporter = new User();

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> flagService.createFlag(req, reporter));

        assertTrue(ex.getMessage().contains("Invalid content type"));
    }

    @Test
    @DisplayName("createFlag saves normalized enum values and returns response")
    void createFlag_success() {
        FlagDTO.CreateFlagRequest req = new FlagDTO.CreateFlagRequest("question", 11L, "spam", "detail", "ctx");
        User reporter = new User();
        reporter.setUsername("alice");

        when(flagRepository.save(any(Flag.class))).thenAnswer(invocation -> {
            Flag f = invocation.getArgument(0);
            f.setId(9L);
            f.setCreatedAt(LocalDateTime.now());
            return f;
        });

        FlagDTO.FlagResponse response = flagService.createFlag(req, reporter);

        ArgumentCaptor<Flag> captor = ArgumentCaptor.forClass(Flag.class);
        verify(flagRepository).save(captor.capture());
        Flag saved = captor.getValue();

        assertEquals(ContentType.QUESTION, saved.getContentType());
        assertEquals(FlagReason.SPAM, saved.getReason());
        assertEquals("alice", response.getReportedBy());
        assertEquals("QUESTION", response.getContentType());
    }

    @Test
    @DisplayName("updateStatus throws when flag not found")
    void updateStatus_notFound_throws() {
        when(flagRepository.findById(7L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> flagService.updateStatus(7L, "REVIEWED"));

        assertEquals("Flag not found", ex.getMessage());
    }

    @Test
    @DisplayName("hasUserFlagged throws for invalid content type")
    void hasUserFlagged_invalidType_throws() {
        User reporter = new User();

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> flagService.hasUserFlagged(reporter, "not_real", 3L));

        assertTrue(ex.getMessage().contains("Invalid content type"));
    }

    @Test
    @DisplayName("deleteResolvedFlags delegates to repository")
    void deleteResolvedFlags_delegates() {
        flagService.deleteResolvedFlags();
        verify(flagRepository).deleteByStatus(FlagStatus.RESOLVED);
    }
}
