package com.csd.cs203t1.question;

import java.util.List;


import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SelectQuestionDTO extends QuestionDTO{
	@NonNull
	private List<String> options;

	@NonNull
	private Integer correctAnswer;
}
