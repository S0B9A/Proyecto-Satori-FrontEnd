import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const products = [
  {
    id: 1,
    title: "Sushi",
    description: "Deliciosos rollos de sushi con pescado fresco.",
    price: "$15",
    image:
      "https://www.tresjotas.com/wp-content/uploads/2021/08/Kit-basico-para-preparar-sushi-en-casa.jpg",
  },
  {
    id: 2,
    title: "Kimchi",
    description: "Fermentado tradicional coreano, picante y sabroso.",
    price: "$8",
    image:
      "https://www.infobae.com/new-resizer/_39RmqV16hMeLM0QyvOxOr8Gnek=/1200x900/filters:format(webp):quality(85)/cloudfront-us-east-1.images.arcpublishing.com/infobae/NNQBBRMFUNCLLBYMJEIEWSVB54.jpg",
  },
  {
    id: 3,
    title: "Dumplings",
    description: "Empanadillas chinas rellenas de carne y verduras.",
    price: "$10",
    image:
      "https://t1.uc.ltmcdn.com/es/posts/9/5/9/como_hacer_dumplings_chinos_46959_orig.jpg",
  },
  {
    id: 4,
    title: "Ramen",
    description: "Tazón de fideos ramen con caldo sabroso.",
    price: "$12",
    image:
      "https://t2.uc.ltmcdn.com/es/posts/1/8/5/como_preparar_sopa_ramen_de_pollo_45581_600_square.jpg",
  },
  {
    id: 5,
    title: "Tempura",
    description: "Verduras y mariscos empanizados y fritos.",
    price: "$14",
    image:
      "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/E3AF6E67-0180-4A0A-8E8F-FF8CF8C97939/Derivates/759c5ff9-a816-41f1-8ae5-dd05dd304856.jpg",
  },
  {
    id: 6,
    title: "Bulgogi",
    description: "Carne de res marinada y a la parrilla al estilo coreano.",
    price: "$18",
    image:
      "https://static01.nyt.com/images/2023/11/14/multimedia/JM-Bulgogi-qmfj/JM-Bulgogi-qmfj-square640.jpg",
  },
  {
    id: 7,
    title: "Tempura",
    description: "Verduras y mariscos empanizados y fritos.",
    price: "$14",
    image:
      "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/E3AF6E67-0180-4A0A-8E8F-FF8CF8C97939/Derivates/759c5ff9-a816-41f1-8ae5-dd05dd304856.jpg",
  },
  {
    id: 8,
    title: "Bulgogi",
    description: "Carne de res marinada y a la parrilla al estilo coreano.",
    price: "$18",
    image:
      "https://static01.nyt.com/images/2023/11/14/multimedia/JM-Bulgogi-qmfj/JM-Bulgogi-qmfj-square640.jpg",
  },
];

function Main({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h4">
        Toda tu comida favorita asiatica {pathname}
      </Typography>
      <div id="card">
        <Grid container spacing={7} sx={{ mt: 4}}>
          {products.map((product) => (
            <Grid item xs={12} sm={10} md={3} key={product.id}>
              <Card sx={{ maxWidth: 320, maxHeight:400, minHeight:400}}>
                {/* Ajusta el tamaño máximo de la tarjeta */}
                <CardMedia
                  component="img"
                  alt={product.title}
                  height="150" // Ajusta la altura de la imagen
                  image={product.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {product.price}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    <button>Comprar</button>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Box>
  );
}

// Agregando PropTypes para la validación de las props
Main.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Main;
