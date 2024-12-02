import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "Ingrediente";

class ingredienteServices {
  // http://localhost:81/SatoriAsianCuisine/Ingrediente
  getIngredientes() {
    return axios.get(BASE_URL);
  }
}

export default new ingredienteServices();
