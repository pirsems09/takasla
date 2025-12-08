import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { ThemedButton } from "../components/ThemedButton";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={styles.avatar} />
        <ThemedText style={styles.name}>Arif Güler</ThemedText>
        <ThemedText style={styles.subtitle}>Profil ayarların burada</ThemedText>
        <ThemedButton onPress={() => {}}>Profili Düzenle</ThemedButton>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#dcdfe4",
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6f7277",
    marginBottom: 14,
  },
});
