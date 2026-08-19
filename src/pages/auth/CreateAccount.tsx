import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ROUTES } from "../../routes/paths"; // adjust step-up path if needed
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input"; // import your custom Input component
import logo from "@/assets/cleanFlow-logo.png";
import darklogo from "@/assets/cleanflowlogodarkMode.png";

export default function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan || "starter";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // 1. Email format check
const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail);
  // 1. Password rules check
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasSymbol = /[^a-zA-Z0-9\s]/.test(formData.password);
  const isUpToEightChars = formData.password.length >= 8;
  const hasNumber = /[0-9]/.test(formData.password); // Added number check
  const isPasswordValid = hasUppercase && hasSymbol && hasNumber && isUpToEightChars;

  // 2. Password matching check
const passwordsMatch = formData.password === formData.confirmPassword;

  // 2. All fields filled check
  const isFormFilled =
    formData.companyName.trim() !== "" &&
    formData.companyEmail.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.confirmPassword.trim() !== "";

  // 3. Final master condition
  const isFormValid = isFormFilled && isEmailValid && isPasswordValid && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  // Simulate API call to send OTP
  setTimeout(() => {
    setIsLoading(false);
    
    // Pass email and plan forward to the OTP screen
    navigate(ROUTES.VERIFY_OTP, {
      state: { 
        email: formData.companyEmail,
        plan: selectedPlan 
      },
    });
  }, 1200);
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-bg)]">
      {/* Brand Header / Logo */}
      <div className="flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform group-hover:scale-105">
        <img
          src={logo}
          alt="CleanFlow"
          className="h-10 w-auto [.dark_&]:hidden"
        />
        <img
          src={darklogo}
          alt="CleanFlow"
          className="h-10 w-auto hidden [.dark_&]:block"
        />
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Create Account
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Welcome to CleanFlow! Enter your details to get started.
          </p>
        </div>

        {/* Selected Plan Badge */}
        <div className="mb-6 p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex justify-between items-center text-sm">
          <span className="text-[var(--color-text-secondary)]">
            Selected Plan:{" "}
            <strong className="text-[var(--color-text)] capitalize">
              {selectedPlan}
            </strong>
          </span>
          <Link
            to={ROUTES.HOME}
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            Change
          </Link>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company Name"
            name="companyName"
            type="text"
            required
            placeholder="e.g. Fresh Laundry Co."
            value={formData.companyName}
            onChange={handleChange}
          />

          <Input
            label="Company Email"
            name="companyEmail"
            type="email"
            required
            placeholder="alex@cleanflow.com"
            value={formData.companyEmail}
            onChange={handleChange}
            helperText="email must contain @.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            helperText="Must contain at least 1 uppercase letter, 1 symbol, and 1 number."
            error={
              formData.password.length > 0 && !isPasswordValid
                ? "Password must include an uppercase letter, a symbol, and a number"
                : undefined
            }
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            helperText="Re-enter your password for confirmation."
          />

          <Button
            type="submit"
            variant="solid"
            className="w-full mt-2"
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
          >
            Create Account
          </Button>
        </form>

        <p className="text-xs text-center text-[var(--color-text-secondary)] mt-6">
          Already have an account?{" "}
          <Link
            to={ROUTES.HOME}
            className="text-[var(--color-primary)] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
