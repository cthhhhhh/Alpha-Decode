package com.csd.cs203t1.question;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@Schema(
    description = "Base schema for questionsDTO",
    oneOf = {IntroQuestionDTO.class, SelectQuestionDTO.class, TranslateQuestionDTO.class}
)
@Getter
@Setter
@SuperBuilder
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, 
    include = JsonTypeInfo.As.EXISTING_PROPERTY, 
    property = "question_type", // Must match your Entity
    visible = true 
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = IntroQuestionDTO.class, name = "INTRO"),
    @JsonSubTypes.Type(value = SelectQuestionDTO.class, name = "SELECT"),
    @JsonSubTypes.Type(value = TranslateQuestionDTO.class, name = "TRANSLATE")
})
@NoArgsConstructor
@AllArgsConstructor
public abstract class QuestionDTO {
	private String explanation;
	private String question_type;
    private String title;
    private String content;
}
