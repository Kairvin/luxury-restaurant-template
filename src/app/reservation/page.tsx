import Link from "next/link";

import {
  restaurant,
} from "@/site";

import {
  Container,
} from "@/components/ui/Container";

export default function ReservationPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <Container className="grid min-h-svh items-center gap-16 pb-24 pt-32 lg:grid-cols-2">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.25em] text-primary">
            Reservations
          </p>

          <h1 className="mt-6 font-display text-[clamp(4.5rem,9vw,9rem)] leading-[0.78] tracking-[-0.06em]">
            Reserve
            <br />
            your table.
          </h1>

          <p className="mt-8 max-w-md font-body text-sm leading-7 text-muted">
            Reservation functionality will be connected during the reservation phase.
          </p>
        </div>

        <div className="border border-border p-7 md:p-10">
          <p className="font-display text-3xl">
            {restaurant.identity.name}
          </p>

          <div className="mt-10 space-y-5 font-body text-sm text-muted">
            <div className="border-b border-border pb-4">
              Guests
            </div>

            <div className="border-b border-border pb-4">
              Date
            </div>

            <div className="border-b border-border pb-4">
              Time
            </div>
          </div>

          <button
            type="button"
            className="mt-10 w-full bg-foreground px-6 py-5 font-body text-[10px] uppercase tracking-[0.2em] text-background"
          >
            Find a Table
          </button>
        </div>

        <Link
          href="/"
          className="font-body text-xs uppercase tracking-[0.18em] lg:col-span-2"
        >
          ← Back Home
        </Link>
      </Container>
    </main>
  );
}
