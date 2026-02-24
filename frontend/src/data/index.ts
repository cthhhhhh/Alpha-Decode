import type { Term, Lesson, QuizQuestion, LessonContent } from '../types';

export const TERMS: Term[] = [
    {
        id: '1',
        term: 'Rizz',
        definition: 'Short for charisma. Ability to attract a romantic partner.',
        example: "He has so much rizz, he didn't even have to say anything.",
        difficulty: 'easy',
        category: 'noun',
    },
    {
        id: '2',
        term: 'Skibidi',
        definition: 'Often used as a nonsense word or to describe something bad/evil, originating from the Skibidi Toilet series.',
        example: "That's so skibidi of you.",
        difficulty: 'medium',
        category: 'adjective',
    },
    {
        id: '3',
        term: 'Gyatt',
        definition: 'An exclamation used when seeing someone with a large posterior. Derived from "God damn".',
        example: 'Gyatt! Look at that!',
        difficulty: 'easy',
        category: 'reaction',
    },
    {
        id: '4',
        term: 'Fanum Tax',
        definition: "Stealing a portion of someone else's food, popularized by streamer Fanum.",
        example: 'You gotta pay the Fanum Tax on those fries.',
        difficulty: 'medium',
        category: 'noun',
    },
    {
        id: '5',
        term: 'Sigma',
        definition: 'A "lone wolf" or someone who is successful and independent. Often used ironically.',
        example: "He's such a sigma male.",
        difficulty: 'easy',
        category: 'noun',
    },
    {
        id: '6',
        term: 'Ohio',
        definition: 'Used to describe something weird, cringey, or abnormal. Based on memes about the state.',
        example: 'Only in Ohio would that happen.',
        difficulty: 'medium',
        category: 'adjective',
    },
    {
        id: '7',
        term: 'Mewing',
        definition: 'A tongue exercise meant to define the jawline. Often associated with "looksmaxxing".',
        example: "I can't talk right now, I'm mewing.",
        difficulty: 'hard',
        category: 'verb',
    },
    {
        id: '8',
        term: 'Delulu',
        definition: 'Short for delusional. Often used in the context of fan culture or relationships.',
        example: "She's so delulu if she thinks they're dating.",
        difficulty: 'easy',
        category: 'adjective',
    },
];

