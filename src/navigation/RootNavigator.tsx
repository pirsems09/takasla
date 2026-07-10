import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import SettingsScreen from "../screens/SettingsScreen";
import IntroScreen from "../screens/IntroScreen";
import AuthScreen from "../screens/AuthScreen";
import { useIntroStore } from "../store/introStore";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../hooks/useTheme";
import type { RootStackParamList } from "./types";
import MainTabs from "./MainTabs";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import ChatScreen from "../screens/ChatScreen";
import CreateListingScreen from "../screens/CreateListingScreen";
import AllListingsScreen from "../screens/AllListingsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const hasSeenIntro = useIntroStore((state) => state.hasSeenIntro);
  const checkIntroStatus = useIntroStore((state) => state.checkIntroStatus);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthReady = useAuthStore((state) => state.isReady);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [introReady, setIntroReady] = React.useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([checkIntroStatus(), checkAuth()]);
      setIntroReady(true);
    };
    initialize();
  }, [checkIntroStatus, checkAuth]);

  // intro + auth başlangıç kontrolü bitene kadar splash göster
  if (!introReady || !isAuthReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenIntro ? (
        <Stack.Screen name="Intro" component={IntroScreen} />
      ) : null}
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : null}
      <Stack.Screen name="Home" component={MainTabs} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen
        name="CreateListingModal"
        component={CreateListingScreen}
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="AllListings"
        component={AllListingsScreen}
        options={{ headerShown: true, title: "Tüm İlanlar" }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Ayarlar", headerShown: true }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RootNavigator;
