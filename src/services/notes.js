import axios from "axios";
const baseUrl = "/api/notes";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);

  return request
    .then((response) => response.data)
    .catch((err) => {
      console.log(err.message);
    });
};

const create = async (newObj) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObj, config);
  return response.data;
};

const updateItem = (id, newObj) => {
  return axios.put(`${baseUrl}/${id}`, newObj).then((res) => res.data);
};

export default {
  getAll,
  updateItem,
  create,
  setToken,
};
