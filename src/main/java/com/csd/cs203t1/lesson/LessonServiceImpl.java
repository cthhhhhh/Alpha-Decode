package com.csd.cs203t1.lesson;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.csd.cs203t1.common.ResourceNotFoundException;
import com.csd.cs203t1.draft.DraftService;
import com.csd.cs203t1.question.Question;
import com.csd.cs203t1.question.QuestionDTO;
import com.csd.cs203t1.question.QuestionMapper;
import com.csd.cs203t1.quiz.LessonQuiz;

import jakarta.transaction.Transactional;

@Service
public class LessonServiceImpl implements LessonService {
	final LessonRepository lessons;
	final DraftService draftService;

	public LessonServiceImpl(LessonRepository lessons, DraftService draftService){
        this.lessons = lessons;
		this.draftService = draftService;
    }
	@Override
	public List<Lesson> listLessons(){
		return lessons.findAllOrderedById();
	}
	@Override
	public Lesson getLesson(Long id){
		return lessons.findById(id).map(lesson ->{
			return lesson;
			}
		).orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
	}

	@Override
	public Lesson getLessonWithQuizAndQuestions(Long lessonId) {
        return lessons.findByIdWithQuizAndQuestions(lessonId)
		.orElseThrow(() -> new ResourceNotFoundException("Lesson not found")); 
    }


	@Override
	public Lesson updateLesson(Long id, LessonDTO dto) {
		Lesson lesson = lessons.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
		if (dto.getTitle() != null) lesson.setTitle(dto.getTitle());
		if (dto.getColour() != null) lesson.setColour(dto.getColour());
		if (dto.getStory() != null) lesson.setStory(dto.getStory());
		if (dto.getEmoji() != null) lesson.setEmoji(dto.getEmoji());
		return lessons.save(lesson);
	}

	@Override
	public void deleteLesson(Long id){
		if(!lessons.existsById(id)){
			throw new ResourceNotFoundException("Lesson not found");
		}
		draftService.handleLessonDeletion(id);
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
            .map(dto -> QuestionMapper.mapToEntity(dto, quiz))
            .collect(Collectors.toList());
		quiz.setQuestions(questions);

		return lessons.save(lesson);


	}

}
