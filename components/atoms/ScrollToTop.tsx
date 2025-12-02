import React, { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from '@mui/material/Zoom';
import useScrollTrigger from '@mui/material/useScrollTrigger';

export interface ScrollToTopProps {
  /**
   * Distância em pixels para mostrar o botão
   * @default 100
   */
  threshold?: number;
}

/**
 * ScrollToTop atom - Botão flutuante para voltar ao topo da página
 * Aparece quando o usuário rola a página para baixo
 */
const ScrollToTop: React.FC<ScrollToTopProps> = ({ threshold = 100 }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Detecta quando o usuário rola a página
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: threshold,
  });

  useEffect(() => {
    setIsVisible(trigger);
  }, [trigger]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={isVisible}>
      <Fab
        onClick={handleClick}
        color="primary"
        size="medium"
        aria-label="voltar ao topo"
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1000,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTop;
