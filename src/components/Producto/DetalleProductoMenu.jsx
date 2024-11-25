import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductoServices from "../../Services/ProductoServices";
import { useCart } from "../../hook/UseCart";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D32F2F", // Color rojo para el botón
    },
  },
});

// Componente de detalle del producto
export function DetalleProductoMenu() {
  //usar CartContext
  const { addItem } = useCart();
  const routeParams = useParams();
  console.log(routeParams);
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ProductoServices.getProductoById(routeParams.id)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        setLoaded(true); // Cambié esto para que se marque como cargado incluso si hay un error
      });
  }, [routeParams.id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          marginTop: "2rem",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={`${BASE_URL}/${data.imagen}`}
              alt={data.nombre}
              sx={{ borderRadius: "10px", height: "300px", objectFit: "cover" }}
            />
            <Button
              sx={{ marginTop: "0.8rem" }}
              variant="contained"
              color="primary"
              fullWidth
              onClick={()=>addItem(data)}
            >
              Agregar a la orden
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography
                variant="h4"
                component="div"
                gutterBottom
                sx={{ color: "#B22222" }}
              >
                {data.nombre || ""}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: "1rem" }}>
                {data.descripcion || ""}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "1rem",
                  fontWeight: "bold",
                  color: "#FF9800",
                }}
              >
                Precio: ${data.precio || "N/A"}
              </Typography>

              <Typography variant="body2" sx={{ marginTop: "1rem" }}>
                Tipo: {data.tipo || "N/A"} | Categoría:{" "}
                {data.categoria || "N/A"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginTop: "1rem", fontWeight: "bold" }}
              >
                Estaciones:
              </Typography>
              <ul>
                {data.estaciones && data.estaciones.length > 0 ? (
                  data.estaciones.map((estacion, index) => (
                    <li key={index}>
                      <Typography variant="body2">
                        {estacion.nombre || "N/A"}
                      </Typography>
                    </li>
                  ))
                ) : (
                  <li>
                    <Typography variant="body2">
                      No hay estaciones disponibles
                    </Typography>
                  </li>
                )}
              </ul>
              <Box
                sx={{
                  marginTop: "1rem",
                  padding: "1rem",
                  border: "1px solid #E0E0E0",
                  borderRadius: "5px",
                  backgroundColor: "#FCE4EC",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#D32F2F" }}
                >
                  Detalles Asiáticos:
                </Typography>
                <Typography variant="body2">
                  - Este plato es un símbolo de la rica tradición culinaria de
                  Asiatico.
                </Typography>
                <Typography variant="body2">
                  - Disfrútalo con palillos para una experiencia auténtica.
                </Typography>
                <Typography variant="body2">
                  - A menudo se sirve en festivales y reuniones familiares.
                </Typography>
                <Box sx={{ marginTop: "1rem" }}>
                  <img
                    src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png"
                    alt="Flor de Cerezo"
                    style={{
                      width: "30px",
                      height: "auto",
                      display: "inline-block",
                      marginRight: "10px",
                    }}
                  />
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/008/513/544/non_2x/chopsticks-illustration-eastern-traditional-cuisine-png.png"
                    alt="Palillos"
                    style={{
                      width: "30px",
                      height: "auto",
                      display: "inline-block",
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default DetalleProductoMenu;
