import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "combo";

class CombosService {
  // http://localhost:81/SatoriAsianCuisine/combo
  getCombos() {
    return axios.get(BASE_URL);
  }

  // http://localhost:81/SatoriAsianCuisine/combo/id
  getComboById(ComboId) {
    return axios.get(BASE_URL + "/" + ComboId);
  }

  
}

export default new CombosService();
