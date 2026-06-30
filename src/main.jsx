import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

//console.log("Stripe public key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);
// const stripePromise = loadStripe(
//   import.meta.env.VITE_STRIPE_PUBLIC_KEY
// );

//Browser Router is used to enable routing in the application, allowing navigation between different pages without a full page reload.
//instead of using the default browser behavior of reloading the page when navigating to a new URL, BrowserRouter uses the HTML5 history API to manipulate the browser's history stack and update the URL in the address bar without triggering a full page reload.

//makes stripe available to all components within the application, allowing them to access Stripe's functionality and securely handle payment information.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
