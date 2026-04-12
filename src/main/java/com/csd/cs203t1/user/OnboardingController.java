package com.csd.cs203t1.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class OnboardingController {

    private final UserService userService;

    @PostMapping("/onboarding")
    public ResponseEntity<UserDTO.AuthResponse> completeOnboarding(@RequestBody UserDTO.OnboardingRequest request) {
        return ResponseEntity.ok(userService.completeOnboarding(request));
    }
}
