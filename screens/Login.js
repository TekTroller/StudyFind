import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";

import Header from "../components/Header";
import TopNavigation from "../components/TopNavigation";

const GRAY = ("#ffffff", 42);

const Login = (props) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const enterEmail = (enteredText) => {
    setEnteredEmail(enteredText);
  };

  const enterPassword = (enteredText) => {
    setEnteredPassword(enteredText);
  };

  const logIn = () => {
    console.log("clicked");
  };

  return (
    <View style={styles.container}>
      <View style={styles.top_wrapper}>
        <StatusBar backgroundColor={("black", 60)} />
        <Header title={"Login"} />
        <TopNavigation />
      </View>
      <Image
        source={require("../assets/client-logo.png")}
        style={styles.image}
      />
      <View style={styles.input_wrapper}>
        <TextInput
          nativeID="user"
          textAlign="left"
          placeholder="Email/Phone"
          sectionColor={"#2C98F0"}
          underlineColorAndroid={GRAY}
          style={styles.input}
          onChangeText={enterEmail}
          value={enteredEmail}
        />
        <TextInput
          nativeID="password"
          textAlign="left"
          placeholder="Password"
          sectionColor={"#2C98F0"}
          underlineColorAndroid={GRAY}
          style={styles.input}
          onChangeText={enterPassword}
          value={"*".repeat(enteredPassword.length)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={logIn}>
        <Text style={styles.button_login}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  top_wrapper: {
    width: "100%",
    height: 160,
  },

  image: {
    width: 244,
    height: 75,
    alignSelf: "center",
    marginTop: 80,
  },

  input_wrapper: {
    width: "100%",
    height: 150,
    marginTop: 20,
  },

  input: {
    width: 328,
    height: 45,
    alignSelf: "center",
    marginTop: 20,
  },

  button: {
    backgroundColor: "#23395D",
    alignSelf: "center",
    marginTop: 50,
    width: 300,
    height: 50,
    alignContent: "center",
  },

  button_login: {
    fontFamily: "Roboto",
    fontSize: 20,
    color: "white",
    alignSelf: "center",
    marginTop: 10,
  },
});

export default Login;
