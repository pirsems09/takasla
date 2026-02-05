import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ProfileMenuItemProps {
    icon: string;
    title: string;
    onPress: () => void;
    isDestructive?: boolean;
}

export const ProfileMenuItem = ({
    icon,
    title,
    onPress,
    isDestructive = false,
}: ProfileMenuItemProps) => {
    // Define icon background based on the icon type for color coding like in the design
    const getIconColor = () => {
        if (isDestructive) return "#ffebee"; // Light red bg
        if (icon === "tag-outline" || icon === "tag") return "#f1f8e9"; // Light green
        if (icon === "shopping-outline" || icon === "shopping") return "#f9fbe7"; // Light lime
        if (icon === "credit-card-outline" || icon === "credit-card") return "#f1f6d6"; // Another light green
        if (icon === "map-marker-outline" || icon === "map-marker") return "#fce4ec"; // Light pinkish? No, image has lime/yellowish
        if (icon === "help-circle-outline" || icon === "help-circle") return "#fffde7"; // Light yellow

        return "#f5f5f5"; // Default gray
    };

    const getIconTintColor = () => {
        if (isDestructive) return "#FF3B30";
        return "#aeca22"; // Lime green tint for icons
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View
                style={[styles.iconContainer, { backgroundColor: getIconColor() }]}
            >
                <Icon name={icon} size={20} color={getIconTintColor()} />
            </View>
            <ThemedText
                style={[styles.title, isDestructive && styles.destructiveTitle]}
            >
                {title}
            </ThemedText>
            {!isDestructive && (
                <Icon name="chevron-right" size={20} color="#ccc" style={styles.arrow} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
    },
    destructiveTitle: {
        color: "#FF3B30",
        fontWeight: "700",
    },
    arrow: {
        marginLeft: 8,
    },
});
