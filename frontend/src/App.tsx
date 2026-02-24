import { useState } from 'react';
import { BookOpen, Trophy, Flame, Star, Search, Zap, Check, Gamepad2, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- DATA & TYPES ---

interface Term {
  id: string;
  term: string;
  definition: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface Lesson {
  id: string;
  title: string;
  color: string;
  gradient: string;
  locked: boolean;
  completed: boolean;
  x: number;
  chapter: number;
  story: string;    // short narrative blurb shown under the title
  emoji: string;
}

const TERMS: Term[] = [
  {
    id: '1',
    term: 'Rizz',
    definition: 'Short for charisma. Ability to attract a romantic partner.',
    example: "He has so much rizz, he didn't even have to say anything.",
    difficulty: 'easy',
    category: 'noun'
  },
  {
    id: '2',
    term: 'Skibidi',
    definition: 'Often used as a nonsense word or to describe something bad/evil, originating from the Skibidi Toilet series.',
    example: "That's so skibidi of you.",
    difficulty: 'medium',
    category: 'adjective'
  },
  {
    id: '3',
    term: 'Gyatt',
    definition: 'An exclamation used when seeing someone with a large posterior. Derived from "God damn".',
    example: 'Gyatt! Look at that!',
    difficulty: 'easy',
    category: 'reaction'
  },
  {
    id: '4',
    term: 'Fanum Tax',
    definition: "Stealing a portion of someone else's food, popularized by streamer Fanum.",
    example: 'You gotta pay the Fanum Tax on those fries.',
    difficulty: 'medium',
    category: 'noun'
  },
  {
    id: '5',
    term: 'Sigma',
    definition: 'A "lone wolf" or someone who is successful and independent. Often used ironically.',
    example: "He's such a sigma male.",
    difficulty: 'easy',
    category: 'noun'
  },
  {
    id: '6',
    term: 'Ohio',
    definition: 'Used to describe something weird, cringey, or abnormal. Based on memes about the state.',
    example: 'Only in Ohio would that happen.',
    difficulty: 'medium',
    category: 'adjective'
  },
  {
    id: '7',
    term: 'Mewing',
    definition: 'A tongue exercise meant to define the jawline. Often associated with "looksmaxxing".',
    example: "I can't talk right now, I'm mewing.",
    difficulty: 'hard',
    category: 'verb'
  },
  {
    id: '8',
    term: 'Delulu',
    definition: 'Short for delusional. Often used in the context of fan culture or relationships.',
    example: "She's so delulu if she thinks they're dating.",
    difficulty: 'easy',
    category: 'adjective'
  }
];

const LESSONS: Lesson[] = [
  { id: '1', title: 'Rizz Refinery', color: 'bg-green-500', locked: false, completed: false, x: 0 },
  { id: '2', title: 'Fanum Fields', color: 'bg-indigo-500', locked: true, completed: false, x: 40 },
  { id: '3', title: 'Ohio Outpost', color: 'bg-yellow-500', locked: true, completed: false, x: -40 },
  { id: '4', title: 'Skibidi Surfers', color: 'bg-red-500', locked: true, completed: false, x: 0 },
  { id: '5', title: 'Mewing Meadows', color: 'bg-orange-500', locked: true, completed: false, x: 40 },
  { id: '6', title: 'Sigma Springs', color: 'bg-purple-500', locked: true, completed: false, x: -40 },
  { id: '7', title: 'Glazing Gulch', color: 'bg-pink-500', locked: true, completed: false, x: 0 },
];

const QUIZ_QUESTIONS: Record<string, { q: string; options: string[]; correct: number; explanation: string }[]> = {
  '1': [
    { q: "What is 'Rizz' short for?", options: ["Risk", "Charisma", "Rhythm", "Real"], correct: 1, explanation: "'Rizz' is slang derived from 'charisma' — the natural ability to charm or attract others." },
    { q: "If you have 'W Rizz', you are...", options: ["Awkward", "Charming", "Sleepy", "Hungry"], correct: 1, explanation: "'W' in Gen Z slang means a win, so 'W Rizz' means top-tier, winning charm." },
    { q: "Which of these best describes someone with rizz?", options: ["Clumsy and shy", "Magnetic and attractive", "Loud and annoying", "Smart but boring"], correct: 1, explanation: "Rizz describes effortless attractiveness — someone people are naturally drawn to." },
    { q: "Rizz is most commonly used in the context of...", options: ["Academics", "Sports", "Romance", "Gaming"], correct: 2, explanation: "Rizz is primarily about attracting a romantic partner through charm and charisma." },
  ],
  '2': [
    { q: "What is 'Fanum Tax'?", options: ["A government fee", "Stealing food", "Paying for fans", "A dance move"], correct: 1, explanation: "Fanum Tax means stealing a portion of someone else's food, popularised by streamer Fanum." },
    { q: "Where did Fanum Tax originate?", options: ["TikTok", "Twitch streaming", "YouTube", "Instagram"], correct: 1, explanation: "The term was coined on Twitch, where streamer Fanum would take his friends' food on stream." },
    { q: "If someone pays 'Fanum Tax', they...", options: ["Earn XP", "Lose some of their food", "Win a prize", "Get fined"], correct: 1, explanation: "Paying the Fanum Tax means someone took a portion of your food — you 'paid' by losing some." },
    { q: "Fanum Tax is popularized by which type of creator?", options: ["Musician", "Artist", "Streamer", "Chef"], correct: 2, explanation: "Fanum is a Twitch streamer and member of the AMP group who popularised the term on his streams." },
  ],
  '3': [
    { q: "Ohio is often associated with...", options: ["Normalcy", "Weird events", "Good weather", "Technology"], correct: 1, explanation: "Ohio memes portray the state as a place where bizarre, surreal, or unsettling things happen." },
    { q: "Using 'Ohio' in Gen Z slang means something is...", options: ["Cool", "Strange or cringe", "Expensive", "Fast"], correct: 1, explanation: "Calling something 'Ohio' means it's weird or cringe — based on internet memes about the state." },
    { q: "Which phrase best uses Ohio correctly?", options: ["That sunset was so Ohio", "Only in Ohio would this happen", "He's got Ohio skills", "Ohio that meal!"], correct: 1, explanation: "'Only in Ohio would this happen' is the classic meme phrase used when something strange occurs." },
    { q: "Ohio memes are typically associated with...", options: ["Beautiful scenery", "Bizarre or unsettling events", "Sports victories", "Academic success"], correct: 1, explanation: "Ohio memes revolve around outlandish, creepy, or weird scenarios that 'could only happen in Ohio'." },
  ],
  '4': [
    { q: "Skibidi is mostly used as...", options: ["A formal greeting", "A nonsense filler word", "A cooking term", "A math concept"], correct: 1, explanation: "'Skibidi' is a nonsense/filler word from internet culture, often used to describe something weird." },
    { q: "Skibidi originated from which series?", options: ["Skibidi Toilet", "Skibidi Dance", "Skibidi School", "Skibidi Wars"], correct: 0, explanation: "Skibidi Toilet is a YouTube series with toilet-headed characters that made 'skibidi' go viral." },
    { q: "In Gen Z slang, 'skibidi' can describe something that is...", options: ["Delicious", "Weird or bad", "Exciting", "Calm"], correct: 1, explanation: "Skibidi is generally used negatively to call something strange, bad, or cringe in internet speak." },
    { q: "Which sentence uses 'skibidi' correctly?", options: ["That's so skibidi of you", "I skibidi to school daily", "She skibidied the exam", "Skibidi is a sport"], correct: 0, explanation: "'That's so skibidi of you' uses it as an adjective to describe weird or bad behaviour — the correct usage." },
  ],
  '5': [
    { q: "Mewing is done to improve...", options: ["Jawline", "Abs", "Hair growth", "Eyesight"], correct: 0, explanation: "Mewing is a tongue posture technique promoted online as a way to define and strengthen the jawline." },
    { q: "Mewing involves pressing your tongue against...", options: ["Your cheek", "The roof of your mouth", "Your teeth", "Your chin"], correct: 1, explanation: "The technique involves resting your tongue flat against the roof of your mouth to reshape the jaw over time." },
    { q: "Mewing is associated with which broader concept?", options: ["Looksmaxxing", "Speedrunning", "Cooking", "Studying"], correct: 0, explanation: "Looksmaxxing is maximising physical appearance — mewing is a popular technique within that community." },
    { q: "Which is TRUE about mewing?", options: ["It's a vocal exercise", "It's a tongue posture technique", "It's a type of dance", "It's a food diet"], correct: 1, explanation: "Mewing is specifically a tongue posture technique, not a vocal or physical exercise." },
  ],
  '6': [
    { q: "A 'Sigma' is considered...", options: ["A follower", "A lone wolf", "A loud person", "A lazy person"], correct: 1, explanation: "A Sigma is a 'lone wolf' — someone who succeeds independently outside of social hierarchies." },
    { q: "Sigma is often used to describe someone who is...", options: ["Dependent on others", "Independent and successful", "Talkative", "Easily influenced"], correct: 1, explanation: "The Sigma archetype values independence and self-sufficiency over social approval or group dynamics." },
    { q: "'Sigma grindset' refers to...", options: ["A type of workout", "A mindset focused on self-improvement", "A music genre", "A fashion style"], correct: 1, explanation: "'Grindset' blends 'grind' and 'mindset'. Sigma grindset means silently hustling and self-improving." },
    { q: "Which best contrasts a Sigma with an Alpha?", options: ["Alpha is popular, Sigma is a loner", "Alpha is smart, Sigma is dumb", "Alpha is quiet, Sigma is loud", "Alpha is lazy, Sigma is fast"], correct: 0, explanation: "In the meme hierarchy, Alphas lead social groups while Sigmas reject the hierarchy and go their own way." },
  ],
  '7': [
    { q: "Glazing means...", options: ["Eating donuts", "Over-complimenting someone", "Sleeping in", "Running fast"], correct: 1, explanation: "Glazing means excessively praising someone to the point it seems obsessive or sycophantic." },
    { q: "If someone is 'glazing' a celebrity, they are...", options: ["Criticizing them", "Excessively praising them", "Ignoring them", "Competing with them"], correct: 1, explanation: "Glazing a celebrity means showering them with over-the-top praise, often used mockingly toward hardcore fans." },
    { q: "Glazing is mostly used in the context of...", options: ["Sports commentary", "Gaming and fan culture", "Cooking shows", "Science class"], correct: 1, explanation: "Glazing is common in gaming and fan communities where people over-hype their favourite players." },
    { q: "Which phrase is an example of glazing?", options: ["He's just okay I guess", "He is literally the greatest person alive no cap", "I don't really know him", "We both made mistakes"], correct: 1, explanation: "'Literally the greatest person alive' is classic glazing — extreme, over-the-top, unearned praise." },
  ],
};

const ONBOARDING_QUESTIONS = [
  { q: "What is 'Fanum Tax'?", options: ["A government fee", "Stealing food", "Paying for fans", "A dance move"], correct: 1 },
  { q: "What is 'Rizz' short for?", options: ["Risk", "Charisma", "Rhythm", "Real"], correct: 1 },
  { q: "What does 'Skibidi' usually precede?", options: ["Toilet", "Bop", "Dop", "Yes"], correct: 0 },
  { q: "Mewing is done to improve...", options: ["Jawline", "Abs", "Hair", "Eyesight"], correct: 0 },
  { q: "What is a 'Sigma'?", options: ["A follower", "A lone wolf", "A loud person", "A lazy person"], correct: 1 },
];

const XP_PER_CORRECT = 50;
const PASS_THRESHOLD = 0.75; // 75% to unlock next lesson

// --- MAIN COMPONENT ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'learn' | 'leaderboard' | 'dict'>('learn');
  const [streak] = useState(12);
  const [xp, setXp] = useState(450);
  const [level, setLevel] = useState(5);
  const [dailyQuizCompleted, setDailyQuizCompleted] = useState(false);

  // Onboarding State — skip if user has been here before
  const isReturningUser = localStorage.getItem('alphaDecode_onboarded') === 'true';
  const [showOnboarding, setShowOnboarding] = useState(!isReturningUser);
  const [onboardingQIndex, setOnboardingQIndex] = useState(0);
  const [onboardingScore, setOnboardingScore] = useState(0);
  const [onboardingFinished, setOnboardingFinished] = useState(false);

  // Learning Path State
  const [lessons, setLessons] = useState(LESSONS);

  // Quiz State
  const [activeQuiz, setActiveQuiz] = useState<{
    lessonId: string;
    qIndex: number;
    show: boolean;
    correctCount: number; // track how many answers were correct this session
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number; xpEarned: number } | null>(null);

  const startQuiz = (lessonId: string) => {
    setActiveQuiz({ lessonId, qIndex: 0, show: true, correctCount: 0 });
    setQuizCompleted(false);
    setQuizResult(null);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null || !activeQuiz) return;
    setSelectedOption(optionIndex);

    const currentQuestions = QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'];
    const correct = currentQuestions[activeQuiz.qIndex].correct === optionIndex;
    setIsCorrect(correct);

    // Track correct count but don't award XP yet — XP only applied on full completion
    if (correct) {
      setActiveQuiz(prev => prev ? { ...prev, correctCount: prev.correctCount + 1 } : prev);
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    const currentQuestions = QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'];
    const totalQuestions = currentQuestions.length;

    if (activeQuiz.qIndex + 1 < totalQuestions) {
      // Move to next question
      setActiveQuiz({ ...activeQuiz, qIndex: activeQuiz.qIndex + 1 });
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      // Quiz finished — calculate results
      const finalCorrect = activeQuiz.correctCount;
      const xpEarned = finalCorrect * XP_PER_CORRECT;
      const scoreRatio = finalCorrect / totalQuestions;
      const isPerfect = scoreRatio === 1.0;
      const isPassing = scoreRatio >= PASS_THRESHOLD;

      setQuizResult({ correct: finalCorrect, total: totalQuestions, xpEarned });
      setQuizCompleted(true);

      // Only award XP on full lesson completion
      setXp(prev => prev + xpEarned);

      // Update lessons state
      setLessons(prev => {
        const updated = [...prev];
        const currentIndex = updated.findIndex(l => l.id === activeQuiz.lessonId);

        if (currentIndex !== -1) {
          // Lock lesson from re-attempt if perfect score
          if (isPerfect) {
            updated[currentIndex] = { ...updated[currentIndex], completed: true };
          }

          // Unlock next lesson only if passing (≥75%)
          if (isPassing && currentIndex + 1 < updated.length) {
            updated[currentIndex + 1] = { ...updated[currentIndex + 1], locked: false };
          }
        }

        return updated;
      });
    }
  };

  const handleOnboardingAnswer = (idx: number) => {
    if (idx === ONBOARDING_QUESTIONS[onboardingQIndex].correct) {
      setOnboardingScore(s => s + 1);
    }
    if (onboardingQIndex + 1 < ONBOARDING_QUESTIONS.length) {
      setOnboardingQIndex(i => i + 1);
    } else {
      setOnboardingFinished(true);
    }
  };

  const completeOnboarding = () => {
    const newLevel = onboardingScore * 10 || 1;
    setLevel(newLevel);
    localStorage.setItem('alphaDecode_onboarded', 'true');
    localStorage.setItem('alphaDecode_level', String(newLevel));
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-100 flex flex-col">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 text-white p-1 rounded-lg">
              <span className="font-black text-xl px-1">a</span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Alpha<span className="text-green-500">Decode</span>
            </h1>
          </div>

          <div className="flex items-center gap-6 font-bold text-sm">
            <div className="flex items-center gap-1.5 text-orange-500">
              <Flame size={20} fill="currentColor" /> <span>{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-500">
              <Star size={20} fill="currentColor" /> <span>{xp}</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-500">
              <Zap size={20} fill="currentColor" /> <span>LVL {level}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 pb-24">

        {activeTab === 'learn' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Daily Word Banner */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                    Daily Slang
                  </span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Feb 24, 2026</span>
                </div>
                <h2 className="text-5xl font-black mb-3">{TERMS[0].term}</h2>
                <p className="text-slate-300 text-lg mb-6">{TERMS[0].definition}</p>
                <div className="flex gap-3">
                  <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                    Learn More
                  </button>
                  <button className="border border-slate-600 text-slate-300 px-6 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-colors">
                    Share
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 blur-[100px] rounded-full opacity-20 -mr-20 -mt-20" />
            </div>

            {/* Daily Quiz Box */}
            {!dailyQuizCompleted && (
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Gamepad2 size={24} />
                    <h3 className="text-2xl font-black">Daily Quiz</h3>
                  </div>
                  <p className="text-indigo-100 font-medium">Test your knowledge up to Level {level}!</p>
                </div>
                <button
                  onClick={() => setDailyQuizCompleted(true)}
                  className="relative z-10 bg-white text-indigo-600 px-6 py-3 rounded-xl font-black hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  Start (+50 XP)
                </button>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column: Learning Path */}
              <div className="lg:col-span-2">
                <h3 className="font-black text-slate-400 text-sm uppercase tracking-wider mb-8 flex items-center gap-2">
                  <BookOpen size={18} /> Learning Path
                </h3>

                <div className="relative flex flex-col items-center py-8">
                  {/* Dashed Path Line */}
                  <div className="absolute inset-0 pointer-events-none flex justify-center">
                    <svg width="200" height="100%" className="opacity-40 text-slate-400" style={{ minHeight: '600px' }}>
                      <path
                        d="M 100 120 Q 140 220, 100 320 T 100 520 T 100 720"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray="16 16"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {lessons.filter(lesson => !lesson.locked).map((lesson, i) => {
                    const isCompleted = lesson.completed;
                    const isLocked = lesson.locked;
                    const isDisabled = isLocked || isCompleted;

                    return (
                      <div
                        key={lesson.id}
                        className="relative z-10 mb-12 last:mb-0 flex flex-col items-center group"
                        style={{ transform: `translateX(${lesson.x}px)` }}
                      >
                        <button
                          onClick={() => !isDisabled && startQuiz(lesson.id)}
                          disabled={isDisabled}
                          title={isCompleted ? 'Perfect score! Lesson complete.' : isLocked ? 'Complete the previous lesson first.' : 'Start lesson'}
                          className={`
                            w-20 h-20 rounded-full flex items-center justify-center shadow-[0_6px_0_rgba(0,0,0,0.2)]
                            border-4 border-white transition-all active:translate-y-1 active:shadow-none relative
                            ${isLocked ? 'bg-slate-200 text-slate-400 cursor-not-allowed' :
                              isCompleted ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70' :
                                `${lesson.color} text-white hover:scale-110 hover:rotate-3`}
                          `}
                        >
                          {isLocked ? <Lock size={28} /> :
                            isCompleted ? <Check size={28} /> :
                              i === 0 ? <Star fill="currentColor" size={32} /> :
                                <BookOpen size={28} />}

                          {/* Dot indicator for available but not completed */}
                          {!isLocked && !isCompleted && (
                            <div className="absolute -top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
                          )}

                        </button>

                        <span className={`mt-3 font-bold text-xs px-3 py-1 rounded-full border shadow-sm uppercase tracking-wide
                          ${isCompleted ? 'bg-green-50 text-green-600 border-green-200' :
                            isLocked ? 'bg-white text-slate-400 border-slate-100' :
                              'bg-white text-slate-400 border-slate-100'}`}>
                          {lesson.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Sidebar Widgets */}
              <div className="space-y-6">
                {/* XP info hint */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
                  <Star size={24} className="text-yellow-500 mx-auto mb-2" fill="currentColor" />
                  <p className="text-sm font-black text-slate-700">+{XP_PER_CORRECT} XP</p>
                  <p className="text-xs text-slate-400 font-medium">per correct answer</p>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center">
                  <Check size={24} className="text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-black text-slate-700">75% to unlock</p>
                  <p className="text-xs text-slate-400 font-medium">the next lesson</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Glossary Tab */}
        {activeTab === 'dict' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-slate-100 p-4 rounded-2xl">
              <div className="relative text-slate-500">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} />
                <input type="text" placeholder="Search slang..." className="w-full bg-transparent pl-10 pr-4 py-2 outline-none font-bold text-slate-800" />
              </div>
            </div>
            <div className="grid gap-4">
              {TERMS.map(term => (
                <div key={term.id} className="bg-white border-2 border-slate-100 p-5 rounded-2xl hover:border-green-200 transition-colors relative">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-black text-slate-800">{term.term}</h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${term.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                      term.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                      {term.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase mb-2">{term.category}</p>
                  <p className="text-slate-600 font-medium mb-3">{term.definition}</p>
                  <div className="bg-slate-50 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium italic inline-block">
                    "{term.example}"
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Leaderboard Tab Placeholder */}
        {activeTab === 'leaderboard' && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <Trophy size={48} className="mb-4 opacity-50" />
            <p className="font-bold">Leaderboard coming soon.</p>
          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 w-full bg-white border-t-2 border-slate-100 py-3 z-50">
        <div className="max-w-md mx-auto flex justify-between px-8">
          {[
            { id: 'learn', icon: BookOpen, label: 'Learn' },
            { id: 'leaderboard', icon: Trophy, label: 'Leaderboards' },
            { id: 'dict', icon: Search, label: 'Glossary' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id
                ? 'text-green-500 -translate-y-1'
                : 'text-slate-300 hover:text-slate-400'
                }`}
            >
              <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* QUIZ MODAL */}
      <AnimatePresence>
        {activeQuiz && activeQuiz.show && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Quiz Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <button onClick={() => setActiveQuiz(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
                <div className="h-3 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{
                      width: quizCompleted
                        ? '100%'
                        : `${((activeQuiz.qIndex) / (QUIZ_QUESTIONS[activeQuiz.lessonId]?.length || 1)) * 100}%`
                    }}
                  />
                </div>
                <div className="text-xs font-bold text-slate-400">
                  {quizCompleted ? '✓' : `${activeQuiz.qIndex + 1}/${QUIZ_QUESTIONS[activeQuiz.lessonId]?.length || 1}`}
                </div>
              </div>

              {/* Quiz Content */}
              <div className="p-8">
                {quizCompleted && quizResult ? (
                  <div className="text-center py-4">
                    {/* Score visual */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${quizResult.correct / quizResult.total === 1
                      ? 'bg-yellow-100 text-yellow-500'
                      : quizResult.correct / quizResult.total >= PASS_THRESHOLD
                        ? 'bg-green-100 text-green-500'
                        : 'bg-red-100 text-red-500'
                      }`}>
                      <Trophy size={40} fill="currentColor" />
                    </div>

                    <h3 className="text-3xl font-black text-slate-800 mb-1">
                      {quizResult.correct / quizResult.total === 1
                        ? 'Perfect Score! 🏆'
                        : quizResult.correct / quizResult.total >= PASS_THRESHOLD
                          ? 'Lesson Passed!'
                          : 'Keep Practicing!'}
                    </h3>
                    <p className="text-slate-500 font-medium mb-6">
                      {quizResult.correct}/{quizResult.total} correct
                    </p>

                    {/* XP Earned */}
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 mb-4 flex items-center justify-center gap-3">
                      <Star size={24} className="text-yellow-500" fill="currentColor" />
                      <span className="text-2xl font-black text-slate-800">+{quizResult.xpEarned} XP earned</span>
                    </div>

                    {/* Result hint */}
                    {quizResult.correct / quizResult.total === 1 && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm font-bold text-green-700">
                        🎉 Perfect! This lesson is now complete and locked.
                      </div>
                    )}
                    {quizResult.correct / quizResult.total >= PASS_THRESHOLD && quizResult.correct / quizResult.total < 1 && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 text-sm font-bold text-indigo-700">
                        🔓 Next lesson unlocked!
                      </div>
                    )}
                    {quizResult.correct / quizResult.total < PASS_THRESHOLD && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm font-bold text-red-700">
                        You need 75% to unlock the next lesson. Try again!
                      </div>
                    )}

                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="w-full bg-green-500 text-white py-4 rounded-xl font-black text-lg hover:bg-green-600 transition-colors shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-black text-slate-800 mb-8 leading-tight">
                      {(QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'])[activeQuiz.qIndex].q}
                    </h3>
                    <div className="space-y-3">
                      {(QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'])[activeQuiz.qIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={selectedOption !== null}
                          className={`w-full p-4 rounded-xl font-bold text-left border-2 transition-all flex items-center justify-between ${selectedOption === idx
                            ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                            : selectedOption !== null && idx === (QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'])[activeQuiz.qIndex].correct
                              ? 'bg-green-50 border-green-300 text-green-600' // highlight correct answer when wrong was picked
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                        >
                          {option}
                          {selectedOption === idx && (isCorrect ? <Check size={20} /> : <X size={20} />)}
                          {selectedOption !== null && selectedOption !== idx && idx === (QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'])[activeQuiz.qIndex].correct && (
                            <Check size={20} className="text-green-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Quiz Footer */}
              {!quizCompleted && selectedOption !== null && (
                <div className={`p-6 border-t ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className={`font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        {isCorrect ? `Nicely done! +${XP_PER_CORRECT} XP` : 'Not quite right.'}
                      </div>
                      {!isCorrect && selectedOption !== null && (
                        <p className="text-sm text-red-600 font-medium">
                          {(QUIZ_QUESTIONS[activeQuiz.lessonId] || QUIZ_QUESTIONS['1'])[activeQuiz.qIndex].explanation}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className={`shrink-0 px-6 py-3 rounded-xl font-black text-white shadow-sm flex items-center gap-2 ${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                      {activeQuiz.qIndex + 1 >= (QUIZ_QUESTIONS[activeQuiz.lessonId]?.length || 0) ? 'Finish' : 'Next'} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ONBOARDING MODAL */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${((onboardingQIndex) / ONBOARDING_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {!onboardingFinished ? (
                <>
                  <div className="mb-8 mt-4">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">Brain Rot Check</h2>
                    <p className="text-slate-500 font-bold">Question {onboardingQIndex + 1} of {ONBOARDING_QUESTIONS.length}</p>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-8">{ONBOARDING_QUESTIONS[onboardingQIndex].q}</h3>
                  <div className="space-y-3">
                    {ONBOARDING_QUESTIONS[onboardingQIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOnboardingAnswer(i)}
                        className="w-full p-4 rounded-xl font-bold text-left border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-4">
                  <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-900 shadow-lg">
                    <Trophy size={48} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Assessment Complete!</h2>
                  <p className="text-slate-500 font-medium mb-8">Your Brain Rot Score: {onboardingScore}/{ONBOARDING_QUESTIONS.length}</p>
                  <div className="bg-slate-100 p-6 rounded-2xl mb-8 border-2 border-slate-200">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Starting Level</p>
                    <p className="text-5xl font-black text-green-500">LVL {onboardingScore * 10 || 1}</p>
                  </div>
                  <button
                    onClick={completeOnboarding}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-lg hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    Start Learning
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}