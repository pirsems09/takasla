module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // ⭐ react-native-dotenv — .env değişkenlerini `@env` modülünden import edilebilir yapar
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    // ⭐ Module resolver — src altındaki klasörleri @alias ile import edebilir yapar
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
        alias: {
          '@api': './src/api',
          '@components': './src/components',
          '@data': './src/data',
          '@hooks': './src/hooks',
          '@lib': './src/lib',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@store': './src/store',
          '@theme': './src/theme',
          '@utils': './src/utils',
        },
      },
    ],
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