export const LESSONS: Lesson[] = [
    { id: '1', title: 'Rizz Basics', color: 'bg-green-500', gradient: '', locked: false, completed: false, x: 0, chapter: 1, story: 'Learn the art of effortless charm.', emoji: '✨' },
    { id: '2', title: 'Fanum Tax', color: 'bg-indigo-500', gradient: '', locked: true, completed: false, x: 40, chapter: 1, story: 'The tax man cometh for your fries.', emoji: '🍟' },
    { id: '3', title: 'Ohio Lore', color: 'bg-yellow-500', gradient: '', locked: true, completed: false, x: -40, chapter: 2, story: 'Descend into the heart of the bizarre.', emoji: '🌀' },
    { id: '4', title: 'Skibidi 101', color: 'bg-red-500', gradient: '', locked: true, completed: false, x: 0, chapter: 2, story: 'A toilet-headed odyssey begins.', emoji: '🚽' },
    { id: '5', title: 'Mewing Pro', color: 'bg-orange-500', gradient: '', locked: true, completed: false, x: 40, chapter: 3, story: 'Jawline or bust. Silence is the grind.', emoji: '💪' },
    { id: '6', title: 'Sigma Mindset', color: 'bg-purple-500', gradient: '', locked: true, completed: false, x: -40, chapter: 3, story: 'Reject the hierarchy. Embrace the grindset.', emoji: '🐺' },
    { id: '7', title: 'Delulu Land', color: 'bg-pink-500', gradient: '', locked: true, completed: false, x: 0, chapter: 4, story: 'The delulu is the solulu.', emoji: '🌸' },
];

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    '1': [
        { q: "What is 'Rizz' short for?", options: ['Risk', 'Charisma', 'Rhythm', 'Real'], correct: 1, explanation: "'Rizz' is slang derived from 'charisma' — the natural ability to charm or attract others." },
        { q: "If you have 'W Rizz', you are...", options: ['Awkward', 'Charming', 'Sleepy', 'Hungry'], correct: 1, explanation: "'W' in Gen Z slang means a win, so 'W Rizz' means top-tier, winning charm." },
        { q: 'Which of these best describes someone with rizz?', options: ['Clumsy and shy', 'Magnetic and attractive', 'Loud and annoying', 'Smart but boring'], correct: 1, explanation: 'Rizz describes effortless attractiveness — someone people are naturally drawn to.' },
        { q: 'Rizz is most commonly used in the context of...', options: ['Academics', 'Sports', 'Romance', 'Gaming'], correct: 2, explanation: 'Rizz is primarily about attracting a romantic partner through charm and charisma.' },
    ],
    '2': [
        { q: "What is 'Fanum Tax'?", options: ['A government fee', 'Stealing food', 'Paying for fans', 'A dance move'], correct: 1, explanation: 'Fanum Tax means stealing a portion of someone else\'s food, popularised by streamer Fanum.' },
        { q: 'Where did Fanum Tax originate?', options: ['TikTok', 'Twitch streaming', 'YouTube', 'Instagram'], correct: 1, explanation: 'The term was coined on Twitch, where streamer Fanum would take his friends\' food on stream.' },
        { q: "If someone pays 'Fanum Tax', they...", options: ['Earn XP', 'Lose some of their food', 'Win a prize', 'Get fined'], correct: 1, explanation: "Paying the Fanum Tax means someone took a portion of your food — you 'paid' by losing some." },
        { q: 'Fanum Tax is popularized by which type of creator?', options: ['Musician', 'Artist', 'Streamer', 'Chef'], correct: 2, explanation: 'Fanum is a Twitch streamer and member of the AMP group who popularised the term on his streams.' },
    ],
    '3': [
        { q: 'Ohio is often associated with...', options: ['Normalcy', 'Weird events', 'Good weather', 'Technology'], correct: 1, explanation: 'Ohio memes portray the state as a place where bizarre, surreal, or unsettling things happen.' },
        { q: "Using 'Ohio' in Gen Z slang means something is...", options: ['Cool', 'Strange or cringe', 'Expensive', 'Fast'], correct: 1, explanation: "Calling something 'Ohio' means it's weird or cringe — based on internet memes about the state." },
        { q: 'Which phrase best uses Ohio correctly?', options: ['That sunset was so Ohio', 'Only in Ohio would this happen', "He's got Ohio skills", 'Ohio that meal!'], correct: 1, explanation: "'Only in Ohio would this happen' is the classic meme phrase used when something strange occurs." },
        { q: 'Ohio memes are typically associated with...', options: ['Beautiful scenery', 'Bizarre or unsettling events', 'Sports victories', 'Academic success'], correct: 1, explanation: "Ohio memes revolve around outlandish, creepy, or weird scenarios that 'could only happen in Ohio'." },
    ],
    '4': [
        { q: 'Skibidi is mostly used as...', options: ['A formal greeting', 'A nonsense filler word', 'A cooking term', 'A math concept'], correct: 1, explanation: "'Skibidi' is a nonsense/filler word from internet culture, often used to describe something weird." },
        { q: 'Skibidi originated from which series?', options: ['Skibidi Toilet', 'Skibidi Dance', 'Skibidi School', 'Skibidi Wars'], correct: 0, explanation: "Skibidi Toilet is a YouTube series with toilet-headed characters that made 'skibidi' go viral." },
        { q: "In Gen Z slang, 'skibidi' can describe something that is...", options: ['Delicious', 'Weird or bad', 'Exciting', 'Calm'], correct: 1, explanation: 'Skibidi is generally used negatively to call something strange, bad, or cringe in internet speak.' },
        { q: "Which sentence uses 'skibidi' correctly?", options: ["That's so skibidi of you", 'I skibidi to school daily', 'She skibidied the exam', 'Skibidi is a sport'], correct: 0, explanation: "'That's so skibidi of you' uses it as an adjective to describe weird or bad behaviour — the correct usage." },
    ],
    '5': [
        { q: 'Mewing is done to improve...', options: ['Jawline', 'Abs', 'Hair growth', 'Eyesight'], correct: 0, explanation: 'Mewing is a tongue posture technique promoted online as a way to define and strengthen the jawline.' },
        { q: 'Mewing involves pressing your tongue against...', options: ['Your cheek', 'The roof of your mouth', 'Your teeth', 'Your chin'], correct: 1, explanation: 'The technique involves resting your tongue flat against the roof of your mouth to reshape the jaw over time.' },
        { q: 'Mewing is associated with which broader concept?', options: ['Looksmaxxing', 'Speedrunning', 'Cooking', 'Studying'], correct: 0, explanation: 'Looksmaxxing is maximising physical appearance — mewing is a popular technique within that community.' },
        { q: 'Which is TRUE about mewing?', options: ["It's a vocal exercise", "It's a tongue posture technique", "It's a type of dance", "It's a food diet"], correct: 1, explanation: 'Mewing is specifically a tongue posture technique, not a vocal or physical exercise.' },
    ],
    '6': [
        { q: "A 'Sigma' is considered...", options: ['A follower', 'A lone wolf', 'A loud person', 'A lazy person'], correct: 1, explanation: "A Sigma is a 'lone wolf' — someone who succeeds independently outside of social hierarchies." },
        { q: 'Sigma is often used to describe someone who is...', options: ['Dependent on others', 'Independent and successful', 'Talkative', 'Easily influenced'], correct: 1, explanation: 'The Sigma archetype values independence and self-sufficiency over social approval or group dynamics.' },
        { q: "'Sigma grindset' refers to...", options: ['A type of workout', 'A mindset focused on self-improvement', 'A music genre', 'A fashion style'], correct: 1, explanation: "'Grindset' blends 'grind' and 'mindset'. Sigma grindset means silently hustling and self-improving." },
        { q: 'Which best contrasts a Sigma with an Alpha?', options: ['Alpha is popular, Sigma is a loner', 'Alpha is smart, Sigma is dumb', 'Alpha is quiet, Sigma is loud', 'Alpha is lazy, Sigma is fast'], correct: 0, explanation: 'In the meme hierarchy, Alphas lead social groups while Sigmas reject the hierarchy and go their own way.' },
    ],
    '7': [
        { q: "What does 'Delulu' mean?", options: ['Dedicated', 'Delusional', 'Deliberate', 'Delighted'], correct: 1, explanation: "'Delulu' is short for delusional — often used when someone has unrealistic expectations, especially about a celebrity crush." },
        { q: "Which context is 'Delulu' most commonly used in?", options: ['Cooking', 'Gaming', 'Fan culture or relationships', 'Sports'], correct: 2, explanation: 'Delulu is most often used in fan communities to describe fans who believe they have a real relationship with a celebrity.' },
        { q: "'The delulu is the solulu' means...", options: ['Being delusional is bad', 'Being delusional is somehow the solution', 'Reality always wins', 'You should be realistic'], correct: 1, explanation: 'This ironic phrase means that sometimes delusional positivity is what gets you through — it is used humorously.' },
        { q: "Which sentence uses 'delulu' correctly?", options: ["She's so delulu if she thinks they're dating", 'He delulued the test', 'I delulu every morning', 'Delulu is a sport'], correct: 0, explanation: "Using 'delulu' as an adjective to describe someone with an unrealistic belief is the correct Gen Z usage." },
    ],
};

