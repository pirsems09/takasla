import React, { useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../components/ThemedText";
import { products } from "../data/mockData";

type SortKey = "recommend" | "priceAsc" | "priceDesc";

const sortOptions: { label: string; key: SortKey }[] = [
  { label: "Önerilen", key: "recommend" },
  { label: "Fiyat Artan", key: "priceAsc" },
  { label: "Fiyat Azalan", key: "priceDesc" },
];

const parsePrice = (product: any) => {
  const value = product.priceMin ?? product.price ?? "0";
  return Number(value);
};

const AllListingsScreen = ({ navigation }: { navigation: any }) => {
  const accent = "#1b1d1f";
  const muted = "#7a7d82";
  const [sortKey, setSortKey] = useState<SortKey>("recommend");

  const sortedProducts = useMemo(() => {
    if (sortKey === "recommend") return products;
    const sorted = [...products].sort((a, b) => parsePrice(a) - parsePrice(b));
    return sortKey === "priceAsc" ? sorted : sorted.reverse();
  }, [sortKey]);

  const goToDetail = (productId: string) => navigation.navigate("ProductDetail", { productId });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#f5f7fb" }]}>
      <View style={styles.filterRow}>
        {sortOptions.map((option) => {
          const active = sortKey === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterPill,
                active && { backgroundColor: "#1b1d1f" },
              ]}
              onPress={() => setSortKey(option.key)}
            >
              <ThemedText style={[styles.filterText, { color: active ? "#ffffff" : accent }]}>
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
            style={styles.card}
            onPress={() => goToDetail(item.id)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardTop}>
              {item.badge ? (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
                </View>
              ) : (
                <View />
              )}
              <TouchableOpacity style={styles.heart}>
                <Icon name="heart-outline" size={18} color={accent} />
              </TouchableOpacity>
            </View>
            <View style={styles.cardInfo}>
              <ThemedText style={[styles.cardTitle, { color: accent }, styles.cardInfoTitleSpacing]}>
                {item.title}
              </ThemedText>
              <ThemedText style={[styles.cardPrice, { color: accent }]}>
                {item.priceMin && item.priceMax
                  ? `${item.priceMin} - ${item.priceMax} ₺`
                  : `${item.currency} ${item.price}`}
              </ThemedText>
              {item.category ? (
                <View style={styles.categoryTag}>
                  <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
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
    backgroundColor: "#e9ecf4",
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
    backgroundColor: "#ffffff",
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
    color: "#1b1d1f",
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
    backgroundColor: "#eef1f6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#49505a",
  },
});
