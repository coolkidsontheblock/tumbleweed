import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: "'Koulen', sans-serif",
    fontSize: 24,
    body1: {
      letterSpacing: '.1em',
      fontStyle: 'normal',
      fontWeight: 400,
      color: '#331E14',
      '&:hover': { color: '#F58B33' },
    },
  }
})