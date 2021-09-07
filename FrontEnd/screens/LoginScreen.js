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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import Colors from "../assets/Colors";
import TopNavigation from "../components/TopNavigation";

const GRAY = Colors.studyFindGray;

const LoginScreen = (props) => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [valid, setValid] = useState(false);

  const enterEmail = (enteredText) => {
    setEnteredEmail(enteredText);
    if (
      enteredEmail.includes("@") &&
      enteredEmail.includes(".") &&
      enteredPassword.length >= 8
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const enterPassword = (enteredText) => {
    setEnteredPassword(enteredText);
    if (
      enteredEmail.includes("@") &&
      enteredEmail.includes(".") &&
      enteredText.length >= 8
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const logIn = () => {
    console.log("clicked");
    if (valid) {
      props.navigation.navigate({ routeName: "PatientRecords" });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <TopNavigation style={{ width: "100" }} />
      <KeyboardAwareScrollView style={{ flex: 1, width: "100%" }}>
        <Image
          source={require("../assets/client-logo.png")}
          style={styles.image}
        />
        <View style={styles.input_wrapper}>
          <TextInput
            nativeID="user"
            textAlign="left"
            placeholder="Email"
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
        <TouchableOpacity
          style={valid ? styles.button : styles.button_inactive}
          onPress={logIn}
        >
          <Text style={styles.button_login}>LOGIN</Text>
        </TouchableOpacity>
        <View style={styles.create_account}>
          <Text>New user? </Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate({ routeName: "CreateAccount" });
            }}
          >
            <Text style={{ color: Colors.studyFindBlue }}>
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

LoginScreen.navigationOptions = {
  headerTitle: "Login",
  headerStyle: {
    backgroundColor: Colors.studyFindDarkBlue,
  },
  headerTintColor: "white",
  headerTintSize: 30,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
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
    backgroundColor: Colors.studyFindDarkBlue,
    alignSelf: "center",
    marginTop: 50,
    width: 300,
    height: 50,
    alignContent: "center",
  },

  button_inactive: {
    backgroundColor: GRAY,
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

  create_account: {
    flexDirection: "row",
    alignSelf: "center",
    alignContent: "center",
  },
});

export default LoginScreen;
