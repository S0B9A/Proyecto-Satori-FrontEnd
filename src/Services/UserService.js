import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'usuario';

class UserService {
  getUsers() {
    return axios.get(BASE_URL);
  }

  getUsuario(Id) {
    return axios.get(BASE_URL + "/" + Id);
  }

  getUserClientes() {
    return axios.get(BASE_URL + '/' + 'allClientes');
  }

  createUser(User) {
    return axios.post(BASE_URL, JSON.stringify(User));
  }

  loginUser(User) {
    return axios.post(BASE_URL + '/login/', JSON.stringify(User));
  }
}

export default new UserService();
