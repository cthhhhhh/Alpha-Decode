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
@DiscriminatorValue("SELECT")
@SuperBuilder
public class SelectQuestion extends Question{

	@NonNull
	@jakarta.persistence.Column(columnDefinition = "TEXT")
	private List<String> options;

	@NonNull
	private Integer correctAnswer;

}
