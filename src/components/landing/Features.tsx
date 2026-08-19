import Container from "@/components/ui/Container";
import { Package, Shirt, Users, Bell } from "lucide-react";

const Features = () => {

  const features = [
  {
    icon: Package,
    title: "Order Management",
    description:
      "Keep every order organized from drop-off to pickup with a clear view of its current status.",
  },
  {
    icon: Shirt,
    title: "Garment Tracking",
    description:
      "Track every garment throughout the cleaning process so nothing gets lost in the workflow.",
  },
  {
    icon: Users,
    title: "Staff Management",
    description:
      "Coordinate your team and keep everyone aligned with the work that needs to be done.",
  },
  {
    icon: Bell,
    title: "Customer Updates",
    description:
      "Keep customers informed about their orders and know when garments are ready for pickup.",
  },
];
  return (
    <section id="features" className="py-10 lg:py-15">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Why CleanFlow?
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
            Everything you need to run your laundry business.
          </h2>

          <p className="mt-4 text-lg leading-8 text-[var(--color-text-secondary)]">
            From order management to garment tracking, CleanFlow brings your
            entire laundry operation together in one place.
          </p>
        </div>

       <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
  {features.map((feature) => (
  <div
    key={feature.title}
    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
  >
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
      <feature.icon size={24} />
    </div>

    <h3 className="text-lg font-semibold text-[var(--color-text)]">
      {feature.title}
    </h3>

    <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
      {feature.description}
    </p>
  </div>
))}
</div>
      </Container>
    </section>
  );
};

export default Features;
