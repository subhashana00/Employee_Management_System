
import { useEffect, useRef, useState } from "react";

export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Hook to detect element in viewport for scroll animations
export function useInView(options = {}, once = true) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (once && currentRef) {
          observer.unobserve(currentRef);
        }
      } else if (!once) {
        setIsInView(false);
      }
    }, options);

    observer.observe(currentRef);
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, once]);

  return { ref, isInView };
}

// Hook for smooth scrolling
export function useSmoothScroll() {
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const linkElement = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (!linkElement) return;
      
      const targetId = linkElement.getAttribute('href')?.substring(1);
      if (!targetId) return;
      
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;
      
      e.preventDefault();
      
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    };
    
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);
}
