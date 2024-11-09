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

// const { palette } = createTheme();
// const { augmentColor } = palette;
// const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
// const theme = createTheme({
//   palette: {
//     anger: createColor('#F40B27'),
//     apple: createColor('#5DBA40'),
//     steelBlue: createColor('#5C76B7'),
//     violet: createColor('#BC00A3'),
//   },
// });


export const textFieldTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#70AF85', // Outline color when focused
          },
        },
        notchedOutline: {
          borderColor: '#70AF85', // Default outline color
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
          color: '#331E14', // Input text color
        },
      },
    },
  },
});
