import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

// ── Root Stack param list ────────────────────────────────────────────
export type RootStackParamList = {
  Intro: undefined;
  Auth: undefined;
  Home: undefined;
  ProductDetail: { productId: string };
  Chat: { threadId: string };
  CreateListingModal: undefined;
  AllListings: undefined;
  Settings: undefined;
};

// ── Bottom Tab param list ────────────────────────────────────────────
export type TabParamList = {
  Listele: undefined;
  Favoriler: undefined;
  "İlan Ekle": undefined;
  "Geçmiş Sohbetler": undefined;
  Profil: undefined;
};

// ── Navigation prop aliases ──────────────────────────────────────────
export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
export type TabNavigation = BottomTabNavigationProp<TabParamList>;

// ── Screen prop bundles ──────────────────────────────────────────────
export type ProductDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ProductDetail"
>;

export type ChatScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Chat"
>;

