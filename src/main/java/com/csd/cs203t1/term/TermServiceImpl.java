package com.csd.cs203t1.term;

import java.util.List;

import org.springframework.stereotype.Service;

import com.csd.cs203t1.lesson.Lesson;
import com.csd.cs203t1.lesson.LessonRepository;

import jakarta.transaction.Transactional;

import java.lang.RuntimeException;

@Service
public class TermServiceImpl implements TermService {
	final TermRepository terms;
	final LessonRepository lessons;
	public TermServiceImpl(TermRepository terms,LessonRepository lessons){
		this.terms = terms;
		this.lessons = lessons;
	}

	
	public List<Term> listTerms(){
		return terms.findAll();
	}

	public Term getTerm(Long id){
		return terms.findById(id).map(term ->{
			return term;
			}
		).orElseThrow(() -> new RuntimeException("Lesson not found"));
	}


	@Transactional
	public Term addTerm(Long lessonId, Term term){
		return lessons.findById(lessonId).map(lesson -> {
			term.setLesson(lesson);
            return terms.save(term);
        }).orElseThrow(() -> new RuntimeException("lesson not found")); //TODO make custom exception
	}


	public void deleteTerm(Long id){
		if(!terms.existsById(id)){
			throw new RuntimeException("Term not found");
		}
		terms.deleteById(id);
	}
}