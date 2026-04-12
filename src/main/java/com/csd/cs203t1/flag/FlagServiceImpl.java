package com.csd.cs203t1.flag;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.csd.cs203t1.user.User;

@Service
public class FlagServiceImpl implements FlagService {

    private final FlagRepository flagRepository;

    public FlagServiceImpl(FlagRepository flagRepository) {
        this.flagRepository = flagRepository;
    }

    @Override
    public FlagDTO.FlagResponse createFlag(FlagDTO.CreateFlagRequest request, User reporter) {
        ContentType contentType;
        FlagReason reason;
        try {
            contentType = ContentType.valueOf(request.getContentType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid content type: " + request.getContentType());
        }
        try {
            reason = FlagReason.valueOf(request.getReason().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid reason: " + request.getReason());
        }

        // Allow multiple flags from same user on same content per user request
        /*
        flagRepository.findByReportedByAndContentTypeAndContentId(reporter, contentType, request.getContentId())
                .ifPresent(f -> { throw new IllegalArgumentException("You have already flagged this content"); });
        */

        Flag flag = Flag.builder()
                .contentType(contentType)
                .contentId(request.getContentId())
                .reason(reason)
                .details(request.getDetails())
                .contentContext(request.getContentContext())
                .reportedBy(reporter)
                .createdAt(LocalDateTime.now())
                .build();

        Flag saved = flagRepository.save(flag);
        return toResponse(saved);
    }

    @Override
    public List<FlagDTO.FlagResponse> getAllFlags() {
        return flagRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FlagDTO.FlagResponse updateStatus(Long flagId, String status) {
        Flag flag = flagRepository.findById(flagId)
                .orElseThrow(() -> new IllegalArgumentException("Flag not found"));
        flag.setStatus(FlagStatus.valueOf(status.toUpperCase()));
        return toResponse(flagRepository.save(flag));
    }

    @Override
    public boolean hasUserFlagged(User user, String contentType, Long contentId) {
        ContentType ct;
        try {
            ct = ContentType.valueOf(contentType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid content type: " + contentType);
        }
        return flagRepository.findByReportedByAndContentTypeAndContentId(user, ct, contentId).isPresent();
    }

    @Override
    public List<String> getFlagReasons() {
        return Arrays.stream(FlagReason.values())
                .map(FlagReason::name)
                .toList();
    }

    @Override
    public void deleteFlag(Long id) {
        flagRepository.deleteById(id);
    }

    @Override
    public void deleteResolvedFlags() {
        flagRepository.deleteByStatus(FlagStatus.RESOLVED);
    }

    private FlagDTO.FlagResponse toResponse(Flag flag) {
        return new FlagDTO.FlagResponse(
                flag.getId(),
                flag.getContentType().name(),
                flag.getContentId(),
                flag.getReason().name(),
                flag.getDetails(),
                flag.getStatus().name(),
                flag.getCreatedAt(),
                flag.getReportedBy().getUsername(),
                flag.getContentContext()
        );
    }
}
