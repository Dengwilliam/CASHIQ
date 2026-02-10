export type Answer = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: number;
  text: string;
  answers: Answer[];
  difficulty: 'easy' | 'medium' | 'hard';
};

export const questions: Question[] = [
  // Easy
  {
    id: 1,
    text: "What is a budget?",
    difficulty: 'easy',
    answers: [
      { text: "A type of loan", isCorrect: false },
      { text: "A plan for spending and saving money", isCorrect: true },
      { text: "A government tax", isCorrect: false },
      { text: "A risky investment", isCorrect: false },
    ],
  },
  {
    id: 2,
    text: "Why is it important to save money?",
    difficulty: 'easy',
    answers: [
      { text: "To spend more on wants", isCorrect: false },
      { text: "To prepare for emergencies and future goals", isCorrect: true },
      { text: "To avoid paying taxes", isCorrect: false },
      { text: "Because banks require it", isCorrect: false },
    ],
  },
   {
    id: 3,
    text: "What does 'income' mean?",
    difficulty: 'easy',
    answers: [
      { text: "Money you owe", isCorrect: false },
      { text: "Money you earn", isCorrect: true },
      { text: "Money you spend", isCorrect: false },
      { text: "Money in your savings account", isCorrect: false },
    ],
  },
  {
    id: 4,
    text: "What is an 'expense'?",
    difficulty: 'easy',
    answers: [
      { text: "A gift you receive", isCorrect: false },
      { text: "Money you pay for goods and services", isCorrect: true },
      { text: "Your salary", isCorrect: false },
      { text: "Interest earned on savings", isCorrect: false },
    ],
  },
  // Medium
  {
    id: 5,
    text: "What is interest?",
    difficulty: 'medium',
    answers: [
      { text: "A fee charged by the government", isCorrect: false },
      { text: "The cost of borrowing money or the return on savings", isCorrect: true },
      { text: "Your total monthly salary", isCorrect: false },
      { text: "A penalty for late payments", isCorrect: false },
    ],
  },
  {
    id: 6,
    text: "Which of these is a liability?",
    difficulty: 'medium',
    answers: [
      { text: "A savings account", isCorrect: false },
      { text: "Credit card debt", isCorrect: true },
      { text: "A house you own", isCorrect: false },
      { text: "Stocks in a company", isCorrect: false },
    ],
  },
  {
    id: 7,
    text: "What is inflation?",
    difficulty: 'medium',
    answers: [
      { text: "The rate at which prices fall over time", isCorrect: false },
      { text: "The rate at which the value of money increases", isCorrect: false },
      { text: "The rate at which the general level of prices for goods and services is rising", isCorrect: true },
      { text: "A decline in economic growth", isCorrect: false },
    ],
  },
   {
    id: 8,
    text: "What is an emergency fund for?",
    difficulty: 'medium',
    answers: [
      { text: "A vacation", isCorrect: false },
      { text: "A down payment on a house", isCorrect: false },
      { text: "Unexpected expenses like job loss or medical bills", isCorrect: true },
      { text: "Investing in the stock market", isCorrect: false },
    ],
  },
  // Hard
  {
    id: 9,
    text: "What is 'compound interest'?",
    difficulty: 'hard',
    answers: [
      { text: "A flat fee charged on a loan", isCorrect: false },
      { text: "Interest calculated only on the principal amount", isCorrect: false },
      { text: "Interest earned on both the principal and the accumulated interest", isCorrect: true },
      { text: "A type of tax on investments", isCorrect: false },
    ],
  },
  {
    id: 10,
    text: "What is 'diversification' in investing?",
    difficulty: 'hard',
    answers: [
      { text: "Putting all your money into a single stock", isCorrect: false },
      { text: "Investing only in savings accounts", isCorrect: false },
      { text: "Spreading your investments across various assets to reduce risk", isCorrect: true },
      { text: "Selling all your investments at once", isCorrect: false },
    ],
  },
  {
    id: 11,
    text: "What does a 'credit score' represent?",
    difficulty: 'hard',
    answers: [
      { text: "Your total net worth", isCorrect: false },
      { text: "How much money you have in the bank", isCorrect: false },
      { text: "A number that represents your creditworthiness to lenders", isCorrect: true },
      { text: "Your annual income", isCorrect: false },
    ],
  },
  {
    id: 12,
    text: "What is a '401(k)'?",
    difficulty: 'hard',
    answers: [
      { text: "A type of savings account with high liquidity", isCorrect: false },
      { text: "A government health insurance program", isCorrect: false },
      { text: "An employer-sponsored retirement savings plan in the United States", isCorrect: true },
      { text: "A short-term, high-interest loan", isCorrect: false },
    ],
  },
];
