import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ScrollToTopProps {
  threshold?: number;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ threshold = 100 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > threshold);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="scroll-top">
      <Button
        type="button"
        size="icon"
        aria-label="voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ScrollToTop;
