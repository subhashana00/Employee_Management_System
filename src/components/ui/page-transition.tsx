
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LoadingScreen } from "./loading-screen";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const visibleTimer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(visibleTimer);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <LoadingScreen fullScreen />}
      <div
        className={cn(
          "transition-all duration-700 ease-in-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
