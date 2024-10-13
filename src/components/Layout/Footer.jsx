import React from 'react';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Logo from '../Image/logo2.png'; // Asegúrate de que la ruta sea correcta
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Crear un tema personalizado para aplicar la fuente y colores
const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP, sans-serif', // Fuente asiática
    h4: {
      color: '#B22222', // Color rojizo oscuro
      fontSize: '1.5rem', // Tamaño de letra más pequeño
    },
    h6: {
      fontSize: '1rem', // Tamaño de letra más pequeño para títulos de productos y combos
    },
  },
});

export function Footer() {
  return (
    <ThemeProvider theme={theme}>
    <Toolbar
      sx={{
        px: 2,
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: '#C72A2A', // Rojo suave
        paddingTop: '1rem',
        paddingBottom: '1rem',
        borderTop: '4px solid black', // Un borde superior negro
        zIndex: 1, // Asegura que el footer esté por encima de otros elementos
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center">
          {/* Sección izquierda con el logo y texto */}
          <Grid item xs={6} display="flex" alignItems="center">
            <img 
              src={Logo} 
              alt="Logo del Restaurante" 
              style={{ width: '60px', height: 'auto', marginRight: '0.5rem' }} // Ajusta el tamaño del logo
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#FFFFFF', 
                fontSize: '1rem' // Tamaño de fuente ajustado
              }} 
            >
              El mejor sabor Asiático
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#FFFFFF', 
                fontSize: '0.8rem',
                marginLeft: '1rem' // Espacio entre el nombre y el número
              }} 
            >
              Teléfono: +506 8713-3971
            </Typography>
          </Grid>

        </Grid>
      </Container>
    </Toolbar>
    </ThemeProvider>
  );
}
