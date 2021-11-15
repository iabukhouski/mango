import { createTheme } from '@mui/material/styles';

export const theme = createTheme(
  {
    typography: {
      h1: {
        fontSize: 20,
        fontWeight: 900,
      },
      h2: {
        fontSize: 14,
        fontWeight: 700,
      },
      body1: {
        fontSize: 12,
      },
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: `white`,
            color: `gray`,
            textTransform: `none`,
            border: `1px solid lightgray`,
            padding: `2px 5px`,
            fontSize: 12,
            fontWeight: 700,
            '&:hover': {
              background: 'lightgray',
            },
          },
        },
      },
    },
  },
);
