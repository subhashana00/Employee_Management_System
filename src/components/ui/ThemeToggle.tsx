
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-accent hover:bg-accent/80 transition-colors duration-200"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-accent-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-accent-foreground" />
      )}
    </button>
  );
}
