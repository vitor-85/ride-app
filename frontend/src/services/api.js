import axios from "axios";

export const api = axios.create({
  baseURL: "https://ride-app-wya2.onrender.com"
});


const token = localStorage.getItem("token");


if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}