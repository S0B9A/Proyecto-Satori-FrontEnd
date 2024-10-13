import { createTheme } from '@mui/material/styles';

// Combinación de ambos temas
const demoTheme = createTheme({
  // Configuración de breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  
  // Configuración de la paleta de colores
  palette: {
    mode: 'light', // Modo de luz
    primary: {
      main: '#C72A2A', // Rojo suave (modificado)
      contrastText: '#ffffff', // Color del texto en botones o elementos primarios
    },
    secondary: {
      main: '#000000', // Negro
    },
    background: {
      default: '#FFFFFF', // Fondo blanco
      paper: '#FFFFFF', // Fondo de papel blanco
    },
    error: {
      main: '#C72A2A', // Rojo para errores
    },
    warning: {
      main: '#FFA500', // Amarillo para advertencias
    },
    info: {
      main: '#1D5B79', // Azul informativo
    },
    success: {
      main: '#4CAF50', // Verde para éxito
    },
  },

  // Configuración de la tipografía
  typography: {
    h1: {
      color: '#ff0000', // Rojo para títulos
    },
    body1: {
      color: '#000000', // Negro para texto principal
    },
  },

  // Estilos personalizados para componentes
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#ff0000', // Rojo para botones
          color: '#ffffff', // Blanco para texto en botones
          '&:hover': {
            backgroundColor: '#cc0000', // Rojo oscuro al hacer hover
          },
        },
      },
    },
  },
});

export default demoTheme;
