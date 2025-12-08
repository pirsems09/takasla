import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
  Linking,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useTheme } from "../hooks/useTheme";
import { ThemedText } from "../components/ThemedText";
import { products, Product } from "../data/mockData";

// Optional import for Google Mobile Ads
let mobileAds: any;
let AdEventType: any;
let InterstitialAd: any;
let TestIds: any;

try {
  const adsModule = require("react-native-google-mobile-ads");
  mobileAds = adsModule.default;
  AdEventType = adsModule.AdEventType;
  InterstitialAd = adsModule.InterstitialAd;
  TestIds = adsModule.TestIds;
} catch (e) {
  console.warn("Google Mobile Ads module not available:", e);
}

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { colors } = useTheme();
  const accent = "#1b1d1f";
  const productId = route?.params?.productId ?? products[0].id;
  const product = products.find((p) => p.id === productId) ?? products[0];
  const images = product.images?.length ? product.images : [product.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const pendingMapRef = useRef(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const adsAvailable = mobileAds && InterstitialAd && AdEventType && TestIds;
  const adUnitId = adsAvailable && __DEV__ ? TestIds.INTERSTITIAL : "ca-app-pub-xxxxxxxxxxxxxxxx/interstitial";
  const interstitialRef = useRef(
    adsAvailable
      ? InterstitialAd.createForAdRequest(adUnitId, {
          requestNonPersonalizedAdsOnly: true,
        })
      : null
  );

  useEffect(() => {
    if (!adsAvailable) return;

    try {
      mobileAds()
        .initialize()
        .catch(() => null);

      if (interstitialRef.current) {
        const adLoadSub = interstitialRef.current.addAdEventListener(AdEventType.LOADED, () =>
          setAdLoaded(true)
        );
        const adCloseSub = interstitialRef.current.addAdEventListener(AdEventType.CLOSED, () => {
          if (pendingMapRef.current) {
            pendingMapRef.current = false;
            openAddressInMaps();
          }
          if (interstitialRef.current) {
            interstitialRef.current.load();
          }
        });

        interstitialRef.current.load();

        return () => {
          adLoadSub();
          adCloseSub();
        };
      }
    } catch (error) {
      console.warn("Error initializing ads:", error);
    }
  }, [adsAvailable]);

  const goChat = () => {
    const threadId = `thread-${product.id}`;
    const parentNav = navigation.getParent ? navigation.getParent() : null;
    if (parentNav) {
      parentNav.navigate("Chat", { threadId });
    } else {
      navigation.navigate("Chat", { threadId });
    }
  };

  const tags = [product.tags[0] ?? "Özel", product.tags[1] ?? "Trend"];

  // İstanbul için varsayılan koordinatlar (Üsküdar)
  const getCoordinatesFromAddress = (address: string) => {
    // Basit bir geocoding - gerçek uygulamada Google Geocoding API kullanılabilir
    if (address.toLowerCase().includes("üsküdar")) {
      return { latitude: 41.0214, longitude: 29.0097 };
    }
    if (address.toLowerCase().includes("kadıköy")) {
      return { latitude: 40.9819, longitude: 29.0256 };
    }
    if (address.toLowerCase().includes("beşiktaş")) {
      return { latitude: 41.0422, longitude: 29.0081 };
    }
    // Varsayılan İstanbul koordinatları
    return { latitude: 41.0082, longitude: 28.9784 };
  };

  const openAddressInMaps = () => {
    if (!product.address) return;
    const query = encodeURIComponent(product.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Harita açılamadı", "Lütfen Google Maps'in kurulu olduğundan emin olun.")
    );
  };

  const handleShowDetails = () => {
    if (!adsAvailable || !interstitialRef.current) {
      openAddressInMaps();
      return;
    }

    if (adLoaded) {
      pendingMapRef.current = true;
      interstitialRef.current.show();
      setAdLoaded(false);
    } else {
      interstitialRef.current.load();
      openAddressInMaps();
    }
  };

  const mapCoordinates = product.address
    ? getCoordinatesFromAddress(product.address)
    : { latitude: 41.0082, longitude: 28.9784 };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#f3f5f8" }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const nextIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveIndex(nextIndex);
            }}
          >
            {images.map((uri, index) => (
              <Image key={uri + index} source={{ uri }} style={[styles.image, { width }]} />
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Liste")}
          >
            <Icon name="chevron-left" size={22} color={accent} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton}>
            <Icon name="heart-outline" size={20} color={accent} />
          </TouchableOpacity>
          <View style={styles.dots}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <ThemedText style={[styles.title, { color: accent }]}>
              {product.title}
            </ThemedText>
            <ThemedText style={[styles.price, { color: accent }]}>
              {product.priceMin && product.priceMax
                ? `${product.priceMin} - ${product.priceMax} ₺`
                : `${product.currency} ${product.price}`}
            </ThemedText>
          </View>
          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <View key={tag} style={styles.pill}>
                <ThemedText style={styles.pillText}>{tag}</ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.specGrid}>
            {product.category ? (
              <View style={styles.specBox}>
                <ThemedText style={styles.specLabel}>Kategori</ThemedText>
                <ThemedText style={[styles.specValue, { color: accent }]}>
                  {product.category}
                </ThemedText>
              </View>
            ) : null}
            {product.condition ? (
              <View style={styles.specBox}>
                <ThemedText style={styles.specLabel}>Durum</ThemedText>
                <ThemedText style={[styles.specValue, { color: accent }]}>
                  {product.condition}
                </ThemedText>
              </View>
            ) : null}
            <View style={styles.specBox}>
              <ThemedText style={styles.specLabel}>Numara</ThemedText>
              <ThemedText style={[styles.specValue, { color: accent }]}>
                {product.size ?? "—"}
              </ThemedText>
            </View>
            <View style={styles.specBox}>
              <ThemedText style={styles.specLabel}>Topuk</ThemedText>
              <ThemedText style={[styles.specValue, { color: accent }]}>
                {product.heelHeight ?? "—"}
              </ThemedText>
            </View>
            <View style={styles.specBox}>
              <ThemedText style={styles.specLabel}>Kalıp</ThemedText>
              <ThemedText style={[styles.specValue, { color: accent }]}>
                {product.width ?? "—"}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={[styles.description, { color: "#4b4e53" }]}>
            {product.description}
          </ThemedText>

          {product.address ? (
            <View style={styles.addressCard}>
              <View style={styles.addressRow}>
                <Icon name="map-marker-outline" size={22} color="#6c8cff" />
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.addressTitle, { color: accent }]}>
                    Adres
                  </ThemedText>
                  <ThemedText style={[styles.addressText, { color: "#4b4e53" }]}>
                    {product.address}
                  </ThemedText>
                </View>
                <ThemedText style={styles.detailsLink} onPress={handleShowDetails}>
                  Detaylı Gör {`>`}
                </ThemedText>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.chatButton, { backgroundColor: "#2c2f33" }]} onPress={goChat}>
          <Icon name="chat-processing-outline" size={18} color="#d8ff57" />
          <ThemedText style={styles.chatText}>Satıcı ile konuş</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buyButton, { backgroundColor: "#d8ff57" }]}>
          <ThemedText style={[styles.buyText, { color: accent }]}>Hemen Al</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Map Modal */}
      <Modal
        visible={mapModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setMapModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setMapModalVisible(false)}
            >
              <Icon name="close" size={24} color={accent} />
            </TouchableOpacity>
            <View style={styles.modalHeaderContent}>
              <ThemedText style={[styles.modalTitle, { color: accent }]}>Konum</ThemedText>
              {product.address && (
                <ThemedText style={[styles.modalAddress, { color: "#4b4e53" }]} numberOfLines={2}>
                  {product.address}
                </ThemedText>
              )}
            </View>
          </View>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              ...mapCoordinates,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={false}
            showsMyLocationButton={false}
          >
            <Marker
              coordinate={mapCoordinates}
              title={product.title}
              description={product.address}
            >
              <View style={styles.customMarker}>
                <Icon name="map-marker" size={32} color="#6c8cff" />
              </View>
            </Marker>
          </MapView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageWrap: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    width,
    alignSelf: "center",
  },
  image: {
    height: 320,
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  likeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  dots: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#d8ff57",
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
  },
  tagRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  pill: {
    backgroundColor: "#eef0f3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 10,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3a3d42",
  },
  specGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 10,
  },
  specBox: {
    width: "48%",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 3,
  },
  specLabel: {
    fontSize: 12,
    color: "#7a7d82",
    fontWeight: "600",
  },
  specValue: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  addressCard: {
    marginTop: 14,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e1e4ea",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  addressText: {
    fontSize: 13,
    marginTop: 4,
  },
  detailsLink: {
    color: "#6c8cff",
    fontWeight: "800",
  },
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 10,
    backgroundColor: "#f3f5f8",
  },
  chatButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  chatText: {
    color: "#f6f7fb",
    fontWeight: "700",
    fontSize: 14,
  },
  buyButton: {
    width: 120,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  buyText: {
    fontSize: 14,
    fontWeight: "800",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f3f5f8",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e4ea",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f5f8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  modalHeaderContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  modalAddress: {
    fontSize: 13,
    lineHeight: 18,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
});
