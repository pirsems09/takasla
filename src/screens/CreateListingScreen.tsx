import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ImagePickerResponse,
  MediaType,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { ThemedText } from '../components/ThemedText';
import SectionCard from '../components/SectionCard';
import { useListingStore } from '../store/listingStore';
import { useAuthStore } from '../store/authStore';
import { useModalStore } from '../store/modalStore';

type ListingCategory =
  | 'Elektronik'
  | 'Giyim'
  | 'Ev ve Yaşam'
  | 'Araç ve Motor'
  | 'Spor ve Outdoor'
  | 'Anne ve Bebek'
  | 'Hobi ve Kitap';
type ListingType = 'sell' | 'swap' | 'donate';
type ConditionType = 'Yeni gibi' | 'Az kullanilmis' | 'Iyi' | 'Yipranmis';

type ListingFormState = {
  title: string;
  description: string;
  category: ListingCategory;
  listingType: ListingType;
  condition: ConditionType;
  tags: string;
  // Kategoriye göre dinamik özellikler (key -> değer)
  features: Record<string, string>;
  price: string;
  priceMin: string;
  priceMax: string;
  address: string;
  rating: string;
  distance: string;
};

type ImageSlot = {
  id: string;
  label: string;
  uri?: string;
};

type SelectOption<T extends string> = {
  id: T;
  label: string;
};

const categoryOptions: SelectOption<ListingCategory>[] = [
  { id: 'Elektronik', label: 'Elektronik' },
  { id: 'Giyim', label: 'Giyim' },
  { id: 'Ev ve Yaşam', label: 'Ev ve Yaşam' },
  { id: 'Araç ve Motor', label: 'Araç ve Motor' },
  { id: 'Spor ve Outdoor', label: 'Spor ve Outdoor' },
  { id: 'Anne ve Bebek', label: 'Anne ve Bebek' },
  { id: 'Hobi ve Kitap', label: 'Hobi ve Kitap' },
];

const listingTypeOptions: SelectOption<ListingType>[] = [
  { id: 'sell', label: 'Satış' },
  { id: 'swap', label: 'Takas' },
  { id: 'donate', label: 'Bağış' },
];

const conditionOptions: SelectOption<ConditionType>[] = [
  { id: 'Yeni gibi', label: 'Yeni gibi' },
  { id: 'Az kullanilmis', label: 'Az kullanilmis' },
  { id: 'Iyi', label: 'Iyi' },
  { id: 'Yipranmis', label: 'Yipranmis' },
];

type CategoryFeature = {
  key: string;
  label: string;
  placeholder: string;
};

/**
 * Her kategori için "Özellikler" bölümünde gösterilecek dinamik alanlar.
 * Kategoriye göre farklı sayıda ve tipte özellik gösterilir.
 * Form state'indeki `features` record'ında saklanır (key -> değer).
 */
