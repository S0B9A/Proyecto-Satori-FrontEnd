import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado para los enlaces.
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP, sans-serif',
    h4: {
      color: '#B22222',
      fontSize: '1.5rem',
    },
    h6: {
      fontSize: '1rem',
    },
  },
});

export function Home() {
  const estaciones = [
    {
      id: '6',
      nombre: 'Estación de Preparación de Postres',
      productos: null,
    },
    {
      id: '5',
      nombre: 'Estación de Preparación de Sopas y Caldos',
      productos: [
        {
          id: '3',
          nombre: 'Ramen',
          descripcion: 'Sopa de fideos con caldo y toppings',
          precio: '9.50',
          imagen:
            'https://www.recetas-japonesas.com/base/stock/Recipe/ramen-de-huevo/ramen-de-huevo_web.jpg.webp',
          tipo: 'Japones',
          categoria: 'Sopa',
        },
      ],
    },
    {
      id: '4',
      nombre: 'Estación de Cocción en Wok',
      productos: [
        {
          id: '3',
          nombre: 'Ramen',
          descripcion: 'Sopa de fideos con caldo y toppings',
          precio: '9.50',
          imagen:
            'https://www.recetas-japonesas.com/base/stock/Recipe/ramen-de-huevo/ramen-de-huevo_web.jpg.webp',
          tipo: 'Japones',
          categoria: 'Sopa',
        },
      ],
    },
    {
      id: '3',
      nombre: 'Estación de Montaje y Enrollado',
      productos: [
        {
          id: '1',
          nombre: 'Sushi',
          descripcion: 'Bocados de arroz con pescado crudo o vegetales',
          precio: '12.50',
          imagen:
            'https://www.oliveradatenea.com/wp-content/uploads/2023/06/Sushi-rolls-de-salmon-y-Olivada-Olivera-dAtenea.jpg',
          tipo: 'Japones',
          categoria: 'Principal',
        },
      ],
    },
    {
      id: '2',
      nombre: 'Estación de Preparación y Corte de Ingredientes',
      productos: [
        {
          id: '3',
          nombre: 'Ramen',
          descripcion: 'Sopa de fideos con caldo y toppings',
          precio: '9.50',
          imagen:
            'https://www.recetas-japonesas.com/base/stock/Recipe/ramen-de-huevo/ramen-de-huevo_web.jpg.webp',
          tipo: 'Japones',
          categoria: 'Sopa',
        },
      ],
    },
    {
      id: '1',
      nombre: 'Estación de Preparación de Arroz',
      productos: [
        {
          id: '2',
          nombre: 'Bibimbap',
          descripcion:
            'Arroz mezclado con vegetales, carne y huevo',
          precio: '10.00',
          imagen:
            'https://cdn.stoneline.de/media/3f/12/g0/1727431220/koreanisches-bibimbap.jpeg',
          tipo: 'Coreano',
          categoria: 'Principal',
        },
        {
          id: '1',
          nombre: 'Sushi',
          descripcion: 'Bocados de arroz con pescado crudo o vegetales',
          precio: '12.50',
          imagen:
            'https://www.oliveradatenea.com/wp-content/uploads/2023/06/Sushi-rolls-de-salmon-y-Olivada-Olivera-dAtenea.jpg',
          tipo: 'Japones',
          categoria: 'Principal',
        },
      ],
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mt: 4, mb: 2 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
          Nuestras Estaciones
        </Typography>

        <Grid container spacing={3}>
          {estaciones.map((estacion) => (
            <Grid item key={estacion.id} xs={12} sm={6} md={12}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto',
                  boxShadow: 3,
                  transition: '0.3s',
                  '&:hover': { transform: 'scale(1.02)', boxShadow: 6 },
                  borderRadius: '15px',
                  backgroundColor: '#f9f9f9',
                  marginBottom: '15px',
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {estacion.nombre}
                  </Typography>

                  {estacion.productos ? (
                    estacion.productos.map((producto) => (
                      <div key={producto.id} style={{ display: 'flex', marginBottom: '10px' }}>
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          style={{
                            width: '100px',
                            height: '100px',
                            marginRight: '15px',
                            borderRadius: '8px',
                          }}
                        />
                        <div>
                          <Typography variant="body1" gutterBottom>
                            {producto.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {producto.descripcion}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`Precio: $${producto.precio}`}
                          </Typography>
                          <IconButton
                            component={Link}
                            to={`/producto/${producto.id}`}
                            aria-label="ver detalles"
                            sx={{ color: "#f44336" }}
                          >
                            <InfoIcon sx={{ fontSize: "1.3rem" }} />
                          </IconButton>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay productos disponibles.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
