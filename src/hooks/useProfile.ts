
import { useNavigation } from "@react-navigation/native";

export const useProfile = () => {

    const navigation = useNavigation();

    // Mock Data matching the design
    const user = {
        name: "Marina",
        email: "marina@example.com",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    };

    const stats = {
        listings: 12,
        favorites: 45,
        rating: 4.8,
    };

    const menuItems = [
        {
            id: "listings",
            icon: "tag", // tag-outline
            title: "İlanlarım",
            onPress: () => { },//navigation.navigate("MyListings"),
            bg: "#EDF9E4",
            iconColor: "#8BC83F"
        },
        {
            id: "orders",
            icon: "shopping", // shopping-outline
            title: "Siparişlerim",
            onPress: () => { },//navigation.navigate("Orders"),
            bg: "#F2F8D8",
            iconColor: "#A3C639",
        },
        {
            id: "payments",
            icon: "credit-card",
            title: "Ödemelerim",
            onPress: () => { }, //navigation.navigate("Payments"),
            bg: "#F2FBD2",
            iconColor: "#ACCF41"
        },
        {
            id: "addresses",
            icon: "map-marker",
            title: "Adreslerim",
            onPress: () => { }, //navigation.navigate("Addresses"),
            bg: "#F3FADD",
            iconColor: "#B5D649"
        },
        {
            id: "support",
            icon: "help-circle",
            title: "Yardım & Destek",
            onPress: () => { }, //navigation.navigate("Support"),
            bg: "#F4FAE3",
            iconColor: "#BEDF52"
        }

    ];

    const handleEditProfile = () => {
        // navigation.navigate("EditProfile");
        console.log("Edit Profile");
    };

    const handleLogout = () => {
        console.log("Logout");
    };

    return {
        user,
        stats,
        menuItems,
        handleEditProfile,
        handleLogout,
    };
};
