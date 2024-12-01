import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import CocinaServices from "../../Services/CocinaServices";
import { Link } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D32F2F", // Color rojo para el botón
    },
  },
});

export function DetallePedidoCocina() {
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  const [pedido, setPedido] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    CocinaServices.getListaProductosById(id)
      .then((response) => {
        setPedido(response.data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, [id]);


  const handleModificarPedido = () => {
    console.log("Modificando el pedido...");
    // Aquí podrías agregar la lógica para modificar el pedido
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!pedido || pedido.length === 0)
    return <p>No se encontró información del pedido.</p>;

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
        <Typography
          variant="h4"
          sx={{ marginBottom: "1rem", color: "#B22222" }}
        >
          Productos del Pedido
        </Typography>

        <Grid container spacing={4}>
          {/* Productos */}
          <Grid item xs={12}>
            <Typography variant="h6">Productos</Typography>
            {pedido.length > 0 ? (
              pedido.map((producto, index) => {
                const info = producto.productoInformacion;
                return (
                  <CardContent
                    key={index}
                    sx={{
                      marginBottom: "1rem",
                      padding: "1rem",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      minHeight: "300px", // Altura mínima para la carta
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <CardMedia
                          component="img"
                          image={`${BASE_URL}/${info.imagen}`}
                          alt={info.nombre || "Producto"}
                          sx={{
                            borderRadius: "8px",
                            height: "130px",
                            objectFit: "cover",
                          }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        {/* Mostrar estado del producto */}
                        <Typography
                          variant="body1"
                          sx={{ marginBottom: "1rem", color: "#555" }}
                        >
                          Estado:{" "}
                          {producto.estado !== null
                            ? producto.estado
                            : "Sin definir"}
                        </Typography>

                        {/* Mostrar estado del producto */}
                        <Typography
                          variant="body1"
                          sx={{ marginBottom: "1rem", color: "#555" }}
                        >
                          Estacion:{" "}
                          {producto.id_estacion !== null
                            ? producto.id_estacion
                            : "Sin definir"}
                        </Typography>

                        <Typography variant="body1">{info.nombre}</Typography>
                        <Typography variant="body2">
                          Descripción: {info.descripcion}
                        </Typography>
                        <Typography variant="body2">
                          Precio Unitario: ${info.precio}
                        </Typography>
                        <Typography variant="body2">
                          Categoría: {info.categoria}
                        </Typography>
                        <Typography variant="body2">
                          Estaciones:
                          {info.estaciones.length > 0 ? (
                            <ul>
                              {info.estaciones.map((estacion) => (
                                <li key={estacion.id}>{estacion.nombre}</li>
                              ))}
                            </ul>
                          ) : (
                            " No asignadas"
                          )}
                        </Typography>
                        <Button
                          component={Link}
                          to={`/cocina/producto/${producto.id}`}
                          variant="contained"
                          sx={{
                            backgroundColor: "#B22222",
                            "&:hover": { backgroundColor: "#8B0000" },
                            borderRadius: "10px",
                            padding: "10px 20px",
                            fontSize: "1rem",
                            display: "block",
                            marginLeft: "auto", // Alinea el botón a la derecha
                          }}
                        >
                          Ver productos del pedido
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                );
              })
            ) : (
              <Typography variant="body2">
                No hay productos disponibles
              </Typography>
            )}
          </Grid>

          {/* Botón "Modificar Pedido" al final de la lista de productos */}
          <Grid item xs={12} sx={{ textAlign: "center", marginTop: "2rem" }}>
            <Button
            component={Link}
            to={`/pedido/update/${id}`}
            variant="contained"
              color="secondary"
              sx={{
                fontSize: "14px",
                padding: "0.8rem 2rem",
                fontWeight: "bold",
                width: "500px",
                backgroundColor: "#D32F2F", // Puedes cambiar el color aquí si lo deseas
              }}
            >
              Modificar Pedido
            </Button>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default DetallePedidoCocina;
