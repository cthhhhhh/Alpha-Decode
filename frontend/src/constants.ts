import { SlangTerm, QuizQuestion, LessonContent } from './types';

export const SLANG_DATA: SlangTerm[] = [
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
    definition: 'Stealing a portion of someone else\'s food, popularized by streamer Fanum.',
    example: 'You gotta pay the Fanum Tax on those fries.',
    difficulty: 'medium',
    category: 'noun'
  },
  {
    id: '5',
    term: 'Sigma',
    definition: 'A "lone wolf" or someone who is successful and independent. Often used ironically.',
    example: 'He\'s such a sigma male.',
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
    example: 'I can\'t talk right now, I\'m mewing.',
    difficulty: 'hard',
    category: 'verb'
  },
  {
    id: '8',
    term: 'Delulu',
    definition: 'Short for delusional. Often used in the context of fan culture or relationships.',
    example: 'She\'s so delulu if she thinks they\'re dating.',
    difficulty: 'easy',
    category: 'adjective'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What does "Rizz" stand for?',
    options: ['Rise', 'Charisma', 'Riddle', 'Risk'],
    correctAnswer: 1,
    explanation: 'It is a shortened version of the middle syllable of "charisma" (cha-rizz-ma). It refers to your ability to attract others through charm.'
  },
  {
    id: 'q2',
    question: 'If someone takes your fries, they are collecting the...',
    options: ['Kai Cenat Fee', 'Ohio Toll', 'Fanum Tax', 'Sigma Surcharge'],
    correctAnswer: 2,
    explanation: 'The term was popularized by streamer Fanum, who frequently "taxed" food from fellow streamer Kai Cenat during their broadcasts.'
  },
  {
    id: 'q3',
    question: 'Which term describes a "lone wolf" who is successful?',
    options: ['Alpha', 'Beta', 'Sigma', 'Omega'],
    correctAnswer: 2,
    explanation: 'A Sigma is often seen as a successful, independent person who doesn\'t need to follow the traditional social hierarchy of "alphas" or "betas".'
  }
];

export const LESSON_CONTENT: LessonContent[] = [
  {
    id: '1',
    name: 'Rizz Basics',
    steps: [
      {
        type: 'intro',
        title: 'New Word: Rizz',
        content: 'Rizz is short for charisma. It is your ability to attract a partner through your personality and charm.',
        explanation: 'Example: "He has unspoken rizz."'
      },
      {
        type: 'select',
        title: 'What does "Rizz" mean?',
        options: ['Being rich', 'Charisma', 'Running fast', 'Sleeping'],
        correctAnswer: 1,
        explanation: 'Rizz is short for cha-rizz-ma!'
      },
      {
        type: 'translate',
        title: 'Translate this sentence',
        content: 'He has charisma',
        wordBank: ['He', 'has', 'rizz', 'Ohio', 'skibidi'],
        targetSentence: 'He has rizz',
        explanation: 'In Gen Alpha slang, charisma is replaced with rizz.'
      },
      {
        type: 'select',
        title: 'Complete the sentence',
        content: 'She has so much ____, she can talk to anyone.',
        options: ['Ohio', 'Sigma', 'Rizz', 'Fanum'],
        correctAnswer: 2,
        explanation: 'Rizz is the social charm needed to talk to people smoothly.'
      }
    ]
  },
  {
    id: '2',
    name: 'Fanum Tax',
    steps: [
      {
        type: 'intro',
        title: 'New Word: Fanum Tax',
        content: 'Popularized by streamer Fanum, this refers to the "tax" you take from a friend\'s food.',
        explanation: 'Example: "I\'m taking my Fanum Tax from that pizza."'
      },
      {
        type: 'select',
        title: 'When do you pay the Fanum Tax?',
        options: ['When you buy a car', 'When you eat with friends', 'When you go to Ohio', 'When you sleep'],
        correctAnswer: 1,
        explanation: 'It refers to stealing a bite of food!'
      }
    ]
  },
  {
    id: '3',
    name: 'Ohio Lore',
    steps: [
      {
        type: 'intro',
        title: 'New Word: Ohio',
        content: 'Ohio is used to describe anything weird or abnormal. It comes from memes suggesting that strange things only happen in Ohio.',
        explanation: 'Example: "That dog looks like it\'s from Ohio."'
      }
    ]
  },
  {
    id: '4',
    name: 'Skibidi 101',
    steps: [
      {
        type: 'intro',
        title: 'New Word: Skibidi',
        content: 'Originating from a viral YouTube series about toilets with heads, "Skibidi" is often used as a general term for something bad or chaotic.',
        explanation: 'Example: "That\'s so skibidi."'
      }
    ]
  },
  {
    id: '5',
    name: 'Mewing Pro',
    steps: [
      {
        type: 'intro',
        title: 'New Word: Mewing',
        content: 'Mewing is a tongue posture exercise meant to improve jawline definition. If someone is "mewing", they can\'t talk because their tongue is pressed to the roof of their mouth.',
        explanation: 'Example: "I\'m can\'t answer, I\'m mewing."'
      }
    ]
  },
  {
    id: '6',
    name: 'Sigma Mindset',
    steps: [
      {
        type: 'intro',
        title: 'New Word: Sigma',
        content: 'A "Sigma" is a lone wolf who is successful and independent. While sometimes used seriously, it\'s often used ironically to describe someone acting cool.',
        explanation: 'Example: "He\'s a true sigma."'
      }
    ]
  },
  {
    id: '7',
    name: 'Delulu Land',
    steps: [
      {
        type: 'intro',
        title: 'New Word: Delulu',
        content: 'Short for delusional. Being "delulu" means having unrealistic expectations or beliefs, especially about celebrities or crushes.',
        explanation: 'Example: "Stay delulu, it\'s the only way."'
      }
    ]
  }
];
