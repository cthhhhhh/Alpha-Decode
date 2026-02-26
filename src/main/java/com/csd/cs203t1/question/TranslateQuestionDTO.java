package com.csd.cs203t1.question;
import java.util.List;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TranslateQuestionDTO extends QuestionDTO {
	@NonNull
	private List<String> wordbank;

	@NonNull
	private String target;
}
