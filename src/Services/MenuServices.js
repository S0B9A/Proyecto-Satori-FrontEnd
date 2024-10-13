import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "menu";

class MenuService {
  // http://localhost:81/SatoriAsianCuisine/menu
  getMenus() {
    return axios.get(BASE_URL);
  }

  // http://localhost:81/SatoriAsianCuisine/menu/id
  getMenuById(ComboId) {
    return axios.get(BASE_URL + "/" + ComboId);
  }

  // http://localhost:81/SatoriAsianCuisine/menu/getMenuActual
  getMenuActual() {
    return axios.get(BASE_URL + "/" + "getMenuActual");
  }
}

export default new MenuService();
