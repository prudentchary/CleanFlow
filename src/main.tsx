import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import "./styles/theme.css";
import App from "./App";
import { ToastProvider } from "@/context/ToastContext";
import { ServiceProvider } from "@/context/ServiceContext";
import { CustomerProvider } from "@/context/CustomerContext";
import { StaffProvider } from "@/context/StaffContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ServiceProvider>
          <CustomerProvider>
            <StaffProvider>
              <App />
            </StaffProvider>
          </CustomerProvider>
        </ServiceProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);