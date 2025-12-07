import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "@ant-design/react-native";
import RootNavigator from "./navigation/RootNavigator";

const App = () => {
  return (
    <Provider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
