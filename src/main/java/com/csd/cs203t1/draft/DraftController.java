package com.csd.cs203t1.draft;

import com.csd.cs203t1.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drafts")
public class DraftController {

    private final DraftService draftService;
    private final UserService userService;

    public DraftController(DraftService draftService, UserService userService) {
        this.draftService = draftService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CONTRIBUTOR')")
    public ResponseEntity<?> createDraft(@RequestBody DraftDTO.CreateOrUpdateDraftRequest req) {
        try {
            Long contributorId = userService.getCurrentUser().getId();
            return ResponseEntity.ok(draftService.createDraft(req, contributorId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CONTRIBUTOR')")
    public ResponseEntity<?> updateDraft(@PathVariable Long id,
                                         @RequestBody DraftDTO.CreateOrUpdateDraftRequest req) {
        try {
            Long contributorId = userService.getCurrentUser().getId();
            return ResponseEntity.ok(draftService.updateDraft(id, req, contributorId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('CONTRIBUTOR')")
    public ResponseEntity<?> submitDraft(@PathVariable Long id) {
        try {
            Long contributorId = userService.getCurrentUser().getId();
            return ResponseEntity.ok(draftService.submitDraft(id, contributorId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CONTRIBUTOR')")
    public ResponseEntity<?> deleteDraft(@PathVariable Long id) {
        try {
            Long contributorId = userService.getCurrentUser().getId();
            draftService.deleteDraft(id, contributorId);
            return ResponseEntity.ok("Draft deleted");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('CONTRIBUTOR')")
    public ResponseEntity<List<DraftDTO.DraftResponse>> getMyDrafts() {
        Long contributorId = userService.getCurrentUser().getId();
        return ResponseEntity.ok(draftService.getDraftsForContributor(contributorId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DraftDTO.DraftResponse>> getPendingDrafts() {
        return ResponseEntity.ok(draftService.getPendingDrafts());
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveDraft(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(draftService.approveDraft(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectDraft(@PathVariable Long id,
                                          @RequestBody DraftDTO.RejectDraftRequest req) {
        try {
            return ResponseEntity.ok(draftService.rejectDraft(id, req.getRejectionReason()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
