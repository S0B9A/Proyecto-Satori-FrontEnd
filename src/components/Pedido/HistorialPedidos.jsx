import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link} from "react-router-dom";
import PedidosServices from "../../Services/PedidoServices";

const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans JP, sans-serif",
    h4: {
      color: "#B22222",
      fontSize: "2rem",
      fontWeight: "bold",
    },
    h6: {
      fontSize: "1.2rem",
      color: "#333",
    },
    body2: {
      fontSize: "1rem",
      color: "#555",
    },
  },
});

export function HistorialPedidos() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState(""); // Estado para el filtro seleccionado

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

  // Filtrar los datos según el filtro seleccionado
  const filteredData =
    filter === ""
      ? [...data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha
      : data.filter((pedido) => pedido.estado === filter); // Filtrar por estado

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6 }}>
          <img
            src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png"
            alt="Flor de Cerezo"
            style={{
              width: "20px",
              height: "auto",
              display: "inline-block",
              marginRight: "10px",
              marginLeft: "10px",
            }}
          />
          Historial de pedidos
          <img
            src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png"
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

        {/* Botones de filtro */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 6 }}>
          {[
            "Pendiente de pago",
            "Aceptada",
            "Preparación",
            "Procesando",
            "Entregada",
          ].map((estado) => (
            <Grid item key={estado}>
              <Button
                variant={filter === estado ? "contained" : "outlined"}
                color="error"
                onClick={() => setFilter(filter === estado ? "" : estado)} // Toggle entre el filtro y "sin filtro"
                sx={{
                  borderRadius: "10px",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                {estado}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          {filteredData.map((pedido) => (
            <Grid item key={pedido.id} xs={12} sm={6} md={6}>
              <Card
                sx={{
                  border: "3px solid #B22222",
                  borderRadius: "20px",
                  padding: "20px",
                  transition: "0.3s",
                  background: "linear-gradient(145deg, #fff, #f5f5f5)",
                  boxShadow: "10px 10px 20px #ccc, -10px -10px 20px #fff",
                  "&:hover": {
                    transform: "scale(1.07)",
                    boxShadow: "15px 15px 30px #bbb, -15px -15px 30px #fff",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#B22222" }}
                  >
                    Costo: {pedido.costo}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ fontStyle: "italic" }}
                  >
                    Método de entrega: {pedido.metodo_entrega}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Fecha del pedido: {pedido.fecha}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{
                      color:
                        pedido.estado === "Entregado"
                          ? "green"
                          : pedido.estado === "Pendiente"
                            ? "orange"
                            : "red",
                    }}
                  >
                    Estado: {pedido.estado}
                  </Typography>
                </CardContent>
                <Button
                  component={Link}
                  to={`/pedido/${pedido.id}`}
                  variant="contained"
                  sx={{
                    backgroundColor: "#B22222",
                    "&:hover": { backgroundColor: "#8B0000" },
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                  }}
                >
                  Ver detalle del pedido
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
