import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1 shadow-sm">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-colors ${
          theme === 'light' 
            ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
        }`}
        aria-label="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-full transition-colors ${
          theme === 'system' 
            ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
        }`}
        aria-label="System theme"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-colors ${
          theme === 'dark' 
            ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
        }`}
        aria-label="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
