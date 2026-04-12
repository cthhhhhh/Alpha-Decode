package com.csd.cs203t1.quiz;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.csd.cs203t1.question.Question;

public interface QuizService {
    List<Question> getDailyQuizQuestions();
    List<Question> getOnboardingQuizQuestions();
    List<Map<String, Object>> getRevisionQuizzes();
    RevisionQuiz createRevisionQuiz(RevisionQuiz revisionQuiz);
    Optional<RevisionQuiz> updateRevisionQuiz(Long id, RevisionQuiz details);
    boolean revisionQuizExists(Long id);
    void deleteRevisionQuiz(Long id);
}
