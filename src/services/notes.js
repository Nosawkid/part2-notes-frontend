import axios from "axios";
const baseUrl = "/api/notes";

const getAll = () => {
  const request = axios.get(baseUrl);

  return request
    .then((response) => response.data)
    .catch((err) => {
      console.log(err.message);
    });
};

const createItem = (newItem) => {
  return axios.post(baseUrl, newItem).then((res) => res.data);
};

const updateItem = (id, newObj) => {
  return axios.put(`${baseUrl}/${id}`, newObj).then((res) => res.data);
};

export default {
  getAll,
  createItem,
  updateItem,
};
