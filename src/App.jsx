import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Bookings from "./pages/Bookings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./auth/ProtectedRoute";
import NavBar from "./components/NavBar";

function App() {
  const location = useLocation();
  const hideNavBar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {!hideNavBar && <NavBar/>}
      <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/*
      ProtectRoute function executed before enetring the protected route section
      */}
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookingdetails" element={<Bookings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
    
  );
}

export default App;
