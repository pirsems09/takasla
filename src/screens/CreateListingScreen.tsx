import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from "react-native-image-picker";
import { ThemedText } from "../components/ThemedText";
import { ThemedButton } from "../components/ThemedButton";
import { categories } from "../data/mockData";
import { useTheme } from "../hooks/useTheme";

const seedImages = [
  "https://images.unsplash.com/photo-1504198266285-165a04f2b417?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542293787938-4d273c37d8e1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=800&q=80",
];


const CreateListingScreen = () => {
  const { colors } = useTheme();
  const accent = colors.complementary;
  const dark = colors.text;
  const muted = colors.textSecondary;
  const [images, setImages] = useState(seedImages);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [address, setAddress] = useState("Üsküdar, İstanbul"); // assume profilden geliyor
  const [addressInput, setAddressInput] = useState("");
  const [hasProfileAddress, setHasProfileAddress] = useState(true);
  const [isDonation, setIsDonation] = useState(false);

  const addPhoto = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    setImages((prev) => [url, ...prev].slice(0, 10));
    setNewImageUrl("");
  };

  const handleImagePicker = () => {
    Alert.alert(
      "Fotoğraf Ekle",
      "Fotoğrafı nereden eklemek istersin?",
      [
        {
          text: "Galeri",
          onPress: () => openImageLibrary(),
        },
        {
          text: "Kamera",
          onPress: () => openCamera(),
        },
        {
          text: "İptal",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const openImageLibrary = () => {
    const options = {
      mediaType: "photo" as MediaType,
      selectionLimit: 10 - images.length,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorMessage) {
        Alert.alert("Hata", response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const newImages = response.assets
          .map((asset) => asset.uri)
          .filter((uri): uri is string => uri !== undefined)
          .slice(0, 10 - images.length);
        setImages((prev) => [...newImages, ...prev].slice(0, 10));
      }
    });
  };

  const openCamera = () => {
    const options = {
      mediaType: "photo" as MediaType,
      saveToPhotos: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorMessage) {
        Alert.alert("Hata", response.errorMessage);
        return;
      }
      if (response.assets && response.assets[0]?.uri) {
        const newImageUri = response.assets[0].uri;
        if (images.length < 10) {
          setImages((prev) => [newImageUri, ...prev].slice(0, 10));
        } else {
          Alert.alert("Uyarı", "En fazla 10 fotoğraf ekleyebilirsiniz.");
        }
      }
    });
  };

  const useProfileAddress = () => {
    if (!hasProfileAddress) return;
    setAddress("Üsküdar, İstanbul");
  };

  const saveAddress = () => {
    if (!addressInput.trim()) return;
    setAddress(addressInput.trim());
    setHasProfileAddress(true);
    setAddressInput("");
  };

  const priceRangeLabel = useMemo(() => {
    if (isDonation) return "Bağış Ürünü (Ücretsiz)";
    if (!priceMin && !priceMax) return "Tahmini aralık";
    if (priceMin && priceMax) return `${priceMin} - ${priceMax} ₺`;
    return priceMin ? `${priceMin}+ ₺` : `~${priceMax} ₺`;
  }, [priceMin, priceMax, isDonation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.title, { color: dark }]}>Yeni ilan ekle</ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Fotoğrafları yükle, detayları doldur ve hemen paylaş.
            </ThemedText>
          </View>
          <TouchableOpacity style={[styles.helpChip, { backgroundColor: colors.secondary + "20" }]}>
            <Icon name="chat-question-outline" size={18} color={accent} />
            <ThemedText style={[styles.helpText, { color: accent }]}>Yardım</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: dark }]}>Fotoğraflar</ThemedText>
            <ThemedText style={[styles.sectionHint, { color: muted }]}>En az 1, en çok 10</ThemedText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroller}>
            <TouchableOpacity
              style={[styles.photoBox, styles.addPhotoBox, { borderColor: colors.textSecondary, backgroundColor: colors.secondary + "0A" }]}
              onPress={handleImagePicker}
            >
              <Icon name="plus" size={28} />
              <ThemedText style={[styles.addPhotoText]}>Fotoğraf ekle</ThemedText>
            </TouchableOpacity>
            {images.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.photoBox} />
            ))}
          </ScrollView>
          <View style={styles.addRow}>
            <View style={[styles.inputWithIcon, styles.flex, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Icon name="link-variant" size={18} color={muted} />
              <TextInput
                placeholder="Fotoğraf URL'si gir veya yapıştır"
                placeholderTextColor={muted}
                value={newImageUrl}
                onChangeText={setNewImageUrl}
                style={[styles.input, styles.noPadding, styles.flex, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              />
            </View>
            <TouchableOpacity style={[styles.softButton, { backgroundColor: colors.secondary }]} onPress={addPhoto}>
              <Icon name="check" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: dark }]}>İlan Bilgileri</ThemedText>
          <View style={styles.inputBlock}>
            <ThemedText style={[styles.label, { color: dark }]}>Başlık</ThemedText>
            <TextInput
              placeholder="Örn: Yeşil çift kişilik kanepe"
              placeholderTextColor={muted}
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            />
          </View>
          <View style={styles.inputBlock}>
            <ThemedText style={[styles.label, { color: dark }]}>Açıklama</ThemedText>
            <TextInput
              placeholder="Durumu, özellikleri ve ek bilgileri yaz."
              placeholderTextColor={muted}
              style={[styles.input, styles.multiline, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: dark }]}>Kategori</ThemedText>
          <View style={styles.chips}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                  selectedCategory === cat.title && { backgroundColor: colors.secondary + "1A", borderColor: colors.secondary },
                ]}
                onPress={() => setSelectedCategory(cat.title)}
                activeOpacity={0.9}
              >
                <ThemedText
                  style={[
                    styles.chipText,
                    { color: selectedCategory === cat.title ? dark : muted },
                  ]}
                >
                  {cat.title}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.donationToggle,
              { borderColor: isDonation ? colors.secondary : colors.border, backgroundColor: colors.surface },
              isDonation && { backgroundColor: colors.secondary + "0A" }
            ]}
            onPress={() => {
              setIsDonation(!isDonation);
              if (!isDonation) {
                setPriceMin("0");
                setPriceMax("0");
              }
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.donationIconWrapper, { backgroundColor: colors.background }]}>
              <Icon name="heart-flash" size={24} color={isDonation ? colors.secondary : muted} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.sectionTitle, { color: dark, fontSize: 15 }]}>
                Bu ürünü bağışlamak istiyorum
              </ThemedText>
              <ThemedText style={[styles.sectionHint, { color: "#7a7d82" }]}>
                İhtiyacı olanlara ücretsiz ulaştırın.
              </ThemedText>
            </View>
            <View style={[styles.toggleTrack, { backgroundColor: colors.border }, isDonation && { backgroundColor: colors.secondary }]}>
              <View style={[styles.toggleThumb, { backgroundColor: colors.surface }, isDonation && { transform: [{ translateX: 18 }] }]} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, isDonation && { opacity: 0.5 }]}>
          <ThemedText style={[styles.sectionTitle, { color: dark }]}>Tahmini fiyat aralığı</ThemedText>
          <ThemedText style={[styles.sectionHint, { color: muted }]}>
            {isDonation ? "Bağış ürünlerinde fiyat girilemez." : "Takas odaklı. Alıcıya fikir vermek için aralık ekle."}
          </ThemedText>
          <View style={styles.row}>
            <View style={[styles.inputBlock, styles.half]}>
              <ThemedText style={[styles.label, { color: dark }]}>Minimum</ThemedText>
              <View style={[styles.inputWithIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  placeholder="1000"
                  placeholderTextColor={muted}
                  keyboardType="numeric"
                  value={priceMin}
                  onChangeText={setPriceMin}
                  editable={!isDonation}
                  style={[styles.input, styles.noPadding, styles.flex, { backgroundColor: colors.surface, color: colors.text }]}
                />
                <ThemedText style={[styles.suffix, { color: dark }]}>₺</ThemedText>
              </View>
            </View>
            <View style={[styles.inputBlock, styles.half]}>
              <ThemedText style={[styles.label, { color: dark }]}>Maksimum</ThemedText>
              <View style={[styles.inputWithIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  placeholder="3000"
                  placeholderTextColor={muted}
                  keyboardType="numeric"
                  value={priceMax}
                  onChangeText={setPriceMax}
                  editable={!isDonation}
                  style={[styles.input, styles.noPadding, styles.flex, { backgroundColor: colors.surface, color: colors.text }]}
                />
                <ThemedText style={[styles.suffix, { color: dark }]}>₺</ThemedText>
              </View>
            </View>
          </View>
          <ThemedText style={[styles.badgeInfo, { color: accent }]}>{priceRangeLabel}</ThemedText>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: dark }]}>Adres</ThemedText>
            {hasProfileAddress ? (
              <TouchableOpacity style={styles.linkRow} onPress={useProfileAddress}>
                <Icon name="account" size={18} color={accent} />
                <ThemedText style={[styles.linkText, { color: accent }]}>Profilden al</ThemedText>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={[styles.locationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {hasProfileAddress && address ? (
              <>
                <View style={styles.locationRow}>
                  <Icon name="map-marker-outline" size={22} color={accent} />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={[styles.locationTitle, { color: dark }]}>{address}</ThemedText>
                    <ThemedText style={[styles.locationSub, { color: muted }]}>
                      Profilden gelen adres, dilersen düzenle.
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity style={styles.softButton} onPress={() => setHasProfileAddress(false)}>
                  <ThemedText style={styles.softButtonText}>Adres değiştir</ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <ThemedText style={[styles.label, { color: dark }]}>Adres ekle</ThemedText>
                <TextInput
                  placeholder="Mahalle, il/ilçe, açık adres"
                  placeholderTextColor={muted}
                  value={addressInput}
                  onChangeText={setAddressInput}
                  style={[styles.input, styles.multiline, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                <ThemedButton onPress={saveAddress}>Adresi Kaydet</ThemedButton>
              </>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedButton onPress={() => { }}>İlanı Yayınla</ThemedButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 80,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 22,
    opacity: 0.8,
  },
  helpChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9f9ef",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginLeft: 10,
    gap: 8,
  },
  helpText: {
    fontWeight: "800",
    fontSize: 13,
  },
  section: {
    marginTop: 36,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  sectionHint: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.7,
  },
  badgeInfo: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },
  photoBox: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginRight: 16,
  },
  addPhotoBox: {
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoText: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
  },
  photoScroller: {
    marginBottom: 16,
  },
  addRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  inputBlock: {
    marginTop: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  multiline: {
    minHeight: 120,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "700",
  },
  donationToggle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    gap: 16,
  },
  donationIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTrack: {
    width: 48,
    height: 26,
    borderRadius: 14,
    padding: 2,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  half: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  noPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  suffix: {
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 8,
  },
  select: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  selectText: {
    fontSize: 14,
    fontWeight: "700",
  },
  softButton: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  softButtonText: {
    fontWeight: "700",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "700",
  },
  locationCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  locationSub: {
    fontSize: 13,
    marginTop: 6,
    opacity: 0.7,
  },
  mapThumb: {
    marginTop: 6,
    borderRadius: 12,
    overflow: "hidden",
    height: 140,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
  },
});
