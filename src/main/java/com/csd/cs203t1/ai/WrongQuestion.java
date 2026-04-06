package com.csd.cs203t1.ai;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WrongQuestion {
    private int questionNumber;
    private String questionText;
    private String userAnswer;
    private String correctAnswer;
}
