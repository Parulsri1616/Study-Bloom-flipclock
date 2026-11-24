import { Quote } from '../types';

export const MOTIVATIONAL_QUOTES: Quote[] = [
  {
    text: "A little progress every day adds up to big results.",
    author: "Satya Nani",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  {
    text: "Small, daily, seemingly insignificant improvements lead to stunning results over time.",
    author: "Robin Sharma",
  },
  {
    text: "The secret to getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "Focus is a muscle. The more you practice deep study, the stronger it blooms.",
    author: "StudyBloom",
  },
  {
    text: "Consistency is more powerful than intensity.",
    author: "James Clear",
  },
  {
    text: "Difficult concepts yield to persistent, quiet effort.",
    author: "Donald Knuth",
  },
  {
    text: "Every hour you invest today is a cornerstone for your GATE CSE dream rank.",
    author: "StudyBloom",
  },
  {
    text: "Quiet your mind, embrace the problem, and let the logic unfold.",
    author: "Edsger W. Dijkstra",
  },
];

export const getRandomQuote = (): Quote => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = Math.abs(dayOfYear) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
};
