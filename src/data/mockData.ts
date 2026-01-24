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

export type Category = {
  id: string;
  title: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "1",
    title: "Krem Bot",
    price: "1500",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"],
    badge: "MODA",
    tags: ["Deri", "Kadın"],
    description: "Şık ve rahat krem rengi botlar.",
    category: "Moda",
    condition: "Yeni Like",
    priceMin: "1200",
    priceMax: "1800",
    address: "Üsküdar, İstanbul",
  },
  {
    id: "2",
    title: "Yün Kazak",
    price: "600",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"],
    tags: ["Yün", "Sıcak"],
    description: "Sıcak tutan yün kazak.",
    category: "Moda",
    condition: "İyi",
    priceMin: "400",
    priceMax: "800",
    address: "Kadıköy, İstanbul",
  },
  {
    id: "4",
    title: "Bebek Arabası",
    price: "4500",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1594132220612-d469ef4bc852?auto=format&fit=crop&w=800&q=80",
    badge: "BEBEK",
    tags: ["Pratik", "Güvenli"],
    description: "Az kullanılmış bebek arabası.",
    category: "Bebek",
    condition: "Yeni gibi",
    priceMin: "3500",
    priceMax: "5500",
    address: "Ataşehir, İstanbul",
  },
  {
    id: "5",
    title: "Bebek Mama Sandalyesi",
    price: "1200",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    tags: ["Mama", "Bebek"],
    description: "Emniyet kemerli mama sandalyesi.",
    category: "Bebek",
    condition: "Yeni",
    priceMin: "1000",
    priceMax: "1500",
    address: "Çekmeköy, İstanbul",
  },
  {
    id: "6",
    title: "Macbook Pro M1",
    price: "28000",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1517336714460-4c50d91703cf?auto=format&fit=crop&w=800&q=80",
    badge: "ELEKTRONİK",
    tags: ["Hızlı", "Hatasız"],
    description: "8GB RAM 256GB SSD Macbook Pro.",
    category: "Elektronik",
    condition: "Yeni gibi",
    priceMin: "25000",
    priceMax: "32000",
    address: "Şişli, İstanbul",
  },
  {
    id: "7",
    title: "Sony WH-1000XM4",
    price: "7500",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    tags: ["ANC", "Müzik"],
    description: "Gürültü engelleyici kulaklık.",
    category: "Elektronik",
    condition: "Sıfır",
    priceMin: "6500",
    priceMax: "8500",
    address: "Maltepe, İstanbul",
  },
  {
    id: "8",
    title: "Modern Koltuk Takımı",
    price: "15000",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    badge: "EV",
    tags: ["Şık", "Yeni"],
    description: "Lüks oturma grubu.",
    category: "Ev & Yaşam",
    condition: "Sıfır",
    priceMin: "12000",
    priceMax: "20000",
    address: "Kartal, İstanbul",
  },
  {
    id: "9",
    title: "Mutfak Robotu",
    price: "2500",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1527633215648-5c42e970b47a?auto=format&fit=crop&w=800&q=80",
    tags: ["Mutfak", "Hızlı"],
    description: "1000W güçlü mutfak şefi.",
    category: "Ev & Yaşam",
    condition: "Az kullanılmış",
    priceMin: "2000",
    priceMax: "3000",
    address: "Beylikdüzü, İstanbul",
  },
  {
    id: "10",
    title: "Yoga Matı",
    price: "400",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1500021804447-2ca2eaaaabeb?auto=format&fit=crop&w=800&q=80",
    badge: "SPOR",
    tags: ["Kaymaz", "TPE"],
    description: "6mm kalınlığında profesyonel yoga matı.",
    category: "Spor",
    condition: "Yeni",
    priceMin: "300",
    priceMax: "500",
    address: "Bakırköy, İstanbul",
  },
  {
    id: "11",
    title: "Nike Koşu Ayakkabısı",
    price: "2200",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    tags: ["Koşu", "Nike"],
    description: "Hafif ve konforlu koşu ayakkabısı.",
    category: "Spor",
    condition: "Sıfır",
    priceMin: "1800",
    priceMax: "2500",
    address: "Sarıyer, İstanbul",
  },
  {
    id: "12",
    title: "Harry Potter Seti",
    price: "1200",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
    badge: "KİTAP",
    tags: ["Set", "Klasik"],
    description: "Ciltli 7 kitaplık tam set.",
    category: "Kitap",
    condition: "Yeni gibi",
    priceMin: "1000",
    priceMax: "1500",
    address: "Beyoğlu, İstanbul",
  },
  {
    id: "13",
    title: "İnsan Geleceğini Nasıl Kurar",
    price: "150",
    currency: "₺",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    tags: ["Kişisel", "Gelişim"],
    description: "İlber Ortaylı'dan hayat dersleri.",
    category: "Kitap",
    condition: "Yeni",
    priceMin: "100",
    priceMax: "200",
    address: "Ümraniye, İstanbul",
  },
];

export const categories: Category[] = [
  {
    id: "cat1",
    title: "Bebek",
    image:
      "https://plus.unsplash.com/premium_photo-1676031861141-fd1b9a2b812e?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "cat2",
    title: "Elektronik",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cat3",
    title: "Ev & Yaşam",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cat4",
    title: "Moda",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cat5",
    title: "Spor",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cat6",
    title: "Kitap",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80",
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
