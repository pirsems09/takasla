import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileStats } from "../components/profile/ProfileStats";
import { ProfileMenuItem } from "../components/profile/ProfileMenuItem";
import { useProfile } from "../hooks/useProfile";

const ProfileScreen = () => {
  const { user, stats, menuItems, handleEditProfile, handleLogout } = useProfile();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader user={user} onEditPress={handleEditProfile} />

        <ProfileStats stats={stats} />

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <ProfileMenuItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              onPress={item.onPress}
            />
          ))}

          {/* Logout Button */}
          <ProfileMenuItem
            icon="logout"
            title="Çıkış Yap"
            onPress={handleLogout}
            isDestructive
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  menuContainer: {
    marginTop: 8,
  },
});
