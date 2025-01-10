import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, render các routes con
  return <Outlet />;
};

export default PrivateRoute; 