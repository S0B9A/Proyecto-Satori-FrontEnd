import React, { useState, useEffect } from "react"; 
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
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
              fontSize: "1.2rem",
              alignSelf: "flex-end",
              marginTop: "auto",
            }}
          >
            <InfoIcon sx={{ fontSize: "1.5rem" }} />
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
            src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png"
            alt="Flor de Cerezo"
            style={{ width: "20px", height: "auto", display: "inline-block", marginRight: "10px", marginLeft: "10px" }}
          />
          Nuestros Menús
          <img
            src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png"
            alt="Flor de Cerezo"
            style={{ width: "20px", height: "auto", display: "inline-block", marginRight: "10px", marginLeft: "10px" }}
          />
        </Typography>

        <Grid container spacing={3}>
          {data.map((menu) => (
            <Grid item key={menu.id} xs={12} sm={6} md={6}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                  borderRadius: "15px",
                  marginBottom: "15px",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image="https://productosgourmet.online/blog/wp-content/uploads/2017/09/comida-japonesa.jpg" // Imagen de fondo
                  alt="Comida Japonesa"
                  sx={{
                    borderTopLeftRadius: "15px",
                    borderTopRightRadius: "15px",
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5))", // Sombra oscura
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                    {menu.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                    {`Disponible desde ${menu.fecha_inicio} hasta ${menu.fecha_fin}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                    {`Horario: ${menu.hora_inicio} - ${menu.hora_fin}`}
                  </Typography>
                </CardContent>
                <Button
                  component={Link}
                  to={`/menu/${menu.id}`} // Cambiar esta URL a la correspondiente a cada menú
                  variant="contained"
                  color="error" // Cambia a color rojo
                  sx={{ margin: 2 }}
                >
                  Ingresa al menú
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
