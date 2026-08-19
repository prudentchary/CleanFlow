import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import logo from "@/assets/cleanFlow-logo.png";
import darklogo from "@/assets/cleanflowlogodarkMode.png";
import { ROUTES } from "../../routes/paths";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Email validation regex
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) return;

    setIsLoading(true);

    // Simulate API request to send reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
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

      {/* Main Card */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        {!isSubmitted ? (
          /* Request Reset Link Form */
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[var(--color-text)]">
                Reset Password
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                Enter your registered email address and we'll send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="alex@cleanflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-5 h-5 text-[var(--color-text-secondary)]" />}
                error={
                  email.length > 0 && !isEmailValid
                    ? "Please enter a valid email address"
                    : undefined
                }
              />

              <Button
                type="submit"
                variant="solid"
                className="w-full"
                isLoading={isLoading}
                disabled={!isEmailValid || isLoading}
              >
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          /* Success View State */
          <div className="text-center py-2 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              Check Your Inbox
            </h2>
            
            <p className="text-sm text-[var(--color-text-secondary)]">
              We've sent password reset instructions to: <br />
              <strong className="text-[var(--color-text)] font-semibold">{email}</strong>
            </p>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={() => setIsSubmitted(false)}
            >
              Didn't receive email? Try again
            </Button>
          </div>
        )}

        {/* Back to Sign In Link */}
        <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-center">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}