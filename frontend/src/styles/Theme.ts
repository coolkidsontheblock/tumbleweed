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
});

export const textFieldTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#70AF85',
          },
        },
        notchedOutline: {
          borderColor: '#70AF85',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Montserrat',
          fontWeight: 400,
          color: '#331E14',
          '&.Mui-focused': {
            color: '#70AF85',
            borderColor: '#70AF85'
          }
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontFamily: 'Montserrat',
          fontWeight: 400,
          color: '#331E14',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: 'Montserrat',
          fontWeight: 400,
          color: '#331E14',
          padding: '16px',
        },
      },
    },
  },
});
