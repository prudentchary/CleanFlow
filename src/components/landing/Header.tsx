import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/cleanFlow-logo.png";
import darklogo from "@/assets/cleanflowlogodarkMode.png";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import ThemeToggle from "../ui/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/paths"; 

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-200 bg-[var(--color-background)]">
      <Container className="flex h-16 items-center justify-between">
      <a href="/" className="flex items-center">
  <img src={logo} alt="CleanFlow" className="h-10 w-auto [.dark_&]:hidden" />
  <img src={darklogo} alt="CleanFlow" className="h-10 w-auto hidden [.dark_&]:block" />
</a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[var(--color-primary)]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[var(--color-primary)]"
          >
            How It Works
          </a>

          <a
            href="#about"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[var(--color-primary)]"
          >
            About
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[var(--color-primary)]"
          >
            Pricing
          </a>

          <a
            href="#contact"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-[var(--color-primary)]"
          >
            Contact-Us
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          <Button variant="ghost" size="sm">
            Login
          </Button>

          <Button onClick={() => navigate(ROUTES.CREATE_ACCOUNT)} variant="solid" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {isMobileMenuOpen && (
        <nav className="md:hidden border-slate-200  px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-medium text-slate-700 transition-colors hover:text-[var(--color-primary)]"
            >
              Features{" "}
            </a>
            <a
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-medium text-slate-700 transition-colors hover:text-[var(--color-primary)]"
            >
              {" "}
              How It Works{" "}
            </a>

            <a
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-medium text-slate-700 transition-colors hover:text-[var(--color-primary)]"
            >
              About{" "}
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-medium text-slate-700 transition-colors hover:text-[var(--color-primary)]"
            >
              Pricing
            </a>
             <a
            href="#contact"
            className="text-medium font-medium text-slate-600 transition-colors hover:text-[var(--color-primary)]"
          >
            Contact-Us
          </a>

            <div className="mt-2 flex flex-col gap-3 border-t border-slate-200 pt-4">
              <Button variant="outline" className="w-full">
                Login
              </Button>

              <Button onClick={() => navigate(ROUTES.CREATE_ACCOUNT)} className="w-full">Get Started</Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
