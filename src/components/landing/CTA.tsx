import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/paths"; 

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-10 lg:py-15">
      <Container>
        <div className="rounded-[var(--radius-xl)] bg-[var(--color-primary)] px-6 py-16 text-center sm:px-12">
          {/* CTA content */}
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to take control of your laundry operation?
            </h2>

            <p className="mt-4 text-lg leading-8 text-white/80">
              Start managing orders, tracking garments, and coordinating your
              team with CleanFlow.
            </p>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              variant="solid"
              className="bg-white text-[var(--color-primary)] hover:bg-white/90"
              onClick={() => navigate(ROUTES.CREATE_ACCOUNT)}
            >
              Get Started
            </Button>

            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[var(--color-primary)]"
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
