package com.csd.cs203t1.question;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.DiscriminatorValue;



import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@DiscriminatorValue("TRANSLATE")
@SuperBuilder
public class TranslateQuestion extends Question{

	@NonNull
	private List<String> wordbank;

	@NonNull
	private String target;

}
