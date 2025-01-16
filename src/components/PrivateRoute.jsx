import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAuth();
  
  console.log(user);

  // Kiểm tra đăng nhập
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  
  // Nếu là admin cho phép vào tất cả các trang
  if (user?.role === 'admin') {
    return <Outlet />;
  }

  // Nếu là user chỉ cho phép vào các trang public
  if (user?.role === 'user') {

    return <Navigate to="/" replace />;
  }

  // Cho phép render route
  return <Outlet />;
};

export default PrivateRoute; 