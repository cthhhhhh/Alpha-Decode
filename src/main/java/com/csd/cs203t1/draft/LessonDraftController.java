package com.csd.cs203t1.draft;

import com.csd.cs203t1.lesson.Lesson;
import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drafts")
public class LessonDraftController {

    private final LessonDraftService draftService;
    private final UserService userService;

    public LessonDraftController(LessonDraftService draftService, UserService userService) {
        this.draftService = draftService;
        this.userService = userService;
    }

    // ── Contributor endpoints ──────────────────────────────────────────────

    @PreAuthorize("hasRole('CONTRIBUTOR')")
    @GetMapping("/my")
    public ResponseEntity<List<LessonDraftDTO.DraftSummary>> getMyDrafts() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(draftService.getMyDrafts(user));
    }

    @PreAuthorize("hasRole('CONTRIBUTOR')")
    @GetMapping("/my/stats")
    public ResponseEntity<Map<String, Long>> getMyStats() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(draftService.getMyDraftStats(user));
    }

    @PreAuthorize("hasAnyRole('CONTRIBUTOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<LessonDraftDTO.DraftDetail> getDraftDetail(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return ResponseEntity.ok(draftService.getAnyDraftDetail(id));
        }
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(draftService.getDraftDetail(id, user));
    }

    @PreAuthorize("hasRole('CONTRIBUTOR')")
    @PostMapping
    public ResponseEntity<LessonDraftDTO.DraftSummary> createDraft(
            @RequestBody LessonDraftDTO.SaveDraftRequest req) {
        User user = userService.getCurrentUser();
        return new ResponseEntity<>(draftService.createDraft(req, user), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('CONTRIBUTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<LessonDraftDTO.DraftSummary> updateDraft(
            @PathVariable Long id,
            @RequestBody LessonDraftDTO.SaveDraftRequest req) {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(draftService.updateDraft(id, req, user));
    }

    @PreAuthorize("hasRole('CONTRIBUTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDraft(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        draftService.deleteDraft(id, user);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('CONTRIBUTOR')")
    @PostMapping("/{id}/submit")
    public ResponseEntity<LessonDraftDTO.DraftSummary> submitDraft(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(draftService.submitDraft(id, user));
    }

    // ── Admin endpoints ────────────────────────────────────────────────────

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/submitted")
    public ResponseEntity<List<LessonDraftDTO.DraftSummary>> getSubmitted() {
        return ResponseEntity.ok(draftService.getSubmittedDrafts());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/review")
    public ResponseEntity<?> reviewDraft(
            @PathVariable Long id,
            @RequestBody LessonDraftDTO.ReviewRequest req) {
        if ("APPROVE".equalsIgnoreCase(req.getAction())) {
            Lesson lesson = draftService.approveDraft(id);
            return ResponseEntity.ok(lesson);
        } else if ("REJECT".equalsIgnoreCase(req.getAction())) {
            return ResponseEntity.ok(draftService.rejectDraft(id, req.getRejectionNote()));
        }
        return ResponseEntity.badRequest().body("action must be APPROVE or REJECT");
    }
}
