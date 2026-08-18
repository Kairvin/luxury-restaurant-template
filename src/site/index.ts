import {
  restaurant as rawRestaurant,
} from "./config/restaurant";

import {
  theme as rawTheme,
} from "./config/theme";

import {
  features as rawFeatures,
} from "./config/features";

import {
  reservation as rawReservation,
} from "./config/reservation";

import {
  homepage as rawHomepage,
} from "./content/homepage";

import {
  menu as rawMenu,
} from "./content/menu";

import {
  gallery as rawGallery,
} from "./content/gallery";

import {
  seo as rawSeo,
} from "./content/seo";

import { validateSite } from "@/lib/validation/validateSite";

const site = validateSite({
  restaurant: rawRestaurant,

  theme: rawTheme,

  features: rawFeatures,

  reservation: rawReservation,

  homepage: rawHomepage,

  menu: rawMenu,

  gallery: rawGallery,

  seo: rawSeo,
});

export const restaurant =
  site.restaurant;

export const theme =
  site.theme;

export const features =
  site.features;

export const reservation =
  site.reservation;

export const homepage =
  site.homepage;

export const menu =
  site.menu;

export const gallery =
  site.gallery;

export const seo =
  site.seo;

export default site;
export { navigation } from "./config/navigation";
