import {jwtDecode} from "jwt-decode";

export const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    return token;
  };

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.user_id || null;
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    return null;
  }
};