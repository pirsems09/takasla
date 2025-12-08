import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../hooks/useTheme";
import { ThemedText } from "../components/ThemedText";
import { products, Product } from "../data/mockData";

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { colors } = useTheme();
  const accent = "#1b1d1f";
  const productId = route?.params?.productId ?? products[0].id;
  const product = products.find((p) => p.id === productId) ?? products[0];
  const images = product.images?.length ? product.images : [product.image];
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);

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
});
