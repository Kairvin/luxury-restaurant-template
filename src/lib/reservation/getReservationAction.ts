import type {
  ReservationConfig,
} from "@/types/reservation";

type ReservationAction = {
  href: string;
  external: boolean;
};

export function getReservationAction(
  config: ReservationConfig
): ReservationAction {
  switch (config.mode) {
    case "internal":
      return {
        href: config.route,
        external: false,
      };

    case "external":
      return {
        href: config.url,
        external: true,
      };

    case "phone":
      return {
        href: `tel:${config.phone}`,
        external: true,
      };

    case "whatsapp": {
      const cleanPhone =
        config.phone.replace(/[^\d]/g, "");

      const message =
        config.message
          ? `?text=${encodeURIComponent(
              config.message
            )}`
          : "";

      return {
        href:
          `https://wa.me/${cleanPhone}${message}`,
        external: true,
      };
    }
  }
}
