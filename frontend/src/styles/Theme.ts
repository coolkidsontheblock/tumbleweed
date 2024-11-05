import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: "'Fredoka', sans-serif",
    fontSize: 20,
    body1: {
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // Example for body1
    },
  }
})