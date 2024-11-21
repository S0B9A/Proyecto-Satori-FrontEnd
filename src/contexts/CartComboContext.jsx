import * as React from "react";
import { createContext, useReducer } from "react";
import {
  cartComboReducer,
  cartInitialStateCombo,
  getTotalcombo,
  getTaxcombo,
  getCountItemscombo,
  CART_COMBO_ACTION,  // Cambiar de CART_ACTION a CART_COMBO_ACTION
  getTotalSinImpuestoscombo,
} from "../reducers/cartCombo";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

export const CartComboContext = createContext();

CartComboProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function CartComboProvider({ children }) {
  const [state, dispatch] = useReducer(cartComboReducer, cartInitialStateCombo);

  const addItem = (producto) => {
    dispatch({
      type: CART_COMBO_ACTION.ADD_ITEM,  // Actualizar el nombre aquí también
      payload: producto,
    });
    toast.success(`${producto.nombre} fue añadido al carrito`);
  };

  const removeItem = (producto) => {
    dispatch({
      type: CART_COMBO_ACTION.REMOVE_ITEM,  // Actualizar el nombre aquí también
      payload: producto,
    });
    toast(`${producto.nombre} fue eliminado del carrito`, {
      icon: <DeleteIcon color="warning" />,
    });
  };

  const cleanCartCombo = () => {
    dispatch({
      type: CART_COMBO_ACTION.CLEAN_CART,  // Actualizar el nombre aquí también
    });
    toast("El carrito fue reiniciado", {
      icon: <RemoveShoppingCartIcon color="warning" />,
    });
  };

  return (
    <CartComboContext.Provider
      value={{
        cartCombo: state,
        addItem,
        removeItem,
        cleanCartCombo,
        getTotalcombo,
        getCountItemscombo,
        getTaxcombo,
        getTotalSinImpuestoscombo,
      }}
    >
      {children}
    </CartComboContext.Provider>
  );
}
