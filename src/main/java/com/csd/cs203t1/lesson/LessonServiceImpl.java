package com.csd.cs203t1.lesson;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.csd.cs203t1.question.IntroQuestion;
import com.csd.cs203t1.question.IntroQuestionDTO;
import com.csd.cs203t1.question.Question;
import com.csd.cs203t1.question.QuestionDTO;
import com.csd.cs203t1.question.QuestionRepository;
import com.csd.cs203t1.question.SelectQuestion;
import com.csd.cs203t1.question.SelectQuestionDTO;
import com.csd.cs203t1.question.TranslateQuestion;
import com.csd.cs203t1.question.TranslateQuestionDTO;
import com.csd.cs203t1.quiz.LessonQuiz;
import com.csd.cs203t1.quiz.QuizRepository;

import jakarta.transaction.Transactional;

@Service
public class LessonServiceImpl implements LessonService {
	final LessonRepository lessons;
	final QuestionRepository questions;
	final QuizRepository quizzes;

	public LessonServiceImpl(LessonRepository lessons, QuestionRepository questions, QuizRepository quizzes){
        this.lessons = lessons;
		this.questions = questions;
		this.quizzes = quizzes;
    }
	@Override
	public List<Lesson> listLessons(){
		return lessons.findAll();
	}
	@Override
	public Lesson getLesson(Long id){
		return lessons.findById(id).map(lesson ->{
			return lesson;
			}
		).orElseThrow(() -> new RuntimeException("Lesson not found"));// TODO make custom exception,
	}

	@Override
	public Lesson getLessonWithQuizAndQuestions(Long lessonId) {
        return lessons.findByIdWithQuizAndQuestions(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found")); //TODO make custom exception
    }


	@Override
	public void deleteLesson(Long id){
		if(!lessons.existsById(id)){
			throw new RuntimeException("Lesson not found");
		}
		lessons.deleteById(id);
	}

	@Override
	@Transactional
	public Lesson addLesson(LessonDTO lessonDTO, List<QuestionDTO> questionDTOs){
		// step 1 get the attributes from lessondto and create lesson object
		Lesson lesson = Lesson.builder()
				.colour(lessonDTO.getColour())
				.story(lessonDTO.getStory())
				.title(lessonDTO.getTitle())
				.emoji(lessonDTO.getEmoji())
				.build();
		
		//step 2 make a quiz, add lesson to it
		LessonQuiz quiz = new LessonQuiz();
		quiz.setLesson(lesson);
		lesson.setQuiz(quiz);
		
		//step3 make all the questions, add quiz to each
		//questions can be of 3 different sub-classes
		List<Question> questions = questionDTOs.stream()
            .map(dto -> mapToEntity(dto, quiz))
            .collect(Collectors.toList());
		quiz.setQuestions(questions);

		return lessons.save(lesson);


	}

	//helper
	private Question mapToEntity(QuestionDTO dto, LessonQuiz quiz) {
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
        throw new IllegalArgumentException("Invalid type: ");
    }
}
}
