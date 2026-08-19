import Container from "@/components/ui/Container";
import { Button } from "../ui";

const Contact = () => {
  return (
    <section id="contact" className="py-16 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left side */}
          <div className="max-w-xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
              Contact Us
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
              Let's talk about your laundry business.
            </h2>

            <p className="mt-4 text-lg leading-8 text-[var(--color-text-secondary)]">
              Have questions about CleanFlow or want to learn how it can help
              your business? We'd love to hear from you.
            </p>
            <div className="mt-8 space-y-5">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  Email
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  hello@cleanflow.com
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  Phone
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  +234 XXX XXX XXXX
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  Availability
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Monday – Friday, 9:00 AM – 5:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div>
            
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-text)]">
                Send us a message
              </h3>

              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Fill out the form and we'll get back to you.
              </p>

              <form className="mt-6 space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[var(--color-text)]"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="mt-2 h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--color-text)]"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="mt-2 h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[var(--color-text)]"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    placeholder="What would you like to discuss?"
                    className="mt-2 h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[var(--color-text)]"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="mt-2 w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Contact;
