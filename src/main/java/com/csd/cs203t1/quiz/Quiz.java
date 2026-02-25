package com.csd.cs203t1.quiz;

import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import lombok.*;

import com.csd.cs203t1.lesson.Lesson;
import com.csd.cs203t1.question.Question;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

import jakarta.persistence.CascadeType;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type")
@Table(name="quizzes")
public abstract class Quiz {
	private @Id @GeneratedValue (strategy = GenerationType.IDENTITY) Long id;

	@OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
	@JsonManagedReference
    private List<Question> questions;
}
