import Container from "@/components/ui/Container";
import { ClipboardPlus, Shirt, Activity, CheckCircle } from "lucide-react";

const HowItWorks = () => {

  const steps = [
  {
    number: "01",
    icon: ClipboardPlus,
    title: "Receive Order",
    description:
      "Record the customer's order and capture the garments that need to be processed.",
  },
  {
    number: "02",
    icon: Shirt,
    title: "Process Garments",
    description:
      "Move garments through each stage of your laundry workflow with a clear process.",
  },
  {
    number: "03",
    icon: Activity,
    title: "Track Progress",
    description:
      "Keep every garment visible and know exactly where it is throughout the process.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Complete Order",
    description:
      "Mark orders as complete and keep customers informed when their garments are ready.",
  },
];
  return (
    <section id="how-it-works" className="py-10 lg:py-15">
      <Container>
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
  <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
    How It Works
  </span>

  <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
    From drop-off to pickup, made simple.
  </h2>

  <p className="mt-4 text-lg leading-8 text-[var(--color-text-secondary)]">
    CleanFlow gives your team a clear workflow for every garment, from the
    moment an order arrives until it reaches the customer.
  </p>
</div>

        {/* Steps */}

       <div className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

  <div className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-[var(--color-border)] lg:block" />

  {steps.map((step) => (
    <div key={step.number} className="relative">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
        <step.icon size={22} />
      </div>

      <span className="mt-4 block text-sm font-semibold text-[var(--color-primary)]">
        {step.number}
      </span>

      <h3 className="mt-2 text-lg font-semibold text-[var(--color-text)]">
        {step.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
        {step.description}
      </p>
    </div>
  ))}
</div>
        
      </Container>
    </section>
  );
};

export default HowItWorks;