export const cartInitialState = JSON.parse(localStorage.getItem("cart")) || [];
export const CART_ACTION = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAN_CART: "CLEAN_CART",
};

//Actualizar localstorage
export const updateLocalStorage = (state) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

// Función para calcular el subtotal de cada ítem
const calculateSubtotal = (item) => item.precio * item.cantidad;

// Función para calcular el total del carrito
const calculateTotal = (cart) =>
  cart.reduce((acc, item) => acc + item.subtotal, 0);

// Función para obtener el impuesto
const calculateTax = (cart) => cart.length * 4;

// Reducer carrito de compras
// state: estado previo
// retorna un nuevo estado
export const cartReducer = (state, action) => {
  // type: acción a realizar para cambiar el estado
  // payload: datos que necesita la acción
  const { type: actionType, payload: actionPayload } = action;

  switch (actionType) {
    // Agregar un item a la compra
    case CART_ACTION.ADD_ITEM: {
      const { id } = actionPayload;

      // Verificar sí existe
      const productoInCart = state.findIndex((item) => item.id === id);

      // Actualizar compra de producto existente
      if (productoInCart >= 0) {
        // structuredClone: copia a profundidad
        const newState = structuredClone(state);

        // Aumentar cantidad del producto
        newState[productoInCart].cantidad += 1;

        // Calcula y actualiza el subtotal
        newState[productoInCart].subtotal = calculateSubtotal(
          newState[productoInCart]
        );
        updateLocalStorage(newState);
        return newState;
      }

      // Nuevo producto en la compra
      const newState = [
        ...state,
        {
          ...actionPayload,
          cantidad: 1,
          subtotal: calculateSubtotal({ ...actionPayload, cantidad: 1 }),
        },
      ];

      updateLocalStorage(newState);
      return newState;
    }

    // Eliminar item de la compra
    case CART_ACTION.REMOVE_ITEM: {
      const { id } = actionPayload;
      const newState = state.filter((item) => item.id !== id);
      updateLocalStorage(newState);
      return newState;
    }

    // Eliminar el carrito completo
    case CART_ACTION.CLEAN_CART: {
      updateLocalStorage([]);
      return [];
    }

    default:
      return state;
  }
};

export const getTotal = (state) => {
  const total = calculateTotal(state);
  const tax = calculateTax(state);
  return total + tax;
};

export const getTotalSinImpuestos = (state) => {
  const total = calculateTotal(state);
  return total;
};

// Nueva función para obtener solo el impuesto
export const getTax = (state) => {
  return calculateTax(state);
};

export const getCountItems = (state) => {
  return state.reduce((acc) => acc + 1, 0);
};
