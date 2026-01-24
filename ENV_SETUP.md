# Environment Variables Setup

Bu proje hassas API key'leri `.env` dosyasından okur. Bu dosya git'e commit edilmez.

## Kurulum

1. `.env.example` dosyasını `.env` olarak kopyalayın:
   ```bash
   cp .env.example .env
   ```

2. `.env` dosyasını düzenleyip gerçek API key'lerinizi ekleyin:
   ```env
   GOOGLE_MOBILE_ADS_IOS_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~xxxxxxxxxxxx
   GOOGLE_MOBILE_ADS_ANDROID_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~xxxxxxxxxxxx
   GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
   ```

## Kullanım

### JavaScript/TypeScript'te

```typescript
import { GOOGLE_MAPS_API_KEY } from '@env';

// Kullanım
console.log(GOOGLE_MAPS_API_KEY);
```

### app.config.js

`app.config.js` dosyası otomatik olarak `.env` dosyasından değerleri okur.

## Android için Google Maps API Key

Android için Google Maps API key'i `android/app/src/main/AndroidManifest.xml` dosyasına manuel olarak eklemeniz gerekebilir:

```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY_HERE"/>
</application>
```

Veya build.gradle'da otomatik olarak eklenebilir (gelecekte implement edilebilir).

## iOS için Google Maps API Key

iOS için Google Maps API key'i `ios/takasla/AppDelegate.swift` veya `Info.plist` dosyasına eklenebilir. Şu anda react-native-maps varsayılan olarak çalışır, ancak production için API key eklenmesi önerilir.

## Notlar

- `.env` dosyası `.gitignore`'da olduğu için git'e commit edilmez
- `.env.example` dosyası template olarak git'te tutulur
- API key'lerinizi asla git'e commit etmeyin!

