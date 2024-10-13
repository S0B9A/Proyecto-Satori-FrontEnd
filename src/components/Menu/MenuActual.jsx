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

  // Llamar al API y obtener la lista de productos y combos
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

  // Función para agrupar elementos por categoría
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
      <Container component="main" sx={{ mt: 4, mb: 2 }}>
        {/* Mostrar la información del menú disponible */}
        <Typography component="h1" variant="h4" align="center" gutterBottom>
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
          MENÚ DISPONIBLE
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
        <Typography align="center" variant="h6" gutterBottom>
          Disponibilidad: {data.fecha_inicio} - {data.fecha_fin} (
          {data.hora_inicio} - {data.hora_fin})
        </Typography>

        {/* Mostrar productos agrupados por categoría */}
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
                      image={producto.imagen}
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
                        {producto.precio}
                      </Typography>
                      <IconButton
                        component={Link}
                        to={`/producto/${producto.id}`}
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
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        ))}

        {/* Mostrar combos agrupados por categoría */}
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
                      image={combo.imagen}
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
                        {combo.precio}
                      </Typography>
                      <IconButton
                        component={Link}
                        to={`/combo/${combo.id}`}
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
