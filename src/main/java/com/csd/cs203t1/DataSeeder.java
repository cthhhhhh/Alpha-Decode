package com.csd.cs203t1;

import com.csd.cs203t1.lesson.Lesson;
import com.csd.cs203t1.lesson.LessonDTO;
import com.csd.cs203t1.lesson.LessonRepository;
import com.csd.cs203t1.lesson.LessonService;
import com.csd.cs203t1.question.*;
import com.csd.cs203t1.quiz.DailyQuiz;
import com.csd.cs203t1.quiz.OnboardingQuiz;
import com.csd.cs203t1.quiz.QuizRepository;
import com.csd.cs203t1.term.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final LessonService lessonService;
    private final LessonRepository lessonRepository;
    private final TermRepository termRepository;
    private final QuizRepository quizRepository;

    public DataSeeder(LessonService lessonService, LessonRepository lessonRepository,
                      TermRepository termRepository, QuizRepository quizRepository) {
        this.lessonService = lessonService;
        this.lessonRepository = lessonRepository;
        this.termRepository = termRepository;
        this.quizRepository = quizRepository;
    }

    @Override
    public void run(String... args) {
        seedLessons();
        seedTerms();
        seedDailyQuiz();
        seedOnboardingQuiz();
    }

    // ─── Lessons ────────────────────────────────────────────────────────────────

    private void seedLessons() {
        if (lessonRepository.count() >= 7) return;
        lessonRepository.deleteAll();

        lessonService.addLesson(lesson("Rizz Basics", "green", "Charisma, attraction, and smooth talk.", "✨"), List.of(
            intro("New Word: Rizz", "Rizz is short for charisma. It is your ability to attract a partner through your personality and charm.", "Example: \"He has unspoken rizz.\""),
            select("What does \"Rizz\" mean?", null, List.of("Being rich", "Charisma", "Running fast", "Sleeping"), 1, "Rizz is short for cha-rizz-ma!"),
            translate("Translate this sentence", "He has charisma", List.of("He", "has", "rizz", "Ohio", "skibidi"), "He has rizz", "In Gen Alpha slang, charisma is replaced with rizz."),
            select("Complete the sentence", "She has so much ____, she can talk to anyone.", List.of("Ohio", "Sigma", "Rizz", "Fanum"), 2, "Rizz is the social charm needed to talk to people smoothly."),
            select("What is \"unspoken rizz\"?", null, List.of("Being loud", "Charming without speaking", "Being shy", "Having a bad jawline"), 1, "Unspoken rizz is raw charisma that doesn't even need words."),
            translate("Translate this sentence", "She got major charisma", List.of("She", "got", "major", "rizz", "Ohio", "gyatt"), "She got major rizz", "Major charisma translates to major rizz.")
        ));

        lessonService.addLesson(lesson("Fanum Tax", "orange", "The art of taking a bite from someone else's food.", "🍕"), List.of(
            intro("New Word: Fanum Tax", "Popularized by streamer Fanum, this refers to the \"tax\" you take from a friend's food.", "Example: \"I'm taking my Fanum Tax from that pizza.\""),
            select("When do you pay the Fanum Tax?", null, List.of("When you buy a car", "When you eat with friends", "When you go to Ohio", "When you sleep"), 1, "It refers to stealing a bite of food!"),
            translate("Translate this sentence", "He stole my fries", List.of("He", "collected", "the", "Fanum", "Tax", "rizz"), "He collected the Fanum Tax", "Collecting the Fanum Tax = taking someone's food."),
            select("Who originally took the Fanum Tax?", null, List.of("A tax collector", "A Twitch streamer", "Chef Boyardee", "Ohio monsters"), 1, "Twitch streamer Fanum started the meme by taking food from friends."),
            select("Which food is most prone to the Fanum Tax?", null, List.of("Pizza and fries", "Salad", "Plain water", "Homework"), 0, "Pizza and fries are common targets for the tax."),
            translate("Translate this sentence", "Tax my fries", List.of("Fanum", "Tax", "my", "fries", "rizz", "sigma"), "Fanum Tax my fries", "Applying the slang directly to the sentence.")
        ));

        lessonService.addLesson(lesson("Ohio Lore", "purple", "Where everything weird happens.", "🌀"), List.of(
            intro("New Word: Ohio", "Ohio is used to describe anything weird or abnormal. It comes from memes suggesting that strange things only happen in Ohio.", "Example: \"That dog looks like it's from Ohio.\""),
            select("Ohio describes something that is...", null, List.of("Cool and trendy", "Weird or bizarre", "Expensive", "Delicious"), 1, "Ohio memes portray the state as a place where bizarre, surreal things happen."),
            translate("Translate this sentence", "Strange events only in Ohio", List.of("Only", "in", "Ohio", "strange", "rizz", "sigma"), "Only in Ohio", "The classic meme phrase is \"Only in Ohio\"."),
            select("A dog from Ohio probably has...", null, List.of("A normal tail", "Laser eyes or three heads", "Good behavior", "A trophy"), 1, "Anything from Ohio is depicted as anomalous or monstrous."),
            select("If a meal is \"Ohio\", it is...", null, List.of("Gourmet", "Disgusting or weird", "Fast", "Cheap"), 1, "In the meme world, Ohio food is usually something unidentifiable."),
            translate("Translate this sentence", "This food is weird", List.of("This", "food", "is", "Ohio", "rizz", "skibidi"), "This food is Ohio", "Replace \"weird\" with \"Ohio\" for full slang usage.")
        ));

        lessonService.addLesson(lesson("Skibidi 101", "blue", "The chaotic viral word from the Skibidi Toilet universe.", "🚽"), List.of(
            intro("New Word: Skibidi", "Originating from a viral YouTube series about toilets with heads, \"Skibidi\" is often used as a general term for something bad or chaotic.", "Example: \"That's so skibidi.\""),
            select("\"Skibidi\" is generally used to describe something...", null, List.of("Awesome", "Delicious", "Weird or bad", "Fast"), 2, "Skibidi is generally used negatively to call something strange, bad, or cringe."),
            select("Where do the characters heads come from?", null, List.of("Toilets", "TV screens", "Speakers", "Computers"), 0, "The series features heads emerging from toilets."),
            translate("Translate this sentence", "That is very chaotic", List.of("That", "is", "so", "skibidi", "rizz", "sigma"), "That is so skibidi", "Skibidi can mean chaotic or bad."),
            select("The Skibidi series started on...", null, List.of("Netflix", "YouTube", "Prime Video", "TikTok"), 1, "It started as a series of shorts on YouTube."),
            translate("Translate this sentence", "Stop being weird", List.of("Stop", "being", "skibidi", "Ohio", "mewing", "rizz"), "Stop being skibidi", "Skibidi is the adjective for weird in this context.")
        ));

        lessonService.addLesson(lesson("Mewing Pro", "teal", "The silent jaw exercise for the sigma grindset.", "🦷"), List.of(
            intro("New Word: Mewing", "Mewing is a tongue posture exercise meant to improve jawline definition. If someone is \"mewing\", they can't talk because their tongue is pressed to the roof of their mouth.", "Example: \"I can't answer, I'm mewing.\""),
            select("Mewing is done to improve your...", null, List.of("Abs", "Jawline", "Hair", "Eyesight"), 1, "Mewing is a tongue posture technique promoted to define the jawline."),
            translate("Translate this sentence", "I am resting my tongue", List.of("I", "am", "mewing", "rizz", "sigma", "skibidi"), "I am mewing", "The act of proper tongue posture is called mewing."),
            select("If someone points to their jaw and stays quiet, they are...", null, List.of("Angry", "Mewing", "Sleepy", "Eating"), 1, "Pointing to the jaw while silent is the universal signal for mewing."),
            select("Where should your tongue be while mewing?", null, List.of("Against your teeth", "Roof of your mouth", "Tucked under", "Sticking out"), 1, "Full tongue contact with the roof of the mouth is the key."),
            translate("Translate this sentence", "Silence is the grind", List.of("Silence", "is", "mewing", "sigma", "rizz", "Ohio"), "Silence is mewing", "Mewing requires silence to maintain focus.")
        ));

        lessonService.addLesson(lesson("Sigma Mindset", "gray", "The lone wolf who needs no one.", "🐺"), List.of(
            intro("New Word: Sigma", "A \"Sigma\" is a lone wolf who is successful and independent. While sometimes used seriously, it's often used ironically to describe someone acting cool.", "Example: \"He's a true sigma.\""),
            select("A Sigma is best described as...", null, List.of("A popular leader", "A lone wolf", "A follower", "A lazy person"), 1, "A Sigma succeeds independently, outside of social hierarchies."),
            translate("Translate this sentence", "He is a lone wolf who needs no one", List.of("He", "is", "a", "sigma", "Ohio", "delulu"), "He is a sigma", "A sigma is the lone wolf archetype in Gen Z slang."),
            select("The \"Sigma grindset\" is about...", null, List.of("Socializing", "Silent self-improvement", "Fashion only", "Gaming all night"), 1, "It is about the silent hustle and improving oneself."),
            select("How does a Sigma relate to the social hierarchy?", null, List.of("At the bottom", "At the top", "Completely outside of it", "Trying to lead it"), 2, "Sigmas reject the hierarchy entirely."),
            translate("Translate this sentence", "Mindset of a lone wolf", List.of("Sigma", "mindset", "only", "rizz", "skibidi", "Ohio"), "Sigma mindset only", "Expressing the lone wolf approach.")
        ));

        lessonService.addLesson(lesson("Delulu Land", "pink", "Delusional positivity is the solution.", "💭"), List.of(
            intro("New Word: Delulu", "Short for delusional. Being \"delulu\" means having unrealistic expectations or beliefs, especially about celebrities or crushes.", "Example: \"Stay delulu, it's the only way.\""),
            select("\"Delulu\" is short for...", null, List.of("Dedicated", "Delusional", "Deliberate", "Delighted"), 1, "'Delulu' is short for delusional — used when someone has unrealistic expectations."),
            translate("Translate this sentence", "You are delusional", List.of("You", "are", "delulu", "rizz", "sigma", "skibidi"), "You are delulu", "Delusional becomes delulu in slang."),
            select("What is the \"solulu\"?", null, List.of("The reality", "The problem", "The delulu", "The truth"), 2, "The phrase \"The delulu is the solulu\" suggests delusional positivity is the solution."),
            select("Believing your favorite singer will marry you is...", null, List.of("Realistic", "Delulu", "Sigma", "Ohio"), 1, "Stalking or extreme parasocial beliefs are the definition of delulu."),
            translate("Translate this sentence", "Delusional is the solution", List.of("Delulu", "is", "the", "solulu", "rizz", "sigma"), "Delulu is the solulu", "Translating the popular ironic catchphrase.")
        ));
    }

    // ─── Terms ──────────────────────────────────────────────────────────────────

    private void seedTerms() {
        if (termRepository.count() >= 7) return;
        termRepository.deleteAll();

        List<Lesson> all = lessonRepository.findAll();
        Lesson rizz    = lessonByTitle(all, "Rizz Basics");
        Lesson fanum   = lessonByTitle(all, "Fanum Tax");
        Lesson ohio    = lessonByTitle(all, "Ohio Lore");
        Lesson skibidi = lessonByTitle(all, "Skibidi 101");
        Lesson mewing  = lessonByTitle(all, "Mewing Pro");
        Lesson sigma   = lessonByTitle(all, "Sigma Mindset");
        Lesson delulu  = lessonByTitle(all, "Delulu Land");

        termRepository.saveAll(List.of(
            term("Rizz",      "Short for charisma. Ability to attract a romantic partner.",                              "He has so much rizz, he didn't even have to say anything.", Difficulty.EASY,   Category.NOUN,      rizz),
            term("Skibidi",   "Often used to describe something bad/evil, from the Skibidi Toilet series.",              "That's so skibidi of you.",                                  Difficulty.MEDIUM, Category.ADJECTIVE, skibidi),
            term("Gyatt",     "An exclamation used when seeing someone with a large posterior.",                          "Gyatt! Look at that!",                                       Difficulty.EASY,   Category.REACTION,  null),
            term("Fanum Tax", "Stealing a portion of someone else's food, popularized by streamer Fanum.",               "You gotta pay the Fanum Tax on those fries.",                Difficulty.MEDIUM, Category.NOUN,      fanum),
            term("Sigma",     "A lone wolf who is successful and independent. Often used ironically.",                   "He's such a sigma male.",                                    Difficulty.EASY,   Category.NOUN,      sigma),
            term("Ohio",      "Used to describe something weird, cringey, or abnormal.",                                 "Only in Ohio would that happen.",                            Difficulty.MEDIUM, Category.ADJECTIVE, ohio),
            term("Mewing",    "A tongue exercise meant to define the jawline. Associated with sigma culture.",           "I can't talk right now, I'm mewing.",                        Difficulty.HARD,   Category.NOUN,      mewing),
            term("Delulu",    "Short for delusional. Often used in the context of fan culture or relationships.",        "She's so delulu if she thinks they're dating.",              Difficulty.EASY,   Category.ADJECTIVE, delulu)
        ));
    }

    // ─── Daily Quiz ─────────────────────────────────────────────────────────────

    private void seedDailyQuiz() {
        boolean exists = quizRepository.findAll().stream().anyMatch(q -> q instanceof DailyQuiz);
        if (exists) return;

        DailyQuiz dq = new DailyQuiz();
        dq.setDate(LocalDate.now());

        SelectQuestion q1 = SelectQuestion.builder()
            .title("Which of these correctly uses \"mewing\" in a sentence?")
            .options(List.of("I mewed the exam", "He stays quiet because he's mewing", "She mewed to the party", "They mewed all the fries"))
            .correctAnswer(1)
            .explanation("Mewing requires silence — pressing the tongue to the roof of the mouth. \"He stays quiet because he's mewing\" is the correct usage.")
            .quiz(dq).build();

        SelectQuestion q2 = SelectQuestion.builder()
            .title("\"The delulu is the solulu\" means...")
            .options(List.of("Being realistic always wins", "Delusional positivity is somehow the answer", "You should face the truth", "Delulu people never succeed"))
            .correctAnswer(1)
            .explanation("This ironic phrase means sometimes delusional confidence is what gets you through — it's used humorously in Gen Z culture.")
            .quiz(dq).build();

        SelectQuestion q3 = SelectQuestion.builder()
            .title("A true Sigma would most likely...")
            .options(List.of("Lead a group project loudly", "Follow the most popular person", "Work alone without seeking approval", "Post on social media every day"))
            .correctAnswer(2)
            .explanation("A Sigma is a lone wolf who operates outside social hierarchies — self-sufficient, silent, and independent.")
            .quiz(dq).build();

        dq.setQuestions(List.of(q1, q2, q3));
        quizRepository.save(dq);
    }

    // ─── Onboarding Quiz ────────────────────────────────────────────────────────

    private void seedOnboardingQuiz() {
        boolean exists = quizRepository.findAll().stream().anyMatch(q -> q instanceof OnboardingQuiz);
        if (exists) return;

        OnboardingQuiz oq = new OnboardingQuiz();

        SelectQuestion q1 = SelectQuestion.builder()
            .title("What is 'Fanum Tax'?")
            .options(List.of("A government fee", "Stealing food", "Paying for fans", "A dance move"))
            .correctAnswer(1).explanation("Fanum Tax means stealing a bite from someone else's food.").quiz(oq).build();

        SelectQuestion q2 = SelectQuestion.builder()
            .title("What is 'Rizz' short for?")
            .options(List.of("Risk", "Charisma", "Rhythm", "Real"))
            .correctAnswer(1).explanation("Rizz is short for cha-rizz-ma!").quiz(oq).build();

        SelectQuestion q3 = SelectQuestion.builder()
            .title("What does 'Skibidi' usually precede?")
            .options(List.of("Toilet", "Bop", "Dop", "Yes"))
            .correctAnswer(0).explanation("Skibidi Toilet is the viral YouTube series.").quiz(oq).build();

        SelectQuestion q4 = SelectQuestion.builder()
            .title("Mewing is done to improve...")
            .options(List.of("Jawline", "Abs", "Hair", "Eyesight"))
            .correctAnswer(0).explanation("Mewing is a tongue posture exercise to define the jawline.").quiz(oq).build();

        SelectQuestion q5 = SelectQuestion.builder()
            .title("What is a 'Sigma'?")
            .options(List.of("A follower", "A lone wolf", "A loud person", "A lazy person"))
            .correctAnswer(1).explanation("A Sigma is an independent lone wolf outside the social hierarchy.").quiz(oq).build();

        oq.setQuestions(List.of(q1, q2, q3, q4, q5));
        quizRepository.save(oq);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private Lesson lessonByTitle(List<Lesson> lessons, String title) {
        return lessons.stream().filter(l -> title.equals(l.getTitle())).findFirst().orElse(null);
    }

    private Term term(String word, String definition, String example, Difficulty difficulty, Category category, Lesson lesson) {
        return Term.builder().term(word).definition(definition).example(example)
                .difficulty(difficulty).category(category).lesson(lesson).build();
    }

    private LessonDTO lesson(String title, String colour, String story, String emoji) {
        LessonDTO dto = new LessonDTO();
        dto.setTitle(title); dto.setColour(colour); dto.setStory(story); dto.setEmoji(emoji);
        return dto;
    }

    private IntroQuestionDTO intro(String title, String content, String explanation) {
        IntroQuestionDTO dto = new IntroQuestionDTO();
        dto.setTitle(title); dto.setContent(content); dto.setExplanation(explanation);
        dto.setQuestion_type("INTRO");
        return dto;
    }

    private SelectQuestionDTO select(String title, String content, List<String> options, int correctAnswer, String explanation) {
        SelectQuestionDTO dto = new SelectQuestionDTO();
        dto.setTitle(title); dto.setContent(content); dto.setOptions(options);
        dto.setCorrectAnswer(correctAnswer); dto.setExplanation(explanation);
        dto.setQuestion_type("SELECT");
        return dto;
    }

    private TranslateQuestionDTO translate(String title, String content, List<String> wordbank, String target, String explanation) {
        TranslateQuestionDTO dto = new TranslateQuestionDTO();
        dto.setTitle(title); dto.setContent(content); dto.setWordbank(wordbank);
        dto.setTarget(target); dto.setExplanation(explanation);
        dto.setQuestion_type("TRANSLATE");
        return dto;
    }
}