const categoryFeatures: Record<ListingCategory, CategoryFeature[]> = {
  Elektronik: [
    { key: 'marka', label: 'Marka', placeholder: 'Apple / Samsung' },
    { key: 'model', label: 'Model', placeholder: 'iPhone 13 Pro' },
    { key: 'garanti', label: 'Garanti Durumu', placeholder: 'Var / Yok / 6 ay' },
    { key: 'kondisyon', label: 'Kondisyon', placeholder: 'Yeni gibi / İyi' },
    { key: 'renk', label: 'Renk', placeholder: 'Siyah' },
    { key: 'depolama', label: 'Depolama Kapasitesi', placeholder: '128 GB' },
    { key: 'ram', label: 'RAM', placeholder: '8 GB' },
    { key: 'baglanti', label: 'Bağlantı Türü', placeholder: 'Wi-Fi / Bluetooth / USB-C' },
  ],
  Giyim: [
    { key: 'cinsiyet', label: 'Cinsiyet', placeholder: 'Kadın / Erkek / Unisex' },
    { key: 'beden', label: 'Beden', placeholder: 'S / M / L / 39' },
    { key: 'marka', label: 'Marka', placeholder: 'Zara / Mavi' },
    { key: 'kumas', label: 'Kumaş Tipi', placeholder: 'Pamuk / Polyester' },
    { key: 'renk', label: 'Renk', placeholder: 'Siyah / Beyaz' },
    { key: 'kondisyon', label: 'Kondisyon', placeholder: 'Yeni gibi / İyi' },
    { key: 'sezon', label: 'Sezon', placeholder: 'İlkbahar / Sonbahar' },
  ],
  'Ev ve Yaşam': [
    { key: 'urunTipi', label: 'Ürün Tipi', placeholder: 'Masa / Sandalye / Halı' },
    { key: 'materyal', label: 'Materyal', placeholder: 'Ahşap / MDF / Cam' },
    { key: 'renk', label: 'Renk', placeholder: 'Beyaz / Kahve' },
    { key: 'boyutlar', label: 'Boyutlar', placeholder: '120x60 cm' },
    { key: 'kondisyon', label: 'Kondisyon', placeholder: 'Yeni gibi / İyi' },
    { key: 'tarz', label: 'Tarz', placeholder: 'Modern / Klasik' },
    { key: 'marka', label: 'Marka', placeholder: 'IKEA / Koçtaş' },
  ],
  'Araç ve Motor': [
    { key: 'marka', label: 'Marka', placeholder: 'Toyota / BMW' },
    { key: 'model', label: 'Model', placeholder: 'Corolla / 320i' },
    { key: 'yil', label: 'Yıl', placeholder: '2020' },
    { key: 'kilometre', label: 'Kilometre', placeholder: '45.000 km' },
    { key: 'yakit', label: 'Yakıt Tipi', placeholder: 'Benzin / Dizel / Elektrik' },
    { key: 'vites', label: 'Vites Tipi', placeholder: 'Otomatik / Manuel' },
    { key: 'kasa', label: 'Kasa Tipi', placeholder: 'Sedan / SUV / Hatchback' },
    { key: 'hasar', label: 'Hasar Durumu', placeholder: 'Hasarsız / Boyalı' },
  ],
  'Spor ve Outdoor': [
    { key: 'brans', label: 'Branş', placeholder: 'Futbol / Koşu / Bisiklet' },
    { key: 'kondisyon', label: 'Kondisyon', placeholder: 'Yeni gibi / İyi' },
    { key: 'marka', label: 'Marka', placeholder: 'Nike / Adidas' },
    { key: 'seviye', label: 'Seviye', placeholder: 'Başlangıç / Profesyonel' },
    { key: 'materyal', label: 'Materyal', placeholder: 'Sentetik / Deri' },
    { key: 'renk', label: 'Renk', placeholder: 'Siyah / Kırmızı' },
  ],
  'Anne ve Bebek': [
    { key: 'kategori', label: 'Kategori', placeholder: 'Bebek Arabası / Oyuncak / Giysi' },
    { key: 'yasAraligi', label: 'Yaş Aralığı', placeholder: '0-6 ay / 1-3 yaş' },
    { key: 'cinsiyet', label: 'Cinsiyet', placeholder: 'Erkek / Kız / Unisex' },
    { key: 'marka', label: 'Marka', placeholder: 'Chicco / Fisher-Price' },
    { key: 'materyal', label: 'Materyal', placeholder: 'Pamuk / Plastik' },
    { key: 'kondisyon', label: 'Kondisyon', placeholder: 'Yeni gibi / İyi' },
  ],
  'Hobi ve Kitap': [
    { key: 'turSanatci', label: 'Tür/Sanatçı', placeholder: 'Roman / Yazar adı' },
    { key: 'basimYili', label: 'Basım Yılı', placeholder: '2019' },
    { key: 'kondisyon', label: 'Kondisyon', placeholder: 'Yeni gibi / İyi' },
  ],
};

const initialSlots: ImageSlot[] = [
  {
    id: 'primary',
    label: 'Ana Kapak',
  },
  {
    id: 'reference',
    label: 'Referans Ekle',
  },
];

type CreateListingNavigation = {
  goBack?: () => void;
};

type CreateListingScreenProps = {
  navigation?: CreateListingNavigation;
};

