package com.csd.cs203t1.lesson;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.csd.cs203t1.question.QuestionDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/lessons")
public class LessonController {
	final LessonService lessonService;
	
	public LessonController(LessonService ls){
		this.lessonService = ls;
	}
	/**
	*List all lessons in the system
	*@return a list of all lessons
	*/
	@GetMapping("/")
	public List<Lesson> getLessons() {
		return lessonService.listLessons();
	}

	/**
	 * search for a specific lesson by id,
	 * if no such lesson id, throw exception
	 * @param id
	 * @return Lesson with given id
	 */
	@GetMapping("/{id}")
	public Lesson getLesson(@PathVariable Long id) {
		return lessonService.getLesson(id);
	}
	/**
	 * search for specific lesson and its questions and quizzes by id
	 * @param id
	 * @return Lesson with associated quiz and question
	 */
	@GetMapping("/questions/{id}")
	public Lesson getLessonsWithQuizAndQuestions(@PathVariable Long id) {
		return lessonService.getLessonWithQuizAndQuestions(id);
	}
	
	@DeleteMapping("/{id}")
	public void deleteLesson(@PathVariable Long id){
		lessonService.deleteLesson(id);
	}

	@Data
	public static class CreateLessonRequest {
    	private LessonDTO lesson;
    	private List<QuestionDTO> questions;
}


	@PostMapping("/create")
	public ResponseEntity<Lesson> createLesson(@RequestBody CreateLessonRequest request) {
        // Delegate the work to the service
        Lesson savedLesson = lessonService.addLesson(
            request.getLesson(), 
            request.getQuestions()
        );

        // Return 201 Created with the saved object
        return new ResponseEntity<>(savedLesson, HttpStatus.CREATED);
    }
	@GetMapping("/test")
	public String test() {
    return "Controller is active!";
}
	
}
