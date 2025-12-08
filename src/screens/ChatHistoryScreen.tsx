import React from "react";
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { threads } from "../data/mockData";

const ChatHistoryScreen = ({ navigation }: { navigation: any }) => {
  const goChat = (id: string) => {
    const parentNav = navigation.getParent ? navigation.getParent() : null;
    if (parentNav) {
      parentNav.navigate("Chat", { threadId: id });
    } else {
      navigation.navigate("Chat", { threadId: id });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => goChat(item.id)}>
            <View style={styles.row}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <ThemedText style={styles.name}>{item.name}</ThemedText>
                <ThemedText style={styles.preview} numberOfLines={1}>
                  {item.lastMessage}
                </ThemedText>
              </View>
              <ThemedText style={styles.time}>{item.time}</ThemedText>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default ChatHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f5f8",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  preview: {
    fontSize: 13,
    color: "#6f7277",
  },
  time: {
    fontSize: 12,
    color: "#8a8d92",
  },
});
