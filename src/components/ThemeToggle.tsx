
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleToggle = () => {
    toggleTheme();
    toast({
      title: `${theme === 'dark' ? 'Light' : 'Dark'} Theme Activated`,
      description: `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`,
      duration: 2000,
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="flex items-center gap-1.5 bg-secondary/40 border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="hidden md:inline">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
    </Button>
  );
};

export default ThemeToggle;
