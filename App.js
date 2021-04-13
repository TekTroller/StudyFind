import React from "react";
import { View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { useState } from "react";
import AppNavigator from "./navigation/AppNavigator";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

const App = () => {
  return <AppNavigator />;
};

export default App;
