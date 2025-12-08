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

const seedImages = [
  "https://images.unsplash.com/photo-1504198266285-165a04f2b417?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542293787938-4d273c37d8e1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=800&q=80",
];

const categories = ["Araba", "Ev Eşyası", "Elektronik", "Moda", "Kitap", "Hobi", "Diğer"];

const CreateListingScreen = () => {
  const accent = "#6c8cff";
  const dark = "#1f2125";
  const muted = "#7a7d82";
  const [images, setImages] = useState(seedImages);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [address, setAddress] = useState("Üsküdar, İstanbul"); // assume profilden geliyor
  const [addressInput, setAddressInput] = useState("");
  const [hasProfileAddress, setHasProfileAddress] = useState(true);

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
    if (!priceMin && !priceMax) return "Tahmini aralık";
    if (priceMin && priceMax) return `${priceMin} - ${priceMax} ₺`;
    return priceMin ? `${priceMin}+ ₺` : `~${priceMax} ₺`;
  }, [priceMin, priceMax]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#f7f8fb" }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.title, { color: dark }]}>Yeni ilan ekle</ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Fotoğrafları yükle, detayları doldur ve hemen paylaş.
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.helpChip}>
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
              style={[styles.photoBox, styles.addPhotoBox]}
              onPress={handleImagePicker}
            >
              <Icon name="plus" size={28} color={accent} />
              <ThemedText style={[styles.addPhotoText, { color: accent }]}>Fotoğraf ekle</ThemedText>
            </TouchableOpacity>
            {images.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.photoBox} />
            ))}
          </ScrollView>
          <View style={styles.addRow}>
            <View style={[styles.inputWithIcon, styles.flex]}>
              <Icon name="link-variant" size={18} color={muted} />
              <TextInput
                placeholder="Fotoğraf URL'si gir veya yapıştır"
                placeholderTextColor={muted}
                value={newImageUrl}
                onChangeText={setNewImageUrl}
                style={[styles.input, styles.noPadding, styles.flex]}
              />
            </View>
            <TouchableOpacity style={[styles.softButton, { backgroundColor: accent }]} onPress={addPhoto}>
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
              style={styles.input}
            />
          </View>
          <View style={styles.inputBlock}>
            <ThemedText style={[styles.label, { color: dark }]}>Açıklama</ThemedText>
            <TextInput
              placeholder="Durumu, özellikleri ve ek bilgileri yaz."
              placeholderTextColor={muted}
              style={[styles.input, styles.multiline]}
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
                key={cat}
                style={[
                  styles.chip,
                  { borderColor: accent },
                  selectedCategory === cat && { backgroundColor: accent + "1A", borderColor: accent },
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.9}
              >
                <ThemedText
                  style={[
                    styles.chipText,
                    { color: selectedCategory === cat ? dark : muted },
                  ]}
                >
                  {cat}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: dark }]}>Tahmini fiyat aralığı</ThemedText>
          <ThemedText style={[styles.sectionHint, { color: muted }]}>
            Takas odaklı. Alıcıya fikir vermek için aralık ekle.
          </ThemedText>
          <View style={styles.row}>
            <View style={[styles.inputBlock, styles.half]}>
              <ThemedText style={[styles.label, { color: dark }]}>Minimum</ThemedText>
              <View style={styles.inputWithIcon}>
                <TextInput
                  placeholder="1000"
                  placeholderTextColor={muted}
                  keyboardType="numeric"
                  value={priceMin}
                  onChangeText={setPriceMin}
                  style={[styles.input, styles.noPadding, styles.flex]}
                />
                <ThemedText style={[styles.suffix, { color: dark }]}>₺</ThemedText>
              </View>
            </View>
            <View style={[styles.inputBlock, styles.half]}>
              <ThemedText style={[styles.label, { color: dark }]}>Maksimum</ThemedText>
              <View style={styles.inputWithIcon}>
                <TextInput
                  placeholder="3000"
                  placeholderTextColor={muted}
                  keyboardType="numeric"
                  value={priceMax}
                  onChangeText={setPriceMax}
                  style={[styles.input, styles.noPadding, styles.flex]}
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
          <View style={styles.locationCard}>
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
                  style={[styles.input, styles.multiline]}
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
          <ThemedButton onPress={() => {}}>İlanı Yayınla</ThemedButton>
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
    padding: 18,
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  helpChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9f9ef",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 10,
    gap: 6,
  },
  helpText: {
    fontWeight: "700",
    fontSize: 13,
  },
  section: {
    marginTop: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  sectionHint: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeInfo: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },
  photoBox: {
    width: 110,
    height: 110,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: "#dbe2ea",
  },
  addPhotoBox: {
    borderWidth: 1.2,
    borderColor: "#4ad17b",
    backgroundColor: "rgba(74,209,123,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },
  photoScroller: {
    marginBottom: 10,
  },
  addRow: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputBlock: {
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e1e4ea",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  multiline: {
    minHeight: 120,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
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
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e1e4ea",
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
    backgroundColor: "#ffffff",
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
    backgroundColor: "#e9ecf4",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  softButtonText: {
    color: "#1f2125",
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
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e1e4ea",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  locationSub: {
    fontSize: 12,
    marginTop: 4,
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
    marginTop: 20,
  },
});
