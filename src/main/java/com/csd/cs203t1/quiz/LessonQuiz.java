package com.csd.cs203t1.quiz;
import java.time.LocalDate;

import com.csd.cs203t1.lesson.Lesson;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.DiscriminatorValue;



import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@DiscriminatorValue("LESSON")
public class LessonQuiz extends Quiz {
	
	@OneToOne
	@JoinColumn(name="lesson_id")
	@JsonBackReference
	private Lesson lesson;

}

