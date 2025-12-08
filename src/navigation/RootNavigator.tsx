import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import SettingsScreen from "../screens/SettingsScreen";
import IntroScreen from "../screens/IntroScreen";
import { useIntroStore } from "../store/introStore";
import { useTheme } from "../hooks/useTheme";
import MainTabs from "./MainTabs";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import ChatScreen from "../screens/ChatScreen";
import CreateListingScreen from "../screens/CreateListingScreen";
import AllListingsScreen from "../screens/AllListingsScreen";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const hasSeenIntro = useIntroStore((state) => state.hasSeenIntro);
  const checkIntroStatus = useIntroStore((state) => state.checkIntroStatus);
  const { colors } = useTheme();

  useEffect(() => {
    const initialize = async () => {
      await checkIntroStatus();
      setIsLoading(false);
    };
    initialize();
  }, [checkIntroStatus]);

  if (isLoading) {
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
