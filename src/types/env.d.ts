/**
 * Ambient declaration for the `@env` module provided by `react-native-dotenv`.
 *
 * The actual values live in the root `.env` file and are injected at build time
 * by the Babel plugin configured in `babel.config.js`.
 *
 * Add new environment variables both here (for TypeScript) and in `.env`.
 */
declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
}
