package com.csd.cs203t1.term;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/terms")
public class TermController {
	final TermService termService;
	public TermController(TermService termService){
		this.termService = termService;
	}

	@GetMapping("/")
	public List<Term> getTerms() {
		return termService.listTerms();
	}

	@GetMapping("/{id}")
	public Term getTerm(@PathVariable Long id) {
		return termService.getTerm(id);
	}

	@PreAuthorize("hasAnyRole('CONTRIBUTOR','ADMIN')")
	@DeleteMapping("/{id}")
	public void deleteTerm(@PathVariable Long id){
		termService.deleteTerm(id);
	}

	@PreAuthorize("hasAnyRole('CONTRIBUTOR','ADMIN')")
	@PostMapping("/lessons/{lessonId}")
	public ResponseEntity<Term> addTermWithLesson(
		@PathVariable Long lessonId,
		@RequestBody Term term
	) {
		Term savedTerm = termService.addTerm(lessonId, term);
		return new ResponseEntity<>(savedTerm, HttpStatus.CREATED);
	}

	@PreAuthorize("hasAnyRole('CONTRIBUTOR','ADMIN')")
	@PostMapping("/create")
	public ResponseEntity<Term> createTerm(
		@RequestBody Term term
	) {
		Term savedTerm = termService.createTerm(term);
		return new ResponseEntity<>(savedTerm, HttpStatus.CREATED);
	}

	@PreAuthorize("hasAnyRole('CONTRIBUTOR','ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<Term> updateTerm(@PathVariable Long id, @RequestBody Term term) {
		Term updated = termService.updateTerm(id, term);
		return ResponseEntity.ok(updated);
	}
}
