// src/App.tsx

import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import LandingPage from "@/pages/landing/LandingPage";
import CreateAccount from "@/pages/auth/CreateAccount"; 
import VerifyOtp from "@/pages/auth/VerifyOtp";

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.CREATE_ACCOUNT} element={<CreateAccount />} />
      <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
    </Routes>
  );
}

export default App;