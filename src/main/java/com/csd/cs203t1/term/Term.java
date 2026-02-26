package com.csd.cs203t1.term;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.csd.cs203t1.lesson.Lesson;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.OneToOne;
import lombok.*;

@Builder
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name="terms")
public class Term {
	private @Id @GeneratedValue (strategy = GenerationType.IDENTITY) Long id;

	@NonNull
	@Column(nullable=false)
	private String term;

	@NonNull
	@Column(nullable=false)
	private String definition;

	@NonNull
	@Column(nullable=false)
	private String example;

	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	private Difficulty difficulty; //makes it so you can only enter the difficulties set in Difficulty.java and not some random value

	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	private Category category ; 

	@OneToOne
	@JoinColumn(name="lesson_id")
	@JsonIgnore
	@OnDelete(action= OnDeleteAction.CASCADE) //makes it so when lesson is deleted the corresponding term is deleted
	private Lesson lesson;

	@JsonProperty("lesson_id") // makes it so select returns lesson_id, not the entire lesson object
    public Long getLessonId() {
        return (lesson != null) ? lesson.getId() : null;
    }
}
