
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full p-0 shadow-lg transition-all duration-300 hover:shadow-xl',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      )}
      size="icon"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
