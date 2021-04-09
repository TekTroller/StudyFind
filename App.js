import React from "react";
import { View } from "react-native";
import Login from "./screens/Login";
import { useState } from "react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

const App = () => {
  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <View>
        <Login title={"Login"} />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default App;
