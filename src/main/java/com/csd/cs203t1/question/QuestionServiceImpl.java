package com.csd.cs203t1.question;

import java.util.List;

import org.springframework.stereotype.Service;

import com.csd.cs203t1.lesson.Lesson;

@Service
public class QuestionServiceImpl implements QuestionService {
	
	final QuestionRepository questions;
	public QuestionServiceImpl(QuestionRepository q){
		this.questions = q;
	}

	public List<Question> listQuestions(){
		return questions.findAll();
	}

	@Override
	public Question getQuestion(Long id){
		return questions.findById(id).map(question ->{
			return question;
			}
		).orElseThrow(() -> new RuntimeException("question not found"));// TODO make custom exception
	}

	@Override
	public void deleteQuestion(Long id){
		if(!questions.existsById(id)){
			throw new RuntimeException("question not found");
		}
		questions.deleteById(id);
	}

	
}
