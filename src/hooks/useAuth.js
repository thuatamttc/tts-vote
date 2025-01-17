import { useState } from 'react';
import { ENDPOINTS } from '../constants/api';
import Cookies from 'js-cookie';

const useAuth = () => {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const saved = Cookies.get("user");
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Error parsing localStorage:", error);
      return null;
    }
  });

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // Lưu token vào cookie đơn giản
        Cookies.set('token', data.token);
        Cookies.set('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, data };
      } else {
        console.log('data', data?.message);
        setError(data?.message || 'Đăng nhập thất bại');
        return { success: false, data };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Xóa token khi logout
    Cookies.remove('token');
    setUser(null);
  };

  // Kiểm tra đã đăng nhập chưa
  const isAuthenticated = () => {
    return Cookies.get('token') && Cookies.get('user') !== undefined;
  };

  return {
    loading,
    error,
    user,
    login,
    logout,
    isAuthenticated
  };
};

export default useAuth; 