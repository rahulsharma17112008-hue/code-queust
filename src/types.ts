export type Topic = 'C++' | 'Python' | 'JavaScript' | 'DSA';

export interface Question {
  id: string;
  topic: Topic;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  id?: string;
  user_id?: string;
  category: Topic;
  score: number;
  total_questions: number;
  accuracy: number;
  completed_at: string;
}

export type Theme = 'light' | 'dark' | 'system';
