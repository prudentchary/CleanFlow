import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";
type Rounded = "none" | "default" | "full";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  rounded?: Rounded;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
   isLoading?: boolean;
  loadingText?: string;
};

const variantMap: Record<Variant, string> = {
  solid:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",

  outline:
    "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white",

  ghost: "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10",
};
const sizeMap: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",

  md: "h-10 px-5 text-base",

  lg: "h-12 px-6 text-lg",
};

const roundedMap: Record<Rounded, string> = {
  none: "rounded-none",

  default: "rounded-[var(--radius-md)]",

  full: "rounded-full",
};

const baseStyles =
"inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none disabled:opacity-60";

const Spinner = () => {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
};
const Button = ({
  children,
  variant = "solid",
  size = "md",
  rounded = "default",
  leftIcon,
  rightIcon,
    isLoading = false,
  loadingText,
  className,
  ...props
}: ButtonProps) => {

    const isDisabled = props.disabled || isLoading;
  return (
    <button
    disabled={isDisabled}
      className={cn(
        baseStyles,
        variantMap[variant],
        sizeMap[size],
        roundedMap[rounded],
        className,
      )}
      {...props}
    >
     {isLoading ? (
    <>
        <Spinner />

        <span>
            {loadingText ?? children}
        </span>
    </>
) : (
    <>
        {leftIcon && <span>{leftIcon}</span>}

        <span>{children}</span>

        {rightIcon && <span>{rightIcon}</span>}
    </>
)}
    </button>
  );
};

export default Button;
