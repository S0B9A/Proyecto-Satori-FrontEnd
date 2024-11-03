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

   // http://localhost:81/SatoriAsianCuisine/combo
   updateCombo(Combo) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Combo)

    })
  }

  // http://localhost:81/SatoriAsianCuisine/combo
  createCombo(combo) {
    return axios.post(BASE_URL, JSON.stringify(combo));
  }
}

export default new CombosService();
