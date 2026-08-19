import Container from "@/components/ui/Container";

const ProductShowcase = () => {
  return (
    <section className="py-10 lg:py-15">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Built for your business
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
              Everything under control, all in one place.
            </h2>

            <p className="mt-4 text-lg leading-8 text-[var(--color-text-secondary)]">
              CleanFlow gives you the tools to manage orders, track garments,
              coordinate your team, and keep your customers informed.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">
                    Know where every garment is
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                    Track every order from drop-off to pickup without losing
                    visibility.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">
                    Keep your team organized
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                    Give your staff a clear workflow and keep everyone working
                    from the same information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">
                    Keep customers informed
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                    Keep customers updated as their orders move through your
                    laundry process.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right visual */}

          <div className="relative flex justify-center lg:justify-end">
  <div className="absolute -inset-4 -z-10 rounded-[var(--radius-xl)] bg-[var(--color-primary)]/10 blur-2xl" />

  <div className="w-full max-w-lg overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
    <img
      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699ddef1d5acb9cc22fa023a/f8b6cc496_generated_image.png"
      alt="Modern commercial laundry facility"
      className="aspect-[4/3] h-auto w-full object-cover"
    />
  </div>
</div>
        </div>
      </Container>
    </section>
  );
};

export default ProductShowcase;
