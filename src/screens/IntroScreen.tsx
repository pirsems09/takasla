import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useIntroStore } from "../store/introStore";

const { width } = Dimensions.get("window");

type SlideKind = "hero" | "topics" | "reasons";
type Slide = { id: string; kind: SlideKind };

const slides: Slide[] = [
  { id: "hero", kind: "hero" },
  { id: "topics", kind: "topics" },
  { id: "reasons", kind: "reasons" },
];

const topicOptions = [
  { id: "business", label: "İş", icon: "briefcase-outline" },
  { id: "travel", label: "Seyahat", icon: "airplane" },
  { id: "movie", label: "Film", icon: "movie-outline" },
  { id: "drink", label: "İçecek", icon: "glass-cocktail" },
  { id: "food", label: "Yemek", icon: "silverware-fork-knife" },
  { id: "dating", label: "Tanınma", icon: "heart-outline" },
  { id: "shopping", label: "Alışveriş", icon: "shopping-outline" },
  { id: "sport", label: "Spor", icon: "basketball" },
  { id: "product", label: "Ürün", icon: "cube-outline" },
];

const reasonOptions = [
  { id: "time", label: "Zaman bulmakta zorlanıyorum" },
  { id: "opportunities", label: "Konuşma fırsatı bulamıyorum" },
  { id: "nervous", label: "Konuşurken geriliyorum" },
  { id: "remember", label: "Öğrendiklerimi hatırlamak istiyorum" },
];

const IntroScreen = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const flatListRef = useRef<FlatList<Slide> | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const setHasSeenIntro = useIntroStore((state) => state.setHasSeenIntro);

  const accent = "#2d2f33";
  const softBackground =
    colors.background === "#FFFFFF" ? "#f4f5f7" : colors.background;

  const goToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const handleContinue = () => {
    if (currentIndex === 0) {
      goToIndex(1);
      return;
    }
    if (currentIndex === 1 && selectedTopics.length < 3) {
      Alert.alert("Başlayalım", "Lütfen en az üç konu seçin.");
      return;
    }
    if (currentIndex < slides.length - 1) {
      goToIndex(currentIndex + 1);
      return;
    }
    handleFinish();
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    goToIndex(currentIndex - 1);
  };

  const handleFinish = async () => {
    await setHasSeenIntro(true);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleReason = (id: string) => {
    setSelectedReasons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderHeroSlide = () => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.heroImageWrapper}>
        <View style={[styles.heroCircle, { backgroundColor: "#e5e7eb" }]}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
            }}
            resizeMode="cover"
            style={styles.heroImage}
          />
          <View style={styles.heroBadge}>
            <Icon name="waveform" size={20} color={accent} />
          </View>
        </View>
      </View>
      <View style={styles.textBlock}>
        <ThemedText style={[styles.heroTitle, { color: accent }]}>
          Konuşmanın En Kolay Yolu
        </ThemedText>
        <ThemedText style={[styles.heroSubtitle, { color: "#8b8d92" }]}>
          KEŞFETMEK İÇİN KAYDIRIN
        </ThemedText>
      </View>
      <View style={styles.primaryAction}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.darkButton, { backgroundColor: accent }]}
          onPress={handleContinue}
        >
          <ThemedText style={styles.darkButtonText}>Hadi Başlayalım</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginRow}>
          <ThemedText style={[styles.loginText, { color: "#6f7277" }]}>
            Zaten hesabın var mı?
          </ThemedText>
          <ThemedText style={[styles.loginLink, { color: colors.primary }]}>
            {" "}
            Giriş Yap
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTopicSlide = () => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.backRow}>
        <TouchableOpacity onPress={handleBack} hitSlop={10}>
          <Icon name="chevron-left" size={26} color={accent} />
        </TouchableOpacity>
      </View>
      <View style={styles.textBlock}>
        <ThemedText style={[styles.sectionTitle, { color: accent }]}>
          Hangi konularla ilgileniyorsun?
        </ThemedText>
        <ThemedText style={[styles.sectionSubtitle, { color: "#7a7d82" }]}>
          Kursunu daha iyi kişiselleştirmek için en az üç konu seç.
        </ThemedText>
      </View>
      <View style={styles.grid}>
        {topicOptions.map((topic) => {
          const active = selectedTopics.includes(topic.id);
          return (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.gridItem,
                active && { backgroundColor: accent },
                { borderColor: active ? accent : "#d5d7db" },
              ]}
              onPress={() => toggleTopic(topic.id)}
              activeOpacity={0.85}
            >
              <Icon
                name={topic.icon}
                size={24}
                color={active ? "#ffffff" : accent}
              />
              <ThemedText
                style={[
                  styles.gridLabel,
                  { color: active ? "#ffffff" : accent },
                ]}
              >
                {topic.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.primaryAction}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.darkButton, { backgroundColor: accent }]}
          onPress={handleContinue}
        >
          <ThemedText style={styles.darkButtonText}>Devam Et</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReasonSlide = () => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.backRow}>
        <TouchableOpacity onPress={handleBack} hitSlop={10}>
          <Icon name="chevron-left" size={26} color={accent} />
        </TouchableOpacity>
      </View>
      <View style={styles.textBlock}>
        <ThemedText style={[styles.sectionTitle, { color: accent }]}>
          Neden konuşma pratiği yapmak istiyorsun?
        </ThemedText>
        <ThemedText style={[styles.sectionSubtitle, { color: "#7a7d82" }]}>
          Seni en iyi anlatan seçenekleri seç.
        </ThemedText>
      </View>
      <View style={styles.reasonList}>
        {reasonOptions.map((reason) => {
          const active = selectedReasons.includes(reason.id);
          return (
            <TouchableOpacity
              key={reason.id}
              style={[
                styles.reasonCard,
                active && { borderColor: accent, backgroundColor: "#f0f1f3" },
              ]}
              onPress={() => toggleReason(reason.id)}
              activeOpacity={0.9}
            >
              <ThemedText
                style={[
                  styles.reasonText,
                  { color: active ? accent : "#2f3237" },
                ]}
              >
                {reason.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.primaryAction}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.darkButton, { backgroundColor: accent }]}
          onPress={handleContinue}
        >
          <ThemedText style={styles.darkButtonText}>Bitir ve Başla</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Slide }) => {
    switch (item.kind) {
      case "hero":
        return renderHeroSlide();
      case "topics":
        return renderTopicSlide();
      case "reasons":
      default:
        return renderReasonSlide();
    }
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 22, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.25, 1, 0.25],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: accent,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: softBackground }]}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        keyExtractor={(item) => item.id}
      />

      {renderPagination()}
    </SafeAreaView>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  heroImageWrapper: {
    alignItems: "center",
    marginTop: 10,
  },
  heroCircle: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: (width * 0.65) / 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    elevation: 6,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroBadge: {
    position: "absolute",
    bottom: 18,
    right: 18,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 10,
    elevation: 4,
  },
  textBlock: {
    width: "100%",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 36,
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    marginTop: 12,
    fontWeight: "700",
  },
  primaryAction: {
    width: "100%",
    marginBottom: 30,
  },
  darkButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  darkButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
  },
  backRow: {
    width: "100%",
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  gridItem: {
    width: "31%",
    marginBottom: 14,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  gridLabel: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 13,
  },
  reasonList: {
    width: "100%",
    marginTop: 10,
  },
  reasonCard: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e1e3e6",
    backgroundColor: "#ffffff",
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
