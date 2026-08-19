import Container from "@/components/ui/Container";
const Footer = () => {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <Container>
        {/* Main footer */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4 lg:py-16">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              CleanFlow
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--color-text-secondary)]">
              Where Every Garment Has a Journey.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Product
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)]">
              <li>
                <a
                  href="#features"
                  className="transition-colors hover:text-[var(--color-primary)]"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="transition-colors hover:text-[var(--color-primary)]"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="#pricing"
                  className="transition-colors hover:text-[var(--color-primary)]"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Company
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)]">
              <li>
                <a
                  href="#about"
                  className="transition-colors hover:text-[var(--color-primary)]"
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="transition-colors hover:text-[var(--color-primary)]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}

        <div className="flex flex-col gap-4 border-t border-[var(--color-border)] py-6 text-sm text-[var(--color-text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CleanFlow. All rights reserved.</p>

          <div className="flex gap-6">
            <a
              href="#"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              Terms
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
