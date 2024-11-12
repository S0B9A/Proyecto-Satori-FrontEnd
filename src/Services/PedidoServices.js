import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "pedido";

class PedidoService {
  // http://localhost:81/SatoriAsianCuisine/pedido
  getPedidos() {
    return axios.get(BASE_URL);
  }

  // http://localhost:81/SatoriAsianCuisine/pedido/id
  getPedidoById(PedidoId) {
    return axios.get(BASE_URL + "/" + PedidoId);
  }

  // http://localhost:81/SatoriAsianCuisine/pedido
  updatePedido(pedido) {
    return axios({
      method: "put",
      url: BASE_URL,
      data: JSON.stringify(pedido),
    });
  }

}

export default new PedidoService();
