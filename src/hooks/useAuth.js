import { useState } from 'react';
import { ENDPOINTS } from '../constants/api';
import Cookies from 'js-cookie';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

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
        console.log('Đăng nhập thành công!');
        return { success: true, data };
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
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