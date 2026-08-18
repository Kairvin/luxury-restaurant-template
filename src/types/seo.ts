export type PageSEO = {
  title: string;
  description: string;

  image?: string;

  noIndex?: boolean;
};

export type SEOContent = {
  home: PageSEO;
  menu: PageSEO;
  gallery: PageSEO;
  reservation: PageSEO;
};