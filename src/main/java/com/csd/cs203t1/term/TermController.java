package com.csd.cs203t1.term;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;








@RestController
@RequestMapping("/api/terms")
public class TermController {
	final TermService ts;
	public TermController(TermService ts){
		this.ts = ts;
	}
	//TODO add descriptors

	@GetMapping("/")
	public List<Term> getLessons() {
		return ts.listTerms();
	}

	@GetMapping("/{id}")
	public Term getTerm(@PathVariable Long id) {
		return ts.getTerm(id);
	}

	@DeleteMapping("/{id}")
	public void deleteTerm(@PathVariable Long id){
		ts.deleteTerm(id);
	}

	@PostMapping("/lessons/{lessonId}")
	public ResponseEntity<Term> addTerm(
		@PathVariable Long lessonId, 
        @RequestBody Term term
	) {
		Term savedTerm = ts.addTerm(lessonId, term);
        return new ResponseEntity<>(savedTerm, HttpStatus.CREATED);
	}
	
}
