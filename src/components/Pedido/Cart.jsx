import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { useCart } from "../../hook/useCart";

CartItem.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
};

// Estilo de Tabla
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center",
    minWidth: "150px",   // Ajusta según lo necesites
    maxWidth: "150px",   // Ajusta según lo necesites
    overflow: "hidden",   // Oculta el contenido que sobrepasa el límite
    textOverflow: "ellipsis",  // Agrega puntos suspensivos si el texto es largo
    whiteSpace: "nowrap", // Evita que el texto se divida en varias líneas
  },
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    fontSize: 16,
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function CartItem({ item, removeItem }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

  return (
    <StyledTableRow>
      <StyledTableCell>{item.nombre}</StyledTableCell>
      <StyledTableCell>
        <img
          src={`${BASE_URL}/${item.imagen}`}
          alt={item.nombre}
          style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
        />
      </StyledTableCell>
      <StyledTableCell>{`¢${item.precio}`}</StyledTableCell>
      <StyledTableCell>{item.cantidad}</StyledTableCell>
      <StyledTableCell>{`¢${item.subtotal}`}</StyledTableCell>
      <StyledTableCell>
        <Tooltip title={`Borrar ${item.nombre}`}>
          <IconButton color="warning" onClick={() => removeItem(item)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}

export function Cart() {
  const { cart, removeItem, cleanCart, getTotal, getTax, getTotalSinImpuestos } = useCart();

  return (
    <div style={{ padding: "20px" }}>
      <Tooltip title="Eliminar Alquiler">
        <IconButton
          color="error"
          onClick={cleanCart}
          aria-label="Eliminar"
          sx={{ mb: 2 }}
        >
          <RemoveShoppingCartIcon />
        </IconButton>
      </Tooltip>
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de carrito">
          <TableHead>
            <TableRow>
              <StyledTableCell>Producto</StyledTableCell>
              <StyledTableCell>Imagen</StyledTableCell>
              <StyledTableCell>Precio</StyledTableCell>
              <StyledTableCell>Cantidad</StyledTableCell>
              <StyledTableCell>Subtotal</StyledTableCell>
              <StyledTableCell>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} removeItem={removeItem} />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell colSpan={4} align="right">
                <Typography variant="subtitle1">Subtotal:</Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={2}>
                <Typography variant="subtitle1">{`¢${getTotalSinImpuestos(cart)}`}</Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell colSpan={4} align="right">
                <Typography variant="subtitle1">Impuestos:</Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={2}>
                <Typography variant="subtitle1">{`¢${getTax(cart)}`}</Typography>
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell colSpan={4} align="right">
                <Typography variant="subtitle1">Total:</Typography>
              </StyledTableCell>
              <StyledTableCell colSpan={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {`¢${getTotal(cart)}`}
                </Typography>
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
