import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  FlatList,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../components/ThemedText";
import { CategoryCard } from "../components/CategoryCard";
import { products, categories } from "../data/mockData";
import { AdBanner } from "../components/AdBanner";

import { useTheme } from "../hooks/useTheme";

const ListingScreen = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.2)).current;
  const floatAnim = React.useRef(new Animated.Value(0)).current;
  const accent = colors.text;
  const muted = colors.textSecondary;

  const donationProducts = products.filter((p) => p.isDonation);

  React.useEffect(() => {
    // Entrance Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating Loop Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const goToDetail = (productId: string) => {
    navigation.navigate("ProductDetail", { productId });
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
              <Icon name="magnify" size={22} color="#1b1d1f" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, styles.headerIconsSpacing]}>
              <Icon name="heart-outline" size={22} color="#1b1d1f" />
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
          <View style={[styles.adBadge, { borderColor: "rgba(255,255,255,0.6)", backgroundColor: "transparent" }]}>
            <ThemedText style={styles.adBadgeText}>REKLAM ALANI</ThemedText>
          </View>

          <View style={styles.heroContent}>
            <View>
              <ThemedText style={styles.heroTitle}>SONBAHAR KOLEKSİYONU</ThemedText>
              <ThemedText style={styles.heroSubtitle}>senin için</ThemedText>
            </View>

            <TouchableOpacity
              style={[styles.heroAdCta, { width: "100%", justifyContent: "center", backgroundColor: "#D8FF57" }]}
              onPress={() => navigation.navigate("CreateListingModal")}
              activeOpacity={0.8}
            >
              <Icon name="bullhorn-variant" size={18} color="#1b1d1f" />
              <ThemedText style={[styles.heroAdCtaText, { fontSize: 13 }]}>Sende İlanını Burada Göster</ThemedText>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <Animated.View
          style={[
            styles.donationSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.donationHeading}>
              <View style={[styles.donationIconCircle, { backgroundColor: "rgba(74,209,123,0.15)" }]}>
                <Icon name="heart-flash" size={20} color="#4ad17b" />
              </View>
              <ThemedText
                style={[styles.sectionTitle, { color: accent, marginLeft: 10 }]}
              >
                BAĞIŞLANANLAR
              </ThemedText>
            </View>
            <View style={[styles.donationPulse, { backgroundColor: "#e9f9ef", borderColor: "transparent" }]}>
              <ThemedText style={[styles.donationPulseText, { color: "#4ad17b" }]}>Hemen Al</ThemedText>
            </View>
          </View>

          {donationProducts.length > 0 ? (
            <FlatList
              data={donationProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoriteList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.donationCard}
                  onPress={() => goToDetail(item.id)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.donationImage}
                  />
                  <View style={styles.donationCardOverlay}>

                    <View style={styles.donationGlassInfo}>
                      <ThemedText style={styles.donationTitleText} numberOfLines={2}>
                        {item.title}
                      </ThemedText>
                      <View style={styles.donationLocationRow}>
                        <Icon name="map-marker" size={10} color="#fff" />
                        <ThemedText style={styles.donationLocationText}>
                          {item.address?.split(",")[0]}
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.donationPremiumTag}>
                      <Icon name="heart" size={10} color="#1b1d1f" />
                      <ThemedText style={styles.donationPremiumTagText}>
                        ÜCRETSİZ
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListFooterComponent={() => (
                <TouchableOpacity
                  style={[styles.donationCard, styles.donationCtaCard]}
                  onPress={() => navigation.navigate("CreateListingModal")}
                  activeOpacity={0.8}
                >
                  <View style={styles.ctaIconCircle}>
                    <Icon name="plus" size={32} color="#D8FF57" />
                  </View>
                  <ThemedText style={styles.ctaCardText}>
                    Sende{"\n"}paylaş
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          ) : (
            <TouchableOpacity
              style={styles.emptyDonationCta}
              onPress={() => navigation.navigate("CreateListingModal")}
              activeOpacity={0.8}
            >
              <Icon name="heart-plus" size={24} color="#4ad17b" />
              <ThemedText style={styles.emptyDonationText}>
                Sende bağış yapmak ister misin?
              </ThemedText>
              <Icon name="chevron-right" size={20} color="#4ad17b" />
            </TouchableOpacity>
          )}
        </Animated.View>


        <View style={styles.favoritesSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: accent }]}>
              Favori Kategoriler
            </ThemedText>
          </View>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.favoriteList}
            renderItem={({ item }) => {
              const isSelected = selectedCategory === item.title;
              return (
                <CategoryCard
                  item={item}
                  isSelected={isSelected}
                  onPress={() =>
                    setSelectedCategory(isSelected ? null : item.title)
                  }
                />
              );
            }}
          />
        </View>


        <View style={styles.gridHeader}>
          <ThemedText style={[styles.sectionTitle, { color: accent }]}>İlanlar</ThemedText>
          <TouchableOpacity onPress={() => navigation.navigate("AllListings")}>
            <ThemedText style={[styles.sectionLink, { color: muted }]}>Tümü ve Sıralama</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {filteredProducts.slice(0, 10).map((item) => (
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

        {/* Banner Reklam */}
        <AdBanner containerStyle={{ marginTop: 10, marginBottom: 20 }} />
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
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  hero: {
    marginHorizontal: 18,
    borderRadius: 16,
    overflow: "hidden",
    height: 180,
    marginTop: 20,
    marginBottom: 10,
    padding: 16,
  },
  heroImage: {
    borderRadius: 16,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  adBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  adBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  heroContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    color: "#D8FF57",
    marginTop: 4,
    fontWeight: "700",
    fontSize: 14,
  },
  heroAdCta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8FF57",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  heroAdCtaText: {
    color: "#1b1d1f",
    fontSize: 12,
    fontWeight: "800",
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
  donationSection: {
    marginTop: 24,
    marginBottom: 12,
  },
  donationHeading: {
    flexDirection: "row",
    alignItems: "center",
  },
  donationIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#4ad17b",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  donationPulse: {
    backgroundColor: "rgba(74,209,123,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(74,209,123,0.3)",
  },
  donationPulseText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#4ad17b",
  },
  donationCard: {
    width: 160,
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "#fff",
    elevation: 12,
    shadowColor: "#4ad17b",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    borderWidth: 1,
    borderColor: "rgba(216, 255, 87, 0.3)",
  },
  donationImage: {
    width: "100%",
    height: "100%",
  },
  donationCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 12,
    justifyContent: "space-between",
  },
  donationTopRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  donationPremiumTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8FF57",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    gap: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  donationPremiumTagText: {
    color: "#1b1d1f",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  donationGlassInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "transparent",
  },
  donationTitleText: {

    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    lineHeight: 18,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  donationLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  donationLocationText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 10,
    fontWeight: "600",
  },
  donationCtaCard: {
    backgroundColor: "#1b1d1f",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#D8FF57",
    borderStyle: "dashed",
    borderWidth: 2,
  },
  ctaIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(216, 255, 87, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  ctaCardText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyDonationCta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(74,209,123,0.1)",
    marginHorizontal: 18,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(74,209,123,0.2)",
    gap: 12,
  },
  emptyDonationText: {
    flex: 1,
    color: "#1b1d1f",
    fontSize: 14,
    fontWeight: "700",
  },
  favoriteList: {
    paddingHorizontal: 18,
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
