package com.csd.cs203t1.question;

import java.util.List;

import org.springframework.stereotype.Service;

import com.csd.cs203t1.quiz.Quiz;
import com.csd.cs203t1.quiz.QuizRepository;

@Service
public class QuestionServiceImpl implements QuestionService {

	final QuestionRepository questions;
	final QuizRepository quizzes;

	public QuestionServiceImpl(QuestionRepository q, QuizRepository quizzes){
		this.questions = q;
		this.quizzes = quizzes;
	}

	public List<Question> listQuestions(){
		return questions.findAll();
	}

	@Override
	public Question getQuestion(Long id){
		return questions.findById(id)
			.orElseThrow(() -> new RuntimeException("question not found"));
	}

	@Override
	public void deleteQuestion(Long id){
		if(!questions.existsById(id)){
			throw new RuntimeException("question not found");
		}
		questions.deleteById(id);
	}

	@Override
	public Question addQuestion(Long quizId, QuestionDTO dto) {
		Quiz quiz = quizzes.findById(quizId)
			.orElseThrow(() -> new RuntimeException("Quiz not found"));
		Question q = QuestionMapper.mapToEntity(dto, quiz);
		return questions.save(q);
	}

	@Override
	public Question updateQuestion(Long id, QuestionDTO dto) {
		Question existing = getQuestion(id);
		if (dto.getExplanation() != null) existing.setExplanation(dto.getExplanation());
		if (dto.getTitle() != null) existing.setTitle(dto.getTitle());
		if (dto.getContent() != null) existing.setContent(dto.getContent());
		if (existing instanceof SelectQuestion sel && dto instanceof SelectQuestionDTO selDto) {
			if (selDto.getOptions() != null) sel.setOptions(selDto.getOptions());
			if (selDto.getCorrectAnswer() != null) sel.setCorrectAnswer(selDto.getCorrectAnswer());
		} else if (existing instanceof TranslateQuestion trans && dto instanceof TranslateQuestionDTO transDto) {
			if (transDto.getTarget() != null) trans.setTarget(transDto.getTarget());
			if (transDto.getWordbank() != null) trans.setWordbank(transDto.getWordbank());
		}
		return questions.save(existing);
	}
}
