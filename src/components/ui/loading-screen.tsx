import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  delay?: number;
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  delay = 300,
  message = "Preparing Your Restaurant Management System",
  className,
  fullScreen = false,
}: LoadingScreenProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullScreen && "fixed inset-0 z-50 bg-white dark:bg-neutral-900 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex justify-center items-center space-x-2 mb-2">
        <div className="animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-primary-600 dark:text-primary-400"
          >
            <path d="M8 3L4 7h3v8c0 1.1.9 2 2 2h2v5h2v-5h2c1.1 0 2-.9 2-2V7h3L16 3z"/>
            <path d="M22 16v-3a6.49 6.49 0 0 0-5.2-6.4A6 6 0 0 0 12 2a6 6 0 0 0-4.8 2.6A6.49 6.49 0 0 0 2 11v5"/>
            <path d="M6 17h12"/>
          </svg>
        </div>
        <div className="animate-spin">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-secondary-600 dark:text-secondary-400"
          >
            <path d="M12 2v4"/>
            <path d="m16.2 7.8 2.9-2.9"/>
            <path d="M18 12h4"/>
            <path d="m16.2 16.2 2.9 2.9"/>
            <path d="M12 18v4"/>
            <path d="m4.9 19.1 2.9-2.9"/>
            <path d="M2 12h4"/>
            <path d="m4.9 4.9 2.9 2.9"/>
          </svg>
        </div>
        <div className="animate-pulse">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-green-600 dark:text-green-400"
          >
            <path d="M16 11h2c1.5 0 3-1.5 3-3V5l-3-3-3 3v3c0 1.5 1.5 3 3 3z"/>
            <path d="M18 11v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h5"/>
            <path d="M5 14H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1"/>
            <path d="M5 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1"/>
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Chopping ingredients, setting up tables, and brewing data...
        </p>
      </div>
    </div>
  );
}

export function LoadingOverlay({
  visible,
  message,
  className,
}: {
  visible: boolean;
  message?: string;
  className?: string;
}) {
  if (!visible) return null;
  
  return (
    <div className={cn(
      "absolute inset-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center",
      className
    )}>
      <LoadingScreen message={message} />
    </div>
  );
}