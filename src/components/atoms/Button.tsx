import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export interface ButtonProps extends MuiButtonProps {
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <MuiButton 
      {...props}
      sx={{
        minHeight: { xs: '40px', sm: '44px' },
        px: { xs: 2, sm: 2.5 },
        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
        '&:active': {
          transform: 'scale(0.98)',
        },
        transition: 'transform 0.1s ease-in-out, background-color 0.2s',
        ...props.sx,
      }}
    />
  );
};

export default Button;
