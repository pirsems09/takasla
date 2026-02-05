import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Product } from "../data/mockData";

interface ProductCardProps {
    product: Product;
    onPress: (product: Product) => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(product)}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.image }} style={styles.image} />

                {/* Favorite Button */}
                <View style={styles.favoriteButton}>
                    <Icon name="heart" size={16} color="#FF3B30" />
                </View>

                {/* Badge (e.g. ÜCRETSİZ) */}
                {product.price === "0" && (
                    <View style={styles.badge}>
                        <ThemedText style={styles.badgeText}>ÜCRETSİZ</ThemedText>
                    </View>
                )}
            </View>

            <View style={styles.details}>
                <ThemedText style={styles.title} numberOfLines={2}>
                    {product.title}
                </ThemedText>

                <View style={styles.locationContainer}>
                    <Icon name="map-marker" size={14} color="#666" />
                    <ThemedText style={styles.locationText} numberOfLines={1}>
                        {product.address ? product.address.split(",")[0] : "İstanbul"}
                    </ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden",
    },
    imageContainer: {
        position: "relative",
        aspectRatio: 1, // Square image as seen in design
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    favoriteButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "white",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    badge: {
        position: "absolute",
        bottom: 8,
        left: 8,
        backgroundColor: "#D4F65E", // Lime green from design
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "800",
        color: "#1A1A1A",
    },
    details: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        lineHeight: 18,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    locationText: {
        fontSize: 12,
        color: "#666",
    },
});
