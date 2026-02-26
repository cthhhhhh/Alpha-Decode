package com.csd.cs203t1.term;

import java.util.List;

public interface TermService {
	List<Term> listTerms();

	void deleteTerm(Long id);

	Term getTerm(Long id);

	Term addTerm(Long lessonId,Term term);
}
