import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

const Section = ({ children, className = "" }: SectionProps) => {
  return (
    <section className={`py-24 ${className}`}>
      {children}
    </section>
  );
};

export default Section;