export const ONBOARDING_QUESTIONS = [
    { q: "What is 'Fanum Tax'?", options: ['A government fee', 'Stealing food', 'Paying for fans', 'A dance move'], correct: 1 },
    { q: "What is 'Rizz' short for?", options: ['Risk', 'Charisma', 'Rhythm', 'Real'], correct: 1 },
    { q: "What does 'Skibidi' usually precede?", options: ['Toilet', 'Bop', 'Dop', 'Yes'], correct: 0 },
    { q: 'Mewing is done to improve...', options: ['Jawline', 'Abs', 'Hair', 'Eyesight'], correct: 0 },
    { q: "What is a 'Sigma'?", options: ['A follower', 'A lone wolf', 'A loud person', 'A lazy person'], correct: 1 },
];

export const XP_PER_CORRECT = 50;
export const PASS_THRESHOLD = 0.75;

export const LESSON_CONTENT: LessonContent[] = [
    {
        id: '1', name: 'Rizz Basics', steps: [
            { type: 'intro', title: 'New Word: Rizz', content: 'Rizz is short for charisma. It is your ability to attract a partner through your personality and charm.', explanation: 'Example: "He has unspoken rizz."' },
            { type: 'select', title: 'What does "Rizz" mean?', options: ['Being rich', 'Charisma', 'Running fast', 'Sleeping'], correctAnswer: 1, explanation: 'Rizz is short for cha-rizz-ma!' },
            { type: 'translate', title: 'Translate this sentence', content: 'He has charisma', wordBank: ['He', 'has', 'rizz', 'Ohio', 'skibidi'], targetSentence: 'He has rizz', explanation: 'In Gen Alpha slang, charisma is replaced with rizz.' },
            { type: 'select', title: 'Complete the sentence', content: 'She has so much ____, she can talk to anyone.', options: ['Ohio', 'Sigma', 'Rizz', 'Fanum'], correctAnswer: 2, explanation: 'Rizz is the social charm needed to talk to people smoothly.' },
            { type: 'select', title: 'What is "unspoken rizz"?', options: ['Being loud', 'Charming without speaking', 'Being shy', 'Having a bad jawline'], correctAnswer: 1, explanation: 'Unspoken rizz is raw charisma that doesn\'t even need words.' },
            { type: 'translate', title: 'Translate this sentence', content: 'She got major charisma', wordBank: ['She', 'got', 'major', 'rizz', 'Ohio', 'gyatt'], targetSentence: 'She got major rizz', explanation: 'Major charisma translates to major rizz.' },
        ]
    },
    {
        id: '2', name: 'Fanum Tax', steps: [
            { type: 'intro', title: 'New Word: Fanum Tax', content: "Popularized by streamer Fanum, this refers to the \"tax\" you take from a friend's food.", explanation: 'Example: "I\'m taking my Fanum Tax from that pizza."' },
            { type: 'select', title: 'When do you pay the Fanum Tax?', options: ['When you buy a car', 'When you eat with friends', 'When you go to Ohio', 'When you sleep'], correctAnswer: 1, explanation: 'It refers to stealing a bite of food!' },
            { type: 'translate', title: 'Translate this sentence', content: 'He stole my fries', wordBank: ['He', 'collected', 'the', 'Fanum', 'Tax', 'rizz'], targetSentence: 'He collected the Fanum Tax', explanation: 'Collecting the Fanum Tax = taking someone\'s food.' },
            { type: 'select', title: 'Who originally took the Fanum Tax?', options: ['A tax collector', 'A Twitch streamer', 'Chef Boyardee', 'Ohio monsters'], correctAnswer: 1, explanation: 'Twitch streamer Fanum started the meme by taking food from friends.' },
            { type: 'select', title: 'Which food is most prone to the Fanum Tax?', options: ['Pizza and fries', 'Salad', 'Plain water', 'Homework'], correctAnswer: 0, explanation: 'Pizza and fries are common targets for the tax.' },
            { type: 'translate', title: 'Translate this sentence', content: 'Tax my fries', wordBank: ['Fanum', 'Tax', 'my', 'fries', 'rizz', 'sigma'], targetSentence: 'Fanum Tax my fries', explanation: 'Applying the slang directly to the sentence.' },
        ]
    },
    {
        id: '3', name: 'Ohio Lore', steps: [
            { type: 'intro', title: 'New Word: Ohio', content: 'Ohio is used to describe anything weird or abnormal. It comes from memes suggesting that strange things only happen in Ohio.', explanation: 'Example: "That dog looks like it\'s from Ohio."' },
            { type: 'select', title: 'Ohio describes something that is...', options: ['Cool and trendy', 'Weird or bizarre', 'Expensive', 'Delicious'], correctAnswer: 1, explanation: 'Ohio memes portray the state as a place where bizarre, surreal things happen.' },
            { type: 'translate', title: 'Translate this sentence', content: 'Strange events only in Ohio', wordBank: ['Only', 'in', 'Ohio', 'strange', 'rizz', 'sigma'], targetSentence: 'Only in Ohio', explanation: 'The classic meme phrase is "Only in Ohio".' },
            { type: 'select', title: 'A dog from Ohio probably has...', options: ['A normal tail', 'Laser eyes or three heads', 'Good behavior', 'A trophy'], correctAnswer: 1, explanation: 'Anything from Ohio is depicted as anomalous or monstrous.' },
            { type: 'select', title: 'If a meal is "Ohio", it is...', options: ['Gourmet', 'Disgusting or weird', 'Fast', 'Cheap'], correctAnswer: 1, explanation: 'In the meme world, Ohio food is usually something unidentifiable.' },
            { type: 'translate', title: 'Translate this sentence', content: 'This food is weird', wordBank: ['This', 'food', 'is', 'Ohio', 'rizz', 'skibidi'], targetSentence: 'This food is Ohio', explanation: 'Replace "weird" with "Ohio" for full slang usage.' },
        ]
    },
    {
        id: '4', name: 'Skibidi 101', steps: [
            { type: 'intro', title: 'New Word: Skibidi', content: 'Originating from a viral YouTube series about toilets with heads, "Skibidi" is often used as a general term for something bad or chaotic.', explanation: 'Example: "That\'s so skibidi."' },
            { type: 'select', title: '"Skibidi" is generally used to describe something...', options: ['Awesome', 'Delicious', 'Weird or bad', 'Fast'], correctAnswer: 2, explanation: 'Skibidi is generally used negatively to call something strange, bad, or cringe.' },
            { type: 'select', title: 'Where do the characters heads come from?', options: ['Toilets', 'TV screens', 'Speakers', 'Computers'], correctAnswer: 0, explanation: 'The series features heads emerging from toilets.' },
            { type: 'translate', title: 'Translate this sentence', content: 'That is very chaotic', wordBank: ['That', 'is', 'so', 'skibidi', 'rizz', 'sigma'], targetSentence: 'That is so skibidi', explanation: 'Skibidi can mean chaotic or bad.' },
            { type: 'select', title: 'The Skibidi series started on...', options: ['Netflix', 'YouTube', 'Prime Video', 'TikTok'], correctAnswer: 1, explanation: 'It started as a series of shorts on YouTube.' },
            { type: 'translate', title: 'Translate this sentence', content: 'Stop being weird', wordBank: ['Stop', 'being', 'skibidi', 'Ohio', 'mewing', 'rizz'], targetSentence: 'Stop being skibidi', explanation: 'Skibidi is the adjective for weird in this context.' },
        ]
    },
    {
        id: '5', name: 'Mewing Pro', steps: [
            { type: 'intro', title: 'New Word: Mewing', content: 'Mewing is a tongue posture exercise meant to improve jawline definition. If someone is "mewing", they can\'t talk because their tongue is pressed to the roof of their mouth.', explanation: 'Example: "I can\'t answer, I\'m mewing."' },
            { type: 'select', title: 'Mewing is done to improve your...', options: ['Abs', 'Jawline', 'Hair', 'Eyesight'], correctAnswer: 1, explanation: 'Mewing is a tongue posture technique promoted to define the jawline.' },
            { type: 'translate', title: 'Translate this sentence', content: 'I am resting my tongue', wordBank: ['I', 'am', 'mewing', 'rizz', 'sigma', 'skibidi'], targetSentence: 'I am mewing', explanation: 'The act of proper tongue posture is called mewing.' },
            { type: 'select', title: 'If someone points to their jaw and stays quiet, they are...', options: ['Angry', 'Mewing', 'Sleepy', 'Eating'], correctAnswer: 1, explanation: 'Pointing to the jaw while silent is the universal signal for mewing.' },
            { type: 'select', title: 'Where should your tongue be while mewing?', options: ['Against your teeth', 'Roof of your mouth', 'Tucked under', 'Sticking out'], correctAnswer: 1, explanation: 'Full tongue contact with the roof of the mouth is the key.' },
            { type: 'translate', title: 'Translate this sentence', content: 'Silence is the grind', wordBank: ['Silence', 'is', 'mewing', 'sigma', 'rizz', 'Ohio'], targetSentence: 'Silence is mewing', explanation: 'Mewing requires silence to maintain focus.' },
        ]
    },
    {
        id: '6', name: 'Sigma Mindset', steps: [
            { type: 'intro', title: 'New Word: Sigma', content: 'A "Sigma" is a lone wolf who is successful and independent. While sometimes used seriously, it\'s often used ironically to describe someone acting cool.', explanation: 'Example: "He\'s a true sigma."' },
            { type: 'select', title: 'A Sigma is best described as...', options: ['A popular leader', 'A lone wolf', 'A follower', 'A lazy person'], correctAnswer: 1, explanation: 'A Sigma succeeds independently, outside of social hierarchies.' },
            { type: 'translate', title: 'Translate this sentence', content: 'He is a lone wolf who needs no one', wordBank: ['He', 'is', 'a', 'sigma', 'Ohio', 'delulu'], targetSentence: 'He is a sigma', explanation: 'A sigma is the lone wolf archetype in Gen Z slang.' },
            { type: 'select', title: 'The "Sigma grindset" is about...', options: ['Socializing', 'Silent self-improvement', 'Fashion only', 'Gaming all night'], correctAnswer: 1, explanation: 'It is about the silent hustle and improving oneself.' },
            { type: 'select', title: 'How does a Sigma relate to the social hierarchy?', options: ['At the bottom', 'At the top', 'Completely outside of it', 'Trying to lead it'], correctAnswer: 2, explanation: 'Sigmas reject the hierarchy entirely.' },
            { type: 'translate', title: 'Translate this sentence', content: 'Mindset of a lone wolf', wordBank: ['Sigma', 'mindset', 'only', 'rizz', 'skibidi', 'Ohio'], targetSentence: 'Sigma mindset only', explanation: 'Expressing the lone wolf approach.' },
        ]
    },
    {
        id: '7', name: 'Delulu Land', steps: [
            { type: 'intro', title: 'New Word: Delulu', content: 'Short for delusional. Being "delulu" means having unrealistic expectations or beliefs, especially about celebrities or crushes.', explanation: 'Example: "Stay delulu, it\'s the only way."' },
            { type: 'select', title: '"Delulu" is short for...', options: ['Dedicated', 'Delusional', 'Deliberate', 'Delighted'], correctAnswer: 1, explanation: "'Delulu' is short for delusional — used when someone has unrealistic expectations." },
            { type: 'translate', title: 'Translate this sentence', content: 'You are delusional', wordBank: ['You', 'are', 'delulu', 'rizz', 'sigma', 'skibidi'], targetSentence: 'You are delulu', explanation: 'Delusional becomes delulu in slang.' },
            { type: 'select', title: 'What is the "solulu"?', options: ['The reality', 'The problem', 'The delulu', 'The truth'], correctAnswer: 2, explanation: 'The phrase "The delulu is the solulu" suggests delusional positivity is the solution.' },
            { type: 'select', title: 'Believing your favorite singer will marry you is...', options: ['Realistic', 'Delulu', 'Sigma', 'Ohio'], correctAnswer: 1, explanation: 'Stalking or extreme parasocial beliefs are the definition of delulu.' },
            { type: 'translate', title: 'Translate this sentence', content: 'Delusional is the solution', wordBank: ['Delulu', 'is', 'the', 'solulu', 'rizz', 'sigma'], targetSentence: 'Delulu is the solulu', explanation: 'Translating the popular ironic catchphrase.' },
        ]
    },
];

