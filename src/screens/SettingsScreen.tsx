import React from "react";
import { View } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { ThemedButton } from "../components/ThemedButton";
import { useThemeStore } from "../store/themeStore";
import { useTheme } from "../hooks/useTheme";

const SettingsScreen = () => {
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { colors, theme } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
      <ThemedText style={{ fontSize: 22 }}>
        Tema: {theme.toUpperCase()}
      </ThemedText>

      <ThemedButton onPress={toggleTheme}>
        Temayı Değiştir
      </ThemedButton>
    </View>
  );
};

export default SettingsScreen;
