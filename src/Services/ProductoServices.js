import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "producto";

class productoService {
  // http://localhost:81/SatoriAsianCuisine/producto
  getProductos() {
    return axios.get(BASE_URL);
  }

  // http://localhost:81/SatoriAsianCuisine/producto/id
  getProductoById(ProductoId) {
    return axios.get(BASE_URL + "/" + ProductoId);
  }
}

export default new productoService();
