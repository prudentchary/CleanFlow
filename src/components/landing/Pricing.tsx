import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/paths";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      description: "For small laundry businesses getting organized.",
      price: "₦XX",
      period: "/month",
      features: [
        "Order management",
        "Garment tracking",
        "Basic staff management",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "Business",
      description: "For growing laundry businesses that need more control.",
      price: "₦XX",
      period: "/month",
      features: [
        "Everything in Starter",
        "Advanced garment tracking",
        "Team management",
        "Customer notifications",
      ],
      buttonText: "Get Started",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For larger laundry operations with advanced needs.",
      price: "Custom",
      period: "",
      features: [
        "Everything in Business",
        "Advanced reporting",
        "Multiple locations",
        "Priority support",
      ],
      buttonText: "Contact Us",
      popular: false,
    },
  ];
  return (
    <section id="pricing" className="py-10 lg:py-15">
      <Container>
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Simple Pricing
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
            Choose the plan that fits your laundry business.
          </h2>

          <p className="mt-4 text-lg leading-8 text-[var(--color-text-secondary)]">
            Start with what you need today and scale as your laundry operation
            grows.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[var(--radius-lg)] border bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] ${
                plan.popular
                  ? "border-[var(--color-primary)] shadow-[var(--shadow-md)]"
                  : "border-[var(--color-border)]"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold text-[var(--color-text)]">
                {plan.name}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--color-text-secondary)]">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-text)]">
                  {plan.price}
                </span>

                {plan.period && (
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]"
                  >
                    <span className="mt-0.5 text-[var(--color-primary)]">
                      ✓
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  className="w-full"
                  variant={plan.popular ? "solid" : "outline"}
                  onClick={() => {
                    if (plan.name === "Enterprise") {
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      navigate(ROUTES.CREATE_ACCOUNT, {
                        state: { plan: plan.name.toLowerCase() },
                      });
                    }
                  }}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Pricing;
