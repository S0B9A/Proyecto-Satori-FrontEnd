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

  // http://localhost:81/SatoriAsianCuisine/menu
  updateMenu(Menu) {
    return axios({
      method: "put",
      url: BASE_URL,
      data: JSON.stringify(Menu),
    });
  }

  // http://localhost:81/SatoriAsianCuisine/menu
  createMenu(Menu) {
    return axios.post(BASE_URL, JSON.stringify(Menu));
  }
}

export default new MenuService();
