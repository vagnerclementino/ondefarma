import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export interface ButtonProps extends MuiButtonProps {
  // Extend with custom props if needed
}

/**
 * Button atom - wrapper do MUI Button
 * Componente básico de botão seguindo Material Design
 * Otimizado para mobile com touch targets adequados
 */
const Button: React.FC<ButtonProps> = (props) => {
  return (
    <MuiButton 
      {...props}
      sx={{
        minHeight: { xs: '40px', sm: '44px' }, // Minimum touch target (WCAG)
        px: { xs: 2, sm: 2.5 }, // Responsive padding
        fontSize: { xs: '0.875rem', sm: '0.9375rem' }, // Responsive font
        '&:active': {
          transform: 'scale(0.98)', // Touch feedback
        },
        transition: 'transform 0.1s ease-in-out, background-color 0.2s',
        ...props.sx,
      }}
    />
  );
};

export default Button;
