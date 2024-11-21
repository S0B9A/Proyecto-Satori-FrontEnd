import { useContext } from "react";
import { CartComboContext } from "../contexts/CartComboContext";  // Cambiar a CartComboContext

export const useCartCombo = () => {  // Cambiar nombre del hook a useCartCombo
  const context = useContext(CartComboContext);  // Usar CartComboContext
  if (context === undefined) {
    throw new Error("useCartCombo debe utilizarse con el CartComboProvider");  // Cambiar el mensaje de error
  }
  return context;
};