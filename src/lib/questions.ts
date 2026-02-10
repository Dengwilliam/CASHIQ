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
  {
    id: 13,
    text: "What is a 'need' in financial terms?",
    difficulty: 'easy',
    answers: [
      { text: "Something you desire but can live without", isCorrect: false },
      { text: "An essential item for survival like food or shelter", isCorrect: true },
      { text: "A luxury car", isCorrect: false },
      { text: "A vacation", isCorrect: false },
    ],
  },
  {
    id: 14,
    text: "What is a debit card linked to?",
    difficulty: 'easy',
    answers: [
      { text: "A loan from the bank", isCorrect: false },
      { text: "Your checking or savings account", isCorrect: true },
      { text: "A credit line you can borrow against", isCorrect: false },
      { text: "The stock market", isCorrect: false },
    ],
  },
  {
    id: 15,
    text: "What is a 'want'?",
    difficulty: 'easy',
    answers: [
      { text: "Something essential for living", isCorrect: false },
      { text: "Something you'd like to have but isn't essential", isCorrect: true },
      { text: "A bill you must pay", isCorrect: false },
      { text: "Your monthly rent", isCorrect: false },
    ],
  },
  {
    id: 16,
    text: "Which of these is a way to earn money?",
    difficulty: 'easy',
    answers: [
      { text: "Buying groceries", isCorrect: false },
      { text: "Getting a job", isCorrect: true },
      { text: "Paying rent", isCorrect: false },
      { text: "Watching movies", isCorrect: false },
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
  {
    id: 17,
    text: "What is a 'fixed expense'?",
    difficulty: 'medium',
    answers: [
      { text: "An expense that changes every month", isCorrect: false },
      { text: "A cost that stays the same each month, like rent", isCorrect: true },
      { text: "Money spent on entertainment", isCorrect: false },
      { text: "An unexpected one-time cost", isCorrect: false },
    ],
  },
  {
    id: 18,
    text: "What is the main difference between a stock and a bond?",
    difficulty: 'medium',
    answers: [
      { text: "There is no difference", isCorrect: false },
      { text: "A stock represents ownership in a company, while a bond is a loan to a company or government", isCorrect: true },
      { text: "Stocks are always safer than bonds", isCorrect: false },
      { text: "Bonds always provide higher returns than stocks", isCorrect: false },
    ],
  },
  {
    id: 19,
    text: "What is a 'variable expense'?",
    difficulty: 'medium',
    answers: [
      { text: "A fixed monthly payment", isCorrect: false },
      { text: "An expense that can change from month to month, like groceries or gas", isCorrect: true },
      { text: "A down payment for a car", isCorrect: false },
      { text: "Your annual salary", isCorrect: false },
    ],
  },
  {
    id: 20,
    text: "What is an 'asset'?",
    difficulty: 'medium',
    answers: [
      { text: "A debt you owe", isCorrect: false },
      { text: "Something of value that you own, like cash or property", isCorrect: true },
      { text: "Your monthly electricity bill", isCorrect: false },
      { text: "A loan you have taken from a bank", isCorrect: false },
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
  {
    id: 21,
    text: "What is a 'mutual fund'?",
    difficulty: 'hard',
    answers: [
      { text: "An investment vehicle that holds a single type of stock", isCorrect: false },
      { text: "An investment that pools money from many investors to purchase a diversified portfolio of stocks, bonds, or other assets", isCorrect: true },
      { text: "A government savings bond", isCorrect: false },
      { text: "A personal checking account", isCorrect: false },
    ],
  },
  {
    id: 22,
    text: "What is 'liquidity' in finance?",
    difficulty: 'hard',
    answers: [
      { text: "The total value of an asset", isCorrect: false },
      { text: "How easily an asset can be converted into cash without affecting its market price", isCorrect: true },
      { text: "The amount of debt a company has", isCorrect: false },
      { text: "The potential for an investment to grow", isCorrect: false },
    ],
  },
  {
    id: 23,
    text: "What is a 'fiduciary'?",
    difficulty: 'hard',
    answers: [
      { text: "A type of stock market index", isCorrect: false },
      { text: "A person or organization that is legally and ethically required to act in another person's best financial interest", isCorrect: true },
      { text: "A government regulator for banks", isCorrect: false },
      { text: "An investor who focuses on short-term gains", isCorrect: false },
    ],
  },
  {
    id: 24,
    text: "What is the 'time value of money' concept?",
    difficulty: 'hard',
    answers: [
      { text: "The idea that money available now is worth less than the same amount in the future", isCorrect: false },
      { text: "The idea that money available at the present time is worth more than the same amount in the future due to its potential earning capacity", isCorrect: true },
      { text: "The concept that time is more valuable than money", isCorrect: false },
      { text: "A theory that money loses value over time due to taxes", isCorrect: false },
    ],
  },
];
