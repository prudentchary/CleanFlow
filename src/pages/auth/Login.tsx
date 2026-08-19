import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/cleanFlow-logo.png";
import darklogo from "@/assets/cleanflowlogodarkMode.png";
import { ROUTES } from "@/routes/paths"; // adjust import path as needed
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Email format validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  // 2. Password security rules (At least 1 Capital, 1 Number, 1 Symbol)
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSymbol = /[^a-zA-Z0-9\s]/.test(formData.password);
  const isPasswordValid = hasUppercase && hasNumber && hasSymbol;

  // Master check to enable the button
  const isFormValid =
    formData.email.trim() !== "" &&
    formData.password.trim() !== "" &&
    isEmailValid &&
    isPasswordValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      // Route user to their dashboard upon successful login
      navigate(ROUTES.HOME);
    }, 1500);
  };
  const handleLogin = () => {
    showToast("Log in successful!", "success");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-bg)]">
      {/* Brand Logo Header */}
      <Link
        to={ROUTES.HOME}
        className="flex items-center justify-center transition-transform hover:scale-105 mb-8"
      >
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
      </Link>

      {/* Main Login Card */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Welcome Back
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Sign in to manage your CleanFlow workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <Input
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="alex@cleanflow.com"
            value={formData.email}
            onChange={handleChange}
            error={
              formData.email.length > 0 && !isEmailValid
                ? "Please enter a valid email address"
                : undefined
            }
          />

          {/* Password Input with Show/Hide Toggle */}
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            helperText="Must contain at least 1 uppercase letter, 1 number, and 1 symbol."
            error={
              formData.password.length > 0 && !isPasswordValid
                ? "Password must contain at least 1 capital letter, 1 number, and 1 symbol."
                : undefined
            }
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword) }
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors focus:outline-none flex items-center justify-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
          />

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[var(--color-text-secondary)]">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
              />
              Remember me
            </label>

            <a
              href="#forgot-password"
              onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <Button onClick={handleLogin}
            type="submit"
            variant="solid"
            className="w-full mt-2"
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
          >
            Sign In
          </Button>
        </form>

        {/* Link to Create Account */}
        <p className="text-xs text-center text-[var(--color-text-secondary)] mt-6">
          Don't have an account yet?{" "}
          <Link
            to={ROUTES.CREATE_ACCOUNT}
            className="text-[var(--color-primary)] font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
