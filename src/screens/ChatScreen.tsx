import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ThemedText } from "../components/ThemedText";
import { messages, threads } from "../data/mockData";

const ChatScreen = ({ route }: { route: any }) => {
  const accent = "#1b1d1f";
  const { threadId } = route?.params || {};
  const activeThread = threads.find((t) => t.id === threadId) ?? threads[0];
  const filteredMessages = messages.filter((m) => m.threadId === activeThread.id);

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
          <Image source={{ uri: activeThread.avatar }} style={styles.avatar} />
        ) : null}
        <View
          style={[
            styles.bubble,
            isMe ? styles.bubbleMe : styles.bubbleOther,
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
              { color: isMe ? accent : "#2e3136" },
            ]}
          >
            {item.text}
          </ThemedText>
          <ThemedText style={styles.time}>{item.time}</ThemedText>
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
    <SafeAreaView style={[styles.container, { backgroundColor: "#e9edf3" }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon}>
          <Icon name="chevron-left" size={22} color={accent} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <ThemedText style={[styles.name, { color: accent }]}>
            {activeThread.name}
          </ThemedText>
          <ThemedText style={styles.status}>çevrimiçi</ThemedText>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="phone-outline" size={18} color={accent} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerIcon, styles.headerActionSpacing]}>
            <Icon name="video-outline" size={18} color={accent} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={18} color="#d8ff57" />
        </TouchableOpacity>
        <TextInput
          placeholder="Mesaj yaz..."
          placeholderTextColor="#9ca0a8"
          style={styles.textInput}
        />
        <TouchableOpacity style={[styles.sendButton, styles.headerActionSpacing]}>
          <Icon name="send" size={18} color="#1b1d1f" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#e9edf3",
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
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
    color: "#7a7d82",
    fontWeight: "600",
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
  bubbleOther: {
    backgroundColor: "#ffffff",
    marginLeft: 8,
  },
  bubbleMe: {
    backgroundColor: "#d8ff57",
    marginRight: 8,
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
  },
  time: {
    fontSize: 11,
    color: "#7a7d82",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e9edf3",
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#2c2f33",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    backgroundColor: "#d8ff57",
    alignItems: "center",
    justifyContent: "center",
  },
});
