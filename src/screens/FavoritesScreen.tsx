import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../components/ThemedText";
import type { Product } from "@api/types";
import { useListingStore } from "../store/listingStore";
import { useFavoriteStore } from "../store/favoriteStore";
import { useAuthStore } from "../store/authStore";
import { formatPrice } from "../utils/format";

type FavoritesNavigation = {
  navigate: (screen: string, params?: Record<string, string>) => void;
};

type FavoritesScreenProps = {
  navigation: FavoritesNavigation;
};

type CategoryFilter = {
  id: string;
  label: string;
};

type FavoriteListing = {
  id: string;
  title: string;
  priceLabel: string;
  conditionLabel: string;
  distanceLabel: string;
  ratingLabel: string;
  tag: string;
  image: string;
  accentTone: "sell" | "swap" | "donate";
};

const categoryFilters: CategoryFilter[] = [
  { id: "all", label: "All" },
  { id: "Moda", label: "Moda" },
  { id: "sell", label: "Sell" },
  { id: "swap", label: "Swap" },
  { id: "donate", label: "Donate" },
];

const buildFavoriteListings = (items: Product[]): FavoriteListing[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    priceLabel: item.listingType === "donate" ? "FREE" : formatPrice(item),
    conditionLabel: item.condition ?? "Good condition",
    distanceLabel: item.distance ?? "—",
    ratingLabel: (item.rating ?? 4.5).toFixed(1),
    tag:
      item.listingType === "sell"
        ? "Sell"
        : item.listingType === "swap"
        ? "Swap"
        : "Donate",
    image: item.image,
    accentTone: item.listingType ?? "sell",
  }));

const getTagStyle = (tone: FavoriteListing["accentTone"]) => {
  switch (tone) {
    case "sell":
      return styles.sellTag;
    case "swap":
      return styles.swapTag;
    case "donate":
      return styles.donateTag;
  }
};

