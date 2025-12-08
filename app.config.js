module.exports = {
  name: 'takasla',
  displayName: 'takasla',
  'react-native-google-mobile-ads': {
    ios_app_id: process.env.GOOGLE_MOBILE_ADS_IOS_APP_ID || '',
    android_app_id: process.env.GOOGLE_MOBILE_ADS_ANDROID_APP_ID || '',
  },
};

