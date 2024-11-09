import axios from "axios";
import { auth } from "../config/firebase";

const BASE_URL = "https://odyssey-hyxqz5ere-abhyudays-projects.vercel.app/";
// const TOKEN =
//   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
//     .accessToken || "";

// const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
// const currentUser = user && JSON.parse(user).currentUser;
// const TOKEN = currentUser?.accessToken;

const getIdToken = async () => {
    const user = auth.currentUser;
    
    if (user) {
      // Get the current user's ID token
      const idToken = await user.getIdToken();
      return idToken;
    } else {
      throw new Error("User is not authenticated");
    }
};

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
    async (config) => {
      try {
        const token = await getIdToken();
        config.headers['Authorization'] = `Bearer ${token}`;
        // config.headers['Content-Type'] = 'application/json';
      } catch (error) {
        console.error('Error getting authentication token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

export const publicRequest = axiosInstance;
