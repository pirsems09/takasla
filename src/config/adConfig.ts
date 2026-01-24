import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

const isDev = __DEV__;

// Production Ad Unit IDs - AdMob hesabınızdan alınmalı
const PROD_AD_UNITS = {
  ios: {
    banner: 'ca-app-pub-8418062286532710/XXXXXXXXXX',
    interstitial: 'ca-app-pub-8418062286532710/YYYYYYYYYY',
    rewarded: 'ca-app-pub-8418062286532710/ZZZZZZZZZZ',
  },
  android: {
    banner: 'ca-app-pub-8418062286532710/AAAAAAAAAA',
    interstitial: 'ca-app-pub-8418062286532710/BBBBBBBBBB',
    rewarded: 'ca-app-pub-8418062286532710/CCCCCCCCCC',
  },
};

// Test ID'leri (development için)
const TEST_AD_UNITS = {
  banner: TestIds.BANNER,
  interstitial: TestIds.INTERSTITIAL,
  rewarded: TestIds.REWARDED,
};

const platform = Platform.OS as 'ios' | 'android';

export const adUnitIds = {
  banner: isDev ? TEST_AD_UNITS.banner : PROD_AD_UNITS[platform].banner,
  interstitial: isDev ? TEST_AD_UNITS.interstitial : PROD_AD_UNITS[platform].interstitial,
  rewarded: isDev ? TEST_AD_UNITS.rewarded : PROD_AD_UNITS[platform].rewarded,
};

export const adConfig = {
  // Banner reklam ayarları
  banner: {
    requestNonPersonalizedAdsOnly: true,
  },
  // Interstitial reklam ayarları
  interstitial: {
    requestNonPersonalizedAdsOnly: true,
  },
  // Rewarded reklam ayarları
  rewarded: {
    requestNonPersonalizedAdsOnly: true,
  },
};
