// src/App.tsx

import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import LandingPage from "@/pages/landing/LandingPage";
import CreateAccount from "@/pages/auth/CreateAccount"; 
import VerifyOtp from "@/pages/auth/VerifyOtp";
import Login from "@/pages/auth/Login"; 
import ForgotPassword from "@/pages/auth/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.CREATE_ACCOUNT} element={<CreateAccount />} />
      <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;