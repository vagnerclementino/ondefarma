import React from 'react';
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select';

export type SelectProps = MuiSelectProps & {
};

const Select: React.FC<SelectProps> = (props) => {
  return (
    <MuiSelect 
      {...props}
      native={false}
      MenuProps={{
        ...props.MenuProps,
        PaperProps: {
          ...props.MenuProps?.PaperProps,
          sx: {
            maxHeight: { xs: '60vh', sm: '400px' },
            ...props.MenuProps?.PaperProps?.sx,
          },
        },
      }}
      sx={{
        '& .MuiSelect-select': {
          minHeight: { xs: '40px', sm: '44px' },
        },
        ...props.sx,
      }}
    />
  );
};

export default Select;
