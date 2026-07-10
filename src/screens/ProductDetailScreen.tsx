import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemedText } from '../components/ThemedText';
import { useTheme } from '../hooks/useTheme';
import type { ProductDetailScreenProps } from '../navigation/types';
import type { Product } from '@api/types';
import { useListingStore } from '../store/listingStore';
import { useChatStore } from '../store/chatStore';
import { useFavoriteStore } from '../store/favoriteStore';
import { useAuthStore } from '../store/authStore';
import { formatPrice } from '../utils/format';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const IMAGE_HEIGHT = 360;

type DetailMetric = {
  icon: string;
  label: string;
  value: string;
};

type DetailSection = {
  title: string;
  items: DetailMetric[];
};

const ProductDetailScreen = ({
  route,
  navigation,
}: ProductDetailScreenProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const productId = route?.params?.productId ?? '';
  const detail = useListingStore((s) => s.detail);
  const loading = useListingStore((s) => s.loading);
  const fetchListingById = useListingStore((s) => s.fetchListingById);
  const threads = useChatStore((s) => s.threads);

  const favoriteIds = useFavoriteStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (productId) fetchListingById(productId);
  }, [productId, fetchListingById]);

  const product = detail[productId];

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <ThemedText style={{ color: colors.textSecondary }}>
              İlan bulunamadı.
            </ThemedText>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const listingType = product.listingType ?? 'sell';
  const isSwap = listingType === 'swap';
  const isFavorite = Boolean(favoriteIds[product.id]);

  const sellerThread = threads.find((item) => item.productId === product.id);
  const sellerName = sellerThread?.name ?? 'Takasla Seller';
  const sellerAvatar = sellerThread?.avatar ?? product.image;
  const sellerInitial = sellerName.charAt(0).toUpperCase();

  const detailSections = buildDetailSections(product, isSwap);
  const offerItems = buildOfferItems(product);

  const actionLabel = isSwap ? 'Takas teklif et' : 'Hemen satin al';
  const secondaryActionLabel = isSwap ? 'Saticiya yaz' : 'Fiyat sor';
  const listingLabel = isSwap ? 'Swap Listing' : 'Sell Listing';
  const listingIcon = isSwap ? 'swap-horizontal' : 'cash';

  const handleMomentumScrollEnd = (offsetX: number) => {
    const nextIndex = Math.round(offsetX / width);
    setActiveIndex(nextIndex);
  };

  const handleThumbnailPress = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setActiveIndex(index);
  };

  // Satıcıya mesaj: mevcut thread varsa onunla, yoksa getOrCreateThread ile
  // gerçek bir thread oluşturup Chat ekranına yönlendir. Giriş yapmamışsa uyar.
  const goChat = async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const ownerId = product.ownerId;
    if (!isAuthenticated) {
      Alert.alert(
        'Giriş gerekli',
        'Satıcıya mesaj gönderebilmek için giriş yapmalısınız.',
        [
          { text: 'Vazgeç', style: 'cancel' },
          { text: 'Giriş Yap', onPress: () => navigation.navigate('Auth' as never) },
        ],
      );
      return;
    }
    // Önce mevcut thread ara; bulunamazsa ownerId ile yeni oluştur.
    let threadId = sellerThread?.id;
    if (!threadId && ownerId) {
      const startChat = useChatStore.getState().startChat;
      threadId = (await startChat(ownerId, product.id)) ?? undefined;
    }
    if (!threadId) {
      Alert.alert('Hata', 'Sohbet başlatılamadı. Lütfen tekrar deneyin.');
      return;
    }
    navigation.getParent()?.navigate('Chat', { threadId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) =>
                handleMomentumScrollEnd(event.nativeEvent.contentOffset.x)
              }
            >
              {images.map((uri, index) => (
                <Image
                  key={`${uri}-${index}`}
                  source={{ uri }}
                  style={styles.heroImage}
                />
              ))}
            </ScrollView>

            <View style={styles.heroTopRow}>
              <TouchableOpacity style={styles.iconButton} onPress={navigation.goBack}>
                <Icon name="chevron-left" size={22} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => toggleFavorite(product.id)}
              >
                <Icon
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? colors.favoriteActive : colors.accent}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.heroOverlay}>
              <View style={styles.heroChipRow}>
                <View style={[styles.heroChip, isSwap ? styles.swapChip : styles.sellChip]}>
                  <Icon name={listingIcon} size={14} color={colors.accent} />
                  <ThemedText style={styles.heroChipText}>{listingLabel}</ThemedText>
                </View>
                {product.condition ? (
                  <View style={styles.heroChip}>
                    <Icon name="shield-check-outline" size={14} color={colors.accent} />
                    <ThemedText style={styles.heroChipText}>{product.condition}</ThemedText>
                  </View>
                ) : null}
              </View>

              <View style={styles.galleryFooter}>
                <View style={styles.pagination}>
                  {images.map((_, index) => (
                    <View
                      key={`dot-${index}`}
                      style={[
                        styles.paginationDot,
                        index === activeIndex
                          ? styles.paginationDotActive
                          : styles.paginationDotInactive,
                      ]}
                    />
                  ))}
                </View>
                <ThemedText style={styles.galleryCount}>
                  {activeIndex + 1}/{images.length}
                </ThemedText>
              </View>
            </View>
          </View>

          {images.length > 1 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailRow}
            >
              {images.map((uri, index) => (
                <TouchableOpacity
                  key={`thumb-${uri}-${index}`}
                  style={[
                    styles.thumbnailButton,
                    index === activeIndex
                      ? styles.thumbnailButtonActive
                      : styles.thumbnailButtonInactive,
                  ]}
                  onPress={() => handleThumbnailPress(index)}
                >
                  <Image source={{ uri }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}

          <View style={styles.content}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={styles.summaryCopy}>
                  <ThemedText style={styles.productTitle}>{product.title}</ThemedText>
                  <ThemedText style={styles.productSubtitle}>
                    {isSwap
                      ? 'Curated for direct swaps and balanced offers.'
                      : 'Ready for direct purchase with transparent details.'}
                  </ThemedText>
                </View>
                <View style={styles.priceBadge}>
                  <ThemedText style={styles.priceBadgeLabel}>
                    {isSwap ? 'Target Value' : 'Asking Price'}
                  </ThemedText>
                  <ThemedText style={styles.priceBadgeValue}>
                    {formatPrice(product)}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.metaRow}>
                {product.rating ? (
                  <View style={styles.metaPill}>
                    <Icon name="star" size={14} color={colors.highlight} />
                    <ThemedText style={styles.metaText}>
                      {product.rating.toFixed(1)} seller score
                    </ThemedText>
                  </View>
                ) : null}
                {product.distance ? (
                  <View style={styles.metaPill}>
                    <Icon name="map-marker-outline" size={14} color={colors.primary} />
                    <ThemedText style={styles.metaText}>{product.distance} away</ThemedText>
                  </View>
                ) : null}
                {product.category ? (
                  <View style={styles.metaPill}>
                    <Icon name="shape-outline" size={14} color={colors.accent} />
                    <ThemedText style={styles.metaText}>{product.category}</ThemedText>
                  </View>
                ) : null}
              </View>

              <View style={styles.tagRow}>
                {product.tags.map((tag) => (
                  <View key={tag} style={styles.tagPill}>
                    <ThemedText style={styles.tagText}>{tag}</ThemedText>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sellerCard}>
              <View style={styles.sellerIdentity}>
                <Image source={{ uri: sellerAvatar }} style={styles.sellerAvatar} />
                <View style={styles.sellerInitialFallback}>
                  <ThemedText style={styles.sellerInitialText}>{sellerInitial}</ThemedText>
                </View>
                <View style={styles.sellerCopy}>
                  <ThemedText style={styles.sellerLabel}>Listed by</ThemedText>
                  <ThemedText style={styles.sellerName}>{sellerName}</ThemedText>
                  <ThemedText style={styles.sellerMeta}>
                    Verified profile with responsive messaging
                  </ThemedText>
                </View>
              </View>
              <TouchableOpacity style={styles.sellerCta} onPress={goChat}>
                <Icon name="message-text-outline" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.descriptionCard}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Overview</ThemedText>
                <View style={styles.sectionAccent} />
              </View>
              <ThemedText style={styles.descriptionText}>{product.description}</ThemedText>
            </View>

            {detailSections.map((section) => (
              <View key={section.title} style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
                  <View style={styles.sectionAccent} />
                </View>
                <View style={styles.metricGrid}>
                  {section.items.map((item) => (
                    <View key={`${section.title}-${item.label}`} style={styles.metricCard}>
                      <View style={styles.metricIconWrap}>
                        <Icon name={item.icon} size={18} color={colors.primary} />
                      </View>
                      <ThemedText style={styles.metricLabel}>{item.label}</ThemedText>
                      <ThemedText style={styles.metricValue}>{item.value}</ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>
                  {isSwap ? 'Preferred swap terms' : 'Purchase terms'}
                </ThemedText>
                <View style={styles.sectionAccent} />
              </View>
              {offerItems.map((item) => (
                <View key={item.label} style={styles.infoRow}>
                  <View style={styles.infoIconWrap}>
                    <Icon name={item.icon} size={18} color={colors.accent} />
                  </View>
                  <View style={styles.infoCopy}>
                    <ThemedText style={styles.infoLabel}>{item.label}</ThemedText>
                    <ThemedText style={styles.infoValue}>{item.value}</ThemedText>
                  </View>
                </View>
              ))}
            </View>

            {product.address ? (
              <View style={styles.locationCard}>
                <View style={styles.sectionHeader}>
                  <ThemedText style={styles.locationSectionTitle}>Location</ThemedText>
                  <View style={styles.locationSectionAccent} />
                </View>
                <View style={styles.locationRow}>
                  <View style={styles.locationPin}>
                    <Icon name="map-marker" size={18} color={colors.textOnAccent} />
                  </View>
                  <View style={styles.locationCopy}>
                    <ThemedText style={styles.locationTitle}>Meet-up area</ThemedText>
                    <ThemedText style={styles.locationText}>{product.address}</ThemedText>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.secondaryAction} onPress={goChat}>
            <Icon name="chat-processing-outline" size={18} color={colors.primary} />
            <ThemedText style={styles.secondaryActionText}>
              {secondaryActionLabel}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryAction}>
            <ThemedText style={styles.primaryActionText}>{actionLabel}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const buildDetailSections = (
  product: Product,
  isSwap: boolean,
): DetailSection[] => {
  const conditionItems: DetailMetric[] = [
    {
      icon: 'hanger',
      label: 'Category',
      value: product.category ?? 'Lifestyle',
    },
    {
      icon: 'shield-check-outline',
      label: 'Condition',
      value: product.condition ?? 'Good',
    },
    {
      icon: 'ruler-square',
      label: 'Size',
      value: product.size ?? 'Flexible fit',
    },
  ];

  const fitItems: DetailMetric[] = [
    {
      icon: 'shoe-heel',
      label: 'Heel',
      value: product.heelHeight ?? 'Flat profile',
    },
    {
      icon: 'arrow-expand-horizontal',
      label: 'Fit',
      value: product.width ?? 'Standard',
    },
    {
      icon: isSwap ? 'cached' : 'cash-multiple',
      label: isSwap ? 'Exchange mode' : 'Price range',
      value: isSwap
        ? 'Item-for-item negotiation'
        : formatRange(product.priceMin, product.priceMax),
    },
  ];

  return [
    { title: 'Item details', items: conditionItems },
    { title: isSwap ? 'Exchange profile' : 'Value snapshot', items: fitItems },
  ];
};

const buildOfferItems = (product: Product) => {
  if (product.listingType === 'swap') {
    return [
      {
        icon: 'swap-horizontal-circle-outline',
        label: 'Looking for',
        value: 'Pieces with similar value and clean condition.',
      },
      {
        icon: 'shield-star-outline',
        label: 'Trade preference',
        value: 'Balanced exchange with clear photos and quick confirmation.',
      },
      {
        icon: 'clock-outline',
        label: 'Response cadence',
        value: 'Usually replies within the same day.',
      },
    ];
  }

  return [
    {
      icon: 'cash-check',
      label: 'Payment',
      value: 'Direct purchase with transparent pricing.',
    },
    {
      icon: 'truck-delivery-outline',
      label: 'Handover',
      value: 'Local meetup or agreed delivery flow.',
    },
    {
      icon: 'clock-outline',
      label: 'Availability',
      value: 'Ready to close quickly if the buyer confirms.',
    },
  ];
};

const formatRange = (priceMin?: string, priceMax?: string) => {
  if (priceMin && priceMax) {
    return `${priceMin} - ${priceMax}`;
  }

  if (priceMin) {
    return `From ${priceMin}`;
  }

  if (priceMax) {
    return `Up to ${priceMax}`;
  }

  return 'Flexible';
};

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 120,
    },
    hero: {
      position: 'relative',
      backgroundColor: colors.surface,
    },
    heroImage: {
      width,
      height: IMAGE_HEIGHT,
    },
    heroTopRow: {
      position: 'absolute',
      top: 18,
      left: HORIZONTAL_PADDING,
      right: HORIZONTAL_PADDING,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    iconButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: 'rgba(255,255,255,0.9)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroOverlay: {
      position: 'absolute',
      left: HORIZONTAL_PADDING,
      right: HORIZONTAL_PADDING,
      bottom: 18,
      gap: 12,
    },
    heroChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    heroChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.9)',
    },
    sellChip: {
      backgroundColor: '#d6eadc',
    },
    swapChip: {
      backgroundColor: '#dce7ef',
    },
    heroChipText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.accent,
    },
    galleryFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    paginationDot: {
      height: 8,
      borderRadius: 99,
    },
    paginationDotInactive: {
      width: 8,
      backgroundColor: 'rgba(255,255,255,0.55)',
    },
    paginationDotActive: {
      width: 22,
      backgroundColor: colors.surface,
    },
    galleryCount: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.surface,
    },
    thumbnailRow: {
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingVertical: 14,
      gap: 12,
    },
    thumbnailButton: {
      width: 74,
      height: 74,
      borderRadius: 20,
      padding: 3,
      backgroundColor: colors.surface,
    },
    thumbnailButtonActive: {
      borderWidth: 2,
      borderColor: colors.primary,
    },
    thumbnailButtonInactive: {
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
      borderRadius: 16,
    },
    content: {
      paddingHorizontal: HORIZONTAL_PADDING,
      gap: 16,
    },
    summaryCard: {
      padding: 20,
      borderRadius: 28,
      backgroundColor: colors.surface,
      gap: 16,
    },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
    },
    summaryCopy: {
      flex: 1,
      gap: 8,
    },
    productTitle: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700',
      color: colors.accent,
    },
    productSubtitle: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textSecondary,
    },
    priceBadge: {
      minWidth: 112,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 22,
      backgroundColor: colors.surfaceAlt,
      gap: 4,
    },
    priceBadgeLabel: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      color: colors.textSecondary,
    },
    priceBadgeValue: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.accent,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    metaPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.background,
    },
    metaText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.accent,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    tagPill: {
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: colors.tagSellBg,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.tagText,
    },
    sellerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: 18,
      borderRadius: 24,
      backgroundColor: colors.surface,
    },
    sellerIdentity: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    sellerAvatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
    },
    sellerInitialFallback: {
      position: 'absolute',
      left: 0,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
      zIndex: -1,
    },
    sellerInitialText: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.accent,
    },
    sellerCopy: {
      flex: 1,
      gap: 4,
    },
    sellerLabel: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: colors.textSecondary,
    },
    sellerName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.accent,
    },
    sellerMeta: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    sellerCta: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
    },
    descriptionCard: {
      padding: 20,
      borderRadius: 24,
      backgroundColor: colors.surface,
      gap: 14,
    },
    sectionCard: {
      padding: 20,
      borderRadius: 24,
      backgroundColor: colors.surface,
      gap: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    sectionTitle: {
      fontSize: 19,
      fontWeight: '700',
      color: colors.accent,
    },
    sectionAccent: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    locationSectionTitle: {
      fontSize: 19,
      fontWeight: '700',
      color: colors.textOnAccent,
    },
    locationSectionAccent: {
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    descriptionText: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.textSecondary,
    },
    metricGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    metricCard: {
      width: '48%',
      minHeight: 128,
      padding: 16,
      borderRadius: 22,
      backgroundColor: colors.background,
      gap: 10,
    },
    metricIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    metricLabel: {
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      color: colors.textSecondary,
    },
    metricValue: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
      color: colors.accent,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
      paddingVertical: 4,
    },
    infoIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    infoCopy: {
      flex: 1,
      gap: 4,
    },
    infoLabel: {
      fontSize: 13,
      fontWeight: '700',
      textTransform: 'uppercase',
      color: colors.textSecondary,
    },
    infoValue: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.accent,
    },
    locationCard: {
      padding: 20,
      borderRadius: 24,
      backgroundColor: colors.accent,
      gap: 16,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    locationPin: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    locationCopy: {
      flex: 1,
      gap: 4,
    },
    locationTitle: {
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      color: colors.textOnAccent,
    },
    locationText: {
      fontSize: 16,
      lineHeight: 22,
      color: colors.textOnAccent,
    },
    bottomBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingTop: 14,
      paddingBottom: 22,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    secondaryAction: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      minHeight: 56,
      borderRadius: 18,
      backgroundColor: colors.surface,
    },
    secondaryActionText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.accent,
    },
    primaryAction: {
      flex: 1.25,
      minHeight: 56,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    primaryActionText: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.textOnAccent,
    },
  });

export default ProductDetailScreen;
