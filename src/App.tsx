import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-native-paper";
import RootNavigator from "./navigation/RootNavigator";
import ConfirmModal from "./components/ConfirmModal";

const App = () => {
  return (
    <Provider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      {/* Global modal — accessible from any screen via useModalStore */}
      <ConfirmModal />
    </Provider>
  );
};

export default App;
