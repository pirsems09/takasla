import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import IntroScreen from "../screens/IntroScreen";
import { useIntroStore } from "../store/introStore";
import { useTheme } from "../hooks/useTheme";

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
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Ana Sayfa", headerShown: true }} />
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
