import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { ThemedText } from "../components/ThemedText";
import { ProductCard } from "../components/ProductCard";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { products } from "../data/mockData";

const { width } = Dimensions.get("window");
const GAP = 16;
const PADDING = 24;
const COLUMN_WIDTH = (width - PADDING * 2 - GAP) / 2;

const FILTERS = ["Hepsi", "Ürünler", "Satıcılar", "Aramalar"];

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("Hepsi");

  const renderHeader = () => (
    <View>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Favorilerim</ThemedText>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterPill,
              activeFilter === filter && styles.activeFilterPill,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <ThemedText
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={products} // Using all products for demo purposes to fill the grid
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={{ width: COLUMN_WIDTH }}>
            <ProductCard
              product={item}
              onPress={() => {
                // Handle product press
              }}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Light gray background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  filterContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  activeFilterPill: {
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeFilterText: {
    color: "white",
  },
  listContent: {
    paddingHorizontal: PADDING,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
