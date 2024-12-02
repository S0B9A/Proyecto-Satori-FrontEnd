import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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

export function MenuActual() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

  useEffect(() => {
    MenuServices.getMenuActual()
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

  const groupByCategory = (items) => {
    return items.reduce((grouped, item) => {
      const category = item.categoria || "Sin Categoría";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
      return grouped;
    }, {});
  };

  const productosPorCategoria = groupByCategory(data.productos);
  const combosPorCategoria = groupByCategory(data.combos);

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          backgroundImage: 'url("https://t4.ftcdn.net/jpg/04/89/15/99/360_F_489159925_C7DHc0L0lNaAz7HliGGyNZvz1SptRis6.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          padding: "60px 20px",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
          ¡Bienvenido a nuestro Restaurante Asiático!
        </Typography>
        <Typography variant="h5" sx={{ marginTop: "20px" }}>
          Descubre sabores únicos y auténticos de Asia.
        </Typography>
      </div>

      <Container component="main" sx={{ mt: 4, mb: 2 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          MENÚ DISPONIBLE
        </Typography>
        <Typography align="center" variant="h6" gutterBottom>
          Disponibilidad: {data.fecha_inicio} - {data.fecha_fin} (
          {data.hora_inicio} - {data.hora_fin})
        </Typography>

        {Object.keys(productosPorCategoria).map((categoria) => (
          <div key={categoria}>
            <Typography variant="h6" component="h2" sx={{ mt: 3 }}>
              {categoria}
            </Typography>
            <Grid container spacing={3}>
              {productosPorCategoria[categoria].map((producto) => (
                <Grid item key={producto.id} xs={12} sm={6} md={12}>
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
                    <CardMedia
                      component="img"
                      sx={{ width: 150, borderRadius: "10px", margin: "10px" }}
                      image={`${BASE_URL}/${producto.imagen}`}
                      alt={producto.nombre}
                    />
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        flexGrow: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {producto.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.9rem" }}
                      >
                        {producto.descripcion}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="#f44336"
                        sx={{ fontSize: "1.1rem" }}
                      >
                        {"₡" + producto.precio}
                      </Typography>
                      <IconButton
                        component={Link}
                        to={`/productoMenu/${producto.id}`}
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
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        ))}

        <Typography
          component="h1"
          variant="h4"
          align="center"
          sx={{ mt: 6, mb: 3 }}
        >
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
          Combos Especiales
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

        {Object.keys(combosPorCategoria).map((categoria) => (
          <div key={categoria}>
            <Typography variant="h6" component="h2" sx={{ mt: 3 }}>
              {categoria}
            </Typography>
            <Grid container spacing={3}>
              {combosPorCategoria[categoria].map((combo) => (
                <Grid item key={combo.id} xs={12} sm={6} md={6}>
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
                    <CardMedia
                      component="img"
                      sx={{ width: 150, borderRadius: "10px", margin: "10px" }}
                      image={`${BASE_URL}/${combo.imagen}`}
                      alt={combo.nombre}
                    />
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        flexGrow: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {combo.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.9rem" }}
                      >
                        {combo.descripcion}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="#f44336"
                        sx={{ fontSize: "1.1rem" }}
                      >
                        {"₡" + combo.precio}
                      </Typography>
                      <IconButton
                        component={Link}
                        to={`/comboMenu/${combo.id}`}
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
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        ))}
      </Container>
    </ThemeProvider>
  );
}
