import React from 'react';
import MuiIconButton, { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';

export interface IconButtonProps extends MuiIconButtonProps {
  // Extend with custom props if needed
}

/**
 * IconButton atom - wrapper do MUI IconButton
 * Componente básico de botão com ícone seguindo Material Design
 */
const IconButton: React.FC<IconButtonProps> = (props) => {
  return <MuiIconButton {...props} />;
};

export default IconButton;
