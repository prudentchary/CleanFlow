import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/cleanFlow-logo.png";
import darklogo from "@/assets/cleanflowlogodarkMode.png";
import { ROUTES } from "../../routes/paths"; // adjust import path as needed
import Button from "@/components/ui/Button";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Reads the email passed from CreateAccount.tsx
  const userEmail = location.state?.email || "your email";

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // References to input elements for manual focus control
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown for Resend Code
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle single digit input
  const handleChange = (index: number, value: string) => {
    // Only allow single numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last character entered
    setOtp(newOtp);

    // Auto-advance to next box if digit entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Pasting full 4-digit OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[3]?.focus(); // Focus last box
    }
  };

  // Resend OTP trigger
  const handleResend = () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    // TODO: Trigger your backend API to resend email code
    alert(`A new verification code has been sent to ${userEmail}`);
  };

  // Submit OTP
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Route to core dashboard upon success
      navigate(ROUTES.HOME);
    }, 1500);
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-bg)]">
      {/* Brand Logo Header */}
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

      {/* Main Card */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Verify Your Email
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">
          We sent a 4-digit verification code to <br />
          <strong className="text-[var(--color-text)]">{userEmail}</strong>
        </p>

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          {/* OTP Digit Inputs */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="solid"
            className="w-full"
            isLoading={isLoading}
            disabled={!isOtpComplete || isLoading}
          >
            Verify & Continue
          </Button>
        </form>

        {/* Resend Cooldown */}
        <div className="mt-6 text-xs text-[var(--color-text-secondary)]">
          Didn't receive the code?{" "}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-[var(--color-primary)] font-semibold hover:underline"
            >
              Resend Code
            </button>
          ) : (
            <span className="text-[var(--color-text-secondary)] font-medium">
              Resend in{" "}
              <strong className="text-[var(--color-text)]">
                {resendTimer}s
              </strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
