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
import liquidGlass from "../theme/liquidGlass";

const Tab = createBottomTabNavigator();
const HALO_SIZE = 64;

type TabRoute =
  | "Listele"
  | "Favoriler"
  | "İlan Ekle"
  | "Geçmiş Sohbetler"
  | "Profil";

const tabIcons: Record<TabRoute, string> = {
  Listele: "view-grid",
  Favoriler: "heart",
  "İlan Ekle": "plus",
  "Geçmiş Sohbetler": "chat",
  Profil: "account",
};

const labels: Record<TabRoute, string> = {
  Listele: "Keşfet",
  Favoriler: "Favori",
  "İlan Ekle": "İlan Ver",
  "Geçmiş Sohbetler": "Mesajlar",
  Profil: "Hesabım",
};

const AnimatedTabBar = ({
  state,
  descriptors,
  navigation,
}: any) => {
  const [layouts, setLayouts] = useState<{ x: number; width: number }[]>([]);
  const translateX = useRef(new Animated.Value(0)).current;
  const haloTranslateX = useRef(new Animated.Value(0)).current;
  const { colors: palette } = useTheme();

  useEffect(() => {
    const current = layouts[state.index];
    if (!current) return;

    const pillTarget = current.x + 8;
    const haloTarget = current.x + (current.width - HALO_SIZE) / 2;

    Animated.parallel([
      Animated.spring(translateX, {
        toValue: pillTarget,
        useNativeDriver: true,
        friction: 12,
        tension: 110,
      }),
      Animated.spring(haloTranslateX, {
        toValue: haloTarget,
        useNativeDriver: true,
        friction: 12,
        tension: 110,
      }),
    ]).start();
  }, [state.index, layouts, translateX, haloTranslateX]);

  const onLayout = (e: LayoutChangeEvent, index: number) => {
    const { x, width } = e.nativeEvent.layout;
    setLayouts((prev) => {
      const copy = [...prev];
      copy[index] = { x, width };
      return copy;
    });
  };

  return (
    <View style={styles.tabWrapper}>
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}
      >
        <View style={styles.glassBackLayer}>
          <View
            style={[
              styles.blob,
              styles.leftBlob,
              { backgroundColor: liquidGlass.blobPrimary },
            ]}
          />
          <View
            style={[
              styles.blob,
              styles.rightBlob,
              { backgroundColor: liquidGlass.blobSecondary },
            ]}
          />
          <View
            style={[
              styles.glassSheen,
              { backgroundColor: "rgba(255, 255, 255, 0.08)" },
            ]}
          />
          <View style={styles.rimLight} />
        </View>

        {layouts[state.index] ? (
          <>
            <Animated.View
              style={[
                styles.activeHalo,
                {
                  transform: [{ translateX: haloTranslateX }],
                  backgroundColor: liquidGlass.highlight,
                  shadowColor: palette.primary,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.pill,
                {
                  transform: [{ translateX }],
                  width: layouts[state.index].width - 16,
                  backgroundColor: palette.secondary,
                  shadowColor: palette.primary,
                },
              ]}
            />
          </>
        ) : null}

        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const isMiddle = route.name === "İlan Ekle";
          const label = labels[route.name as TabRoute];

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
              onPress={onPress}
              onLayout={(e) => onLayout(e, index)}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconContainer,
                  isMiddle && [
                    styles.middleIconContainer,
                    {
                      backgroundColor: isFocused
                        ? palette.secondary
                        : palette.border,
                    },
                  ],
                ]}
              >
                <Icon
                  name={
                    isFocused
                      ? tabIcons[route.name as TabRoute].replace("-outline", "")
                      : tabIcons[route.name as TabRoute]
                  }
                  size={isMiddle ? 26 : 24}
                  color={
                    isFocused
                      ? isMiddle
                        ? palette.primary
                        : palette.text
                      : palette.textSecondary
                  }
                />
              </View>
              {!isMiddle && (
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? palette.text : palette.textSecondary,
                      opacity: isFocused ? 1 : 0.8,
                    },
                  ]}
                >
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
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
  tabWrapper: {
    paddingHorizontal: 12,
    marginBottom: 24,
    position: "relative",
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: 26,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    elevation: 24,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  middleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginTop: -16,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tabLabel: {
    fontWeight: "600",
    fontSize: 10.5,
    letterSpacing: 0.1,
  },
  pill: {
    position: "absolute",
    top: 6,
    bottom: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  activeHalo: {
    position: "absolute",
    top: 0,
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    opacity: 0.5,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  rimLight: {
    position: "absolute",
    top: 1,
    left: 16,
    right: 16,
    height: 1.2,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  glassBackLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
  blob: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.4,
  },
  leftBlob: {
    top: -80,
    left: -60,
  },
  rightBlob: {
    bottom: -100,
    right: -40,
  },
  glassSheen: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    transform: [{ skewX: "-12deg" }],
  },
});

export default MainTabs;
