import { siteSchema } from "./siteSchemas";

type SiteInput = {
  restaurant: unknown;

  theme: unknown;

  features: unknown;

  reservation: unknown;

  homepage: unknown;

  menu: unknown;

  gallery: unknown;

  seo: unknown;
};

export function validateSite(
  input: SiteInput
) {
  const result =
    siteSchema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  const errors = result.error.issues
    .map((issue) => {
      const path =
        issue.path.length > 0
          ? issue.path.join(".")
          : "site";

      return `• ${path}: ${issue.message}`;
    })
    .join("\n");

  throw new Error(
    [
      "",
      "❌ Invalid restaurant template configuration",
      "",
      errors,
      "",
      "Fix the fields above inside src/site/",
      "",
    ].join("\n")
  );
}