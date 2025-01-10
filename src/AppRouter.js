import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home"; // Giả sử bạn có một trang Home khác
import Login from "./pages/Login";
import Award from "./pages/Award";
import LuckyWheel from "./pages/LuckyWheel";
import PrivateRoute from "./components/PrivateRoute";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/award" element={<Award />} />
        <Route path="/lucky-wheel" element={<LuckyWheel />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
