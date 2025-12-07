import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
//import DetailsScreen from "../screens/DetailsScreen";
import SettingsScreen from "../screens/SettingsScreen"

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Ana Sayfa" }} />
      {/* <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Detaylar" }} /> */}
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Ayarlar" }} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
