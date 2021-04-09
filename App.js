import React from "react";
import { View } from "react-native";
import Login from "./screens/Login";
import { useState } from "react";

const App = () => {
  const [loginEmail, setLoginEmail] = useState("");

  const enterEmail = (enteredText) => {
    setLoginEmail(enteredText);
  };

  return (
    <View>
      <Login title={"Login"} loginEmail={loginEmail} enterEmail={enterEmail} />
    </View>
  );
};

export default App;
