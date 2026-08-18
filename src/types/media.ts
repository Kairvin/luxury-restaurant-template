export type FocalPoint = {
  x: number;
  y: number;
};

export type MediaCredit = {
  name: string;
  url?: string;
};

export type MediaAsset = {
  src: string;
  alt: string;

  width: number;
  height: number;

  focalPoint?: FocalPoint;

  priority?: boolean;

  credit?: MediaCredit;
};