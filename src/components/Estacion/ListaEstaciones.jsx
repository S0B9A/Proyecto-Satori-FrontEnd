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

import { useState } from "react";
import EstacionServices from "../../Services/EstacionServices";
import { useEffect } from "react";

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

export function ListaEstaciones() {
   //Resultado de consumo del API, respuesta
   const [data, setData] = useState(null);
   //Error del API
   const [error, setError] = useState("");
   //Booleano para establecer sí se ha recibido respuesta
   const [loaded, setLoaded] = useState(false);
 
   //Llamar al API y obtener la lista de productos
   useEffect(() => {
     EstacionServices.getEstaciones()
       .then((response) => {
         console.log(response);
         setData(response.data);
         setError(response.error);
         setLoaded(true);
       })
       .catch((error) => {
         console.log(error);
         if (error instanceof SyntaxError) {
           setError(error);
           setLoaded(false);
         }
       });
   }, []);
 
   if (!loaded) return <p>Cargando..</p>;
   if (error) return <p>Error: {error.message}</p>;

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mt: 4, mb: 2 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
        <img
            src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png" // Reemplaza esta URL con la de una flor de cerezo
            alt="Flor de Cerezo"
            style={{
              width: "20px",
              height: "auto",
              display: "inline-block",
              marginRight: "10px",
              marginLeft: "10px",
            }}
          />
          Nuestras Estaciones
          <img
            src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png" // Reemplaza esta URL con la de una flor de cerezo
            alt="Flor de Cerezo"
            style={{
              width: "20px",
              height: "auto",
              display: "inline-block",
              marginRight: "10px",
              marginLeft: "10px",
            }}
          />
        </Typography>

        <Grid container spacing={3}>
          {data.map((estacion) => (
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
                          <Typography variant="body2" color="text.secondary">
                            {`Cantidad de estaciones: ${producto.cantidadEstaciones.total_estaciones}`}
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
