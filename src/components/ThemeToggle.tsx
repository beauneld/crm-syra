import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  isCollapsed?: boolean;
}

export default function ThemeToggle({ isCollapsed = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${isCollapsed ? 'w-full' : 'flex-1'} flex items-center gap-2 px-4 py-3 text-sm rounded-2xl transition-all text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100 font-light ${
        isCollapsed ? 'justify-center' : ''
      }`}
      title={isCollapsed ? (theme === 'light' ? 'Mode sombre' : 'Mode clair') : undefined}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
      {!isCollapsed && <span>{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>}
    </button>
  );
}
