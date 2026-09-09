import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/cleanFlow-logo.png";
import darklogo from "@/assets/cleanflowlogodarkMode.png";
import { ROUTES } from "../../routes/paths";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const isCurrentPasswordValid = formData.currentPassword.length > 0;
  const isNewPasswordValid = formData.newPassword.length >= 8;
  const doPasswordsMatch = formData.newPassword === formData.confirmPassword;
  
  const isFormValid =
    isCurrentPasswordValid &&
    isNewPasswordValid &&
    doPasswordsMatch &&
    formData.confirmPassword.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      showToast("Please check all fields and ensure passwords match.", "error");
      return;
    }

    setIsLoading(true);

    // Simulate API request to update password
    setTimeout(() => {
      setIsLoading(false);

      // Example mock verification for incorrect current password
      if (formData.currentPassword === "wrongpassword") {
        showToast("Your current password is incorrect.", "error");
        return;
      }

      showToast("Password updated successfully!", "success");
      navigate(ROUTES.LOGIN); // Redirect to login page after successful password change
    }, 1200);
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

      {/* Card Container */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Change Password
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Enter your current password and choose a new one.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password Field */}
          <Input
            label="Current Password"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={formData.currentPassword}
            onChange={handleChange}
            leftIcon={<Lock className="w-5 h-5 text-[var(--color-text-secondary)]" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] focus:outline-none"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />

          {/* New Password Field */}
          <Input
            label="New Password"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={handleChange}
            leftIcon={<Lock className="w-5 h-5 text-[var(--color-text-secondary)]" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] focus:outline-none"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            error={
              formData.newPassword.length > 0 && !isNewPasswordValid
                ? "Password must be at least 8 characters"
                : undefined
            }
          />

          {/* Confirm New Password Field */}
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            leftIcon={<Lock className="w-5 h-5 text-[var(--color-text-secondary)]" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            error={
              formData.confirmPassword.length > 0 && !doPasswordsMatch
                ? "Passwords do not match"
                : undefined
            }
          />

          <Button
            type="submit"
            variant="solid"
            className="w-full mt-2"
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}