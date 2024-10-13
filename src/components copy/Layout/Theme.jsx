import { createTheme } from '@mui/material/styles';

const demoTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#ff0000', // Rojo para áreas destacadas como botones
    },
    background: {
      default: '#ffffff', // Blanco para los fondos
    },
    text: {
      primary: '#000000', // Negro para la tipografía
    },
  },
  typography: {
    h1: {
      color: '#ff0000', // Rojo para los títulos
    },
    body1: {
      color: '#000000', // Negro para el texto principal
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#ff0000', // Rojo para los botones
          color: '#ffffff', // Blanco para el texto de los botones
          '&:hover': {
            backgroundColor: '#cc0000', // Color rojo más oscuro al hacer hover
          },
        },
      },
    },
  },
});

export default demoTheme;
