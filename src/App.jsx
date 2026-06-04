import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import StripeCheckout from "./pages/StripeCheckout";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./auth/ProtectedRoute";
import NavBar from "./components/NavBar";
import Profile from "./pages/UserProfile";
import UserReviews from "./pages/UserReviews";
import ReviewVisit from "./pages/ReviewVisit";
import ManageHotels from "./pages/admin/ManageHotels";
import HotelFormPage from "./pages/admin/HotelFormPage";
import ManageRooms from "./pages/admin/ManageRooms";
import RoomFormPage from "./pages/admin/RoomFormPage";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageReviews from "./pages/admin/ManageReviews";
import ManageUsers from "./pages/admin/ManageUsers";

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
        <Route path="/bookingdetails" element={<BookingDetails />} />
        <Route path="/stripe-checkout" element={<StripeCheckout />} />
        <Route path="/UserProfile" element={<Profile />} />
        <Route path="/UserReviews" element={<UserReviews/>} />
        <Route path="/review-visit" element={<ReviewVisit />} />
        <Route path="/admin/hotels" element={<ManageHotels />} />
        <Route path="/admin/add-hotel" element={<HotelFormPage  />} />
        <Route path="/admin/edit-hotel/:id" element={<HotelFormPage  />} />
        <Route path="/admin/rooms" element={<ManageRooms  />} />
        <Route path="/admin/add-room" element={<RoomFormPage  />} />
        <Route path="/admin/edit-room/:id" element={<RoomFormPage  />} />
        <Route path="/admin/bookings" element={<ManageBookings  />} />
        <Route path="/admin/reviews" element={<ManageReviews  />} />
        <Route path="/admin/users" element={<ManageUsers  />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
    
  );
}

export default App;
