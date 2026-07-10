import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../components/ThemedText";
import type { Product } from "@api/types";
import { formatPrice } from "../utils/format";
import { useListingStore } from "../store/listingStore";
import { useTheme } from "../hooks/useTheme";

type ListingNavigation = {
  navigate: (screen: string, params?: Record<string, string>) => void;
};

type ListingScreenProps = {
  navigation: ListingNavigation;
};

type QuickAction = {
  id: string;
  label: string;
  icon: string;
  tone: "trade" | "buy" | "check" | "meet";
};

type CategoryShortcut = {
  id: string;
  label: string;
  icon: string;
};

type CommunityCard = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: string;
};

type NearbyItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

const quickActions: QuickAction[] = [
  { id: "trade", label: "Trade", icon: "swap-horizontal", tone: "trade" },
  { id: "buy", label: "Buy", icon: "cash-multiple", tone: "buy" },
  { id: "check", label: "Check In", icon: "check-decagram-outline", tone: "check" },
  { id: "meet", label: "Meet", icon: "map-marker-radius-outline", tone: "meet" },
];

const categoryShortcuts: CategoryShortcut[] = [
  { id: "furniture", label: "Furniture", icon: "sofa-outline" },
  { id: "decor", label: "Decor", icon: "lamp-outline" },
  { id: "fashion", label: "Fashion", icon: "hanger" },
  { id: "books", label: "Books", icon: "book-open-page-variant-outline" },
];

const buildCommunityCards = (items: Product[]): CommunityCard[] =>
  items.map((item) => ({
    id: item.id,
    title: item.category ?? item.title,
    subtitle: item.address ?? "Topluluk önerisi",
    image: item.image,
    price: formatPrice(item),
  }));

const buildNearbyItems = (items: Product[]): NearbyItem[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.address ?? "Yakın çevrende",
    image: item.image,
  }));

const getQuickActionToneStyle = (tone: QuickAction["tone"]): ViewStyle => {
  switch (tone) {
    case "trade":
      return styles.quickActionTrade;
    case "buy":
      return styles.quickActionBuy;
    case "check":
      return styles.quickActionCheck;
    case "meet":
      return styles.quickActionMeet;
  }
};

