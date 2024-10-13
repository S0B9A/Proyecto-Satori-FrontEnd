import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#C72A2A', // Rojo suave
    },
    secondary: {
      main: '#000000', // Color negro
    },
    background: {
      default: '#FFFFFF', // Color de fondo blanco
      paper: '#FFFFFF', // Color de fondo de papel blanco
    },
    error: {
      main: '#C72A2A', // Color rojo para errores
    },
    warning: {
      main: '#FFA500', // Color de advertencia (amarillo)
    },
    info: {
      main: '#1D5B79', // Color azul como ejemplo
    },
    success: {
      main: '#4CAF50', // Color verde como ejemplo
    },
  },
});
