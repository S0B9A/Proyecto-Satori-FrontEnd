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

  // http://localhost:81/SatoriAsianCuisine/producto
  updateProducto(Producto) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Producto)

    })
  }

  // http://localhost:81/SatoriAsianCuisine/producto
  createProducto(Producto) {
    return axios.post(BASE_URL, JSON.stringify(Producto));
  }

}

export default new productoService();
