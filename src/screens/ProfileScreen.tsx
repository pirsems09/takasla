import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
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
import { useProfileStore } from "../store/profileStore";
import { useListingStore } from "../store/listingStore";
import { useAuthStore } from "../store/authStore";
import { formatPrice } from "../utils/format";

type ProfileTab = "active" | "past";

type ProfileNavigation = {
  navigate: (screen: string, params?: Record<string, string>) => void;
};

type ProfileScreenProps = {
  navigation: ProfileNavigation;
};

type StatItem = {
  id: string;
  value: string;
  label: string;
  icon: string;
  tone: "rose" | "gold" | "blue";
};

type BadgeItem = {
  id: string;
  label: string;
  icon: string;
  tone: "green" | "blue" | "peach" | "lavender";
};

type ListingCard = {
  id: string;
  title: string;
  priceLabel: string;
  image: string;
  tone: "warm" | "plum";
};

const statItems: StatItem[] = [
  { id: "swaps", value: "142", label: "Swaps", icon: "heart-outline", tone: "rose" },
  { id: "trust", value: "4.9", label: "Rating", icon: "star-outline", tone: "gold" },
  { id: "impact", value: "12", label: "Impact", icon: "leaf", tone: "blue" },
];

const badgeItems: BadgeItem[] = [
  { id: "eco", label: "Eco-Warrior", icon: "leaf", tone: "green" },
  { id: "kind", label: "Fast Helper", icon: "lightning-bolt-outline", tone: "blue" },
  { id: "top", label: "Top Saver", icon: "hand-heart-outline", tone: "peach" },
  { id: "local", label: "Local Gem", icon: "map-marker-radius-outline", tone: "lavender" },
];

const buildListings = (items: Product[]): ListingCard[] =>
  items.map((item) => ({
    id: item.id,
    title:
      item.listingType === "swap"
        ? `${item.title} (Takas)`
        : item.title,
    priceLabel: item.listingType === "donate" ? "FREE" : formatPrice(item),
    image: item.image,
    tone: item.listingType === "donate" ? "plum" : "warm",
  }));

const getStatToneStyle = (tone: StatItem["tone"]) => {
  switch (tone) {
    case "rose":
      return styles.statToneRose;
    case "gold":
      return styles.statToneGold;
    case "blue":
      return styles.statToneBlue;
  }
};

const getBadgeToneStyle = (tone: BadgeItem["tone"]) => {
  switch (tone) {
    case "green":
      return styles.badgeToneGreen;
    case "blue":
      return styles.badgeToneBlue;
    case "peach":
      return styles.badgeTonePeach;
    case "lavender":
      return styles.badgeToneLavender;
  }
};

