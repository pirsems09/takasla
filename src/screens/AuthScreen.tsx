import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/authStore';

/**
 * AuthScreen — giriş / kayıt ekranı.
 *
 * Supabase email+şifre auth kullanır. `useAuthStore`'un `signIn` / `signUp`
 * aksiyonlarını çağırır. Başarılı girişte `authStore.isAuthenticated` true olur
 * ve `RootNavigator` bu ekranı koşullu olarak kaldırır (ekstra navigate gerekmez).
 *
 * Toggle ile "Giriş Yap" / "Kayıt Ol" arasında geçilir; kayıt modunda ek olarak
 * isim alanı gösterilir (Supabase `user_metadata.name` olarak saklanır, profil
 * trigger ile `profiles` tablosuna yansır).
 */
type AuthMode = 'signin' | 'signup';

const AuthScreen = () => {
  const { colors } = useTheme();
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);

  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('test@takasla.com');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Eksik bilgi', 'Lütfen e-posta ve şifre girin.');
      return;
    }
    if (isSignup && !name.trim()) {
      Alert.alert('Eksik bilgi', 'Lütfen isminizi girin.');
      return;
    }
    setSubmitting(true);
    try {
      if (isSignup) {
        await signUp(email.trim(), password, name.trim());
      } else {
        await signIn(email.trim(), password);
      }
      // Başarılı → RootNavigator isAuthenticated true olup bu ekranı kaldırır.
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Bir hata oluştu. Tekrar deneyin.';
      Alert.alert('Hata', message);
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (next: AuthMode) => {
    if (next === mode) return;
    setMode(next);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandWrap}>
            <View style={[styles.brandDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.brandText, { color: colors.accent }]}>Takasla</Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {isSignup ? 'Aramıza katıl' : 'Tekrar hoş geldin'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isSignup
              ? 'Takas yapmak, satmak veya bağışlamak için hesap oluştur.'
              : 'Devam etmek için giriş yap.'}
          </Text>

          {/* ── Mod toggle ─────────────────────────────────────────────── */}
          <View
            style={[
              styles.segmentRow,
              { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              style={[styles.segmentButton, !isSignup && { backgroundColor: colors.primary }]}
              onPress={() => switchMode('signin')}
              activeOpacity={0.9}
            >
              <Text style={[styles.segmentText, { color: !isSignup ? colors.textOnAccent : colors.textSecondary }]}>
                Giriş Yap
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentButton, isSignup && { backgroundColor: colors.primary }]}
              onPress={() => switchMode('signup')}
              activeOpacity={0.9}
            >
              <Text style={[styles.segmentText, { color: isSignup ? colors.textOnAccent : colors.textSecondary }]}>
                Kayıt Ol
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Form ───────────────────────────────────────────────────── */}
          {isSignup ? (
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>İsim</Text>
              <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Icon name="account-outline" size={20} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Adınız"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>E-posta</Text>
            <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Icon name="email-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="ornek@email.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Şifre</Text>
            <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Icon name="lock-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType={isSignup ? 'newPassword' : 'password'}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            activeOpacity={0.9}
            disabled={submitting}
          >
            <Text style={[styles.primaryButtonText, { color: colors.textOnAccent }]}>
              {submitting ? 'Lütfen bekleyin...' : isSignup ? 'Kayıt Ol' : 'Giriş Yap'}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.footer, { color: colors.textMuted }]}>
            {isSignup
              ? 'Kayıt olarak kullanım koşullarını kabul edersiniz.'
              : 'Hesabın yok mu? Yukarıdaki "Kayıt Ol" sekmesine geç.'}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 32,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 26,
  },
  segmentRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
