import { useState } from "react";
import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  const [email, setEmail] = useState("");

  // Simple SPA routing without a router: render Register when path is /register
  const path = window.location.pathname.replace(/\/+$/g, "");

  if (path === "/register") {
    return <Register />;
  }

  return <Login />;
}

export default App;
