import React from 'react';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

export type TextFieldProps = MuiTextFieldProps & {
  // Extend with custom props if needed
};

/**
 * TextField atom - wrapper do MUI TextField
 * Componente básico de campo de texto seguindo Material Design
 */
const TextField: React.FC<TextFieldProps> = (props) => {
  return <MuiTextField {...props} />;
};

export default TextField;
