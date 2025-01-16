import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home"; // Giả sử bạn có một trang Home khác
import Login from "./pages/Login";
import Award from "./pages/Award";
import LuckyWheel from "./pages/LuckyWheel";
import PrivateRoute from "./components/PrivateRoute";
import ShowVote from "./pages/ShowVote";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          
          {/* Admin only routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/award" element={<Award />} />
          <Route path="/lucky-wheel" element={<LuckyWheel />} />
          <Route path="/show-vote" element={<ShowVote />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
