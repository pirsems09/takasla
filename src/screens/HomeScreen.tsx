import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedButton } from "../components/ThemedButton";
import { useTheme } from "../hooks/useTheme";
import { useThemeStore } from "../store/themeStore";
import { ThemedText } from "../components/ThemedText";

const HomeScreen = ({ navigation }: { navigation: any }) => {
    const { colors, theme } = useTheme();
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ThemedText style={styles.title}>Hello World</ThemedText>
            <ThemedButton onPress={toggleTheme}>
                Temayı Değiştir
            </ThemedButton>

            <ThemedButton onPress={() => navigation.navigate("Settings")}>
                Ayarlar
            </ThemedButton>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
    },
});
