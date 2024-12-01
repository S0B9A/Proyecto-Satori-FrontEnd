import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "cocina";

class CocinaService {
  // http://localhost:81/SatoriAsianCuisine/cocina/id_cocina
  getCocinaProducto(id) {
    return axios.get(BASE_URL + "/" + id);
  }

  // http://localhost:81/SatoriAsianCuisine/cocina/getListaDeProductosPorPedido/id_pedido
  getListaProductosById(PedidoId) {
    return axios.get(BASE_URL + "/getListaDeProductosPorPedido/" + PedidoId);
  }


  // http://localhost:81/SatoriAsianCuisine/cocina
  updatePedidoProducto(pedido) {
    return axios({
      method: "put",
      url: BASE_URL,
      data: JSON.stringify(pedido),
    });
  }
}

export default new CocinaService();
