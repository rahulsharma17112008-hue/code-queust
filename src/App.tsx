import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { Login } from './components/Login';
import { questions } from './data';
import type { Topic, QuizResult } from './types';
import { Code2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useTheme } from './hooks/useTheme';

type View = 'dashboard' | 'quiz' | 'results';

function App() {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [view, setView] = useState<View>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [history, setHistory] = useState<QuizResult[]>([]);

  useTheme(); // Initialize theme

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch history when user changes
  useEffect(() => {
    if (session?.user) {
      fetchHistory();
      migrateLocalHistory();
    } else {
      setHistory([]);
    }
  }, [session?.user]);

  const migrateLocalHistory = async () => {
    if (!session?.user) return;
    const local = localStorage.getItem('codequest_history');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Transform to new schema
          const toInsert = parsed.map((p: any) => ({
            user_id: session.user.id,
            category: p.topic || p.category,
            score: p.score,
            total_questions: p.totalQuestions || p.total_questions,
            accuracy: Math.round((p.score / (p.totalQuestions || p.total_questions)) * 100),
            completed_at: p.date || p.completed_at
          }));
          
          await supabase.from('quiz_results').insert(toInsert);
          // Remove from local storage after successful migration to prevent exposing to another user
          localStorage.removeItem('codequest_history');
          fetchHistory();
        }
      } catch (e) {
        console.error('Migration failed', e);
      }
    }
  };

  const fetchHistory = async () => {
    if (!session?.user) return;
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('completed_at', { ascending: true }); // We reverse it in Dashboard

    if (!error && data) {
      setHistory(data as QuizResult[]);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setView('dashboard');
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setView('quiz');
    setUserAnswers({});
  };

  const handleQuizComplete = async (answers: Record<number, number>) => {
    setUserAnswers(answers);
    setView('results');
    
    if (selectedTopic && session?.user) {
      const topicQuestions = questions.filter(q => q.topic === selectedTopic);
      const score = topicQuestions.reduce((acc, q, index) => {
        return acc + (answers[index] === q.correctAnswer ? 1 : 0);
      }, 0);
      const accuracy = Math.round((score / topicQuestions.length) * 100);

      const result = {
        user_id: session.user.id,
        category: selectedTopic,
        score,
        total_questions: topicQuestions.length,
        accuracy,
        completed_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('quiz_results')
        .insert([result])
        .select()
        .single();
        
      if (!error && data) {
        setHistory(prev => [...prev, data as QuizResult]);
      }
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  const currentQuestions = selectedTopic 
    ? questions.filter(q => q.topic === selectedTopic) 
    : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-200">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('dashboard')}
          >
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">CodeQuest</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {view === 'dashboard' && (
          <Dashboard onSelectTopic={handleSelectTopic} history={history} onSignOut={handleSignOut} />
        )}
        
        {view === 'quiz' && currentQuestions.length > 0 && (
          <Quiz 
            questions={currentQuestions} 
            onComplete={handleQuizComplete}
            onCancel={() => setView('dashboard')}
          />
        )}
        
        {view === 'results' && currentQuestions.length > 0 && (
          <Results 
            questions={currentQuestions}
            userAnswers={userAnswers}
            onRetry={() => {
              setUserAnswers({});
              setView('quiz');
            }}
            onHome={() => setView('dashboard')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
