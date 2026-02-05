import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ProfileHeaderProps {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
    onEditPress: () => void;
}

export const ProfileHeader = ({ user, onEditPress }: ProfileHeaderProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <TouchableOpacity style={styles.editIconBadge}>
                    <Icon name="pencil" size={14} color="#1A1A1A" />
                </TouchableOpacity>
            </View>

            <ThemedText style={styles.name}>{user.name}</ThemedText>
            <ThemedText style={styles.email}>{user.email}</ThemedText>

            <TouchableOpacity
                style={styles.editButton}
                onPress={onEditPress}
                activeOpacity={0.8}
            >
                <ThemedText style={styles.editButtonText}>Profili Düzenle</ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 24,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "#ffffff",
    },
    editIconBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#D4F65E",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#ffffff",
    },
    name: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: "#8FA365", // Olive green tone from image
        marginBottom: 16,
    },
    editButton: {
        backgroundColor: "#D4F65E", // Lime green
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1A1A1A",
    },
});
