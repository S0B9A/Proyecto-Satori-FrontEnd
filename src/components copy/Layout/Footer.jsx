import React from 'react';
import { Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar'; 

export function Footer() {
  return (
    <Toolbar
      sx={{
        px: 2,
        position: 'fixed',
        bottom: 0,
        width: '100%',
        height: '5.5rem',
        backgroundColor: '#C72A2A', // Rojo suave
        paddingTop: '1rem',
        paddingBottom: '1rem',
        borderTop: '4px solid black', // Un borde superior azul
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#FFFFFF', 
                textAlign: 'center', 
                fontSize: '0.8rem' // Tamaño de fuente ajustado
              }} 
            >
              Sabor Asiático
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#FFFFFF', 
                textAlign: 'center', 
                fontStyle: 'italic', 
                fontSize: '0.6rem' // Tamaño de fuente ajustado
              }} 
            >
              ISW-613
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography 
              color="#F3AA60" // Color amarillo suave
              variant="body1" 
              sx={{ 
                textAlign: 'center',
                fontSize: '0.845rem' // Tamaño de fuente ajustado
              }}
            >
              {`${new Date().getFullYear()} © Todos los derechos reservados`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Toolbar>
  );
}
