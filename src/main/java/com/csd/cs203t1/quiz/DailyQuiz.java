package com.csd.cs203t1.quiz;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.DiscriminatorValue;



import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@DiscriminatorValue("DAILY")
public class DailyQuiz extends Quiz {
	@NonNull
	private LocalDate date;
}
