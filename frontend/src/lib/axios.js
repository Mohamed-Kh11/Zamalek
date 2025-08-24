import axios from "axios";

// in production, there's no localhost so we have to make this dynamic
const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5001" : "/api";
const api = axios.create({
  baseURL: BASE_URL,
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // or sessionStorage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.request.use((config) => {
//   const token =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWNlZGQ2N2JlNzRjMTg3ZmIzYzdiYiIsInVzZXJuYW1lIjoibW9oYW1lZCIsImlhdCI6MTc1NTExNTAwOCwiZXhwIjoxNzU1MjAxNDA4fQ.mqcCj3ntoWenJC_h__u4HJZWRoslzFpxze2ytEUcO50"; // paste from your server
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
