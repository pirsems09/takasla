import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { Category } from "../data/mockData";

interface CategoryCardProps {
    item: Category;
    isSelected?: boolean;
    onPress: () => void;
}

export const CategoryCard = ({ item, isSelected, onPress }: CategoryCardProps) => {
    return (
        <TouchableOpacity
            style={styles.favoriteCard}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.favoriteImageContainer}>
                <Image source={{ uri: item.image }} style={styles.favoriteImage} />
                {isSelected && <View style={styles.favoriteSelectedOverlay} />}
            </View>
            <ThemedText style={styles.favoriteTitle} numberOfLines={1}>
                {item.title}
            </ThemedText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    favoriteCard: {
        width: 90,
        height: 110,
        borderRadius: 16,
        overflow: "hidden",
        marginRight: 12,
        marginBottom: 0,
        backgroundColor: "transparent",
        alignItems: "center",
    },
    favoriteImageContainer: {
        width: 76,
        height: 76,
        borderRadius: 38,
        overflow: "hidden",
        marginBottom: 8,
        backgroundColor: "#e5e7eb",
    },
    favoriteImage: {
        width: "100%",
        height: "100%",
    },
    favoriteSelectedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(74,209,123,0.3)",
        borderWidth: 2,
        borderColor: "#4ad17b",
        borderRadius: 38,
    },
    favoriteTitle: {
        color: "#1b1d1f",
        fontWeight: "700",
        fontSize: 12,
        textAlign: "center",
    },
});
