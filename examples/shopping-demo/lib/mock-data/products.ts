export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium audio quality.",
    price: 299.99,
    category: "Electronics",
    image: "/products/headphones.jpg",
    rating: 4.8,
    reviews: 2547,
    inStock: true,
    tags: ["bestseller", "electronics", "audio"],
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    description:
      "Adjustable lumbar support, breathable mesh back, and memory foam seat cushion for all-day comfort.",
    price: 449.0,
    category: "Furniture",
    image: "/products/chair.jpg",
    rating: 4.6,
    reviews: 1823,
    inStock: true,
    tags: ["furniture", "office", "ergonomic"],
  },
  {
    id: "3",
    name: "Smart Watch Pro",
    description:
      "Advanced health tracking, GPS, and 7-day battery life. Water resistant to 50m.",
    price: 399.99,
    category: "Electronics",
    image: "/products/watch.jpg",
    rating: 4.7,
    reviews: 3156,
    inStock: true,
    tags: ["bestseller", "electronics", "wearable"],
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    description:
      "Hot-swappable switches, RGB backlighting, and programmable macros for gaming and productivity.",
    price: 149.99,
    category: "Electronics",
    image: "/products/keyboard.jpg",
    rating: 4.5,
    reviews: 892,
    inStock: true,
    tags: ["electronics", "gaming", "productivity"],
  },
  {
    id: "5",
    name: "Standing Desk Converter",
    description:
      "Transform any desk into a standing desk. Smooth height adjustment and spacious work surface.",
    price: 279.0,
    category: "Furniture",
    image: "/products/standing-desk.jpg",
    rating: 4.4,
    reviews: 567,
    inStock: true,
    tags: ["furniture", "office", "ergonomic"],
  },
  {
    id: "6",
    name: "4K Webcam",
    description:
      "Ultra HD video quality with auto-focus, low-light correction, and built-in microphone.",
    price: 179.99,
    category: "Electronics",
    image: "/products/webcam.jpg",
    rating: 4.6,
    reviews: 1245,
    inStock: false,
    tags: ["electronics", "work from home"],
  },
  {
    id: "7",
    name: "Wireless Charging Pad",
    description:
      "Fast 15W charging for all Qi-enabled devices. Sleek minimalist design.",
    price: 49.99,
    category: "Accessories",
    image: "/products/charger.jpg",
    rating: 4.3,
    reviews: 2103,
    inStock: true,
    tags: ["accessories", "electronics"],
  },
  {
    id: "8",
    name: "Laptop Backpack",
    description:
      'Water-resistant material, fits 15.6" laptops, with USB charging port and anti-theft pocket.',
    price: 79.99,
    category: "Accessories",
    image: "/products/backpack.jpg",
    rating: 4.7,
    reviews: 3421,
    inStock: true,
    tags: ["bestseller", "accessories", "travel"],
  },
];

export const categories = ["All", "Electronics", "Furniture", "Accessories"];

export const coupons: Record<
  string,
  { discount: number; type: "percent" | "fixed"; minPurchase?: number }
> = {
  SAVE10: { discount: 10, type: "percent" },
  SAVE20: { discount: 20, type: "percent", minPurchase: 100 },
  FLAT50: { discount: 50, type: "fixed", minPurchase: 200 },
  WELCOME15: { discount: 15, type: "percent" },
};