const FavoritesScreen = ({ navigation }: FavoritesScreenProps) => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter["id"]>("all");
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false);

  const favoriteIds = useFavoriteStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const syncFromServer = useFavoriteStore((state) => state.syncFromServer);

  const listings = useListingStore((s) => s.listings);
  const fetchListings = useListingStore((s) => s.fetchListings);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    fetchListings();
    syncFromServer();
  }, [fetchListings, syncFromServer, isAuthenticated]);

  const favoriteListings = useMemo(() => buildFavoriteListings(listings), [listings]);
  const filteredListings = useMemo(() => {
    if (activeFilter === "all") {
      return favoriteListings;
    }

    // Filter by category using real product.category
    if (activeFilter === "Moda") {
      return favoriteListings.filter((item) => {
        const product = listings.find((p) => p.id === item.id);
        return product?.category === activeFilter;
      });
    }

    // Filter by listing type using real product.listingType
    return favoriteListings.filter((item) => item.accentTone === activeFilter);
  }, [activeFilter, favoriteListings, listings]);

  const favoritedItems = useMemo(
    () => favoriteListings.filter((item) => favoriteIds[item.id]),
    [favoriteListings, favoriteIds]
  );

  const favoriteCount = Object.keys(favoriteIds).length;

  const handleOpenDetail = (productId: string) => {
    navigation.navigate("ProductDetail", { productId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.9} style={styles.iconButton}>
            <Icon name="menu" size={18} color="#87685c" />
          </TouchableOpacity>
          <ThemedText style={styles.brandTitle}>Relove</ThemedText>
          <TouchableOpacity activeOpacity={0.9} style={styles.iconButton}>
            <Icon name="bell-outline" size={18} color="#87685c" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <TouchableOpacity activeOpacity={0.9} style={styles.searchField}>
            <Icon name="magnify" size={16} color="#a89083" />
            <ThemedText style={styles.searchPlaceholder}>
              Search for toys, clothes...
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} style={styles.filterButton}>
            <Icon name="tune-variant" size={16} color="#60483f" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {categoryFilters.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <TouchableOpacity
                key={filter.id}
                activeOpacity={0.9}
                onPress={() => setActiveFilter(filter.id)}
                style={[
                  styles.filterChip,
                  isActive ? styles.filterChipActive : styles.filterChipInactive,
                ]}
              >
                <ThemedText
                  style={[
                    styles.filterChipText,
                    isActive
                      ? styles.filterChipTextActive
                      : styles.filterChipTextInactive,
                  ]}
                >
                  {filter.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.92}
          style={styles.favoritesSummary}
          onPress={() => setIsFavoritesExpanded((prev) => !prev)}
        >
          <View style={styles.summaryIcon}>
            <Icon name="heart" size={16} color="#f29b86" />
          </View>
          <View style={styles.summaryContent}>
            <ThemedText style={styles.summaryTitle}>Your Favorites</ThemedText>
            <ThemedText style={styles.summarySubtitle}>
              {favoriteCount} items updated recently
            </ThemedText>
          </View>
          <Icon
            name={isFavoritesExpanded ? "chevron-up" : "chevron-down"}
            size={18}
            color="#70584d"
          />
        </TouchableOpacity>

        {isFavoritesExpanded && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.favoritesScrollContent}
          >
            {favoritedItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.92}
                style={styles.favoriteCard}
                onPress={() => handleOpenDetail(item.id)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.favoriteCardImage}
                />
                <View style={styles.favoriteCardBadge}>
                  <View
                    style={[styles.tagBadgeSmall, getTagStyle(item.accentTone)]}
                  >
                    <ThemedText style={styles.tagBadgeSmallText}>
                      {item.tag}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.favoriteCardBody}>
                  <ThemedText numberOfLines={1} style={styles.favoriteCardTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.favoriteCardPrice}>
                    {item.priceLabel}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>All Listings</ThemedText>
          <TouchableOpacity activeOpacity={0.9} style={styles.sortButton}>
            <ThemedText style={styles.sortButtonText}>Nearest First</ThemedText>
            <Icon name="swap-vertical" size={14} color="#7c6358" />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {filteredListings.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.92}
              style={styles.card}
              onPress={() => handleOpenDetail(item.id)}
            >
              <View style={styles.cardImageWrap}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardTopRow}>
                  <View style={[styles.tagBadge, getTagStyle(item.accentTone)]}>
                    <ThemedText style={styles.tagBadgeText}>{item.tag}</ThemedText>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.cardHeartButton}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <Icon
                      name={favoriteIds[item.id] ? "heart" : "heart-outline"}
                      size={14}
                      color={favoriteIds[item.id] ? "#f29b86" : "#725a50"}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardBody}>
                <ThemedText numberOfLines={2} style={styles.cardTitle}>
                  {item.title}
                </ThemedText>
                <View style={styles.cardMetaRow}>
                  <ThemedText style={styles.cardPrice}>{item.priceLabel}</ThemedText>
                  <ThemedText style={styles.cardCondition}>{item.conditionLabel}</ThemedText>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.metricRow}>
                    <Icon name="star" size={10} color="#f08d60" />
                    <ThemedText style={styles.metricText}>{item.ratingLabel}</ThemedText>
                  </View>
                  <View style={styles.metricRow}>
                    <Icon name="map-marker" size={10} color="#9c8377" />
                    <ThemedText style={styles.metricText}>{item.distanceLabel}</ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.loadMoreButton}>
          <ThemedText style={styles.loadMoreText}>Load More Listings</ThemedText>
          <Icon name="reload" size={14} color="#9e5a43" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf5f2ec",
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#b83d20",
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  searchField: {
    flex: 1,
    minHeight: 38,
    borderRadius: 19,
    backgroundColor: "#f0e3d7",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 12,
    color: "#aa9286",
  },
  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f0e3d7",
    alignItems: "center",
    justifyContent: "center",
  },
  filterList: {
    paddingBottom: 14,
    gap: 8,
  },
  filterChip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: "#2663f6",
  },
  filterChipInactive: {
    backgroundColor: "#f7eee8",
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  filterChipTextInactive: {
    color: "#3f2f28",
  },
  favoritesSummary: {
    backgroundColor: "#fff9f6",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#c8a994",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffe4dc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#322621",
    marginBottom: 2,
  },
  summarySubtitle: {
    fontSize: 11,
    color: "#9a857a",
  },
  favoritesScrollContent: {
    paddingLeft: 4,
    paddingRight: 8,
    paddingBottom: 16,
    gap: 10,
  },
  favoriteCard: {
    width: 130,
    backgroundColor: "#fff8f3",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#c9aa95",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  favoriteCardImage: {
    width: "100%",
    height: 90,
  },
  favoriteCardBadge: {
    position: "absolute",
    top: 6,
    left: 6,
  },
  tagBadgeSmall: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagBadgeSmallText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#63483f",
  },
  favoriteCardBody: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  favoriteCardTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2f241e",
    marginBottom: 4,
  },
  favoriteCardPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: "#8f3d1c",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2e231d",
  },
  sortButton: {
    borderRadius: 14,
    backgroundColor: "#f0e3d8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortButtonText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#7c6358",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  card: {
    width: "48.2%",
    backgroundColor: "#fff8f3",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#c9aa95",
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardImageWrap: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 126,
  },
  cardTopRow: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sellTag: {
    backgroundColor: "#fff1cf",
  },
  swapTag: {
    backgroundColor: "#e4e7ff",
  },
  donateTag: {
    backgroundColor: "#ffe7df",
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#63483f",
  },
  cardHeartButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255, 250, 246, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
    color: "#2f241e",
    minHeight: 34,
  },
  cardMetaRow: {
    marginTop: 6,
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#8f3d1c",
    marginBottom: 2,
  },
  cardCondition: {
    fontSize: 11,
    color: "#8d7c72",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 10,
    color: "#7c695f",
  },
  loadMoreButton: {
    marginTop: 18,
    alignSelf: "center",
    backgroundColor: "#f2d9cd",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  loadMoreText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9e5a43",
  },
});
