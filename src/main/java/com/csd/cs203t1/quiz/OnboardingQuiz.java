package com.csd.cs203t1.quiz;

import jakarta.persistence.Entity;
import jakarta.persistence.DiscriminatorValue;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@DiscriminatorValue("ONBOARDING")
public class OnboardingQuiz extends Quiz {
    // Onboarding quiz — no extra fields, just uses Quiz.questions
}
