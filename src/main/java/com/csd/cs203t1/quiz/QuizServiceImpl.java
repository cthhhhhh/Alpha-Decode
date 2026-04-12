package com.csd.cs203t1.quiz;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import com.csd.cs203t1.question.Question;

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;

    public QuizServiceImpl(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    @Override
    public List<Question> getDailyQuizQuestions() {
        List<Question> bank = quizRepository.findAllDailyQuizzes().stream()
                .findFirst()
                .map(Quiz::getQuestions)
                .orElse(null);
        if (bank == null || bank.size() < 3) {
            return null;
        }

        List<Question> copy = new ArrayList<>(bank);
        long seed = LocalDate.now().toEpochDay();
        int k = Math.min(3, copy.size());
        for (int i = 0; i < k; i++) {
            int j = (int) ((seed + i * 31) % copy.size());
            Question tmp = copy.get(i);
            copy.set(i, copy.get(j));
            copy.set(j, tmp);
        }

        return copy.subList(0, 3);
    }

    @Override
    public List<Question> getOnboardingQuizQuestions() {
        return quizRepository.findAllOnboardingQuizzes().stream()
                .findFirst()
                .map(Quiz::getQuestions)
                .orElse(null);
    }

    @Override
    public List<Map<String, Object>> getRevisionQuizzes() {
        return quizRepository.findAllRevisionQuizzes().stream()
                .map(rq -> {
                    var questions = rq.getQuestions();
                    int sampleSize = Math.min(10, questions == null ? 0 : questions.size());
                    List<?> sampled;
                    if (questions == null || questions.isEmpty() || sampleSize == questions.size()) {
                        sampled = questions;
                    } else {
                        List<Object> copy = new ArrayList<>(questions);
                        for (int i = 0; i < sampleSize; i++) {
                            int j = ThreadLocalRandom.current().nextInt(i, copy.size());
                            Object tmp = copy.get(i);
                            copy.set(i, copy.get(j));
                            copy.set(j, tmp);
                        }
                        sampled = copy.subList(0, sampleSize);
                    }
                    return Map.<String, Object>of(
                            "id", rq.getId(),
                            "afterLessonIndex", rq.getAfterLessonIndex(),
                            "questions", sampled
                    );
                })
                .toList();
    }

    @Override
    public RevisionQuiz createRevisionQuiz(RevisionQuiz revisionQuiz) {
        return quizRepository.save(revisionQuiz);
    }

    @Override
    public Optional<RevisionQuiz> updateRevisionQuiz(Long id, RevisionQuiz details) {
        return quizRepository.findRevisionQuizById(id)
                .map(rq -> {
                    rq.setAfterLessonIndex(details.getAfterLessonIndex());
                    return quizRepository.save(rq);
                });
    }

    @Override
    public boolean revisionQuizExists(Long id) {
        return quizRepository.findRevisionQuizById(id).isPresent();
    }

    @Override
    public void deleteRevisionQuiz(Long id) {
        quizRepository.deleteById(id);
    }
}
