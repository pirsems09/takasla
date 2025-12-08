import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { ThemedText } from "../components/ThemedText";

const FavoritesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <ThemedText style={styles.title}>Favoriler</ThemedText>
        <ThemedText style={styles.subtitle}>
          Beğendiğin ürünler burada görünecek.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f5f8",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6f7277",
    textAlign: "center",
  },
});
