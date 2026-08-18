export type MenuPrice =
  | {
      type: "money";
      amount: number;
      currency?: string;
    }
  | {
      type: "label";
      label: string;
    };

export type MenuVariant = {
  label: string;
  price: MenuPrice;
};

export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "contains-nuts"
  | "spicy";

export type MenuItem = {
  name: string;

  description?: string;

  price?: MenuPrice;

  variants?: MenuVariant[];

  dietary?: DietaryTag[];

  featured?: boolean;
};

export type MenuCategory = {
  id: string;

  title: string;
  description?: string;

  items: MenuItem[];
};

export type RestaurantMenu = {
  id: string;

  title: string;
  subtitle?: string;

  categories: MenuCategory[];
};

export type MenuContent = {
  menus: RestaurantMenu[];
};