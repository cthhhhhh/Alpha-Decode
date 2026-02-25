import type { Term, Lesson, LessonContent } from '../types';

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

export const DAILY_QUIZ_QUESTIONS = [
    {
        q: 'Which of these correctly uses "mewing" in a sentence?',
        options: ['I mewed the exam', 'He stays quiet because he\'s mewing', 'She mewed to the party', 'They mewed all the fries'],
        correct: 1,
        explanation: 'Mewing requires silence — pressing the tongue to the roof of the mouth. "He stays quiet because he\'s mewing" is the correct usage.',
    },
    {
        q: '"The delulu is the solulu" means...',
        options: ['Being realistic always wins', 'Delusional positivity is somehow the answer', 'You should face the truth', 'Delulu people never succeed'],
        correct: 1,
        explanation: 'This ironic phrase means sometimes delusional confidence is what gets you through — it\'s used humorously in Gen Z culture.',
    },
    {
        q: 'A true Sigma would most likely...',
        options: ['Lead a group project loudly', 'Follow the most popular person', 'Work alone without seeking approval', 'Post on social media every day'],
        correct: 2,
        explanation: 'A Sigma is a lone wolf who operates outside social hierarchies — self-sufficient, silent, and independent.',
    },
];

export const LESSONS: Lesson[] = [
    { id: '1', title: 'Rizz Basics', locked: false, completed: false, x: 0 },
    { id: '2', title: 'Fanum Tax', locked: true, completed: false, x: 40 },
    { id: '3', title: 'Ohio Lore', locked: true, completed: false, x: -40 },
    { id: '4', title: 'Skibidi 101', locked: true, completed: false, x: 0 },
    { id: '5', title: 'Mewing Pro', locked: true, completed: false, x: 40 },
    { id: '6', title: 'Sigma Mindset', locked: true, completed: false, x: -40 },
    { id: '7', title: 'Delulu Land', locked: true, completed: false, x: 0 },
];

export const ONBOARDING_QUESTIONS = [
    { q: "What is 'Fanum Tax'?", options: ['A government fee', 'Stealing food', 'Paying for fans', 'A dance move'], correct: 1 },
    { q: "What is 'Rizz' short for?", options: ['Risk', 'Charisma', 'Rhythm', 'Real'], correct: 1 },
    { q: "What does 'Skibidi' usually precede?", options: ['Toilet', 'Bop', 'Dop', 'Yes'], correct: 0 },
    { q: 'Mewing is done to improve...', options: ['Jawline', 'Abs', 'Hair', 'Eyesight'], correct: 0 },
    { q: "What is a 'Sigma'?", options: ['A follower', 'A lone wolf', 'A loud person', 'A lazy person'], correct: 1 },
];

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

