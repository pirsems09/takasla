import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../components/ThemedText";
import { useChatStore } from "../store/chatStore";
import { useTheme } from "../hooks/useTheme";
import type { ChatScreenProps } from "../navigation/types";

const ChatScreen = ({ route, navigation }: ChatScreenProps) => {
  const { colors } = useTheme();
  const { threadId } = route?.params || {};
  const threads = useChatStore((s) => s.threads);
  const messagesByThread = useChatStore((s) => s.messages);
  const fetchMessages = useChatStore((s) => s.fetchMessages);
  const subscribeToThread = useChatStore((s) => s.subscribeToThread);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const activeThread = threads.find((t) => t.id === threadId);
  const filteredMessages = messagesByThread[threadId] ?? [];
  const listRef = useRef<FlatList | null>(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (!threadId) return;
    fetchMessages(threadId);
    const unsubscribe = subscribeToThread(threadId);
    return unsubscribe;
  }, [threadId, fetchMessages, subscribeToThread]);

  const handleSend = () => {
    if (!threadId) return;
    sendMessage(threadId, inputText);
    setInputText("");
  };

  const renderMessage = ({ item }: any) => {
    const isMe = item.from === "me";
    return (
      <View
        style={[
          styles.messageRow,
          { justifyContent: isMe ? "flex-end" : "flex-start" },
        ]}
      >
        {!isMe ? (
          <Image source={{ uri: activeThread?.avatar ?? "" }} style={styles.avatar} />
        ) : null}
        <View
          style={[
            styles.bubble,
            isMe
              ? { backgroundColor: colors.chatBubbleMe, marginRight: 8 }
              : { backgroundColor: colors.chatBubbleOther, marginLeft: 8 },
          ]}
        >
          {item.previewImage ? (
            <Image
              source={{ uri: item.previewImage }}
              style={styles.preview}
            />
          ) : null}
          <ThemedText
            style={[
              styles.messageText,
              { color: isMe ? colors.accent : colors.text },
            ]}
          >
            {item.text}
          </ThemedText>
          <ThemedText style={[styles.time, { color: colors.textSecondary }]}>
            {item.time}
          </ThemedText>
        </View>
        {isMe ? (
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
            }}
            style={styles.avatar}
          />
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.chatBackground }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={[styles.header, { backgroundColor: colors.chatBackground }]}>
          <TouchableOpacity
            style={[styles.headerIcon, { backgroundColor: colors.surface }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={22} color={colors.accent} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <ThemedText style={[styles.name, { color: colors.accent }]}>
              {activeThread?.name ?? "Sohbet"}
            </ThemedText>
            <ThemedText style={[styles.status, { color: colors.online }]}>
              çevrimiçi
            </ThemedText>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.headerIcon, { backgroundColor: colors.surface }]}>
              <Icon name="phone-outline" size={18} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerIcon,
                styles.headerActionSpacing,
                { backgroundColor: colors.surface },
              ]}
            >
              <Icon name="video-outline" size={18} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={filteredMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={[styles.inputBar, { backgroundColor: colors.chatInputBar }]}>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.accentSurface }]}>
            <Icon name="plus" size={18} color={colors.highlight} />
          </TouchableOpacity>
          <TextInput
            placeholder="Mesaj yaz..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            style={[
              styles.textInput,
              { backgroundColor: colors.surface, color: colors.text },
            ]}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              styles.headerActionSpacing,
              { backgroundColor: colors.chatInputButton },
            ]}
          >
            <Icon name="send" size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  headerText: {
    flex: 1,
    marginHorizontal: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
  },
  status: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerActionSpacing: {
    marginLeft: 8,
  },
  list: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 80,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  bubble: {
    maxWidth: "68%",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
  },
  time: {
    fontSize: 11,
    marginTop: 6,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#dcdfe4",
  },
  preview: {
    width: 160,
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginHorizontal: 10,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
