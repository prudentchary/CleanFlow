import Container from "@/components/ui/Container";

const companies = [
  {
    
    name: "Laundry Co.",
  },
  {
    name: "FreshCare",
  },
  {
    name: "CleanWear",
  },
  {
    name: "WashPro",
  },
  {
    name: "FreshPress",
  },
];

const TrustedBy = () => {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-12">
      <Container>
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Designed for modern laundry businesses
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {companies.map((company) => (
              <div
                key={company.name}
                className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-sm)]"
              >
                {/* Empty logo placeholder */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Logo
                  </span>
                </div>

                <p className="mt-4 text-sm font-semibold text-[var(--color-text)]">
                  {company.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TrustedBy;