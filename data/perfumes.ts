export interface Perfume {
  id: number;
  name: string;
  price: string;
  bg: string;
  tag: string;
  desc: string;
  review: string;
  productType: string;
  image: string;
}

export const perfumes: Perfume[] = [
  {
    id: 1,
    name: "Persian Oud - Collection Privée",
    price: "4,500 DA", // Assuming a price for Algerian market. Real price can be updated later. Let's stick with 6,800 DA or something premium
    bg: "#110b05", // Deep brown/black base for premium oud feel
    tag: "Ombre Nomade DNA",
    desc: "A luxurious oriental woody fragrance taking you to the heart of the desert. A noble blend of fine Oud, soft Incense, amber touches, and rose.",
    review: '"عطر حضور وهيبة. قوي، راقٍ ومتوازن." — تقييم عميل',
    productType: "perfume",
    image: "/products/persian_oud.png",
  }
];
