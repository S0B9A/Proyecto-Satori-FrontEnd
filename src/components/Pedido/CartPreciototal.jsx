import * as React from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { useCartCombo } from "../../hook/useCartCombo";
import { useCart } from "../../hook/useCart";
import { Box, Paper, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

// Estilo personalizado para el contenedor y las secciones de precio
const PriceCard = styled(Paper)(({ theme }) => ({
  padding: "20px",
  borderRadius: "15px",
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
  maxWidth: "400px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

// Estilo para las etiquetas de precios
const PriceLabel = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: "500",
  margin: "10px 0",
  textAlign: "center",
}));

// Estilo para el Total
const TotalPrice = styled(Typography)(({ theme }) => ({
  fontSize: "1.4rem",
  fontWeight: "700",
  color: theme.palette.success.main,
  marginTop: "20px",
  textAlign: "center",
}));

export function CartPreciototal({ isDomicilio }) {
  // Costo fijo por envío a domicilio
  const envioCosto = 5;

  const { cartCombo, getTotalcombo, getTaxcombo, getTotalSinImpuestoscombo } = useCartCombo();
  const { cart, getTotal, getTax, getTotalSinImpuestos } = useCart();

  // Función para calcular el costo total con envío
  const calcularCostoConEnvio = () => {
    const total = getTotalcombo(cartCombo) + getTotal(cart);
    return isDomicilio ? total + envioCosto : total;
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <PriceCard elevation={4}>
        <Typography variant="h6" gutterBottom>
          <strong>Resumen de Precio</strong>
        </Typography>

        <Divider sx={{ width: "100%", marginBottom: "15px" }} />

        <PriceLabel variant="body1">
          Precio Total sin impuestos: &cent;{getTotalSinImpuestoscombo(cartCombo) + getTotalSinImpuestos(cart)}
        </PriceLabel>

        <PriceLabel variant="body1">
          Impuesto Total: &cent;{getTaxcombo(cartCombo) + getTax(cart)}
        </PriceLabel>

        <PriceLabel variant="body1">
          Costo por Envío: &cent;{isDomicilio ? envioCosto : 0}
        </PriceLabel>

        <Divider sx={{ width: "100%", marginTop: "15px", marginBottom: "15px" }} />

        <TotalPrice variant="h6">
          Total: &cent;{calcularCostoConEnvio()}
        </TotalPrice>

        {isDomicilio && (
          <Tooltip title="Eliminar todos los productos">
            <IconButton
              color="error"
              onClick={() => {}}
              sx={{ position: "absolute", top: 10, right: 10 }}
            >
              <RemoveShoppingCartIcon />
            </IconButton>
          </Tooltip>
        )}
      </PriceCard>
    </Box>
  );
}
