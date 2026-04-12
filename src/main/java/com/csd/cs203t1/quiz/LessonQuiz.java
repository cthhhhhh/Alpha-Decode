package com.csd.cs203t1.quiz;

import com.csd.cs203t1.lesson.Lesson;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

