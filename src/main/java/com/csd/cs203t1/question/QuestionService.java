package com.csd.cs203t1.question;

import java.util.List;

public interface QuestionService {
	List<Question> listQuestions();

	Question getQuestion(Long id);

	void deleteQuestion(Long id);

	// Question addQuestion(Long quiz_id, Question question);

	
}
