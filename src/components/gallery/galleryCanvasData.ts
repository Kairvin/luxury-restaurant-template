export type CanvasPosition = {
  x: number;
  y: number;
  width: string;
  depth: number;
};

export type CanvasImageItem =
  CanvasPosition & {
    kind: "image";
    id: string;
    src: string;
    alt: string;
    label: string;
    meta: string;
    aspectRatio: string;
    objectPosition?: string;
  };

export type CanvasNoteItem =
  Omit<CanvasPosition, "width"> & {
    kind: "note";
    id: string;
    text: string;
    meta: string;
    maxWidth: string;
  };

export type CanvasItem =
  | CanvasImageItem
  | CanvasNoteItem;

export const galleryCanvasItems: CanvasItem[] = [
  {
    kind: "image",
    id: "opening-table",
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=88",
    alt: "A composed dining table with a plated course",
    label: "Before the room fills",
    meta: "18:40 · Dining room",
    x: 5,
    y: 9,
    width: "clamp(280px, 32vw, 520px)",
    aspectRatio: "4 / 5",
    depth: 0.025,
    objectPosition: "50% 52%",
  },
  {
    kind: "image",
    id: "room-study",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=88",
    alt: "Atmospheric restaurant dining room",
    label: "Room study No. 02",
    meta: "Light · Oak · Linen",
    x: 34,
    y: 5,
    width: "clamp(260px, 24vw, 440px)",
    aspectRatio: "4 / 3",
    depth: 0.065,
  },
  {
    kind: "note",
    id: "note-candles",
    text: "The room changes once the candles are lit.",
    meta: "Service note · 01",
    x: 27,
    y: 39,
    maxWidth: "330px",
    depth: 0.11,
  },
  {
    kind: "image",
    id: "chef-pass",
    src: "https://images.unsplash.com/photo-1761095596765-c8abe01d3aea?auto=format&fit=crop&w=1800&q=84",
    alt: "Chef plating a course in the restaurant kitchen",
    label: "At the pass",
    meta: "Course five · 21:10",
    x: 57,
    y: 12,
    width: "clamp(230px, 19vw, 360px)",
    aspectRatio: "3 / 4",
    depth: 0.12,
    objectPosition: "50% 48%",
  },
  {
    kind: "image",
    id: "mezcal-study",
    src: "https://images.unsplash.com/photo-1705940636970-ebd5623ece1a?auto=format&fit=crop&w=1800&q=86",
    alt: "A clear mezcal cocktail on the bar",
    label: "Sotol, clarified",
    meta: "Bar note · 07",
    x: 78,
    y: 6,
    width: "clamp(250px, 27vw, 480px)",
    aspectRatio: "16 / 11",
    depth: 0.04,
  },
  {
    kind: "image",
    id: "seasonal-table",
    src: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1800&q=88",
    alt: "A table of seasonal dishes and fruit",
    label: "Market morning",
    meta: "Produce · Late summer",
    x: 9,
    y: 61,
    width: "clamp(250px, 24vw, 430px)",
    aspectRatio: "4 / 3",
    depth: 0.09,
  },
  {
    kind: "note",
    id: "note-fire",
    text: "Fire first. Garnish last.",
    meta: "Kitchen rule · 03",
    x: 39,
    y: 65,
    maxWidth: "300px",
    depth: 0.15,
  },
  {
    kind: "image",
    id: "plate-study",
    src: "https://images.unsplash.com/photo-1750943082012-efe6d2fd9e45?auto=format&fit=crop&w=1800&q=84",
    alt: "Chef presenting a carefully plated restaurant dish",
    label: "A final adjustment",
    meta: "Pass study · 04",
    x: 48,
    y: 49,
    width: "clamp(280px, 30vw, 520px)",
    aspectRatio: "3 / 2",
    depth: 0.035,
  },
  {
    kind: "image",
    id: "gin-sour",
    src: "https://images.unsplash.com/photo-1531002423613-b7d0e005770b?auto=format&fit=crop&w=1600&q=86",
    alt: "Cocktail shaker and gin sour at the bar",
    label: "After dinner",
    meta: "Bar · 23:35",
    x: 83,
    y: 53,
    width: "clamp(220px, 18vw, 340px)",
    aspectRatio: "4 / 5",
    depth: 0.13,
  },
  {
    kind: "image",
    id: "late-room",
    src: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1800&q=88",
    alt: "An intimate restaurant interior after service",
    label: "The last table",
    meta: "00:12 · Saturday",
    x: 20,
    y: 82,
    width: "clamp(270px, 28vw, 500px)",
    aspectRatio: "16 / 10",
    depth: 0.055,
  },
  {
    kind: "note",
    id: "note-season",
    text: "Everything arrives in its own season.",
    meta: "House philosophy",
    x: 69,
    y: 84,
    maxWidth: "360px",
    depth: 0.1,
  },
];
