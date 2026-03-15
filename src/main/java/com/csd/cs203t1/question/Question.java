package com.csd.cs203t1.question;

import com.csd.cs203t1.quiz.Quiz;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.Table;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "question_type")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, 
    include = JsonTypeInfo.As.EXISTING_PROPERTY, // Uses the actual column
    property = "question_type",
    visible = true 
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = IntroQuestion.class, name = "INTRO"),
    @JsonSubTypes.Type(value = SelectQuestion.class, name = "SELECT"),
	@JsonSubTypes.Type(value = TranslateQuestion.class, name = "TRANSLATE")
})
@Table(name="questions")
public abstract class Question {
	private @Id @GeneratedValue (strategy = GenerationType.IDENTITY) Long id;

	// Exposes the Hibernate discriminator column as a JSON property
	@Column(name = "question_type", insertable = false, updatable = false)
	private String question_type;

	@NonNull
	@Column(nullable=false)
	private String explanation;

	@NonNull
	@Column(nullable=false)
	private String title;
	//quiz_type is auto constructed via inheritance

	private String content;

	@ManyToOne
	@JoinColumn(name="quiz_id")
	@JsonBackReference
	private Quiz quiz;
}
