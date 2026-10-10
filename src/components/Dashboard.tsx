
import type { Topic, QuizResult } from '../types';
import { topics } from '../data';
import { BookOpen, Code2, Database, FileJson, Trophy, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface DashboardProps {
  onSelectTopic: (topic: Topic) => void;
  history: QuizResult[];
  onSignOut: () => void;
}

export function Dashboard({ onSelectTopic, history, onSignOut }: DashboardProps) {
  const getIcon = (topic: Topic) => {
    switch (topic) {
      case 'C++': return <Code2 className="w-8 h-8 text-blue-500" />;
      case 'Python': return <Database className="w-8 h-8 text-yellow-500" />;
      case 'JavaScript': return <FileJson className="w-8 h-8 text-yellow-400" />;
      case 'DSA': return <BookOpen className="w-8 h-8 text-emerald-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-8">
        <ThemeToggle />
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Welcome to <span className="text-blue-600 dark:text-blue-400">CodeQuest</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Sharpen your programming skills with interactive quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className="flex items-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 text-left group"
          >
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
              {getIcon(topic)}
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{topic}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practice {topic} concepts</p>
            </div>
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {history.slice().reverse().map((result, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{result.category} Quiz</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(result.completed_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {result.score} / {result.total_questions}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Correct ({result.accuracy}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
