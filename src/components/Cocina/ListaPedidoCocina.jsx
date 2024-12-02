import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import PedidosServices from "../../Services/PedidoServices";

const theme = createTheme({
  palette: {
    primary: {
      main: "#B22222",
    },
    secondary: {
      main: "#FFCDD2",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      color: "#B22222",
      fontSize: "2.2rem",
      fontWeight: 700,
    },
    h6: {
      color: "#B22222",
      fontSize: "1.8rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      color: "#555",
    },
  },
});

export function ListaPedidoCocina() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    PedidosServices.getPedidos()
      .then((response) => {
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        setError(error.message);
        setLoaded(false);
      });
  }, []);

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  const today = new Date();
  const todayFormatted = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString.replace(" ", "T"));
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredData = data.filter(
    (pedido) =>
      formatDate(pedido.fecha) === todayFormatted && pedido.estado !== "Entregada"
  );

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mt: 4, mb: 7 }}>
        <Grid container spacing={3}>
          {/* Columna Izquierda: Lista de Pedidos */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {filteredData.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ width: "100%" }}>
                  No hay pedidos disponibles para hoy.
                </Typography>
              ) : (
                filteredData.map((pedido) => (
                  <Grid item key={pedido.id} xs={12} sm={6} md={6}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 3,
                        backgroundColor: "#FFEBEE",
                        "&:hover": {
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#B22222",
                          }}
                        >
                          Costo: {pedido.costo}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          Método: {pedido.metodo_entrega}
                        </Typography>
                        <Typography variant="body1">
                          Fecha: {formatDate(pedido.fecha)}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            mt: 1,
                            fontWeight: 500,
                            color:
                              pedido.estado === "Pendiente"
                                ? "#F57C00"
                                : pedido.estado === "Preparando"
                                ? "#B22222"
                                : "#D32F2F",
                          }}
                        >
                          Estado: {pedido.estado}
                        </Typography>
                      </CardContent>
                      <Button
                        component={Link}
                        to={`/cocina/${pedido.id}`}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          borderRadius: 0,
                          fontSize: "1rem",
                          py: 1.5,
                        }}
                      >
                        Ver Detalles
                      </Button>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>

          {/* Columna Derecha: Cantidad de Pedidos */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: "#B22222",
                color: "#fff",
                textAlign: "center",
                borderRadius: 3,
                boxShadow: 4,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: "1.5rem", color: "white" }}>
                  Total de Pedidos de Hoy
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontSize: "3rem", fontWeight: 700, color: "white" }}
                >
                  {filteredData.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
