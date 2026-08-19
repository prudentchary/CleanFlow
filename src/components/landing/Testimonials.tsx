import Container from "@/components/ui/Container";

const testimonials = [
  {
    name: "John Doe",
    role: "Laundry Business Owner",
    quote:
      "CleanFlow gives us a much clearer view of our daily operations and helps our team stay organized.",
  },
  {
    name: "Sarah Johnson",
    role: "Operations Manager",
    quote:
      "Managing orders and tracking garments becomes much easier when everything is handled from one place.",
  },
  {
    name: "Michael Brown",
    role: "Laundry Manager",
    quote:
      "The workflow is simple, clear, and makes it easier for our team to know exactly what needs to be done.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Testimonials
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
            Built to make laundry operations easier.
          </h2>

          <p className="mt-4 text-lg leading-8 text-[var(--color-text-secondary)]">
            See how CleanFlow can help laundry teams stay organized and keep
            every order moving.
          </p>
        </div>
        {/* Testimonials */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
            >
              {/* Testimonial content */}
              <div className="flex items-center gap-4">
                {/* Empty profile image */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-[var(--color-border)] bg-[var(--color-background)]">
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Photo
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">
                    {testimonial.name}
                  </h3>

                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-1 text-sm text-[var(--color-warning)]">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <blockquote className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