const CreateListingScreen = ({ navigation }: CreateListingScreenProps) => {

  const showModal = useModalStore((s) => s.showModal);
  const hideModal = useModalStore((s) => s.hideModal);

  const [formState, setFormState] = useState<ListingFormState>({
    title: '',
    description: '',
    category: 'Giyim',
    listingType: 'sell',
    condition: 'Az kullanilmis',
    tags: '',
    features: {},
    price: '',
    priceMin: '',
    priceMax: '',
    address: '',
    rating: '',
    distance: '',
  });
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(initialSlots);
  const createListing = useListingStore((s) => s.createListing);
  const uploadImage = useListingStore((s) => s.uploadImage);
  const [publishing, setPublishing] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const selectedImagesCount = useMemo(
    () => imageSlots.filter((slot) => Boolean(slot.uri)).length,
    [imageSlots]
  );

  const updateField = <K extends keyof ListingFormState>(
    key: K,
    value: ListingFormState[K]
  ) => {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateFeature = (key: string, value: string) => {
    setFormState((current) => ({
      ...current,
      features: { ...current.features, [key]: value },
    }));
  };

  const features = useMemo(
    () => categoryFeatures[formState.category] ?? [],
    [formState.category]
  );

  const handleCategoryChange = (category: ListingCategory) => {
    setFormState((current) => ({
      ...current,
      category,
      // Özellik alanları kategoriye göre tamamen değişir; sıfırla
      features: {},
    }));
  };

  const handleListingTypeChange = (type: ListingType) => {
    setFormState((current) => ({
      ...current,
      listingType: type,
      // Bağış: fiyat alanı yok; Takas: sadece tahmini takas fiyatı; Satış: fiyat + aralık
      price: type === 'donate' ? '' : current.price,
      priceMin: type === 'sell' ? current.priceMin : '',
      priceMax: type === 'sell' ? current.priceMax : '',
    }));
  };

  const handleImagePicker = (slotId: string) => {
    showModal({
      title: 'Referans Görseli',
      description: 'Görsel nereden alınsın?',
      buttons: [
        { text: 'Galeri', onPress: () => openImageLibrary(slotId) },
        { text: 'Kamera', onPress: () => openCamera(slotId) },
        { text: 'İptal', mode: 'text' },
      ],
    });
  };

  const openImageLibrary = (slotId: string) => {
    launchImageLibrary(
      {
        mediaType: 'photo' as MediaType,
        selectionLimit: 1,
      },
      (response: ImagePickerResponse) => {
        applyPickedImage(slotId, response);
      }
    );
  };

  const openCamera = (slotId: string) => {
    launchCamera(
      {
        mediaType: 'photo' as MediaType,
        saveToPhotos: true,
      },
      (response: ImagePickerResponse) => {
        applyPickedImage(slotId, response);
      }
    );
  };

  const applyPickedImage = (slotId: string, response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorMessage) {
      showModal({
        title: 'Hata',
        description: response.errorMessage,
        buttons: [{ text: 'Tamam' }],
      });
      return;
    }

    const assetUri = response.assets?.[0]?.uri;
    if (!assetUri) {
      return;
    }

    setImageSlots((current) =>
      current.map((slot) =>
        slot.id === slotId
          ? {
            ...slot,
            uri: assetUri,
          }
          : slot
      )
    );
  };

  const resolveImageUrls = async (): Promise<string[]> => {
    const uris = imageSlots
      .map((slot) => slot.uri)
      .filter((uri): uri is string => Boolean(uri));
    const urls: string[] = [];
    for (const uri of uris) {
      // Uzak URL'leri (ör. placeholder) olduğu gibi kullan; yerel dosya URI'lerini Storage'a yükle
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        urls.push(uri);
      } else {
        const publicUrl = await uploadImage(uri);
        urls.push(publicUrl);
      }
    }
    return urls;
  };

  const handlePublish = async () => {
    if (!formState.title.trim()) {
      showModal({
        title: 'Eksik bilgi',
        description: 'Lütfen ilan başlığı girin.',
        buttons: [{ text: 'Tamam' }],
      });
      return;
    }
    setPublishing(true);
    try {
      const imageUrls = await resolveImageUrls();
      const userTags = formState.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      // Dinamik özellikleri "Etiket: Değer" formatında tags'a göm
      const featureTags = Object.entries(formState.features)
        .filter(([, value]) => value.trim())
        .map(([key, value]) => {
          const feature = features.find((f) => f.key === key);
          return `${feature?.label ?? key}: ${value.trim()}`;
        });
      const product = await createListing({
        title: formState.title.trim(),
        description: formState.description,
        category: formState.category,
        listingType: formState.listingType,
        condition: formState.condition,
        tags: [...userTags, ...featureTags],
        price: formState.listingType === 'donate' ? '0' : formState.price || '0',
        priceMin: formState.listingType === 'sell' ? formState.priceMin : '',
        priceMax: formState.listingType === 'sell' ? formState.priceMax : '',
        address: formState.address,
        rating: Number(formState.rating) || 0,
        distance: formState.distance,
        imageUrls,
      });
      showModal({
        title: 'İlan yayınlandı',
        description: `"${product.title}" başarıyla oluşturuldu.`,
        buttons: [
          { text: 'Tamam', onPress: () => navigation?.goBack?.() },
        ],
      });
    } catch (e) {
      showModal({
        title: 'Yayınlanamadı',
        description: e instanceof Error ? e.message : 'Bir hata oluştu.',
        buttons: [{ text: 'Tamam' }],
      });
    } finally {
      setPublishing(false);
    }
  };

  // Giriş yapılmamışsa form yerine uyarı kartı göster (ilan eklemek RLS
  // gereği auth gerektirir — kullanıcı formu boşuna doldurmasın).
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestWrap}>
          <View style={styles.guestIconWrap}>
            <Icon name="lock-outline" size={40} color="#0f4c5c" />
          </View>
          <ThemedText style={styles.guestTitle}>İlan eklemek için giriş yap</ThemedText>
          <ThemedText style={styles.guestSubtitle}>
            Takasla'da ilan yayınlayabilmek, fotoğraf yükleyebilmek ve diğer
            kullanıcılarla iletişim kurabilmek için hesabına giriş yapmalısın.
          </ThemedText>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.guestButton}
            onPress={() => navigation?.goBack?.()}
          >
            <ThemedText style={styles.guestButtonText}>Geri Dön</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.segmentRow}>
          <TouchableOpacity activeOpacity={0.9} style={styles.segmentTabActive}>
            <ThemedText style={styles.segmentActiveText}>İlan</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} style={styles.segmentTab}>
            <ThemedText style={styles.segmentText}>Detay Parametreleri</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.introCard}>
          <View style={styles.introTopRow}>
            <View style={styles.introBadge}>
              <Icon name="clipboard-text-outline" size={16} color="#0f4c5c" />
              <ThemedText style={styles.introBadgeText}>İlan Kurulumu</ThemedText>
            </View>
            <View style={styles.introValueBadge}>
              <ThemedText style={styles.introValueLabel}>Mod</ThemedText>
              <ThemedText style={styles.introValueText}>{formState.listingType}</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.introTitle}>Daha temiz bir detay sayfası yükü oluşturun</ThemedText>
          <ThemedText style={styles.introText}>
            Aşağıdaki gruplandırılmış girdiler, ürün detay ekranında kullanılan yapıyı yansıtır, bu sayede gerekli veriler daha kolay taranır ve tamamlanır.
          </ThemedText>
          <View style={styles.introStatsRow}>
            <View style={styles.introStatChip}>
              <Icon name="image-multiple-outline" size={14} color="#ffffff" />
              <ThemedText style={styles.introStatText}>{selectedImagesCount}/2 medya</ThemedText>
            </View>
            <View style={styles.introStatChipMuted}>
              <Icon name="map-marker-outline" size={14} color="#0f4c5c" />
              <ThemedText style={styles.introStatMutedText}>
                {formState.address || 'Konum bekleniyor'}
              </ThemedText>
            </View>
          </View>
        </View>

        <SectionCard
          eyebrow="Temel"
          title="Birincil ilan detayları"
          description="Kullanıcıların ilk fark ettiği içerikle başlayın: başlık, kategori, açıklama ve ilan modu."
        >
          <FieldCard label="İlan Başlığı" compact>
            <TextInput
              value={formState.title}
              onChangeText={(value) => updateField('title', value)}
              placeholder="Kısa bir başlık ekleyin"
              placeholderTextColor="#b4a39a"
              style={styles.textInput}
            />
          </FieldCard>

          <FieldCard label="Açıklama" compact>
            <TextInput
              value={formState.description}
              onChangeText={(value) => updateField('description', value)}
              placeholder="Eşyayı açıklayın"
              placeholderTextColor="#b4a39a"
              style={styles.multilineInput}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </FieldCard>


        </SectionCard>

        <SectionCard
          eyebrow="İlan Modu"
          title={null}
          description={null}
        >
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <SelectCard
                label="İlan Türü"
                value={listingTypeOptions.find((option) => option.id === formState.listingType)?.label ?? ''}
                onPress={() =>
                  cycleSelection(
                    formState.listingType,
                    listingTypeOptions,
                    handleListingTypeChange
                  )
                }
                compact
              />
            </View>
            <View style={styles.rowItem}>
              <SelectCard
                label="Durum"
                value={formState.condition}
                onPress={() =>
                  cycleSelection(formState.condition, conditionOptions, (value) =>
                    updateField('condition', value)
                  )
                }
                compact
              />
            </View>
          </View>

        </SectionCard>

        <SectionCard
          eyebrow="Kategorİ"
          title="Kategori seçimi"
          description="Kategori seçimi, ilan detaylarının birincil özelliğidir. Kategorinin seçimi, ilanın görüntülenme alanını ve fiyatlandırma mekanizmasını etkiler."
        >
          <View style={styles.sectionBlock}>
            <View style={styles.chipGroup}>
              {categoryOptions.map((option) => {
                const selected = formState.category === option.id;

                return (
                  <TouchableOpacity
                    key={option.id}
                    activeOpacity={0.9}
                    onPress={() => handleCategoryChange(option.id)}
                    style={[
                      styles.chip,
                      selected ? styles.chipSelected : styles.chipDefault,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.chipText,
                        selected ? styles.chipTextSelected : styles.chipTextDefault,
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </SectionCard>

        <SectionCard
          eyebrow="Özellikler"
          title="Ürün özellikleri"
          description="Bu alanlar detay ekranındaki rozetleri ve metrik kartları besler."
        >
          <FieldCard label="Etiketler" compact>
            <TextInput
              value={formState.tags}
              onChangeText={(value) => updateField('tags', value)}
              placeholder="Virgülle ayrılmış etiketler"
              placeholderTextColor="#b4a39a"
              style={styles.textInput}
            />
          </FieldCard>

          {features.length > 1 && (
            <View style={styles.row}>
              {features.slice(0, 2).map((feature) => (
                <View key={feature.key} style={styles.rowItem}>
                  <FieldCard label={feature.label} compact>
                    <TextInput
                      value={formState.features[feature.key] ?? ''}
                      onChangeText={(value) => updateFeature(feature.key, value)}
                      placeholder={feature.placeholder}
                      placeholderTextColor="#b4a39a"
                      style={styles.textInput}
                    />
                  </FieldCard>
                </View>
              ))}
            </View>
          )}

          {features.slice(2).map((feature) => (
            <FieldCard key={feature.key} label={feature.label} compact>
              <TextInput
                value={formState.features[feature.key] ?? ''}
                onChangeText={(value) => updateFeature(feature.key, value)}
                placeholder={feature.placeholder}
                placeholderTextColor="#b4a39a"
                style={styles.textInput}
              />
            </FieldCard>
          ))}
        </SectionCard>

        <SectionCard
          eyebrow="Değer"
          title={formState.listingType === 'donate' ? 'Konum ve güven' : 'Fiyatlandırma ve güven'}
          description={
            formState.listingType === 'donate'
              ? 'Bağış ilanlarında fiyat alanı bulunmaz; konum ve güven bilgilerini ekleyin.'
              : formState.listingType === 'swap'
                ? 'Takas ilanları için tahmini takas fiyatını girin; konum ve güven bağlamını tamamlayın.'
                : 'Değer aralığı ve konum bağlamı sağlayarak satış akışını tamamlayın.'
          }
        >
          {formState.listingType === 'donate' ? (
            <View style={styles.donateNote}>
              <Icon name="gift-outline" size={18} color="#0f4c5c" />
              <ThemedText style={styles.donateNoteText}>
                Bağış ilanları ücretsizdir; fiyat bilgisi girilmez.
              </ThemedText>
            </View>
          ) : formState.listingType === 'swap' ? (
            <FieldCard label="Tahmini Takas Fiyatı" compact>
              <TextInput
                value={formState.price}
                onChangeText={(value) => updateField('price', value)}
                placeholder="1400"
                placeholderTextColor="#b4a39a"
                style={styles.textInput}
                keyboardType="numeric"
              />
            </FieldCard>
          ) : (
            <>
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <FieldCard label="Fiyat" compact>
                    <TextInput
                      value={formState.price}
                      onChangeText={(value) => updateField('price', value)}
                      placeholder="1400"
                      placeholderTextColor="#b4a39a"
                      style={styles.textInput}
                      keyboardType="numeric"
                    />
                  </FieldCard>
                </View>
                <View style={styles.rowItem}>
                  <FieldCard label="Min Fiyat" compact>
                    <TextInput
                      value={formState.priceMin}
                      onChangeText={(value) => updateField('priceMin', value)}
                      placeholder="1000"
                      placeholderTextColor="#b4a39a"
                      style={styles.textInput}
                      keyboardType="numeric"
                    />
                  </FieldCard>
                </View>
              </View>

              <FieldCard label="Maks Fiyat" compact>
                <TextInput
                  value={formState.priceMax}
                  onChangeText={(value) => updateField('priceMax', value)}
                  placeholder="3000"
                  placeholderTextColor="#b4a39a"
                  style={styles.textInput}
                  keyboardType="numeric"
                />
              </FieldCard>
            </>
          )}

        </SectionCard>

        <SectionCard
          eyebrow="Konum"
          title="Konum bilgileri"
          description="Konum bilgileri, ilanın görüntülenme alanını ve fiyatlandırma mekanizmasını etkiler."
        >
          <FieldCard label="Adres" compact>
            <TextInput
              value={formState.address}
              onChangeText={(value) => updateField('address', value)}
              placeholder="İlçe, Şehir"
              placeholderTextColor="#b4a39a"
              style={styles.textInput}
            />
          </FieldCard>
        </SectionCard>

        <SectionCard
          eyebrow="Medya"
          title="Referans fotoğrafları"
          description="Bu görseller detay sayfasındaki ana galeriyi ve küçük resim çubuğunu yönetir."
        >
          <View style={styles.uploadHeader}>
            <ThemedText style={styles.sectionLabel}>Referans Fotoğrafları</ThemedText>
            <ThemedText style={styles.uploadCounter}>
              {selectedImagesCount}/2 seçildi
            </ThemedText>
          </View>

          <View style={styles.imageGrid}>
            {imageSlots.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                activeOpacity={0.92}
                onPress={() => handleImagePicker(slot.id)}
                style={styles.imageSlot}
              >
                {slot.uri ? (
                  <>
                    <Image source={{ uri: slot.uri }} style={styles.slotImage} />
                    <View style={styles.slotOverlay}>
                      <Icon name="camera-outline" size={16} color="#9d5a43" />
                    </View>
                  </>
                ) : (
                  <View style={styles.emptySlot}>
                    <Icon name="plus" size={22} color="#cf7e63" />
                    <ThemedText style={styles.emptySlotText}>{slot.label}</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Icon name="leaf" size={16} color="#bd6c4d" />
          </View>
          <View style={styles.tipContent}>
            <ThemedText style={styles.tipTitle}>İpucu: Detay Kapsamı</ThemedText>
            <ThemedText style={styles.tipText}>
              Durum, fiyat aralığı, uyum ve konumu doldurun, böylece ürün detay
              ekranı ilanı yedek değerler olmadan görüntüleyebilir.
            </ThemedText>
          </View>
        </View>

        <View style={styles.bottomCtaCard}>
          <View style={styles.bottomCtaCopy}>
            <ThemedText style={styles.bottomCtaTitle}>Önizleme için hazır</ThemedText>
            <ThemedText style={styles.footerNote}>
              Canlıya almadan önce önizleyip düzenleyebileceksiniz.
            </ThemedText>
          </View>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={handlePublish}
            disabled={publishing}
            style={styles.primaryButton}
          >
            {publishing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <ThemedText style={styles.primaryButtonText}>Yayınla</ThemedText>
                <Icon name="arrow-right" size={16} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type FieldCardProps = {
  label: string;
  children: React.ReactNode;
  trailingIcon?: string;
  compact?: boolean;
};

const FieldCard = ({
  label,
  children,
  trailingIcon,
  compact,
}: FieldCardProps) => (
  <View style={compact ? styles.compactSection : styles.section}>
    <View style={styles.fieldHeader}>
      <ThemedText style={styles.sectionLabel}>{label}</ThemedText>
      {trailingIcon ? (
        <Icon name={trailingIcon} size={16} color="#9d8578" />
      ) : null}
    </View>
    <View style={styles.fieldCard}>{children}</View>
  </View>
);

type SelectCardProps = {
  label: string;
  value: string;
  onPress: () => void;
  compact?: boolean;
};

const SelectCard = ({ label, value, onPress, compact }: SelectCardProps) => (
  <View style={compact ? styles.compactSection : styles.section}>
    <ThemedText style={styles.sectionLabel}>{label}</ThemedText>
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={styles.selectCard}>
      <ThemedText style={styles.selectValue}>{value}</ThemedText>
      <Icon name="chevron-down" size={16} color="#9d8578" />
    </TouchableOpacity>
  </View>
);

const cycleSelection = <T extends string>(
  currentValue: T,
  options: SelectOption<T>[],
  onChange: (value: T) => void
) => {
  const currentIndex = options.findIndex((option) => option.id === currentValue);
  const nextIndex = currentIndex === options.length - 1 ? 0 : currentIndex + 1;
  onChange(options[nextIndex].id);
};

export default CreateListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3ef',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2e7df',
  },
  headerAction: {
    minWidth: 92,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b79e91',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#6e2a19',
  },
  segmentRow: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ead8cc',
  },
  segmentTab: {
    paddingBottom: 12,
    marginRight: 24,
  },
  segmentTabActive: {
    paddingBottom: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#2559f3',
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#c3ada1',
    textTransform: 'uppercase',
  },
  segmentActiveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#71554a',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 18,
  },
  compactSection: {
    marginBottom: 14,
  },
  introCard: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 28,
    backgroundColor: '#0f4c5c',
    gap: 10,
    shadowColor: '#0f4c5c',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  introTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  introBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  introBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  introValueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#f3f4f5',
    gap: 2,
  },
  introValueLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#7c8588',
  },
  introValueText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f4c5c',
  },
  introTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  introText: {
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.78)',
  },
  introStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
  },
  introStatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#306576',
  },
  introStatText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  introStatChipMuted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#e8ecee',
  },
  introStatMutedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f4c5c',
  },
  sectionBlock: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  rowItem: {
    flex: 1,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5559',
  },
  fieldCard: {
    backgroundColor: '#f4f6f7',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  textInput: {
    fontSize: 15,
    lineHeight: 22,
    color: '#191c1d',
    padding: 0,
  },
  multilineInput: {
    minHeight: 104,
    fontSize: 15,
    lineHeight: 23,
    color: '#191c1d',
    padding: 0,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipSelected: {
    backgroundColor: '#d9ecf2',
  },
  chipDefault: {
    backgroundColor: '#f4f6f7',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: '#0f4c5c',
  },
  chipTextDefault: {
    color: '#596468',
  },
  selectCard: {
    backgroundColor: '#f4f6f7',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectValue: {
    fontSize: 15,
    lineHeight: 22,
    color: '#191c1d',
  },
  uploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  uploadCounter: {
    fontSize: 12,
    color: '#7b8588',
  },
  imageGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  imageSlot: {
    flex: 1,
    height: 136,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#f4f6f7',
    borderWidth: 1,
    borderColor: '#dde4e7',
  },
  slotImage: {
    width: '100%',
    height: '100%',
  },
  slotOverlay: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 247, 241, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  emptySlotText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#708085',
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eef4f5',
    borderRadius: 22,
    padding: 16,
    marginTop: 2,
    marginBottom: 18,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d9ecf2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f4c5c',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#5c6a6e',
  },
  bottomCtaCard: {
    marginTop: 4,
    padding: 18,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e3e7e8',
    gap: 14,
  },
  bottomCtaCopy: {
    gap: 4,
  },
  bottomCtaTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#191c1d',
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#003441',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#003441',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  footerNote: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6c757a',
  },
  guestWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 32,
  },
  guestIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#d9ecf2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f4c5c',
    marginBottom: 10,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5c6a6e',
    textAlign: 'center',
    marginBottom: 24,
  },
  guestButton: {
    backgroundColor: '#003441',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  donateNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#eef4f5',
    marginBottom: 14,
  },
  donateNoteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#0f4c5c',
    fontWeight: '600',
  },
});
