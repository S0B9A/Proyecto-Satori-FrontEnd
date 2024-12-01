import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "estacion";

class EstacionService {
  // http://localhost:81/SatoriAsianCuisine/estacion
  getEstaciones() {
    return axios.get(BASE_URL);
  }

  // http://localhost:81/SatoriAsianCuisine/estacion/id
  getEstacionById(EstacionId) {
    return axios.get(BASE_URL + "/" + EstacionId);
  }

     // http://localhost:81/SatoriAsianCuisine/cocina/getEstacionesPorProductoID/id_pedido
     getEstacionesPorProductoID(ProductoId) {
      return axios.get(BASE_URL + "/getEstacionesPorProductoID/" + ProductoId);
    }
  
}

export default new EstacionService();
