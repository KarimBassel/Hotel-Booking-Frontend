import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import App from "./App";

console.log("Stripe public key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
      </Elements>
    </BrowserRouter>
  </React.StrictMode>
);
