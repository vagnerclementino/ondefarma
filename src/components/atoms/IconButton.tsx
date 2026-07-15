import React from 'react';
import { Button } from '@/components/ui/button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ className, asChild, ...props }) => {
  return <Button {...props} asChild={asChild} variant="ghost" size="icon" className={className} />;
};

export default IconButton;
