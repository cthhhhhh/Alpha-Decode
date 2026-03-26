package com.csd.cs203t1;

import com.csd.cs203t1.achievement.Achievement;
import com.csd.cs203t1.achievement.AchievementRepository;
import com.csd.cs203t1.achievement.TriggerType;
import com.csd.cs203t1.lesson.Lesson;
import com.csd.cs203t1.lesson.LessonDTO;
import com.csd.cs203t1.lesson.LessonRepository;
import com.csd.cs203t1.lesson.LessonService;
import com.csd.cs203t1.question.IntroQuestionDTO;
import com.csd.cs203t1.question.SelectQuestion;
import com.csd.cs203t1.question.SelectQuestionDTO;
import com.csd.cs203t1.question.TranslateQuestionDTO;
import com.csd.cs203t1.quiz.DailyQuiz;
import com.csd.cs203t1.quiz.OnboardingQuiz;
import com.csd.cs203t1.quiz.QuizRepository;
import com.csd.cs203t1.quiz.RevisionQuiz;
import com.csd.cs203t1.term.Category;
import com.csd.cs203t1.term.Difficulty;
import com.csd.cs203t1.term.Term;
import com.csd.cs203t1.term.TermRepository;
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
    private final AchievementRepository achievementRepository;

    public DataSeeder(LessonService lessonService, LessonRepository lessonRepository,
            TermRepository termRepository, QuizRepository quizRepository,
            AchievementRepository achievementRepository) {
        this.lessonService = lessonService;
        this.lessonRepository = lessonRepository;
        this.termRepository = termRepository;
        this.quizRepository = quizRepository;
        this.achievementRepository = achievementRepository;
    }

    @Override
    public void run(String... args) {
        seedLessons();
        seedTerms();
        seedDailyQuiz();
        seedOnboardingQuiz();
        seedRevisionQuiz();
        seedAchievements();
    }

    // ─── Lessons ────────────────────────────────────────────────────────────────

    private void seedLessons() {
        if (lessonRepository.count() >= 20)
            return;
        lessonRepository.deleteAll();

        lessonService.addLesson(lesson("Rizz Basics", "green", "Charisma, attraction, and smooth talk.", "✨"), List.of(
                intro("New Word: Rizz",
                        "Rizz is short for charisma. It is your ability to attract a partner through your personality and charm.",
                        "Example: \"He has unspoken rizz.\""),
                select("What does \"Rizz\" mean?", null, List.of("Being rich", "Charisma", "Running fast", "Sleeping"),
                        1, "Rizz is short for cha-rizz-ma!"),
                translate("Translate this sentence", "He has charisma", List.of("He", "has", "rizz", "Ohio", "skibidi"),
                        "He has rizz", "In Gen Alpha slang, charisma is replaced with rizz."),
                select("Complete the sentence", "She has so much ____, she can talk to anyone.",
                        List.of("Ohio", "Sigma", "Rizz", "Fanum"), 2,
                        "Rizz is the social charm needed to talk to people smoothly."),
                select("What is \"unspoken rizz\"?", null,
                        List.of("Being loud", "Charming without speaking", "Being shy", "Having a bad jawline"), 1,
                        "Unspoken rizz is raw charisma that doesn't even need words."),
                translate("Translate this sentence", "She got major charisma",
                        List.of("She", "got", "major", "rizz", "Ohio", "gyatt"), "She got major rizz",
                        "Major charisma translates to major rizz.")));

        lessonService.addLesson(
                lesson("Fanum Tax", "orange", "The art of taking a bite from someone else's food.", "🍕"), List.of(
                        intro("New Word: Fanum Tax",
                                "Popularized by streamer Fanum, this refers to the \"tax\" you take from a friend's food.",
                                "Example: \"I'm taking my Fanum Tax from that pizza.\""),
                        select("When do you pay the Fanum Tax?", null,
                                List.of("When you buy a car", "When you eat with friends", "When you go to Ohio",
                                        "When you sleep"),
                                1, "It refers to stealing a bite of food!"),
                        translate("Translate this sentence", "He stole my fries",
                                List.of("He", "collected", "the", "Fanum", "Tax", "rizz"), "He collected the Fanum Tax",
                                "Collecting the Fanum Tax = taking someone's food."),
                        select("Who originally took the Fanum Tax?", null,
                                List.of("A tax collector", "A Twitch streamer", "Chef Boyardee", "Ohio monsters"), 1,
                                "Twitch streamer Fanum started the meme by taking food from friends."),
                        select("Which food is most prone to the Fanum Tax?", null,
                                List.of("Pizza and fries", "Salad", "Plain water", "Homework"), 0,
                                "Pizza and fries are common targets for the tax."),
                        translate("Translate this sentence", "Tax my fries",
                                List.of("Fanum", "Tax", "my", "fries", "rizz", "sigma"), "Fanum Tax my fries",
                                "Applying the slang directly to the sentence.")));

        lessonService.addLesson(lesson("Ohio Lore", "purple", "Where everything weird happens.", "🌀"), List.of(
                intro("New Word: Ohio",
                        "Ohio is used to describe anything weird or abnormal. It comes from memes suggesting that strange things only happen in Ohio.",
                        "Example: \"That dog looks like it's from Ohio.\""),
                select("Ohio describes something that is...", null,
                        List.of("Cool and trendy", "Weird or bizarre", "Expensive", "Delicious"), 1,
                        "Ohio memes portray the state as a place where bizarre, surreal things happen."),
                translate("Translate this sentence", "Strange events only in Ohio",
                        List.of("Only", "in", "Ohio", "strange", "rizz", "sigma"), "Only in Ohio",
                        "The classic meme phrase is \"Only in Ohio\"."),
                select("A dog from Ohio probably has...", null,
                        List.of("A normal tail", "Laser eyes or three heads", "Good behavior", "A trophy"), 1,
                        "Anything from Ohio is depicted as anomalous or monstrous."),
                select("If a meal is \"Ohio\", it is...", null,
                        List.of("Gourmet", "Disgusting or weird", "Fast", "Cheap"), 1,
                        "In the meme world, Ohio food is usually something unidentifiable."),
                translate("Translate this sentence", "This food is weird",
                        List.of("This", "food", "is", "Ohio", "rizz", "skibidi"), "This food is Ohio",
                        "Replace \"weird\" with \"Ohio\" for full slang usage.")));

        lessonService.addLesson(
                lesson("Skibidi 101", "blue", "The chaotic viral word from the Skibidi Toilet universe.", "🚽"),
                List.of(
                        intro("New Word: Skibidi",
                                "Originating from a viral YouTube series about toilets with heads, \"Skibidi\" is often used as a general term for something bad or chaotic.",
                                "Example: \"That's so skibidi.\""),
                        select("\"Skibidi\" is generally used to describe something...", null,
                                List.of("Awesome", "Delicious", "Weird or bad", "Fast"), 2,
                                "Skibidi is generally used negatively to call something strange, bad, or cringe."),
                        select("Where do the characters heads come from?", null,
                                List.of("Toilets", "TV screens", "Speakers", "Computers"), 0,
                                "The series features heads emerging from toilets."),
                        translate("Translate this sentence", "That is very chaotic",
                                List.of("That", "is", "so", "skibidi", "rizz", "sigma"), "That is so skibidi",
                                "Skibidi can mean chaotic or bad."),
                        select("The Skibidi series started on...", null,
                                List.of("Netflix", "YouTube", "Prime Video", "TikTok"), 1,
                                "It started as a series of shorts on YouTube."),
                        translate("Translate this sentence", "Stop being weird",
                                List.of("Stop", "being", "skibidi", "Ohio", "mewing", "rizz"), "Stop being skibidi",
                                "Skibidi is the adjective for weird in this context.")));

        lessonService.addLesson(lesson("Mewing Pro", "teal", "The silent jaw exercise for the sigma grindset.", "🦷"),
                List.of(
                        intro("New Word: Mewing",
                                "Mewing is a tongue posture exercise meant to improve jawline definition. If someone is \"mewing\", they can't talk because their tongue is pressed to the roof of their mouth.",
                                "Example: \"I can't answer, I'm mewing.\""),
                        select("Mewing is done to improve your...", null, List.of("Abs", "Jawline", "Hair", "Eyesight"),
                                1, "Mewing is a tongue posture technique promoted to define the jawline."),
                        translate("Translate this sentence", "I am resting my tongue",
                                List.of("I", "am", "mewing", "rizz", "sigma", "skibidi"), "I am mewing",
                                "The act of proper tongue posture is called mewing."),
                        select("If someone points to their jaw and stays quiet, they are...", null,
                                List.of("Angry", "Mewing", "Sleepy", "Eating"), 1,
                                "Pointing to the jaw while silent is the universal signal for mewing."),
                        select("Where should your tongue be while mewing?", null,
                                List.of("Against your teeth", "Roof of your mouth", "Tucked under", "Sticking out"), 1,
                                "Full tongue contact with the roof of the mouth is the key."),
                        translate("Translate this sentence", "Silence is the grind",
                                List.of("Silence", "is", "mewing", "sigma", "rizz", "Ohio"), "Silence is mewing",
                                "Mewing requires silence to maintain focus.")));

        lessonService.addLesson(lesson("Sigma Mindset", "gray", "The lone wolf who needs no one.", "🐺"), List.of(
                intro("New Word: Sigma",
                        "A \"Sigma\" is a lone wolf who is successful and independent. While sometimes used seriously, it's often used ironically to describe someone acting cool.",
                        "Example: \"He's a true sigma.\""),
                select("A Sigma is best described as...", null,
                        List.of("A popular leader", "A lone wolf", "A follower", "A lazy person"), 1,
                        "A Sigma succeeds independently, outside of social hierarchies."),
                translate("Translate this sentence", "He is a lone wolf who needs no one",
                        List.of("He", "is", "a", "sigma", "Ohio", "delulu"), "He is a sigma",
                        "A sigma is the lone wolf archetype in Gen Z slang."),
                select("The \"Sigma grindset\" is about...", null,
                        List.of("Socializing", "Silent self-improvement", "Fashion only", "Gaming all night"), 1,
                        "It is about the silent hustle and improving oneself."),
                select("How does a Sigma relate to the social hierarchy?", null,
                        List.of("At the bottom", "At the top", "Completely outside of it", "Trying to lead it"), 2,
                        "Sigmas reject the hierarchy entirely."),
                translate("Translate this sentence", "Mindset of a lone wolf",
                        List.of("Sigma", "mindset", "only", "rizz", "skibidi", "Ohio"), "Sigma mindset only",
                        "Expressing the lone wolf approach.")));

        lessonService.addLesson(lesson("Delulu Land", "pink", "Delusional positivity is the solution.", "💭"), List.of(
                intro("New Word: Delulu",
                        "Short for delusional. Being \"delulu\" means having unrealistic expectations or beliefs, especially about celebrities or crushes.",
                        "Example: \"Stay delulu, it's the only way.\""),
                select("\"Delulu\" is short for...", null,
                        List.of("Dedicated", "Delusional", "Deliberate", "Delighted"), 1,
                        "'Delulu' is short for delusional — used when someone has unrealistic expectations."),
                translate("Translate this sentence", "You are delusional",
                        List.of("You", "are", "delulu", "rizz", "sigma", "skibidi"), "You are delulu",
                        "Delusional becomes delulu in slang."),
                select("What is the \"solulu\"?", null,
                        List.of("The reality", "The problem", "The delulu", "The truth"), 2,
                        "The phrase \"The delulu is the solulu\" suggests delusional positivity is the solution."),
                select("Believing your favorite singer will marry you is...", null,
                        List.of("Realistic", "Delulu", "Sigma", "Ohio"), 1,
                        "Stalking or extreme parasocial beliefs are the definition of delulu."),
                translate("Translate this sentence", "Delusional is the solution",
                        List.of("Delulu", "is", "the", "solulu", "rizz", "sigma"), "Delulu is the solulu",
                        "Translating the popular ironic catchphrase.")));

        lessonService.addLesson(lesson("No Cap", "red", "For real, not lying.", "🧢"), List.of(
                intro("New Word: No Cap",
                        "\"No cap\" means \"for real\" or \"I'm not lying\". It is used to emphasise that something is true.",
                        "Example: \"That was the best burger I've ever had, no cap.\""),
                select("What does \"no cap\" mean?", null,
                        List.of("Just kidding", "For real, not lying", "I give up", "Maybe"), 1,
                        "No cap = I'm not capping (lying). It means you're being completely serious."),
                select("Which sentence uses \"no cap\" correctly?", null,
                        List.of("No cap, I slept for 12 hours", "No cap me outside", "No cap you later",
                                "No cap is a hat"),
                        0, "\"No cap, I slept for 12 hours\" correctly uses it to emphasise truth."),
                select("\"Cap\" in slang means...", null, List.of("A hat", "The limit", "A lie", "Winning"), 2,
                        "\"Cap\" = lie or exaggeration. So \"no cap\" = no lie."),
                translate("Translate this sentence", "I am not lying, that was amazing",
                        List.of("No", "cap", "that", "was", "amazing", "rizz"), "No cap that was amazing",
                        "Replace 'I am not lying' with 'No cap'."),
                translate("Translate this sentence", "She is serious, that actually happened",
                        List.of("She", "is", "no", "cap", "that", "happened"), "She is no cap that happened",
                        "No cap is inserted to reinforce the truth of the statement.")));

        lessonService.addLesson(lesson("Slay", "rose", "Do something excellently.", "💅"), List.of(
                intro("New Word: Slay",
                        "\"Slay\" means to do something exceptionally well or to look amazing. It is a compliment for someone who is crushing it.",
                        "Example: \"She slayed that presentation.\""),
                select("\"Slay\" is used to describe...", null,
                        List.of("Destroying something", "Doing something excellently", "Sleeping in", "Losing a game"),
                        1, "Slay = to perform or look absolutely outstanding."),
                select("Which sentence uses \"slay\" correctly?", null,
                        List.of("She slayed the math test", "He slayed the river", "They slayed the couch",
                                "I slayed lunch"),
                        0, "\"She slayed the math test\" = she did an amazing job on it."),
                select("When someone says \"slay queen\", they mean...", null,
                        List.of("Attack the queen", "You are doing great", "Be careful", "Stay quiet"), 1,
                        "\"Slay queen\" is a term of encouragement meaning you're excelling."),
                translate("Translate this sentence", "She did an excellent job",
                        List.of("She", "slayed", "it", "ohio", "rizz", "sigma"), "She slayed it",
                        "\"Did an excellent job\" becomes \"slayed it\" in slang."),
                translate("Translate this sentence", "You look absolutely amazing today",
                        List.of("You", "are", "slaying", "today", "cap", "mewing"), "You are slaying today",
                        "Looking amazing = slaying.")));

        lessonService.addLesson(lesson("Bussin", "yellow", "Extremely good, usually food.", "🍔"), List.of(
                intro("New Word: Bussin",
                        "\"Bussin\" means extremely good, and is most commonly used to describe food. It originated from African-American Vernacular English (AAVE).",
                        "Example: \"This ramen is bussin fr.\""),
                select("\"Bussin\" is most often used for...", null,
                        List.of("Weather", "Food", "Music videos", "Sports"), 1,
                        "Bussin is predominantly used to describe food that tastes amazing."),
                select("\"This pizza is bussin\" means...", null,
                        List.of("The pizza is burning", "The pizza is disgusting", "The pizza is extremely good",
                                "The pizza is too expensive"),
                        2, "Bussin = extremely good, especially for food."),
                select("Which sentence is correct?", null,
                        List.of("That burger is bussin bussin", "That bussin is burger", "The bussin eats good",
                                "Bussin the meal"),
                        0, "\"Bussin bussin\" doubles the emphasis — it means really, really good."),
                translate("Translate this sentence", "This food is extremely good",
                        List.of("This", "food", "is", "bussin", "cap", "delulu"), "This food is bussin",
                        "Extremely good food = bussin."),
                translate("Translate this sentence", "That meal was fire and amazing",
                        List.of("That", "meal", "was", "bussin", "fr", "ohio"), "That meal was bussin fr",
                        "Bussin + fr (for real) doubles the sincerity of the compliment.")));

        lessonService.addLesson(lesson("Lowkey", "slate", "Secretly or subtly.", "🤫"), List.of(
                intro("New Word: Lowkey",
                        "\"Lowkey\" means secretly, subtly, or to a moderate degree. Its opposite, \"highkey\", means openly or very much so.",
                        "Example: \"I lowkey want dessert but I won't say it out loud.\""),
                select("\"Lowkey\" means...", null,
                        List.of("Very loudly", "Secretly or subtly", "Obviously", "Not at all"), 1,
                        "Lowkey = secretly or to a subtle degree."),
                select("\"Highkey\" is the ____ of lowkey.", null,
                        List.of("Synonym", "Opposite", "Slang version", "Translation"), 1,
                        "Highkey means openly or very much — the opposite of lowkey."),
                select("\"I lowkey love this song\" means...", null,
                        List.of("I hate this song", "I openly love this song", "I secretly enjoy this song",
                                "I don't know this song"),
                        2, "Lowkey here means the speaker quietly enjoys it but may not want to admit it."),
                translate("Translate this sentence", "I secretly think he is cute",
                        List.of("I", "lowkey", "think", "he", "is", "cute"), "I lowkey think he is cute",
                        "Secret feelings = lowkey."),
                translate("Translate this sentence", "She openly hates mornings",
                        List.of("She", "highkey", "hates", "mornings", "lowkey", "cap"), "She highkey hates mornings",
                        "Openly/very much = highkey.")));

        lessonService.addLesson(lesson("NPC Behaviour", "zinc", "Acting robotic with no original thought.", "🤖"),
                List.of(
                        intro("New Word: NPC",
                                "NPC stands for Non-Playable Character (from video games). In slang, calling someone an NPC means they act robotically, follow the crowd, and have no original thoughts.",
                                "Example: \"He just agreed with everyone — total NPC behaviour.\""),
                        select("An NPC in slang is someone who...", null,
                                List.of("Is very creative", "Follows the crowd blindly", "Is extremely athletic",
                                        "Leads others"),
                                1, "NPC = someone acting like a background character with no individual thought."),
                        select("\"NPC behaviour\" at a protest means...", null,
                                List.of("Leading the charge", "Chanting slogans without knowing why",
                                        "Organising the event", "Leaving early"),
                                1, "NPC behaviour = following without thinking, like a scripted game character."),
                        select("The phrase 'NPC mindset' is...", null,
                                List.of("A compliment", "Neutral", "An insult", "A goal"), 2,
                                "Being called an NPC is an insult — it means you lack original thought or personality."),
                        translate("Translate this sentence", "He just follows without thinking",
                                List.of("He", "is", "such", "an", "NPC", "sigma"), "He is such an NPC",
                                "Following without original thought = being an NPC."),
                        translate("Translate this sentence", "Stop acting like a background character",
                                List.of("Stop", "acting", "like", "an", "NPC", "rizz"), "Stop acting like an NPC",
                                "Background character with no agency = NPC.")));

        lessonService.addLesson(lesson("Main Character", "violet", "Treating yourself as the protagonist.", "🎬"),
                List.of(
                        intro("New Word: Main Character",
                                "\"Main character energy\" means treating yourself as the protagonist of your own life story — confident, dramatic, and at the centre of attention.",
                                "Example: \"She walked in like she was the main character.\""),
                        select("\"Main character energy\" is about...", null,
                                List.of("Being shy and quiet", "Treating yourself as the hero of your story",
                                        "Following others", "Avoiding attention"),
                                1, "Main character energy = acting like life is your movie and you're the star."),
                        select("Which action shows main character energy?", null,
                                List.of("Sitting in the corner silently", "Walking in slow-motion to a dramatic song",
                                        "Copying someone else's style", "Avoiding eye contact"),
                                1, "Slow-motion walks and dramatic music are classic main character moments."),
                        select("The opposite of main character is...", null,
                                List.of("Side character", "NPC", "Both A and B", "Sigma"), 2,
                                "Both side characters and NPCs represent people who aren't the focus — main character is the opposite."),
                        translate("Translate this sentence", "She walks in like she owns the place",
                                List.of("She", "has", "main", "character", "energy", "ohio"),
                                "She has main character energy", "Owning the room = main character energy."),
                        translate("Translate this sentence", "Stop acting like you are in a movie",
                                List.of("Stop", "acting", "like", "the", "main", "character"),
                                "Stop acting like the main character",
                                "Being overly dramatic = acting like the main character.")));

        lessonService.addLesson(lesson("Based", "stone", "Holding a strong opinion unapologetically.", "🗿"), List.of(
                intro("New Word: Based",
                        "\"Based\" means holding a strong, genuine opinion and being unapologetically yourself — regardless of what others think. It is a compliment for authenticity.",
                        "Example: \"He wore that outfit with full confidence. Based.\""),
                select("\"Based\" is used to describe someone who...", null,
                        List.of("Agrees with everyone", "Is unapologetically themselves", "Is always wrong",
                                "Is very quiet"),
                        1, "Based = authentic, confident, doesn't care about others' opinions."),
                select("Calling someone \"based\" is...", null,
                        List.of("An insult", "Neutral", "A compliment", "A question"), 2,
                        "Based is a compliment — it means you admire their confident authenticity."),
                select("\"That's a based take\" means...", null,
                        List.of("That opinion is boring", "That opinion is confidently authentic",
                                "That opinion is wrong", "That opinion is popular"),
                        1, "A based take = a confident, genuine opinion you stand behind regardless of backlash."),
                translate("Translate this sentence", "He is unapologetically himself",
                        List.of("He", "is", "based", "no", "cap", "sigma"), "He is based",
                        "Unapologetically authentic = based."),
                translate("Translate this sentence", "That is a bold and genuine opinion",
                        List.of("That", "is", "a", "based", "take", "rizz"), "That is a based take",
                        "Bold, genuine opinion = based take.")));

        lessonService.addLesson(lesson("Rent Free", "cyan", "Living in your head without permission.", "🧠"), List.of(
                intro("New Word: Rent Free",
                        "Something \"living rent free\" in your head means you can't stop thinking about it, even if you want to. It occupies mental space without you inviting it.",
                        "Example: \"That song is living rent free in my head.\""),
                select("\"Living rent free in my head\" means...", null,
                        List.of("I paid for something", "I can't stop thinking about it",
                                "I forgot about it completely", "I own a house"),
                        1, "Rent free = occupying mental real estate without permission."),
                select("Which is an example of living rent free?", null,
                        List.of("Forgetting an exam", "Obsessively replaying an embarrassing moment",
                                "Sleeping peacefully", "Ignoring drama"),
                        1, "Replaying an embarrassing moment = it's living rent free in your head."),
                select("If a song is \"rent free\", you...", null,
                        List.of("Hate it completely", "Can't stop thinking about or humming it", "Never heard of it",
                                "Composed it"),
                        1, "The song keeps playing in your mind involuntarily — classic rent free."),
                translate("Translate this sentence", "That meme will not leave my head",
                        List.of("That", "meme", "lives", "rent", "free", "in", "my", "head"),
                        "That meme lives rent free in my head", "Can't get it out of your head = living rent free."),
                translate("Translate this sentence", "She is always on my mind",
                        List.of("She", "lives", "rent", "free", "in", "my", "head"), "She lives rent free in my head",
                        "Constantly thinking about someone = living rent free.")));

        lessonService.addLesson(lesson("It's Giving", "emerald", "It has the energy or vibe of...", "✨"), List.of(
                intro("New Word: It's Giving",
                        "\"It's giving\" is used to describe the vibe, energy, or feeling that something exudes. It's like saying 'it reminds me of' or 'it has the energy of'.",
                        "Example: \"That outfit is giving royalty.\""),
                select("\"It's giving\" is closest in meaning to...", null,
                        List.of("It costs a lot", "It has the vibe of", "It is giving away", "It belongs to someone"),
                        1, "It's giving = it exudes / it has the energy of."),
                select("\"That speech is giving main character\" means...", null,
                        List.of("The speech was boring", "The speech had main character energy",
                                "The speech was a gift", "The speech was too short"),
                        1, "The speech gave off main character vibes."),
                select("\"It's giving chaos\" describes something that is...", null,
                        List.of("Very orderly", "Extremely chaotic or wild", "Expensive", "Quiet"), 1,
                        "Giving chaos = exuding chaotic energy."),
                translate("Translate this sentence", "That outfit has royal energy",
                        List.of("That", "outfit", "is", "giving", "royalty", "ohio"), "That outfit is giving royalty",
                        "Having the vibe of something = it's giving [that thing]."),
                translate("Translate this sentence", "This party has sigma energy",
                        List.of("This", "party", "is", "giving", "sigma", "bussin"), "This party is giving sigma",
                        "Giving + descriptor = it has that energy.")));

        lessonService.addLesson(lesson("Touch Grass", "green", "Go outside, disconnect from internet.", "🌿"), List.of(
                intro("New Word: Touch Grass",
                        "\"Touch grass\" means to go outside and disconnect from the internet. It's told to people who are too online, arguing too hard online, or being unhinged on social media.",
                        "Example: \"You've been arguing about this for 6 hours. Touch grass.\""),
                select("\"Touch grass\" means...", null,
                        List.of("Plant a garden", "Go outside and disconnect", "Win an argument", "Touch someone"), 1,
                        "Touch grass = go outside, skill issue detected, you're too online."),
                select("You would tell someone to touch grass if they...", null,
                        List.of("Win a sports game", "Have been arguing online for hours", "Cook a great meal",
                                "Study all night"),
                        1, "Someone who is too deep in internet drama needs to touch grass."),
                select("Telling someone to touch grass is...", null,
                        List.of("Encouraging them to garden", "An insult meaning they're too online",
                                "A compliment for creativity", "A meme about Ohio"),
                        1, "It's a mildly dismissive suggestion — you need a reality check, go outside."),
                translate("Translate this sentence", "Please go outside and log off",
                        List.of("Please", "touch", "grass", "and", "log", "off"), "Please touch grass and log off",
                        "Go outside = touch grass."),
                translate("Translate this sentence", "You are too online right now",
                        List.of("You", "need", "to", "touch", "grass", "sigma"), "You need to touch grass",
                        "Too online = needs to touch grass.")));

        lessonService.addLesson(lesson("Caught in 4K", "indigo", "Caught with undeniable evidence.", "📷"), List.of(
                intro("New Word: Caught in 4K",
                        "\"Caught in 4K\" means being caught red-handed with absolutely undeniable, crystal-clear evidence. It references 4K video resolution — so clear there's no denying it.",
                        "Example: \"He lied about being sick but was caught in 4K at the mall.\""),
                select("\"Caught in 4K\" means...", null,
                        List.of("Caught watching TV", "Caught with undeniable clear evidence",
                                "Caught making a 4K video", "Caught in Ohio"),
                        1, "4K = ultra-high resolution — caught so clearly there's no denying it."),
                select("You are caught in 4K when...", null,
                        List.of("Nobody sees you", "You're caught on camera doing something undeniably",
                                "You win a bet", "You delete evidence"),
                        1, "Caught in 4K = evidence so clear it's irrefutable."),
                select("The 4K in this phrase refers to...", null,
                        List.of("4000 dollars", "High resolution video quality", "4000 people watching", "4K hours"), 1,
                        "4K resolution is ultra-clear — so caught in 4K means caught with crystal-clear evidence."),
                translate("Translate this sentence", "He was caught red-handed lying",
                        List.of("He", "was", "caught", "in", "4K", "lying"), "He was caught in 4K lying",
                        "Caught red-handed with clear evidence = caught in 4K."),
                translate("Translate this sentence", "The video proves she was there",
                        List.of("She", "was", "caught", "in", "4K", "no", "cap"), "She was caught in 4K no cap",
                        "Undeniable video proof = caught in 4K.")));

        lessonService.addLesson(lesson("Vibe Check", "purple", "Assessing someone's energy or mood.", "🎵"), List.of(
                intro("New Word: Vibe Check",
                        "A \"vibe check\" is an assessment of someone's current energy, mood, or attitude. If you pass the vibe check, your energy is good. If you fail it, something is off.",
                        "Example: \"Vibe check — you seem stressed today.\""),
                select("A vibe check is...", null,
                        List.of("A music test", "An assessment of someone's mood or energy", "A vibration sensor",
                                "A math quiz"),
                        1, "Vibe check = checking the vibe/energy someone is giving off."),
                select("If you fail the vibe check, you...", null,
                        List.of("Have great energy", "Have won a prize", "Have bad or off energy", "Are very skilled"),
                        2, "Failing the vibe check means your vibe/energy is not good."),
                select("\"The whole party failed the vibe check\" means...", null,
                        List.of("The party was amazing", "Nobody danced", "The energy of the whole party was off",
                                "Everyone passed the test"),
                        2, "The energy of the whole party was wrong or uncomfortable."),
                translate("Translate this sentence", "Check if this place has good energy",
                        List.of("Vibe", "check", "this", "place", "bussin", "ohio"), "Vibe check this place",
                        "Assessing energy = vibe check."),
                translate("Translate this sentence", "His mood is completely off today",
                        List.of("He", "failed", "the", "vibe", "check", "today"), "He failed the vibe check today",
                        "Off energy = failed the vibe check.")));

        lessonService.addLesson(lesson("Gyatt", "red", "Exclamation of admiration.", "😳"), List.of(
                intro("New Word: Gyatt",
                        "\"Gyatt\" (also spelled \"gyat\") is an exclamation used to express admiration, usually at an attractive person. It is derived from a popular streamer's reaction.",
                        "Example: \"Gyatt! Did you see her walk in?\""),
                select("\"Gyatt\" is best described as...", null,
                        List.of("An insult", "A dance move", "An exclamation of admiration", "A type of food"), 2,
                        "Gyatt is an exclamation expressing surprised admiration."),
                select("When would you say \"gyatt\"?", null,
                        List.of("When something is disgusting", "When you see someone very attractive",
                                "When you are bored", "When food is bussin"),
                        1, "Gyatt is said in reaction to someone you find very attractive."),
                select("\"Gyatt\" is closest in meaning to...", null, List.of("Yuck", "Wow", "Okay", "Maybe"), 1,
                        "Gyatt is a surprised, admiring exclamation similar to 'wow'."),
                translate("Translate this sentence", "Wow she looks amazing",
                        List.of("Gyatt", "she", "looks", "amazing", "bussin", "rizz"), "Gyatt she looks amazing",
                        "Surprised admiration = Gyatt."),
                translate("Translate this sentence", "He walked in and everyone was shocked",
                        List.of("He", "walked", "in", "gyatt", "no", "cap"), "He walked in gyatt no cap",
                        "The slang phrase captures the admiring reaction.")));
    }

    // ─── Terms ──────────────────────────────────────────────────────────────────

    private void seedTerms() {
        if (termRepository.count() >= 7)
            return;
        termRepository.deleteAll();

        List<Lesson> all = lessonRepository.findAll();
        Lesson rizz = lessonByTitle(all, "Rizz Basics");
        Lesson fanum = lessonByTitle(all, "Fanum Tax");
        Lesson ohio = lessonByTitle(all, "Ohio Lore");
        Lesson skibidi = lessonByTitle(all, "Skibidi 101");
        Lesson mewing = lessonByTitle(all, "Mewing Pro");
        Lesson sigma = lessonByTitle(all, "Sigma Mindset");
        Lesson delulu = lessonByTitle(all, "Delulu Land");

        termRepository.saveAll(List.of(
                term("Rizz", "Short for charisma. Ability to attract a romantic partner.",
                        "He has so much rizz, he didn't even have to say anything.", Difficulty.EASY, Category.NOUN,
                        rizz),
                term("Skibidi", "Often used to describe something bad/evil, from the Skibidi Toilet series.",
                        "That's so skibidi of you.", Difficulty.MEDIUM, Category.ADJECTIVE, skibidi),
                term("Gyatt", "An exclamation used when seeing someone with a large posterior.", "Gyatt! Look at that!",
                        Difficulty.EASY, Category.REACTION, null),
                term("Fanum Tax", "Stealing a portion of someone else's food, popularized by streamer Fanum.",
                        "You gotta pay the Fanum Tax on those fries.", Difficulty.MEDIUM, Category.NOUN, fanum),
                term("Sigma", "A lone wolf who is successful and independent. Often used ironically.",
                        "He's such a sigma male.", Difficulty.EASY, Category.NOUN, sigma),
                term("Ohio", "Used to describe something weird, cringey, or abnormal.",
                        "Only in Ohio would that happen.", Difficulty.MEDIUM, Category.ADJECTIVE, ohio),
                term("Mewing", "A tongue exercise meant to define the jawline. Associated with sigma culture.",
                        "I can't talk right now, I'm mewing.", Difficulty.HARD, Category.NOUN, mewing),
                term("Delulu", "Short for delusional. Often used in the context of fan culture or relationships.",
                        "She's so delulu if she thinks they're dating.", Difficulty.EASY, Category.ADJECTIVE, delulu)));
    }

    // ─── Daily Quiz ─────────────────────────────────────────────────────────────

    private void seedDailyQuiz() {
        boolean exists = quizRepository.findAll().stream().anyMatch(q -> q instanceof DailyQuiz);
        if (exists)
            return;

        DailyQuiz dq = new DailyQuiz();
        dq.setDate(LocalDate.now());

        SelectQuestion q1 = SelectQuestion.builder()
                .title("Which of these correctly uses \"mewing\" in a sentence?")
                .options(List.of("I mewed the exam", "He stays quiet because he's mewing", "She mewed to the party",
                        "They mewed all the fries"))
                .correctAnswer(1)
                .explanation(
                        "Mewing requires silence — pressing the tongue to the roof of the mouth. \"He stays quiet because he's mewing\" is the correct usage.")
                .quiz(dq).build();

        SelectQuestion q2 = SelectQuestion.builder()
                .title("\"The delulu is the solulu\" means...")
                .options(List.of("Being realistic always wins", "Delusional positivity is somehow the answer",
                        "You should face the truth", "Delulu people never succeed"))
                .correctAnswer(1)
                .explanation(
                        "This ironic phrase means sometimes delusional confidence is what gets you through — it's used humorously in Gen Z culture.")
                .quiz(dq).build();

        SelectQuestion q3 = SelectQuestion.builder()
                .title("A true Sigma would most likely...")
                .options(List.of("Lead a group project loudly", "Follow the most popular person",
                        "Work alone without seeking approval", "Post on social media every day"))
                .correctAnswer(2)
                .explanation(
                        "A Sigma is a lone wolf who operates outside social hierarchies — self-sufficient, silent, and independent.")
                .quiz(dq).build();

        dq.setQuestions(List.of(q1, q2, q3));
        quizRepository.save(dq);
    }

    // ─── Onboarding Quiz ────────────────────────────────────────────────────────

    private void seedOnboardingQuiz() {
        boolean exists = quizRepository.findAll().stream().anyMatch(q -> q instanceof OnboardingQuiz);
        if (exists)
            return;

        OnboardingQuiz oq = new OnboardingQuiz();

        SelectQuestion q1 = SelectQuestion.builder()
                .title("What is 'Fanum Tax'?")
                .options(List.of("A government fee", "Stealing food", "Paying for fans", "A dance move"))
                .correctAnswer(1).explanation("Fanum Tax means stealing a bite from someone else's food.").quiz(oq)
                .build();

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
                .correctAnswer(0).explanation("Mewing is a tongue posture exercise to define the jawline.").quiz(oq)
                .build();

        SelectQuestion q5 = SelectQuestion.builder()
                .title("What is a 'Sigma'?")
                .options(List.of("A follower", "A lone wolf", "A loud person", "A lazy person"))
                .correctAnswer(1).explanation("A Sigma is an independent lone wolf outside the social hierarchy.")
                .quiz(oq).build();

        oq.setQuestions(List.of(q1, q2, q3, q4, q5));
        quizRepository.save(oq);
    }

    // ─── Revision Quiz ──────────────────────────────────────────────────────────

    private void seedRevisionQuiz() {
        boolean exists = quizRepository.findAll().stream().anyMatch(q -> q instanceof RevisionQuiz);
        if (exists)
            return;

        RevisionQuiz rq = new RevisionQuiz();
        rq.setAfterLessonIndex(6); // after all 7 current lessons (0-based)

        SelectQuestion q1 = SelectQuestion.builder()
                .title("Which term means having natural charm without trying?")
                .options(List.of("Sigma", "Rizz", "Mewing", "Delulu"))
                .correctAnswer(1).explanation("Rizz is short for cha-rizz-ma — natural social charm.").quiz(rq).build();

        SelectQuestion q2 = SelectQuestion.builder()
                .title("Your friend grabs a handful of your fries without asking. What just happened?")
                .options(List.of("An Ohio moment", "Fanum Tax", "Sigma move", "Skibidi behaviour"))
                .correctAnswer(1).explanation("Fanum Tax = taking someone else's food, popularised by streamer Fanum.")
                .quiz(rq).build();

        SelectQuestion q3 = SelectQuestion.builder()
                .title("She truly believes her celebrity crush is secretly in love with her. She is...")
                .options(List.of("Sigma", "Ohio", "Delulu", "Mewing"))
                .correctAnswer(2)
                .explanation(
                        "Delulu (delusional) describes someone with wildly unrealistic beliefs, often about relationships.")
                .quiz(rq).build();

        SelectQuestion q4 = SelectQuestion.builder()
                .title("A video shows a cat riding a skateboard through a thunderstorm. That's very...")
                .options(List.of("Rizz", "Sigma", "Ohio", "Mewing"))
                .correctAnswer(2).explanation("Ohio = weird, cringey, or abnormal. Classic Ohio behaviour.").quiz(rq)
                .build();

        SelectQuestion q5 = SelectQuestion.builder()
                .title("He works in silence, needs no validation, and grinds alone. He has the ____ mindset.")
                .options(List.of("Fanum", "Skibidi", "Delulu", "Sigma"))
                .correctAnswer(3)
                .explanation("The Sigma is the lone wolf — self-sufficient, independent, outside social hierarchies.")
                .quiz(rq).build();

        SelectQuestion q6 = SelectQuestion.builder()
                .title("She can't talk right now — she's focused on her tongue posture. She is...")
                .options(List.of("Mewing", "Ohio", "Rizz", "Skibidi"))
                .correctAnswer(0)
                .explanation("Mewing = pressing tongue to roof of mouth to define the jawline. Requires silence.")
                .quiz(rq).build();

        SelectQuestion q7 = SelectQuestion.builder()
                .title("The viral YouTube series featuring heads emerging from toilets is called ____ Toilet.")
                .options(List.of("Ohio", "Sigma", "Skibidi", "Rizz"))
                .correctAnswer(2)
                .explanation("Skibidi Toilet is the viral animated series — skibidi now means something bad or cringe.")
                .quiz(rq).build();

        rq.setQuestions(List.of(q1, q2, q3, q4, q5, q6, q7));
        quizRepository.save(rq);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private Lesson lessonByTitle(List<Lesson> lessons, String title) {
        return lessons.stream().filter(l -> title.equals(l.getTitle())).findFirst().orElse(null);
    }

    private Term term(String word, String definition, String example, Difficulty difficulty, Category category,
            Lesson lesson) {
        return Term.builder().term(word).definition(definition).example(example)
                .difficulty(difficulty).category(category).lesson(lesson).build();
    }

    private LessonDTO lesson(String title, String colour, String story, String emoji) {
        LessonDTO dto = new LessonDTO();
        dto.setTitle(title);
        dto.setColour(colour);
        dto.setStory(story);
        dto.setEmoji(emoji);
        return dto;
    }

    private IntroQuestionDTO intro(String title, String content, String explanation) {
        IntroQuestionDTO dto = new IntroQuestionDTO();
        dto.setTitle(title);
        dto.setContent(content);
        dto.setExplanation(explanation);
        dto.setQuestion_type("INTRO");
        return dto;
    }

    private SelectQuestionDTO select(String title, String content, List<String> options, int correctAnswer,
            String explanation) {
        SelectQuestionDTO dto = new SelectQuestionDTO();
        dto.setTitle(title);
        dto.setContent(content);
        dto.setOptions(options);
        dto.setCorrectAnswer(correctAnswer);
        dto.setExplanation(explanation);
        dto.setQuestion_type("SELECT");
        return dto;
    }

    private TranslateQuestionDTO translate(String title, String content, List<String> wordbank, String target,
            String explanation) {
        TranslateQuestionDTO dto = new TranslateQuestionDTO();
        dto.setTitle(title);
        dto.setContent(content);
        dto.setWordbank(wordbank);
        dto.setTarget(target);
        dto.setExplanation(explanation);
        dto.setQuestion_type("TRANSLATE");
        return dto;
    }

    // ─── Achievements ────────────────────────────────────────────────────────────

    private void seedAchievements() {
        List<Achievement> defaults = List.of(
                achievement("First Lesson", "Complete your very first lesson", "🌱", TriggerType.LESSON_COMPLETE, 1),
                achievement("Halfway There", "Complete 10 out of 20 lessons", "🚀", TriggerType.LESSON_COMPLETE, 10),
                achievement("Alpha Graduate", "Complete all 20 lessons", "🎓", TriggerType.LESSON_COMPLETE, 20),
                achievement("Streak Starter", "Maintain a 3-day streak", "🔥", TriggerType.STREAK_DAYS, 3),
                achievement("Week Warrior", "Maintain a 7-day streak", "⚡", TriggerType.STREAK_DAYS, 7),
                achievement("Daily Devotee", "Complete the daily quiz 5 times", "📅", TriggerType.DAILY_QUIZ_COUNT, 5),
                achievement("XP Grinder", "Earn 50 stars", "⭐", TriggerType.XP_REACHED, 50),
                achievement("Star Collector", "Earn 100 stars", "🌟", TriggerType.XP_REACHED, 100));

        for (Achievement a : defaults) {
            achievementRepository.findByName(a.getName()).ifPresentOrElse(existing -> {
                existing.setDescription(a.getDescription());
                existing.setThreshold(a.getThreshold());
                existing.setTriggerType(a.getTriggerType());
                existing.setIcon(a.getIcon());
                achievementRepository.save(existing);
            }, () -> achievementRepository.save(a));
        }
    }

    private Achievement achievement(String name, String description, String icon,
            TriggerType triggerType, int threshold) {
        return Achievement.builder()
                .name(name).description(description).icon(icon)
                .triggerType(triggerType).threshold(threshold)
                .build();
    }
}