const getListingOverlayStyle = (tone: ListingCard["tone"]) => {
  switch (tone) {
    case "warm":
      return styles.listingOverlayWarm;
    case "plum":
      return styles.listingOverlayPlum;
  }
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("active");

  const profile = useProfileStore((s) => s.profile);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);
  const fetchListingsByOwner = useListingStore((s) => s.fetchListingsByOwner);
  const userId = useAuthStore((s) => s.userId);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [myListings, setMyListings] = useState<Product[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchProfile();
    if (userId) {
      fetchListingsByOwner(userId).then(setMyListings).catch(() => {});
    }
  }, [isAuthenticated, userId, fetchProfile, fetchListingsByOwner]);

  const listings = useMemo(() => buildListings(myListings), [myListings]);
  const activeListings = listings.slice(0, 2);
  const pastListings = listings.slice(1, 3);

  const visibleListings = activeTab === "active" ? activeListings : pastListings;
  const logout = useAuthStore((s) => s.logout);

  const openDetail = (productId: string) => {
    navigation.navigate("ProductDetail", { productId });
  };

  // Giriş yapılmamışsa: profil içeriği yerine "Giriş Yap" kartı göster.
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.guestContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.guestCard}>
            <View style={styles.guestIconWrap}>
              <Icon name="account-circle-outline" size={40} color="#b64222" />
            </View>
            <ThemedText style={styles.guestTitle}>Profilin için giriş yap</ThemedText>
            <ThemedText style={styles.guestSubtitle}>
              İlanlarını, takas geçmişini ve favorilerini görmek için hesabına giriş yap.
            </ThemedText>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.guestButton}
              onPress={() => navigation.navigate("Auth")}
            >
              <ThemedText style={styles.guestButtonText}>Giriş Yap / Kayıt Ol</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Oturumu kapatmak istediğine emin misin?",
      [
        { text: "Vazgeç", style: "cancel" },
        { text: "Çıkış Yap", style: "destructive", onPress: () => logout() },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.9} style={styles.topIconButton}>
            <Icon name="menu" size={16} color="#7b6058" />
          </TouchableOpacity>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <ThemedText style={styles.brandText}>Relove</ThemedText>
          </View>
          <TouchableOpacity activeOpacity={0.9} style={styles.topIconButton}>
            <Icon name="bell-outline" size={16} color="#7b6058" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri: profile?.avatar ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=220&q=80",
              }}
              style={styles.avatar}
            />
            <View style={styles.plusBadge}>
              <Icon name="plus" size={10} color="#ffffff" />
            </View>
          </View>

          <ThemedText style={styles.profileName}>{profile?.name ?? "Sarah Jenkins"}</ThemedText>
          <ThemedText style={styles.profileMeta}>
            Portland, OR • Member since 2022
          </ThemedText>
        </View>

        <View style={styles.segmentRow}>
          <TouchableOpacity activeOpacity={0.9} style={styles.segmentChipActive}>
            <ThemedText style={styles.segmentChipActiveText}>Community Trust Score</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreRing}>
            <ThemedText style={styles.scoreValue}>98</ThemedText>
            <ThemedText style={styles.scoreLabel}>BLUE</ThemedText>
          </View>
          <ThemedText style={styles.scoreCaption}>
            Top 1% of the Relove community for responsiveness & quality
          </ThemedText>
        </View>

        <View style={styles.statsRow}>
          {statItems.map((item) => (
            <View key={item.id} style={styles.statCard}>
              <View style={[styles.statIconWrap, getStatToneStyle(item.tone)]}>
                <Icon name={item.icon} size={14} color="#7c5d53" />
              </View>
              <ThemedText style={styles.statValue}>{item.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{item.label}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Badges</ThemedText>
          <TouchableOpacity activeOpacity={0.9}>
            <ThemedText style={styles.linkText}>View All</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgesRow}
        >
          {badgeItems.map((badge) => (
            <View key={badge.id} style={styles.badgeCard}>
              <View style={[styles.badgeIconWrap, getBadgeToneStyle(badge.tone)]}>
                <Icon name={badge.icon} size={16} color="#5f4d46" />
              </View>
              <ThemedText style={styles.badgeLabel}>{badge.label}</ThemedText>
            </View>
          ))}
        </ScrollView>

        <View style={styles.impactCard}>
          <ThemedText style={styles.impactTitle}>Sustainability Impact</ThemedText>
          <View style={styles.impactMetricRow}>
            <ThemedText style={styles.impactValue}>42.5</ThemedText>
            <ThemedText style={styles.impactUnit}>kg</ThemedText>
          </View>
          <ThemedText style={styles.impactText}>
            By re-homing pre-loved toys, you&apos;ve prevented the carbon equivalent
            of 17 new items.
          </ThemedText>
          <View style={styles.impactFooter}>
            <View style={styles.impactPill}>
              <ThemedText style={styles.impactPillText}>Level 4 Eco-Hero</ThemedText>
            </View>
            <View style={styles.impactLevelWrap}>
              <ThemedText style={styles.impactLevelText}>Level 5</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>What parents say</ThemedText>
        </View>

        <View style={styles.quoteCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
            }}
            style={styles.quoteAvatar}
          />
          <View style={styles.quoteContent}>
            <ThemedText style={styles.quoteName}>Abdul R.</ThemedText>
            <ThemedText style={styles.quoteText}>
              Sarah always ships fast and the items arrive exactly as described.
            </ThemedText>
          </View>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setActiveTab("active")}
            style={styles.tabButton}
          >
            <ThemedText
              style={activeTab === "active" ? styles.tabTextActive : styles.tabText}
            >
              Active Listing
            </ThemedText>
            {activeTab === "active" ? <View style={styles.tabUnderline} /> : null}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setActiveTab("past")}
            style={styles.tabButton}
          >
            <ThemedText
              style={activeTab === "past" ? styles.tabTextActive : styles.tabText}
            >
              Past Listings
            </ThemedText>
            {activeTab === "past" ? <View style={styles.tabUnderline} /> : null}
          </TouchableOpacity>
        </View>

        <View style={styles.listingsRow}>
          {visibleListings.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.92}
              onPress={() => openDetail(item.id)}
              style={styles.listingCard}
            >
              <Image source={{ uri: item.image }} style={styles.listingImage} />
              <View style={[styles.listingOverlay, getListingOverlayStyle(item.tone)]} />
              <View style={styles.listingBadge}>
                <ThemedText style={styles.listingBadgeText}>
                  {activeTab === "active" ? "Active" : "Past"}
                </ThemedText>
              </View>
              <View style={styles.listingFooter}>
                <ThemedText numberOfLines={1} style={styles.listingTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText style={styles.listingPrice}>{item.priceLabel}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Çıkış butonu ─────────────────────────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon name="logout" size={18} color="#b64222" />
          <ThemedText style={styles.logoutText}>Çıkış Yap</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7efea",
  },
  guestContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 32,
  },
  guestCard: {
    backgroundColor: "#fffdf9",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  guestIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f2dfd7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2f2320",
  },
  guestSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: "#8b7e73",
    marginBottom: 8,
  },
  guestButton: {
    backgroundColor: "#b64222",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  guestButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff8f2",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#fff9f5",
    borderWidth: 1,
    borderColor: "#e0c3a7",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#b64222",
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  topIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d16a59",
  },
  brandText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#b64222",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrap: {
    position: "relative",
    marginBottom: 8,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: "#efb19d",
  },
  plusBadge: {
    position: "absolute",
    right: -2,
    bottom: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#2d5fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#f7efea",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2f2320",
    marginBottom: 2,
  },
  profileMeta: {
    fontSize: 10,
    color: "#9d8a81",
  },
  segmentRow: {
    alignItems: "center",
    marginBottom: 14,
  },
  segmentChipActive: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#f2dfd7",
  },
  segmentChipActiveText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    color: "#9c6b5d",
    letterSpacing: 0.5,
  },
  scoreCard: {
    alignItems: "center",
    marginBottom: 18,
  },
  scoreRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 6,
    borderColor: "#f28f7d",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff8f4",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2d2420",
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8d7b71",
  },
  scoreCaption: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: "center",
    color: "#8f7d74",
    maxWidth: 220,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff9f5",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  statIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statToneRose: {
    backgroundColor: "#ffe4de",
  },
  statToneGold: {
    backgroundColor: "#ffeecd",
  },
  statToneBlue: {
    backgroundColor: "#dfe8ff",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#3a2c26",
  },
  statLabel: {
    fontSize: 9,
    color: "#9b867a",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#3a2c26",
  },
  linkText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4671ff",
  },
  badgesRow: {
    paddingBottom: 16,
    gap: 12,
  },
  badgeCard: {
    width: 74,
    backgroundColor: "#fff9f5",
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  badgeIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  badgeToneGreen: {
    backgroundColor: "#dff3e2",
  },
  badgeToneBlue: {
    backgroundColor: "#dce8ff",
  },
  badgeTonePeach: {
    backgroundColor: "#ffe5da",
  },
  badgeToneLavender: {
    backgroundColor: "#ece5ff",
  },
  badgeLabel: {
    fontSize: 9,
    textAlign: "center",
    color: "#705f57",
  },
  impactCard: {
    backgroundColor: "#2160ff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  impactTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#d9e4ff",
    marginBottom: 6,
  },
  impactMetricRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    marginRight: 4,
  },
  impactUnit: {
    fontSize: 14,
    fontWeight: "800",
    color: "#dbe7ff",
    marginBottom: 4,
  },
  impactText: {
    fontSize: 10,
    lineHeight: 15,
    color: "#dde7ff",
    marginBottom: 10,
  },
  impactFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  impactPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  impactPillText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#ffffff",
  },
  impactLevelWrap: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  impactLevelText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#ffffff",
  },
  quoteCard: {
    backgroundColor: "#fff9f5",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  quoteAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  quoteContent: {
    flex: 1,
  },
  quoteName: {
    fontSize: 10,
    fontWeight: "800",
    color: "#3a2c26",
    marginBottom: 2,
  },
  quoteText: {
    fontSize: 10,
    lineHeight: 14,
    color: "#8c776e",
  },
  tabRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 14,
  },
  tabButton: {
    paddingBottom: 6,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#b09b90",
  },
  tabTextActive: {
    fontSize: 11,
    fontWeight: "800",
    color: "#352823",
  },
  tabUnderline: {
    marginTop: 4,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#f28f7d",
  },
  listingsRow: {
    flexDirection: "row",
    gap: 12,
  },
  listingCard: {
    flex: 1,
    height: 126,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  listingImage: {
    width: "100%",
    height: "100%",
  },
  listingOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  listingOverlayWarm: {
    backgroundColor: "rgba(250, 146, 103, 0.22)",
  },
  listingOverlayPlum: {
    backgroundColor: "rgba(116, 43, 101, 0.28)",
  },
  listingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "rgba(255, 249, 245, 0.88)",
  },
  listingBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#785d54",
  },
  listingFooter: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
  },
  listingTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 2,
  },
  listingPrice: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff2ec",
  },
});
