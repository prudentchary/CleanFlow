import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";
type Rounded = "none" | "default" | "full";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  error?: string;
  helperText?: string;
  size?: Size;
  rounded?: Rounded;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const sizeMap: Record<Size, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-3.5 text-sm",
  lg: "h-12 px-4 text-base",
};

const roundedMap: Record<Rounded, string> = {
  none: "rounded-none",
  default: "rounded-[var(--radius-md)]",
  full: "rounded-full",
};

const baseInputStyles =
  "w-full bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] border border-[var(--color-border)] transition-all duration-200 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-60 disabled:cursor-not-allowed";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      size = "md",
      rounded = "default",
      leftIcon,
      rightIcon,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate a fallback accessible ID if none is provided
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--color-text)] select-none"
          >
            {label}
          </label>
        )}

        {/* Input Wrapper (for Icons positioning) */}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3 text-[var(--color-text-secondary)] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              baseInputStyles,
              sizeMap[size],
              roundedMap[rounded],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error &&
                "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 text-[var(--color-text-secondary)] flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error or Helper Text */}
        {error ? (
          <p className="text-xs text-[var(--color-danger)] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--color-text-secondary)]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;