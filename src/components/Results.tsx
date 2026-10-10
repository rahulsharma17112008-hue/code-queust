
import type { Question } from '../types';
import { CheckCircle2, XCircle, RotateCcw, Home } from 'lucide-react';

interface ResultsProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  onRetry: () => void;
  onHome: () => void;
}

export function Results({ questions, userAnswers, onRetry, onHome }: ResultsProps) {
  const score = questions.reduce((acc, q, index) => {
    return acc + (userAnswers[index] === q.correctAnswer ? 1 : 0);
  }, 0);
  
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Quiz Complete!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Here's how you performed</p>
        
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-slate-50 dark:border-slate-800 shadow-inner">
            <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                className="text-slate-100 dark:text-slate-800 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              />
              <circle
                className="text-blue-500 stroke-current transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                strokeDasharray={`${percentage * 2.51} 251`}
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{percentage}%</span>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{score} / {questions.length}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Retry Quiz
          </button>
          <button
            onClick={onHome}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white px-2">Detailed Review</h3>
        {questions.map((q, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === q.correctAnswer;
          
          return (
            <div key={q.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="mt-1">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                    Question {index + 1}
                  </span>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{q.question}</h4>
                </div>
              </div>
              
              <div className="ml-10 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Your Answer:</p>
                    <p className={`font-medium ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                      {userAnswer !== undefined ? q.options[userAnswer] : 'Skipped'}
                    </p>
                  </div>
                  {!isCorrect && (
                    <div className="p-4 rounded-xl border bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30">
                      <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium mb-1">Correct Answer:</p>
                      <p className="font-medium text-emerald-900 dark:text-emerald-300">{q.options[q.correctAnswer]}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-400 mb-1">Explanation:</p>
                  <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
