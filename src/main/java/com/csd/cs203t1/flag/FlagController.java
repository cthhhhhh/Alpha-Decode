package com.csd.cs203t1.flag;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;

@RestController
@RequestMapping("/api/flags")
public class FlagController {

    private final FlagService flagService;
    private final UserService userService;

    public FlagController(FlagService flagService, UserService userService) {
        this.flagService = flagService;
        this.userService = userService;
    }

    /** Public — returns enum values for frontend dropdown. */
    @GetMapping("/reasons")
    public ResponseEntity<List<String>> getFlagReasons() {
        return ResponseEntity.ok(flagService.getFlagReasons());
    }

    /** Authenticated user submits a flag. */
    @PostMapping
    public ResponseEntity<?> createFlag(@RequestBody FlagDTO.CreateFlagRequest request) {
        try {
            User user = userService.getCurrentUserReadOnly();
            if (user == null) return ResponseEntity.status(401).body("Session expired. Please log in again.");
            
            FlagDTO.FlagResponse response = flagService.createFlag(request, user);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("auth")) {
                return ResponseEntity.status(401).body("Authentication failed: " + e.getMessage());
            }
            return ResponseEntity.status(500).body("Error creating flag: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }

    /** Admin — view all flags. */
    @GetMapping
    public ResponseEntity<List<FlagDTO.FlagResponse>> getAllFlags() {
        return ResponseEntity.ok(flagService.getAllFlags());
    }

    /** Admin — update flag status. */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateFlagStatus(@PathVariable Long id,
                                               @RequestBody FlagDTO.UpdateStatusRequest request) {
        try {
            return ResponseEntity.ok(flagService.updateStatus(id, request.getStatus()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** Admin — delete individual flag. */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFlag(@PathVariable Long id) {
        flagService.deleteFlag(id);
        return ResponseEntity.noContent().build();
    }

    /** Admin — delete all resolved flags. */
    @DeleteMapping("/resolved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteResolvedFlags() {
        flagService.deleteResolvedFlags();
        return ResponseEntity.noContent().build();
    }
}
