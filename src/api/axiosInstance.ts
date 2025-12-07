import axios from "axios";
import { Alert } from "react-native";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // Örnek API
  timeout: 10000,
});

// ⭐ Request Interceptor (Token ekleme)
api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⭐ Response Interceptor (Global hata yönetimi)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Bilinmeyen bir hata oluştu.";

    if (error.code === "ECONNABORTED") {
      message = "Sunucu yanıt vermiyor (timeout).";
    } else if (!error.response) {
      message = "İnternet bağlantısı yok.";
    } else if (error.response.status >= 500) {
      message = "Sunucu hatası.";
    } else if (error.response.status === 404) {
      message = "İstek bulunamadı.";
    } else if (error.response.status === 401) {
      message = "Oturum süresi doldu. Tekrar giriş yapınız.";
      useAuthStore.getState().logout();
    } else {
      message = error.response.data?.message || "Bir hata oluştu.";
    }

    Alert.alert("Hata", message);
    
    return Promise.reject(error);
  }
);

export default api;
