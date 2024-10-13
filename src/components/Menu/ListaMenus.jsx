import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuServices from "../../Services/MenuServices";

const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans JP, sans-serif",
    h4: {
      color: "#B22222",
      fontSize: "1.5rem",
    },
    h6: {
      fontSize: "1rem",
    },
  },
});

export function ListaMenus() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Llamar al API y obtener la lista de productos y combos
  useEffect(() => {
    MenuServices.getMenus()
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

  if (!loaded) return <p>Cargando..</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mt: 4, mb: 2 }}>
        {/* Mensaje informativo con ícono */}
        <Typography
          variant="body1"
          align="center"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
                        component={Link}
                        to={`/menu`}
                        aria-label="ver detalles"
                        sx={{
                          color: "#f44336",
                          fontSize: "1.2rem", // Hacer el icono más pequeño
                          alignSelf: "flex-end", // Mover el icono al final de la tarjeta
                          marginTop: "auto", // Asegura que esté alineado al fondo
                        }}
                      >
                        <InfoIcon sx={{ fontSize: "1.5rem" }} />{" "}
                        {/* Ajuste del tamaño del ícono */}
                      </IconButton>
          ¡Revisa nuestro menú actual!
        </Typography>

        <Typography
          component="h1"
          variant="h4"
          align="center"
          gutterBottom
          sx={{ mb: 3 }}
        >
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
          Nuestros Menús
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

        {/* Sección de Menús */}
        <Grid container spacing={3}>
          {data.map((menu) => (
            <Grid item key={menu.id} xs={12} sm={6} md={6}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  height: "150px",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                  borderRadius: "15px",
                  backgroundColor: "#f9f9f9",
                  marginBottom: "15px",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flexGrow: 1,
                  }}
                >
                  <div>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {menu.nombre}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {`Disponible desde ${menu.fecha_inicio} hasta ${menu.fecha_fin}`}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {`Horario: ${menu.hora_inicio} - ${menu.hora_fin}`}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
