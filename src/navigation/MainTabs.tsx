import React, { useEffect, useRef, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Animated,
  LayoutChangeEvent,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ListingScreen from "../screens/ListingScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import CreateListingScreen from "../screens/CreateListingScreen";
import ChatHistoryScreen from "../screens/ChatHistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useTheme } from "../hooks/useTheme";

const Tab = createBottomTabNavigator();

type TabRoute =
  | "Listele"
  | "Favoriler"
  | "İlan Ekle"
  | "Geçmiş Sohbetler"
  | "Profil";

const tabIcons: Record<TabRoute, string> = {
  Listele: "view-grid-outline",
  Favoriler: "heart-outline",
  "İlan Ekle": "plus-circle-outline",
  "Geçmiş Sohbetler": "chat-outline",
  Profil: "account-outline",
};

const AnimatedTabBar = ({
  state,
  descriptors,
  navigation,
}: any) => {
  const { colors } = useTheme();
  const [layouts, setLayouts] = useState<{ x: number; width: number }[]>([]);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!layouts[state.index]) return;
    Animated.spring(translateX, {
      toValue: layouts[state.index].x,
      useNativeDriver: true,
    }).start();
  }, [state.index, layouts, translateX]);

  const onLayout = (e: LayoutChangeEvent, index: number) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) => {
      const copy = [...prev];
      copy[index] = { x, width };
      return copy;
    });
  };

  return (
    <View style={[styles.tabContainer, { backgroundColor: colors.tabBackground }]}>
      {layouts[state.index] ? (
        <Animated.View
          style={[
            styles.pill,
            {
              transform: [{ translateX }],
              width: layouts[state.index].width,
              backgroundColor: colors.tabPill,
            },
          ]}
        />
      ) : null}
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (route.name === "İlan Ekle") {
            navigation.getParent()?.navigate("CreateListingModal");
            return;
          }

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLayout={(e) => onLayout(e, index)}
            style={styles.tabButton}
            activeOpacity={0.8}
          >
            <Icon
              name={tabIcons[route.name as TabRoute]}
              size={22}
              color={isFocused ? colors.tabActive : colors.tabInactive}
              style={{ marginBottom: 4 }}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? colors.tabActive : colors.tabInactive },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AnimatedTabBar {...props} />}
      initialRouteName="Listele"
    >
      <Tab.Screen name="Listele" component={ListingScreen} />
      <Tab.Screen name="Favoriler" component={FavoritesScreen} />
      <Tab.Screen name="İlan Ekle" component={CreateListingScreen} />
      <Tab.Screen name="Geçmiş Sohbetler" component={ChatHistoryScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginBottom: 12,
    marginTop: 8,
    borderRadius: 18,
    padding: 6,
    alignItems: "center",
    position: "relative",
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabLabel: {
    fontWeight: "700",
    fontSize: 13,
    marginTop: 2,
  },
  pill: {
    position: "absolute",
    top: 6,
    bottom: 6,
    left: 6,
    borderRadius: 12,
  },
});

export default MainTabs;
