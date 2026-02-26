package com.csd.cs203t1.question;


import jakarta.persistence.Entity;
import jakarta.persistence.DiscriminatorValue;



import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@Entity
@DiscriminatorValue("INTRO")
@SuperBuilder
public class IntroQuestion extends Question{
	@NonNull
	private String content;

}
