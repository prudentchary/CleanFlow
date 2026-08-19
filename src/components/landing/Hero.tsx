import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/paths"; 
// import {rightIcon} from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section>
      <Container>
        <div className="grid items-center  gap-12 py-10 md:grid-cols-2 lg:gap-15 lg:py-">
          {/* Left side */}
          <div className="max-w-xl">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              The Operating System for Modern Laundries
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
              Where Every Garment Has a Journey.
            </h1>

            <p className="mt-6 text-lg leading-8 text-[var(--color-text-secondary)]">
              Manage your laundry business with less chaos. Track orders, manage
              garments, coordinate staff, and keep your customers informed — all
              in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-between">
              <Button  size="lg" onClick={() => navigate(ROUTES.CREATE_ACCOUNT)}>
                Get Started
              </Button>

              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </div>
          </div>

          {/* Right side */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-lg">
              <div className="flex justify-center md:justify-end">
                <div className="w-full max-w-lg overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
                  <img
                    src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1"
                    alt="Modern laundry service"
                    className="aspect-[4/3] h-auto w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
