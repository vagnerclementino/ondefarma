import { createTheme } from '@mui/material/styles';

// Tema customizado para Farmácia Popular
// Cores: azul governo (primary) e verde saúde (secondary)
const theme = createTheme({
  palette: {
    primary: {
      main: '#0056B3', // Azul governo brasileiro
      light: '#3380CC',
      dark: '#003D82',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#28A745', // Verde saúde
      light: '#5CB85C',
      dark: '#1E7E34',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.375rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '1.125rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      '@media (max-width:600px)': {
        fontSize: '0.9375rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.9375rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      '@media (max-width:600px)': {
        fontSize: '0.8125rem',
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,      // Extra small: mobile phones
      sm: 600,    // Small: tablets
      md: 960,    // Medium: small laptops
      lg: 1280,   // Large: desktops
      xl: 1920,   // Extra large: large desktops
    },
  },
  spacing: 8, // Base spacing unit (8px)
});

export default theme;
