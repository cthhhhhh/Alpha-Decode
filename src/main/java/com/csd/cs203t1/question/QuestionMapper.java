package com.csd.cs203t1.question;

import com.csd.cs203t1.quiz.Quiz;

public class QuestionMapper {

    public static Question mapToEntity(QuestionDTO dto, Quiz quiz) {
        if (dto instanceof IntroQuestionDTO introDto) {
            return IntroQuestion.builder()
                    .explanation(introDto.getExplanation())
                    .quiz(quiz)
                    .title(introDto.getTitle())
                    .content(introDto.getContent())
                    .build();
        } else if (dto instanceof SelectQuestionDTO selectDto) {
            return SelectQuestion.builder()
                    .explanation(selectDto.getExplanation())
                    .quiz(quiz)
                    .title(selectDto.getTitle())
                    .options(selectDto.getOptions())
                    .correctAnswer(selectDto.getCorrectAnswer())
                    .content(selectDto.getContent())
                    .build();
        } else if (dto instanceof TranslateQuestionDTO transDto) {
            return TranslateQuestion.builder()
                    .explanation(transDto.getExplanation())
                    .quiz(quiz)
                    .title(transDto.getTitle())
                    .target(transDto.getTarget())
                    .wordbank(transDto.getWordbank())
                    .content(transDto.getContent())
                    .build();
        } else {
            throw new IllegalArgumentException("Unknown question type: " + dto.getQuestion_type());
        }
    }

    private QuestionMapper() {}
}
