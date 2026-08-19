import Container from "@/components/ui/Container";
import logo from "@/assets/cleanFlow-logo.png";

const About = () => {
  return (
    <section id="about" className="py-10 lg:py-15">
      <Container>
        
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              About CleanFlow
            </span>
          </div>
          <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="max-w-xl ">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
              We're building a better way to run laundry businesses.
            </h2>

            <p className="mt-4 text-lg leading-8 text-[var(--color-text-secondary)]">
              CleanFlow is designed to help modern laundry businesses replace
              disconnected processes with one clear and organized workflow.
            </p>

            <p className="mt-4 text-base leading-7 text-[var(--color-text-secondary)]">
              From receiving an order to tracking garments, managing staff, and
              keeping customers informed, CleanFlow brings the entire journey
              into one place.
            </p>
          </div>

          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="flex aspect-[4/3] w-full max-w-lg flex-col items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)]">
              {/* CleanFlow logo placeholder */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-2xl font-bold text-[var(--color-primary)]">
                <img src={logo} alt="Clean flow logo" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-[var(--color-text)]">
                CleanFlow
              </h3>

              <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
                Where Every Garment Has a Journey.
              </p>

              {/* Key highlights */}
              <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3">
                <div className="rounded-[var(--radius-md)] bg-[var(--color-background)] p-3 text-center">
                  <p className="text-lg font-bold text-[var(--color-primary)]">
                    01
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Workflow
                  </p>
                </div>

                <div className="rounded-[var(--radius-md)] bg-[var(--color-background)] p-3 text-center">
                  <p className="text-lg font-bold text-[var(--color-primary)]">
                    02
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Tracking
                  </p>
                </div>

                <div className="rounded-[var(--radius-md)] bg-[var(--color-background)] p-3 text-center">
                  <p className="text-lg font-bold text-[var(--color-primary)]">
                    03
                  </p>

                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Visibility
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default About;
