import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "pedido";

class PedidoService {
  // http://localhost:81/SatoriAsianCuisine/pedido
  getPedidos() {
    const user = localStorage.getItem("user");
    const token = user ? user.replace(/^"|"$/g, "") : "";
    console.log("Token", token);
    return axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // http://localhost:81/SatoriAsianCuisine/PedidosPorUsuario/idUsuario
  getPedidosPorUsuario(UsuarioId) {
    return axios.get(BASE_URL + "/PedidosPorUsuario/" + UsuarioId);
  }

  // http://localhost:81/SatoriAsianCuisine/pedido/id
  getPedidoById(PedidoId) {
    return axios.get(BASE_URL + "/" + PedidoId);
  }

  // http://localhost:81/SatoriAsianCuisine/pedido/getPedidoMasReciente
  getPedidoMasReciente() {
    return axios.get(BASE_URL + "/getPedidoMasReciente"); 
  }



    // http://localhost:81/SatoriAsianCuisine/pedido/updatePedidoPorPago
 
    updatePedidoPorPago(Pedido) {
      return axios.post(BASE_URL + "/updatePedidoPorPago", JSON.stringify(Pedido));
    }
    

  // http://localhost:81/SatoriAsianCuisine/pedido
  updatePedido(pedido) {
    return axios({
      method: "put",
      url: BASE_URL,
      data: JSON.stringify(pedido),
    });
  }

  createPedido(Pedido) {
    return axios.post(BASE_URL, JSON.stringify(Pedido));
  }
}

export default new PedidoService();
