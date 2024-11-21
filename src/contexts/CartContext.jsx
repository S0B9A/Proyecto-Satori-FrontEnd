import * as React from "react";
import { createContext, useReducer } from "react";
import {
  cartReducer,
  cartInitialState,
  getTotal,
  getTax,
  getCountItems,
  CART_ACTION,
  getTotalSinImpuestos,
} from "../reducers/cart";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

export const CartContext = createContext();

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);

  const addItem = (producto) => {
    dispatch({
      type: CART_ACTION.ADD_ITEM,
      payload: producto,
    });
    toast.success(`${producto.nombre} fue añadido al carrito`);
  };

  const removeItem = (producto) => {
    dispatch({
      type: CART_ACTION.REMOVE_ITEM,
      payload: producto,
    });
    toast(`${producto.nombre} fue eliminado del carrito`, {
      icon: <DeleteIcon color="warning" />,
    });
  };

  const cleanCart = () => {
    dispatch({
      type: CART_ACTION.CLEAN_CART,
    });
    toast("El carrito fue reiniciado", {
      icon: <RemoveShoppingCartIcon color="warning" />,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addItem,
        removeItem,
        cleanCart,
        getTotal,
        getCountItems,
        getTax,
        getTotalSinImpuestos,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
