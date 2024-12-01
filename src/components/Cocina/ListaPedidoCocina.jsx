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
  typography: {
    fontFamily: "Noto Sans JP, sans-serif",
    h4: {
      color: "#B22222",
      fontSize: "2rem",
      fontWeight: "bold",
    },
    body2: {
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

  // Obtener fecha actual en formato "DD/MM/YYYY"
  const today = new Date();
  const todayFormatted = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  // Función para convertir la fecha del pedido a formato "DD/MM/YYYY"
  const formatDate = (dateString) => {
    const date = new Date(dateString.replace(" ", "T")); // Convertir la fecha del formato "YYYY-MM-DD HH:MM:SS"
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Retornar la fecha en formato "DD/MM/YYYY"
  };

  // Filtrar los pedidos para solo mostrar los que coinciden con la fecha de hoy y que no estén "Entregados"
  const filteredData = data.filter(
    (pedido) => 
      formatDate(pedido.fecha) === todayFormatted && pedido.estado !== "Entregada"
  );

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mt: 4, mb: 2 }}>
        {/* Mostrar la cantidad de pedidos de hoy */}
        <Typography variant="h6" align="center" sx={{ mb: 3 }}>
          Total de pedidos de hoy: {filteredData.length}
        </Typography>

        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6 }}>
          Pedidos de Hoy
        </Typography>

        <Grid container spacing={4}>
          {filteredData.length === 0 ? (
            <Typography variant="body2" align="center" sx={{ width: '100%' }}>
              No hay pedidos disponibles para hoy.
            </Typography>
          ) : (
            filteredData.map((pedido) => (
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
                    <Typography variant="body2" gutterBottom>
                      Método de entrega: {pedido.metodo_entrega}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Fecha del pedido: {formatDate(pedido.fecha)} {/* Mostrar la fecha formateada */}
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{
                        color:
                          pedido.estado === "Pendiente"
                            ? "orange"
                            : "red", // Excluir "Entregado"
                      }}
                    >
                      Estado: {pedido.estado}
                    </Typography>
                  </CardContent>
                  <Button
                    component={Link}
                    to={`/cocina/${pedido.id}`}
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
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
