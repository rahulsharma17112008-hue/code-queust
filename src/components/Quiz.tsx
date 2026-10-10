import { useState, useEffect, useRef } from 'react';
import type { Question } from '../types';
import { Timer, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  onComplete: (answers: Record<number, number>) => void;
  onCancel: () => void;
}

export function Quiz({ questions, onComplete, onCancel }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 60 seconds per question

  const answersRef = useRef(answers);
  
  // Keep ref up to date with the latest answers for the timeout
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(answersRef.current);
    }
  }, [timeLeft, onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors text-sm font-medium">
          Exit Quiz
        </button>
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 font-mono font-medium">
          <Timer className="w-5 h-5 text-blue-500" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="h-2 bg-slate-100 dark:bg-slate-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentIndex] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full p-4 rounded-xl text-left border-2 transition-all duration-200 flex justify-between items-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-medium'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{option}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                currentIndex === 0
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={answers[currentIndex] === undefined}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                answers[currentIndex] === undefined
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
              }`}
            >
              {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
