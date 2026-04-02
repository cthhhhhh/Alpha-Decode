package com.csd.cs203t1.question;

import com.csd.cs203t1.quiz.Quiz;

public class QuestionMapper {

    private static final int LEGACY_VARCHAR_LIMIT = 255;

    public static Question mapToEntity(QuestionDTO dto, Quiz quiz) {
        if (dto instanceof IntroQuestionDTO introDto) {
            return IntroQuestion.builder()
                    .explanation(clampText(introDto.getExplanation()))
                    .quiz(quiz)
                    .title(clampText(introDto.getTitle()))
                    .content(clampText(introDto.getContent()))
                    .build();
        } else if (dto instanceof SelectQuestionDTO selectDto) {
            return SelectQuestion.builder()
                    .explanation(clampText(selectDto.getExplanation()))
                    .quiz(quiz)
                    .title(clampText(selectDto.getTitle()))
                    .options(selectDto.getOptions())
                    .correctAnswer(selectDto.getCorrectAnswer())
                    .content(clampText(selectDto.getContent()))
                    .build();
        } else if (dto instanceof TranslateQuestionDTO transDto) {
            return TranslateQuestion.builder()
                    .explanation(clampText(transDto.getExplanation()))
                    .quiz(quiz)
                    .title(clampText(transDto.getTitle()))
                    .target(clampText(transDto.getTarget()))
                    .wordbank(transDto.getWordbank())
                    .content(clampText(transDto.getContent()))
                    .build();
        } else {
            throw new IllegalArgumentException("Unknown question type: " + dto.getQuestion_type());
        }
    }

    private static String clampText(String value) {
        if (value == null) return null;
        return value.length() > LEGACY_VARCHAR_LIMIT
                ? value.substring(0, LEGACY_VARCHAR_LIMIT)
                : value;
    }

    private QuestionMapper() {}
}
