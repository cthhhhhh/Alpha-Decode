import type { Term } from '../types';

export const TERMS: Term[] = [
    { id: '1', term: 'Rizz', definition: 'Short for charisma. Ability to attract a romantic partner.', example: "He has so much rizz, he didn't even have to say anything.", difficulty: 'easy', category: 'noun', lessonId: '1' },
    { id: '2', term: 'Skibidi', definition: 'Often used as a nonsense word or to describe something bad/evil, originating from the Skibidi Toilet series.', example: "That's so skibidi of you.", difficulty: 'medium', category: 'adjective', lessonId: '4' },
    { id: '3', term: 'Gyatt', definition: 'An exclamation used when seeing someone with a large posterior. Derived from "God damn".', example: 'Gyatt! Look at that!', difficulty: 'easy', category: 'reaction' },
    { id: '4', term: 'Fanum Tax', definition: "Stealing a portion of someone else's food, popularized by streamer Fanum.", example: 'You gotta pay the Fanum Tax on those fries.', difficulty: 'medium', category: 'noun', lessonId: '2' },
    { id: '5', term: 'Sigma', definition: 'A "lone wolf" or someone who is successful and independent. Often used ironically.', example: "He's such a sigma male.", difficulty: 'easy', category: 'noun', lessonId: '6' },
    { id: '6', term: 'Ohio', definition: 'Used to describe something weird, cringey, or abnormal. Based on memes about the state.', example: 'Only in Ohio would that happen.', difficulty: 'medium', category: 'adjective', lessonId: '3' },
    { id: '7', term: 'Mewing', definition: 'A tongue exercise meant to define the jawline. Often associated with "looksmaxxing".', example: "I can't talk right now, I'm mewing.", difficulty: 'hard', category: 'verb', lessonId: '5' },
    { id: '8', term: 'Delulu', definition: 'Short for delusional. Often used in the context of fan culture or relationships.', example: "She's so delulu if she thinks they're dating.", difficulty: 'easy', category: 'adjective', lessonId: '7' },
];

export const DAILY_QUIZ_QUESTIONS = [
    { q: 'Which of these correctly uses "mewing" in a sentence?', options: ['I mewed the exam', "He stays quiet because he's mewing", 'She mewed to the party', 'They mewed all the fries'], correct: 1, explanation: "Mewing requires silence — pressing the tongue to the roof of the mouth. \"He stays quiet because he's mewing\" is the correct usage." },
    { q: '"The delulu is the solulu" means...', options: ['Being realistic always wins', 'Delusional positivity is somehow the answer', 'You should face the truth', 'Delulu people never succeed'], correct: 1, explanation: "This ironic phrase means sometimes delusional confidence is what gets you through — it's used humorously in Gen Z culture." },
    { q: 'A true Sigma would most likely...', options: ['Lead a group project loudly', 'Follow the most popular person', 'Work alone without seeking approval', 'Post on social media every day'], correct: 2, explanation: 'A Sigma is a lone wolf who operates outside social hierarchies — self-sufficient, silent, and independent.' },
];

export const ONBOARDING_QUESTIONS = [
    { q: "What is 'Fanum Tax'?", options: ['A government fee', 'Stealing food', 'Paying for fans', 'A dance move'], correct: 1 },
    { q: "What is 'Rizz' short for?", options: ['Risk', 'Charisma', 'Rhythm', 'Real'], correct: 1 },
    { q: "What does 'Skibidi' usually precede?", options: ['Toilet', 'Bop', 'Dop', 'Yes'], correct: 0 },
    { q: 'Mewing is done to improve...', options: ['Jawline', 'Abs', 'Hair', 'Eyesight'], correct: 0 },
    { q: "What is a 'Sigma'?", options: ['A follower', 'A lone wolf', 'A loud person', 'A lazy person'], correct: 1 },
];
