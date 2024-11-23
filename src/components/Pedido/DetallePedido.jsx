import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import PedidoServices from "../../Services/PedidoServices";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D32F2F", // Color rojo para el botón
    },
  },
});

export function DetallePedido() {
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    PedidoServices.getPedidoById(id)
      .then((response) => {
        const data = response.data;

        // Mapea productos y combos solo si existen
        data.productos = Array.isArray(data.productos)
          ? data.productos.map((item) => ({
              ...item,
              id: item.id, // Preserva propiedades necesarias
            }))
          : [];

        data.combos = Array.isArray(data.combos)
          ? data.combos.map((item) => ({
              ...item,
              id: item.id,
            }))
          : [];

        setPedido(data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, [id]);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!pedido) return <p>No se encontró información del pedido.</p>;

  const { cliente, productos = [], combos = [] } = pedido;

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
          Detalle del Pedido
        </Typography>

        <Grid container spacing={4}>
          {/* Información del pedido */}
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h6">Estado: {pedido.estado}</Typography>
              <Typography variant="body1">
                Método de Entrega: {pedido.metodo_entrega}
              </Typography>
              <Typography variant="body1">Observación Combo: {pedido.Observacion_combo}</Typography>
              <Typography variant="body1">Observación Producto: {pedido.Observacion_pedido}</Typography>
              <Typography variant="body1">Dirección: {pedido.direccion}</Typography>
              <Typography variant="body1">Método de Pago: {pedido.metodo_pago}</Typography>
              <Typography variant="body1">Subtotal: ${pedido.Subtotal}</Typography>
              <Typography variant="body1">Impuesto: ${pedido.Impuesto}</Typography>
              <Typography variant="body1">Costo Total: ${pedido.costo}</Typography>
            </CardContent>
          </Grid>

          {/* Información del cliente */}
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h6">Cliente</Typography>
              <Typography variant="body1">Nombre: {cliente?.nombre || "N/A"}</Typography>
              <Typography variant="body1">Email: {cliente?.email || "N/A"}</Typography>
              <Typography variant="body1">Rol: {cliente?.rol?.name || "N/A"}</Typography>
            </CardContent>
          </Grid>

          {/* Productos */}
          <Grid item xs={12}>
            <Typography variant="h6">Productos</Typography>
            {productos.length > 0 ? (
              productos.map((producto, index) => (
                <CardContent
                  key={index}
                  sx={{
                    marginBottom: "1rem",
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <CardMedia
                        component="img"
                        image={`${BASE_URL}/${producto.imagen}`}
                        alt={producto.nombre || "Producto"}
                        sx={{
                          borderRadius: "8px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        {producto.nombre} - Cantidad: {producto.cantidad}
                      </Typography>
                      <Typography variant="body2">
                        Precio Unitario: ${producto.precio}
                      </Typography>
                      <Typography variant="body2">
                        Subtotal: ${producto.subtotal}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              ))
            ) : (
              <Typography variant="body2">No hay productos disponibles</Typography>
            )}
          </Grid>

          {/* Combos */}
          <Grid item xs={12}>
            <Typography variant="h6">Combos</Typography>
            {combos.length > 0 ? (
              combos.map((combo, index) => (
                <CardContent
                  key={index}
                  sx={{
                    marginBottom: "1rem",
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <CardMedia
                        component="img"
                        image={`${BASE_URL}/${combo.imagen}`}
                        alt={combo.nombre || "Combo"}
                        sx={{
                          borderRadius: "8px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        {combo.nombre} - Cantidad: {combo.cantidad}
                      </Typography>
                      <Typography variant="body2">
                        Precio Unitario: ${combo.precio}
                      </Typography>
                      <Typography variant="body2">
                        Subtotal: ${combo.subtotal}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              ))
            ) : (
              <Typography variant="body2">No hay combos disponibles</Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default DetallePedido;
