package com.csd.cs203t1.term;

import java.util.List;

import org.springframework.stereotype.Service;

import com.csd.cs203t1.lesson.LessonRepository;

import jakarta.transaction.Transactional;

@Service
public class TermServiceImpl implements TermService {
	final TermRepository terms;
	final LessonRepository lessons;
	public TermServiceImpl(TermRepository terms,LessonRepository lessons){
		this.terms = terms;
		this.lessons = lessons;
	}

	@Override
	public List<Term> listTerms(){
		return terms.findAll();
	}

	@Override
	public Term getTerm(Long id){
		return terms.findById(id).map(term ->{
			return term;
			}
		).orElseThrow(() -> new RuntimeException("Term not found"));
	}


	@Override
	@Transactional
	public Term addTerm(Long lessonId, Term term){
		return lessons.findById(lessonId).map(lesson -> {
			term.setLesson(lesson);
            return terms.save(term);
        }).orElseThrow(() -> new RuntimeException("lesson not found")); 
	}

	@Override
	@Transactional
	public Term createTerm(Term term) {
		return terms.save(term);
	}


	@Override
	public void deleteTerm(Long id){
		if(!terms.existsById(id)){
			throw new RuntimeException("Term not found");
		}
		terms.deleteById(id);
	}

	@Override
	public Term updateTerm(Long id, Term incoming) {
		Term existing = getTerm(id);
		if (incoming.getTerm() != null) existing.setTerm(incoming.getTerm());
		if (incoming.getDefinition() != null) existing.setDefinition(incoming.getDefinition());
		if (incoming.getExample() != null) existing.setExample(incoming.getExample());
		if (incoming.getDifficulty() != null) existing.setDifficulty(incoming.getDifficulty());
		if (incoming.getCategory() != null) existing.setCategory(incoming.getCategory());
		return terms.save(existing);
	}
}