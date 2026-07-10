import React, { useEffect } from "react";
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../hooks/useTheme";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import type { RootNavigation } from "../navigation/types";

const ChatHistoryScreen = ({ navigation }: { navigation: RootNavigation }) => {
  const { colors } = useTheme();
  const threads = useChatStore((s) => s.threads);
  const loading = useChatStore((s) => s.threadsLoading);
  const error = useChatStore((s) => s.threadsError);
  const fetchThreads = useChatStore((s) => s.fetchThreads);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchThreads();
    }
  }, [isAuthenticated, fetchThreads]);

  const goChat = (id: string) => {
    navigation.getParent()?.navigate("Chat", { threadId: id });
  };

  if (loading && threads.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (threads.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <ThemedText style={[styles.empty, { color: colors.textSecondary }]}>
            {!isAuthenticated ? "Sohbetleri görmek için giriş yapın." : error ?? "Henüz sohbet yok."}
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => goChat(item.id)}
          >
            <View style={styles.row}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.info}>
                <ThemedText style={[styles.name, { color: colors.accent }]}>
                  {item.name}
                </ThemedText>
                <ThemedText
                  style={[styles.preview, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </ThemedText>
              </View>
              <ThemedText style={[styles.time, { color: colors.textMuted }]}>
                {item.time}
              </ThemedText>
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
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  empty: {
    fontSize: 14,
    textAlign: "center",
  },
  list: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
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
  },
  time: {
    fontSize: 12,
  },
});
