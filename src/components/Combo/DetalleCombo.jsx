import React from "react";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CombosServices from "../../Services/CombosServices";

const theme = createTheme({
  palette: {
    primary: {
      main: '#D32F2F', // Color rojo para el botón
    },
  },
});

// Componente de detalle del producto
export function DetalleCombo() {
  const routeParams = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    CombosServices.getComboById(routeParams.id)
      .then((response) => {
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        setLoaded(true);
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ marginTop: '2rem', backgroundColor: '#fff', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={`${BASE_URL}/${data.imagen}`} // Placeholder si no hay imagen
              alt={data.nombre}
              sx={{ borderRadius: '10px', height: '300px', objectFit: 'cover' }}
            />
            <Button sx={{ marginTop: '0.8rem' }} variant="contained" color="primary" fullWidth>
              Agregar a la orden
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom sx={{ color: '#B22222' }}>
                {data.nombre || ''}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
                {data.descripcion || ''}
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: '1rem', fontWeight: 'bold', color: '#FF9800' }}>
                Precio: ${data.precio || 'N/A'}
              </Typography>
              
              <Typography variant="body2" sx={{ marginTop: '1rem' }}>
                Categoría: {data.categoria || 'N/A'}
              </Typography>

              {/* Listado de productos */}
              <Typography variant="body2" sx={{ marginTop: '1rem', fontWeight: 'bold' }}>
                Productos incluidos:
              </Typography>
              <ul>
                {data.productos && data.productos.length > 0 ? (
                  data.productos.map((producto, index) => (
                    <li key={index}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{producto.nombre}</Typography>
                      <Typography variant="body2">{producto.descripcion}</Typography>
                      <Typography variant="body2" sx={{ color: '#FF9800' }}>Precio: ${producto.precio}</Typography>
                      <img
                        src={`${BASE_URL}/${producto.imagen}`}
                        alt={producto.nombre}
                        style={{ width: '100px', height: 'auto', borderRadius: '5px', marginTop: '10px' }}
                      />
                    </li>
                  ))
                ) : (
                  <li>
                    <Typography variant="body2">No hay productos disponibles</Typography>
                  </li>
                )}
              </ul>
            </CardContent>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default DetalleCombo;
