package com.csd.cs203t1.flag;

import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        return ResponseEntity.ok(FlagService.getFlagReasons());
    }

    /** Authenticated user submits a flag. */
    @PostMapping
    public ResponseEntity<?> createFlag(@RequestBody FlagDTO.CreateFlagRequest request) {
        try {
            User user = userService.getCurrentUser();
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
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFlag(@PathVariable Long id) {
        flagService.deleteFlag(id);
        return ResponseEntity.noContent().build();
    }

    /** Admin — delete all resolved flags. */
    @DeleteMapping("/resolved")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteResolvedFlags() {
        flagService.deleteResolvedFlags();
        return ResponseEntity.noContent().build();
    }
}
