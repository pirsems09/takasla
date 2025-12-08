import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../components/ThemedText";
import { products } from "../data/mockData";

const ListingScreen = ({ navigation }: { navigation: any }) => {
  const accent = "#1b1d1f";
  const muted = "#7a7d82";

  const goToDetail = (productId: string) => {
    navigation.navigate("ProductDetail", { productId });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#f3f5f8" }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <ThemedText style={[styles.greeting, { color: accent }]}>
              Merhaba, Marina
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Hadi takas yapalım
            </ThemedText>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="magnify" size={20} color={accent} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, styles.headerIconsSpacing]}>
              <Icon name="heart-outline" size={20} color={accent} />
            </TouchableOpacity>
          </View>
        </View>


        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
          }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <ThemedText style={styles.heroTitle}>SONBAHAR KOLEKSİYONU</ThemedText>
          <ThemedText style={styles.heroSubtitle}>senin için</ThemedText>
        </ImageBackground>


        <View style={styles.favoritesSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: accent }]}>
              Favori Takas Ürünleri
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={[styles.sectionLink, { color: muted }]}>Tümü</ThemedText>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.favoriteList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.favoriteCard}
                onPress={() => goToDetail(item.id)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.images?.[0] ?? item.image }} style={styles.favoriteImage} />
                <View style={styles.favoriteOverlay} />
                <ThemedText style={styles.favoriteTitle} numberOfLines={1}>
                  {item.title}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>


        <View style={styles.gridHeader}>
          <ThemedText style={[styles.sectionTitle, { color: accent }]}>İlanlar</ThemedText>
          <TouchableOpacity onPress={() => navigation.navigate("AllListings")}>
            <ThemedText style={[styles.sectionLink, { color: muted }]}>Tümü ve Sıralama</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {products.slice(0, 10).map((item) => (
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
                <ThemedText
                  style={[styles.cardTitle, { color: accent }, styles.cardInfoTitleSpacing]}
                >
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "500",
  },
  headerIcons: {
    flexDirection: "row",
  },
  headerIconsSpacing: {
    marginLeft: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  hero: {
    marginHorizontal: 18,
    borderRadius: 16,
    overflow: "hidden",
    height: 150,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: "flex-end",
    padding: 16,
  },
  heroImage: {
    borderRadius: 16,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "#f1f3f5",
    marginTop: 4,
    fontWeight: "600",
    fontSize: 13,
  },
  gridHeader: {
    paddingHorizontal: 18,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoritesSection: {
    marginVertical: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: "600",
  },
  favoriteList: {
    paddingHorizontal: 18,
  },
  favoriteCard: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderRadius: 45,
    overflow: "hidden",
    marginRight: 12,
    marginBottom: 20,
    backgroundColor: "#e5e7eb",
  },
  favoriteImage: {
    width: "100%",
    height: "100%",
  },
  favoriteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  favoriteTitle: {
    position: "absolute",
    bottom: 10,
    left: 8,
    right: 8,
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  card: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    marginBottom: 14,
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
