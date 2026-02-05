import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ProfileStatsProps {
    stats: {
        listings: number;
        favorites: number;
        rating: number;
    };
}

export const ProfileStats = ({ stats }: ProfileStatsProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <ThemedText style={styles.value}>{stats.listings}</ThemedText>
                <ThemedText style={styles.label}>İlanlarım</ThemedText>
            </View>

            <View style={styles.card}>
                <ThemedText style={styles.value}>{stats.favorites}</ThemedText>
                <ThemedText style={styles.label}>Favorilerim</ThemedText>
            </View>

            <View style={styles.card}>
                <View style={styles.ratingContainer}>
                    <ThemedText style={styles.value}>{stats.rating}</ThemedText>
                    <Icon name="star" size={16} color="#FFC107" style={styles.starIcon} />
                </View>
                <ThemedText style={styles.label}>Puanım</ThemedText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
        gap: 12,
    },
    card: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#f0f0f0",
    },
    value: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    starIcon: {
        marginLeft: 4,
        marginTop: -4,
    },
});
