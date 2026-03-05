import React from 'react';
import { Button as ShadButton } from '@/components/ui/button';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant = 'contained', size = 'medium', fullWidth, className, ...props }) => {
  const shadVariant = variant === 'outlined' ? 'outline' : variant === 'text' ? 'ghost' : 'default';
  const shadSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'default';

  return <ShadButton {...props} variant={shadVariant} size={shadSize} className={`${fullWidth ? 'w-full' : ''} ${className ?? ''}`.trim()} />;
};

export default Button;
