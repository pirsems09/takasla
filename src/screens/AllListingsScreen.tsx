import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../components/ThemedText";
import { useListingStore } from "../store/listingStore";
import { useTheme } from "../hooks/useTheme";
import { useFavoriteStore } from "../store/favoriteStore";
import { parsePrice, formatPrice } from "../utils/format";
import type { RootNavigation } from "../navigation/types";

type SortKey = "recommend" | "priceAsc" | "priceDesc";

const sortOptions: { label: string; key: SortKey }[] = [
  { label: "Önerilen", key: "recommend" },
  { label: "Fiyat Artan", key: "priceAsc" },
  { label: "Fiyat Azalan", key: "priceDesc" },
];

const AllListingsScreen = ({ navigation }: { navigation: RootNavigation }) => {
  const { colors } = useTheme();
  const [sortKey, setSortKey] = useState<SortKey>("recommend");

  const listings = useListingStore((s) => s.listings);
  const loading = useListingStore((s) => s.loading);
  const fetchListings = useListingStore((s) => s.fetchListings);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const favoriteIds = useFavoriteStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  const sortedProducts = useMemo(() => {
    if (sortKey === "recommend") return listings;
    const sorted = [...listings].sort((a, b) => parsePrice(a) - parsePrice(b));
    return sortKey === "priceAsc" ? sorted : sorted.reverse();
  }, [sortKey, listings]);

  const goToDetail = (productId: string) =>
    navigation.navigate("ProductDetail", { productId });

  if (loading && listings.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!loading && listings.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingWrap}>
          <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
            Henüz ilan bulunmuyor.
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.filterRow}>
        {sortOptions.map((option) => {
          const active = sortKey === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterPill,
                { backgroundColor: active ? colors.accent : colors.surfaceAlt },
              ]}
              onPress={() => setSortKey(option.key)}
            >
              <ThemedText style={[styles.filterText, { color: active ? colors.textOnAccent : colors.accent }]}>
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {sortedProducts.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => goToDetail(item.id)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardTop}>
              {item.badge ? (
                <View style={styles.badge}>
                  <ThemedText style={[styles.badgeText, { color: colors.accent }]}>
                    {item.badge}
                  </ThemedText>
                </View>
              ) : (
                <View />
              )}
              <TouchableOpacity
                style={styles.heart}
                onPress={() => toggleFavorite(item.id)}
              >
                <Icon
                  name={favoriteIds[item.id] ? "heart" : "heart-outline"}
                  size={18}
                  color={favoriteIds[item.id] ? colors.favoriteActive : colors.accent}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.cardInfo}>
              <ThemedText style={[styles.cardTitle, { color: colors.accent }, styles.cardInfoTitleSpacing]}>
                {item.title}
              </ThemedText>
              <ThemedText style={[styles.cardPrice, { color: colors.accent }]}>
                {formatPrice(item)}
              </ThemedText>
              {item.category ? (
                <View style={[styles.categoryTag, { backgroundColor: colors.surfaceAlt }]}>
                  <ThemedText style={[styles.categoryText, { color: colors.textSecondary }]}>
                    {item.category}
                  </ThemedText>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllListingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 14,
  },
  card: {
    width: "47%",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardTop: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  heart: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    padding: 12,
  },
  cardInfoTitleSpacing: {
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "600",
  },
  categoryTag: {
    marginTop: 6,
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
