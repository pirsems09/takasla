export type Product = {
  id: string;
  title: string;
  price: string;
  currency: string;
  image: string;
  images?: string[];
  badge?: string;
  tags: string[];
  size?: string;
  heelHeight?: string;
  width?: string;
  description: string;
  category?: string;
  condition?: string;
  priceMin?: string;
  priceMax?: string;
  address?: string;
};

export type Thread = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  productId?: string;
};

export const products: Product[] = [
  {
    id: "1",
    title: "Krem Bot",
    price: "14",
    currency: "$",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    ],
    badge: "İLKBAHAR",
    tags: ["Hakiki Deri", "Kadın", "Sonbahar"],
    size: "39",
    heelHeight: "5.5 cm",
    width: "AA",
    description:
      "Sadece bir sezon giyilmiş, konforlu krem bot. Hafif bir burun çizgisi var, yumuşak astarlı.",
    category: "Moda",
    condition: "Az kullanılmış",
    priceMin: "1000",
    priceMax: "3000",
    address: "Üsküdar, İstanbul",
  },
  {
    id: "2",
    title: "Yün Kazak",
    price: "8",
    currency: "$",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Yün", "Unisex", "Sıcak"],
    description:
      "Oversize kesim yün kazak. Yumuşak dokulu, topaklanma yok. Sıfır yakalı.",
    category: "Moda",
    condition: "İyi",
    priceMin: "400",
    priceMax: "900",
    address: "Kadıköy, İstanbul",
  },
  {
    id: "3",
    title: "Trençkot",
    price: "10",
    currency: "$",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Mevsimlik", "Kadın", "Kahverengi"],
    description:
      "Klasik kahverengi trençkot. Orta kalınlıkta, suya dayanıklı kumaş.",
    category: "Moda",
    condition: "Yeni gibi",
    priceMin: "700",
    priceMax: "1500",
    address: "Beşiktaş, İstanbul",
  },
];

export type Message = {
  id: string;
  from: "me" | "seller";
  text: string;
  time: string;
  previewImage?: string;
  threadId: string;
};

export const threads: Thread[] = [
  {
    id: "thread-1",
    name: "Tessa Williams",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Tabii, kartla ödeyebilirsin. Yarın 10:00’da olur mu?",
    time: "15:29",
    productId: "1",
  },
  {
    id: "thread-2",
    name: "Marina White",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Kazak tertemiz, kargo yapabilirim.",
    time: "14:12",
    productId: "2",
  },
  {
    id: "thread-3",
    name: "Emma Brown",
    avatar:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Trençkot için yerinde teslim olur.",
    time: "09:30",
    productId: "3",
  },
];

export const messages: Message[] = [
  {
    id: "m1",
    from: "seller",
    text: "Merhaba! Botlar ilgini çekti mi?",
    time: "15:24",
    threadId: "thread-1",
  },
  {
    id: "m2",
    from: "me",
    text: "Evet, durumları nasıl?",
    time: "15:25",
    previewImage:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    threadId: "thread-1",
  },
  {
    id: "m3",
    from: "seller",
    text: "Çok temiz, sadece bir sezon giyildi. Yerinde teslim olur mu?",
    time: "15:27",
    threadId: "thread-1",
  },
  {
    id: "m4",
    from: "me",
    text: "Tamamdır, kartla ödeme yapabilir miyim?",
    time: "15:28",
    threadId: "thread-1",
  },
  {
    id: "m5",
    from: "seller",
    text: "Tabii, kartla ödeyebilirsin. Yarın 10:00’da müsait misin?",
    time: "15:29",
    threadId: "thread-1",
  },
  {
    id: "m6",
    from: "seller",
    text: "Kazak tertemiz, kargo yapabilirim.",
    time: "14:12",
    threadId: "thread-2",
  },
  {
    id: "m7",
    from: "me",
    text: "Olur, kargo ücreti dahil mi?",
    time: "14:14",
    threadId: "thread-2",
  },
  {
    id: "m8",
    from: "seller",
    text: "Trençkot için yerinde teslim olur.",
    time: "09:30",
    threadId: "thread-3",
  },
];
