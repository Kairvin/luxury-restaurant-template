export type ReservationProvider =
  | "opentable"
  | "resy"
  | "sevenrooms"
  | "thefork"
  | "quandoo"
  | "other";

export type ReservationConfig =
  | {
      mode: "internal";
      route: "/reservation";
    }
  | {
      mode: "external";
      provider: ReservationProvider;
      url: string;
    }
  | {
      mode: "phone";
      phone: string;
    }
  | {
      mode: "whatsapp";
      phone: string;
      message?: string;
    };