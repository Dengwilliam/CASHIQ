export type Answer = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: number;
  text: string;
  answers: Answer[];
};

export const questions: Question[] = [
  // Prev 'Easy'
  {
    id: 1,
    text: "What is a budget?",
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
    answers: [
      { text: "Buying groceries", isCorrect: false },
      { text: "Getting a job", isCorrect: true },
      { text: "Paying rent", isCorrect: false },
      { text: "Watching movies", isCorrect: false },
    ],
  },
  // Prev 'Medium'
  {
    id: 5,
    text: "What is interest?",
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
    answers: [
      { text: "A debt you owe", isCorrect: false },
      { text: "Something of value that you own, like cash or property", isCorrect: true },
      { text: "Your monthly electricity bill", isCorrect: false },
      { text: "A loan you have taken from a bank", isCorrect: false },
    ],
  },
  // Prev 'Hard'
  {
    id: 9,
    text: "What is 'compound interest'?",
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
    answers: [
      { text: "The idea that money available now is worth less than the same amount in the future", isCorrect: false },
      { text: "The idea that money available at the present time is worth more than the same amount in the future due to its potential earning capacity", isCorrect: true },
      { text: "The concept that time is more valuable than money", isCorrect: false },
      { text: "A theory that money loses value over time due to taxes", isCorrect: false },
    ],
  },
  // New questions
  {
    id: 25,
    text: "What is 'APR' (Annual Percentage Rate)?",
    answers: [
      { text: "The yearly interest generated by a sum that's charged to borrowers or paid to investors.", isCorrect: true },
      { text: "A plan for retirement.", isCorrect: false },
      { text: "The total profit of a company in a year.", isCorrect: false },
      { text: "A type of government bond.", isCorrect: false },
    ],
  },
  {
    id: 26,
    text: "What is the purpose of a balance sheet?",
    answers: [
      { text: "To show a company's profitability over a period of time.", isCorrect: false },
      { text: "To provide a snapshot of a company's financial health at a specific point in time.", isCorrect: true },
      { text: "To list an individual's personal expenses.", isCorrect: false },
      { text: "To track daily stock market fluctuations.", isCorrect: false },
    ],
  },
  {
    id: 27,
    text: "What does 'amortization' mean?",
    answers: [
      { text: "The process of spreading out a loan into a series of fixed payments over time.", isCorrect: true },
      { text: "The appreciation of an asset's value.", isCorrect: false },
      { text: "A sudden drop in the stock market.", isCorrect: false },
      { text: "A type of investment strategy.", isCorrect: false },
    ],
  },
  {
    id: 28,
    text: "What is a 'capital gain'?",
    answers: [
      { text: "A loss incurred from selling an asset.", isCorrect: false },
      { text: "The profit from the sale of an asset like stocks or real estate.", isCorrect: true },
      { text: "The interest paid on a loan.", isCorrect: false },
      { text: "The salary earned from a job.", isCorrect: false },
    ],
  },
  {
    id: 29,
    text: "What is the 'Rule of 72'?",
    answers: [
      { text: "A law about retirement savings.", isCorrect: false },
      { text: "A quick way to estimate the number of years required to double your money at a given annual rate of return.", isCorrect: true },
      { text: "A tax regulation.", isCorrect: false },
      { text: "A method for calculating credit scores.", isCorrect: false },
    ],
  },
  {
    id: 30,
    text: "What is 'net worth'?",
    answers: [
      { text: "Your total annual income.", isCorrect: false },
      { text: "The value of your assets minus your liabilities.", isCorrect: true },
      { text: "The amount of money in your savings account.", isCorrect: false },
      { text: "The total amount of your debts.", isCorrect: false },
    ],
  },
  {
    id: 31,
    text: "What's the difference between a Roth IRA and a Traditional IRA?",
    answers: [
      { text: "There is no difference.", isCorrect: false },
      { text: "Roth IRA contributions are pre-tax, while Traditional IRA contributions are post-tax.", isCorrect: false },
      { text: "Roth IRA contributions are made with after-tax money for tax-free withdrawals in retirement; Traditional IRAs use pre-tax money for tax-deferred growth.", isCorrect: true },
      { text: "Roth IRAs are only for government employees.", isCorrect: false },
    ],
  },
  {
    id: 32,
    text: "What is a 'FICO score'?",
    answers: [
      { text: "A score in a video game.", isCorrect: false },
      { text: "A specific type of credit score widely used by lenders.", isCorrect: true },
      { text: "An investment rating.", isCorrect: false },
      { text: "A measure of a country's economic health.", isCorrect: false },
    ],
  },
  {
    id: 33,
    text: "What is a 'bear market'?",
    answers: [
      { text: "A market where stock prices are rising or expected to rise.", isCorrect: false },
      { text: "A market condition in which the prices of securities are falling, and widespread pessimism causes the negative sentiment to be self-sustaining.", isCorrect: true },
      { text: "A market for exotic pets.", isCorrect: false },
      { text: "A market with no volatility.", isCorrect: false },
    ],
  },
  {
    id: 34,
    text: "What is a 'bull market'?",
    answers: [
      { text: "A market where stock prices are falling.", isCorrect: false },
      { text: "The condition of a financial market in which prices are rising or are expected to rise.", isCorrect: true },
      { text: "A market for livestock.", isCorrect: false },
      { text: "A market that is closed for holidays.", isCorrect: false },
    ],
  },
  {
    id: 35,
    text: "What is 'dollar-cost averaging'?",
    answers: [
      { text: "An investment strategy of timing the market.", isCorrect: false },
      { text: "An investment technique of buying a fixed dollar amount of a particular investment on a regular schedule, regardless of the share price.", isCorrect: true },
      { text: "A way to calculate currency exchange rates.", isCorrect: false },
      { text: "A method to avoid all investment risk.", isCorrect: false },
    ],
  },
  {
    id: 36,
    text: "What are 'dividends'?",
    answers: [
      { text: "A tax on investments.", isCorrect: false },
      { text: "A sum of money paid regularly (typically quarterly) by a company to its shareholders out of its profits.", isCorrect: true },
      { text: "The fees you pay to a financial advisor.", isCorrect: false },
      { text: "A type of loan.", isCorrect: false },
    ],
  },
  {
    id: 37,
    text: "What is a 'mortgage'?",
    answers: [
      { text: "A retirement savings account.", isCorrect: false },
      { text: "A loan used to purchase real estate.", isCorrect: true },
      { text: "A type of insurance policy.", isCorrect: false },
      { text: "A government grant for students.", isCorrect: false },
    ],
  },
  {
    id: 38,
    text: "What does it mean to 'default' on a loan?",
    answers: [
      { text: "To pay a loan back early.", isCorrect: false },
      { text: "The failure to repay a debt including interest or principal on a loan.", isCorrect: true },
      { text: "To get a lower interest rate.", isCorrect: false },
      { text: "To consolidate multiple loans into one.", isCorrect: false },
    ],
  },
  {
    id: 39,
    text: "What is an 'index fund'?",
    answers: [
      { text: "A fund that invests in a single, high-performing company.", isCorrect: false },
      { text: "A type of mutual fund with a portfolio constructed to match or track the components of a financial market index, such as the S&P 500.", isCorrect: true },
      { text: "A high-risk, high-reward investment.", isCorrect: false },
      { text: "A government-run savings program.", isCorrect: false },
    ],
  },
  {
    id: 40,
    text: "What is 'equity' in the context of homeownership?",
    answers: [
      { text: "The total mortgage amount.", isCorrect: false },
      { text: "The market value of a homeowner's unencumbered interest in their real property, that is, the difference between the home's fair market value and the outstanding balance of all liens on the property.", isCorrect: true },
      { text: "The monthly mortgage payment.", isCorrect: false },
      { text: "The property tax on a home.", isCorrect: false },
    ],
  },
  {
    id: 41,
    text: "What is 'financial independence'?",
    answers: [
      { text: "Having a high-paying job.", isCorrect: false },
      { text: "Having enough income to pay your living expenses for the rest of your life without having to be employed or dependent on others.", isCorrect: true },
      { text: "Being completely debt-free.", isCorrect: false },
      { text: "Winning the lottery.", isCorrect: false },
    ],
  },
  {
    id: 42,
    text: "What is a 'gig economy'?",
    answers: [
      { text: "A traditional 9-to-5 work environment.", isCorrect: false },
      { text: "A labor market characterized by the prevalence of short-term contracts or freelance work as opposed to permanent jobs.", isCorrect: true },
      { text: "An economy based on agriculture.", isCorrect: false },
      { text: "A government-controlled economy.", isCorrect: false },
    ],
  },
  {
    id: 43,
    text: "What is a 'cryptocurrency'?",
    answers: [
      { text: "Physical coins and banknotes.", isCorrect: false },
      { text: "A digital or virtual currency that uses cryptography for security.", isCorrect: true },
      { text: "A type of stock.", isCorrect: false },
      { text: "A loyalty rewards program.", isCorrect: false },
    ],
  },
  {
    id: 44,
    text: "What is a 'blockchain'?",
    answers: [
      { text: "A type of financial statement.", isCorrect: false },
      { text: "A distributed database that is shared among the nodes of a computer network.", isCorrect: true },
      { text: "A marketing strategy.", isCorrect: false },
      { text: "A government agency.", isCorrect: false },
    ],
  },
];
