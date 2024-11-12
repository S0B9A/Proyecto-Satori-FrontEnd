import React from "react";
import { Link } from "react-router-dom"; // Asegúrate de importar Link
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans JP, sans-serif",
    h4: {
        color: "#B22222",
        fontSize: "1.5rem",
    },
    h6: {
      fontSize: "1.25rem",
    },
  },
  palette: {
    primary: {
      main: "#FF0000", // Rojo para los botones
    },
    secondary: {
      main: "#333",
    },
  },
});

export function Mantenimiento() {
  const cards = [
    { id: 1, title: "Mantenimiento de Productos", buttonLabel: "Gestionar Productos", link: `/producto-table` },
    { id: 2, title: "Mantenimiento de Combos", buttonLabel: "Gestionar Combos", link: `/combo-table` },
    { id: 3, title: "Mantenimiento del Menú", buttonLabel: "Gestionar Menú", link: `/menu-table` },
    { id: 4, title: "Mantenimiento de los Pedidos", buttonLabel: "Gestionar Pedido", link: `/pedido-table` },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mt: 4, mb: 4, bgcolor: "#fff" }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom sx={{ mb: 10 }}>
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
          Opciones de Mantenimiento
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
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", // Sombra más moderna
                  minHeight: "280px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.04)",
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)", // Efecto de hover más sutil
                  },
                  borderRadius: "15px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  image="https://www.justspices.es/media/magefan_blog/comida-asiatica.jpg"
                  alt="Fondo de tarjeta"
                  sx={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: 0.3,
                  }}
                />
                <CardContent
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    padding: "30px 20px",
                    textAlign: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.8)", // Fondo blanco semitransparente para texto
                    borderRadius: "10px",
                  }}
                >
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                    {card.title}
                  </Typography>
                  <Button
                    component={Link}
                    to={card.link}
                    aria-label="ver detalles"
                    sx={{
                      mt: 2,
                      color: "#f44336",
                      borderRadius: "20px",
                      padding: "8px 16px",
                      fontWeight: "bold",
                      fontSize: "0.8rem", // Tamaño más pequeño para un aspecto elegante
                      "&:hover": { backgroundColor: "#cc0000", color:"#ffffff" }, // Rojo más oscuro en hover
                    }}
                  >
                    {card.buttonLabel}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Mantenimiento;
