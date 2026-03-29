package com.csd.cs203t1.lesson;

import com.csd.cs203t1.quiz.LessonQuiz;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;


import lombok.*;

@Builder
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name="lessons")

public class Lesson {
	private @Id @GeneratedValue (strategy = GenerationType.IDENTITY) Long id;

	@NonNull
	@Column(nullable=false, columnDefinition = "TEXT")
	private String title;

	@NonNull
	@Column(columnDefinition = "TEXT")
	private String colour;

	@NonNull
	@Column(nullable=false, columnDefinition = "TEXT")
	private String story;

	@NonNull
	@Column(columnDefinition = "TEXT")
	private String emoji;

	
	@OneToOne(mappedBy="lesson", cascade= CascadeType.ALL)
	@JsonManagedReference
	private LessonQuiz quiz;

	//if we want to make it such that there can be multiple courses, can many to one join courses, but for now i leave it here
}
