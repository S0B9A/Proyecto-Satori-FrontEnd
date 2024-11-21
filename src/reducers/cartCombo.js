export const cartInitialStateCombo = JSON.parse(localStorage.getItem("cartCombo")) || [];
export const CART_COMBO_ACTION = {  // Cambiar el nombre de CART_ACTION por CART_COMBO_ACTION
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAN_CART: "CLEAN_CART",
};

//Actualizar localstorage
export const updateLocalStorage = (state) => {
  localStorage.setItem("cartCombo", JSON.stringify(state));
};

// Función para calcular el subtotal de cada ítem
const calculateSubtotalCombo = (item) => item.precio * item.cantidad;

// Función para calcular el total del carrito
const calculateTotalCombo = (cartCombo) =>
  cartCombo.reduce((acc, item) => acc + item.subtotal, 0);

// Función para obtener el impuesto
const calculateTax = (cartCombo) => cartCombo.length * 4;

// Reducer carrito de compras
export const cartComboReducer = (state, action) => {
  const { type: actionType, payload: actionPayload } = action;

  switch (actionType) {
    case CART_COMBO_ACTION.ADD_ITEM: { // Cambiar el nombre aquí también
      const { id } = actionPayload;

      const comboInCart = state.findIndex((item) => item.id === id);

      if (comboInCart >= 0) {
        const newState = structuredClone(state);
        newState[comboInCart].cantidad += 1;
        newState[comboInCart].subtotal = calculateSubtotalCombo(newState[comboInCart]);
        updateLocalStorage(newState);
        return newState;
      }

      const newState = [
        ...state,
        {
          ...actionPayload,
          cantidad: 1,
          subtotal: calculateSubtotalCombo({ ...actionPayload, cantidad: 1 }),
        },
      ];

      updateLocalStorage(newState);
      return newState;
    }

    case CART_COMBO_ACTION.REMOVE_ITEM: { // Cambiar el nombre aquí también
      const { id } = actionPayload;
      const newState = state.filter((item) => item.id !== id);
      updateLocalStorage(newState);
      return newState;
    }

    case CART_COMBO_ACTION.CLEAN_CART: { // Cambiar el nombre aquí también
      updateLocalStorage([]);
      return [];
    }

    default:
      return state;
  }
};

export const getTotalcombo = (state) => {
  const total = calculateTotalCombo(state);
  const tax = calculateTax(state);
  return total + tax;
};

export const getTotalSinImpuestoscombo = (state) => {
  const total = calculateTotalCombo(state);
  return total;
};

export const getTaxcombo = (state) => {
  return calculateTax(state);
};

export const getCountItemscombo = (state) => {
  return state.reduce((acc) => acc + 1, 0);
};
