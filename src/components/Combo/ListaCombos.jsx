import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CombosServices from "../../Services/CombosServices";

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

export function ListaCombos() {
  //Resultado de consumo del API, respuesta
  const [data, setData] = useState(null);
  //Error del API
  const [error, setError] = useState("");
  //Booleano para establecer sí se ha recibido respuesta
  const [loaded, setLoaded] = useState(false);

  //Llamar al API y obtener la lista de productos
  useEffect(() => {
    CombosServices.getCombos()
      .then((response) => {
        console.log(response);
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof SyntaxError) {
          setError(error);
          setLoaded(false);
        }
      });
  }, []);

  if (!loaded) return <p>Cargando..</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mt: 4, mb: 2 }}>
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
          Menú de Combos
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

        {/* Sección de productos */}
        <Grid container spacing={3}>
          {data.map((combo) => (
            <Grid item key={combo.id} xs={12} sm={6} md={12}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "row", // Hace que el contenido esté en fila
                  height: "150px", // Ajuste rectangular
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                  borderRadius: "15px",
                  backgroundColor: "#f9f9f9",
                  marginBottom: "10px",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 150, borderRadius: "10px", margin: "10px" }} // Mantener imagen rectangular
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
                  <div>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {combo.nombre}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {combo.descripcion}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
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
                      sx={{ color: "#f44336" }}
                    >
                      <InfoIcon sx={{ fontSize: "1 .8rem" }} />
                    </IconButton>
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
