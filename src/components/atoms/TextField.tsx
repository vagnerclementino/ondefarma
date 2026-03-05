import React from 'react';
import { Input } from '@/components/ui/input';

export type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

const TextField: React.FC<TextFieldProps> = ({ className, ...props }) => {
  return <Input {...props} className={className} />;
};

export default TextField;