const ListingScreen = ({ navigation }: ListingScreenProps) => {
  const { colors } = useTheme();
  const listings = useListingStore((s) => s.listings);
  const loading = useListingStore((s) => s.loading);
  const fetchListings = useListingStore((s) => s.fetchListings);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const featuredProduct = listings[0];
  const smallCards = listings.slice(1, 3);
  const communityCards = useMemo(
    () => buildCommunityCards(listings.slice(0, 2)),
    [listings]
  );
  const nearbyItems = useMemo(() => buildNearbyItems(listings), [listings]);

  const goToDetail = (productId: string) => {
    navigation.navigate("ProductDetail", { productId });
  };

  if (loading && listings.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (!featuredProduct) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>Henüz gösterilecek ilan yok.</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Icon name="map-marker" size={14} color="#d46b58" />
              <ThemedText style={styles.brandText}>Relove</ThemedText>
            </View>
            <ThemedText style={styles.locationText}>Üsküdar, İstanbul</ThemedText>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity activeOpacity={0.85} style={styles.headerIconButton}>
              <Icon name="shopping-outline" size={18} color="#2d241f" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
              }}
              style={styles.avatar}
            />
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.searchBar}>
          <Icon name="magnify" size={18} color="#867c73" />
          <ThemedText style={styles.searchPlaceholder}>
            Search for clothes, decor...
          </ThemedText>
          <View style={styles.searchFilter}>
            <Icon name="tune-variant" size={16} color="#53463f" />
          </View>
        </TouchableOpacity>

        <View style={styles.quickActionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              activeOpacity={0.9}
              style={styles.quickActionItem}
            >
              <View
                style={[styles.quickActionIcon, getQuickActionToneStyle(action.tone)]}
              >
                <Icon name={action.icon} size={18} color="#46352c" />
              </View>
              <ThemedText style={styles.quickActionLabel}>{action.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shortcutRow}
        >
          {categoryShortcuts.map((shortcut) => (
            <TouchableOpacity
              key={shortcut.id}
              activeOpacity={0.9}
              style={styles.shortcutChip}
            >
              <Icon name={shortcut.icon} size={16} color="#2457ff" />
              <ThemedText style={styles.shortcutLabel}>{shortcut.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionHeader
          title="Smart Feed"
          actionLabel="See all"
          onPress={() => navigation.navigate("AllListings")}
        />

        <TouchableOpacity
          activeOpacity={0.92}
          style={styles.featuredCard}
          onPress={() => goToDetail(featuredProduct.id)}
        >
          <Image source={{ uri: featuredProduct.image }} style={styles.featuredImage} />
          <View style={styles.featuredBody}>
            <ThemedText style={styles.featuredTitle}>{featuredProduct.title}</ThemedText>
            <ThemedText style={styles.featuredSubtitle}>
              {featuredProduct.description}
            </ThemedText>
            <View style={styles.featuredFooter}>
              <ThemedText style={styles.featuredPrice}>
                {formatPrice(featuredProduct)}
              </ThemedText>
              <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton}>
                <ThemedText style={styles.primaryButtonText}>Add</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.smallCardRow}>
          {smallCards.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.92}
              style={styles.smallCard}
              onPress={() => goToDetail(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.smallCardImage} />
              <View style={styles.smallCardContent}>
                <ThemedText numberOfLines={1} style={styles.smallCardTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.smallCardPrice}>
                  {formatPrice(item)}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Community Gigs" actionLabel="See all" />

        <View style={styles.communityRow}>
          {communityCards.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.92}
              style={styles.communityCard}
              onPress={() => goToDetail(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.communityImage} />
              <ThemedText style={styles.communityPrice}>{item.price}</ThemedText>
              <ThemedText style={styles.communityTitle}>{item.title}</ThemedText>
              <ThemedText numberOfLines={1} style={styles.communitySubtitle}>
                {item.subtitle}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.communityBanner}>
          <ThemedText style={styles.communityBannerTitle}>
            Join the Community!
          </ThemedText>
          <ThemedText style={styles.communityBannerText}>
            Connect with people in your neighborhood and swap what you no longer
            use.
          </ThemedText>
          <TouchableOpacity activeOpacity={0.9} style={styles.bannerButton}>
            <ThemedText style={styles.bannerButtonText}>Start Swapping</ThemedText>
          </TouchableOpacity>
        </View>

        <SectionHeader title="Nearby You" />

        <View style={styles.nearbyList}>
          {nearbyItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={styles.nearbyItem}
              onPress={() => goToDetail(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.nearbyImage} />
              <View style={styles.nearbyContent}>
                <ThemedText numberOfLines={1} style={styles.nearbyTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText numberOfLines={1} style={styles.nearbySubtitle}>
                  {item.subtitle}
                </ThemedText>
              </View>
              <Icon name="chevron-right" size={20} color="#8f8378" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
};

const SectionHeader = ({ title, actionLabel, onPress }: SectionHeaderProps) => (
  <View style={styles.sectionHeader}>
    <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    {actionLabel ? (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <ThemedText style={styles.sectionAction}>{actionLabel}</ThemedText>
      </TouchableOpacity>
    ) : null}
  </View>
);

export default ListingScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fcf5ef",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fcf5ef",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#53463f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  brandText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e241f",
  },
  locationText: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.7,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff2e4",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ff6c57",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  searchBar: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#fffaf5",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#e0c3a7",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#8a7e74",
  },
  searchFilter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f5e8dc",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  quickActionItem: {
    alignItems: "center",
    width: "23%",
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  quickActionTrade: {
    backgroundColor: "#f7b6a9",
  },
  quickActionBuy: {
    backgroundColor: "#c8d7ff",
  },
  quickActionCheck: {
    backgroundColor: "#f9d2a8",
  },
  quickActionMeet: {
    backgroundColor: "#d5c4ff",
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6d5f56",
  },
  shortcutRow: {
    paddingBottom: 18,
    gap: 10,
  },
  shortcutChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef3ff",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  shortcutLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2457ff",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2f2520",
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4674ff",
  },
  featuredCard: {
    backgroundColor: "#fffdf9",
    borderRadius: 22,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#d3b299",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  featuredImage: {
    width: "100%",
    height: 132,
    borderRadius: 18,
    marginBottom: 10,
  },
  featuredBody: {
    gap: 6,
  },
  featuredTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2f2520",
  },
  featuredSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: "#7d6f65",
  },
  featuredFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  featuredPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2f2520",
  },
  primaryButton: {
    backgroundColor: "#2457ff",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  smallCardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "#fffdf9",
    borderRadius: 18,
    padding: 8,
    shadowColor: "#dcc0a6",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  smallCardImage: {
    width: "100%",
    height: 94,
    borderRadius: 14,
    marginBottom: 8,
  },
  smallCardContent: {
    gap: 2,
  },
  smallCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#342923",
  },
  smallCardPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2457ff",
  },
  communityRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },
  communityCard: {
    flex: 1,
    backgroundColor: "#fffdf9",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#dcc0a6",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  communityImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
    marginBottom: 10,
  },
  communityPrice: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2f2520",
    marginBottom: 4,
  },
  communityTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2f2520",
  },
  communitySubtitle: {
    fontSize: 11,
    color: "#8b7e73",
    marginTop: 2,
  },
  communityBanner: {
    backgroundColor: "#f6d9cf",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  communityBannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#37261f",
    marginBottom: 6,
  },
  communityBannerText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6d584e",
    marginBottom: 14,
  },
  bannerButton: {
    alignSelf: "flex-start",
    backgroundColor: "#3b2419",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bannerButtonText: {
    color: "#fff8f2",
    fontSize: 12,
    fontWeight: "700",
  },
  nearbyList: {
    gap: 10,
  },
  nearbyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffdf9",
    borderRadius: 18,
    padding: 10,
    shadowColor: "#dcc0a6",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  nearbyImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
  },
  nearbyContent: {
    flex: 1,
    gap: 2,
  },
  nearbyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#342923",
  },
  nearbySubtitle: {
    fontSize: 12,
    color: "#8b7e73",
  },
});
