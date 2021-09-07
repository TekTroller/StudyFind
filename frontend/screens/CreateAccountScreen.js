import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import AccountType from "../components/AccountType";
import Colors from "../assets/Colors";

const GRAY = Colors.studyFindGray;

const CreateAccountScreen = (props) => {
  const [role, setRole] = useState("Patient");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [verification, setVerification] = useState("");

  const [codeSent, setCodeSent] = useState(false);
  const [valid, setValid] = useState(false);

  const enterEmail = (enteredText) => {
    setEnteredEmail(enteredText);
    if (
      enteredEmail.includes("@") &&
      enteredEmail.includes(".") &&
      enteredPassword.length >= 8 &&
      confirmedPassword == enteredPassword &&
      verification.length >= 6
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
      enteredText.length >= 8 &&
      confirmedPassword == enteredPassword &&
      verification.length >= 6
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const enterConfirmation = (enteredText) => {
    setConfirmedPassword(enteredText);
    if (
      enteredEmail.includes("@") &&
      enteredEmail.includes(".") &&
      enteredPassword.length >= 8 &&
      confirmedPassword == enteredPassword &&
      verification.length >= 6
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const enterVerification = (enteredText) => {
    setVerification(enteredText);
    if (
      enteredEmail.includes("@") &&
      enteredEmail.includes(".") &&
      enteredPassword.length >= 8 &&
      confirmedPassword == enteredPassword &&
      enteredText.length >= 6
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const sendCode = () => {
    setCodeSent(true);
  };

  const register = () => {
    if (valid) {
      props.navigation.navigate({ routeName: "Success" });
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <StatusBar backgroundColor={("black", 60)} />
        <KeyboardAvoidingView style={{ flex: 1, width: "100%" }}>
          {/* <View style={styles.picker_wrapper}>
          <Picker
            style={styles.picker}
            selectedValue={role}
            onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
          >
            <Picker.Item label="Patient" value="Patient" />
            <Picker.Item label="Professional" value="Professional" />
          </Picker>
        </View> */}

          <View style={styles.input_wrapper}>
            <AccountType accountType={"Patient"} />
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
              placeholder="Create Password   (at least 8 characters)"
              sectionColor={"#2C98F0"}
              underlineColorAndroid={GRAY}
              style={styles.input}
              onChangeText={enterPassword}
              value={"*".repeat(enteredPassword.length)}
            />
            <TextInput
              nativeID="confirmation"
              textAlign="left"
              placeholder="Confirm Password"
              sectionColor={"#2C98F0"}
              underlineColorAndroid={GRAY}
              style={styles.input}
              onChangeText={enterConfirmation}
              value={"*".repeat(confirmedPassword.length)}
            />
            <View style={styles.send_code}>
              <TextInput
                nativeID="verification"
                textAlign="left"
                placeholder="Verification Code"
                sectionColor={"#2C98F0"}
                underlineColorAndroid={GRAY}
                style={styles.verification}
                onChangeText={enterVerification}
                value={verification}
              />
              <TouchableOpacity
                style={
                  codeSent ? styles.resend_button : styles.send_code_button
                }
                onPress={sendCode}
              >
                <Text style={styles.send_code_text}>
                  {codeSent ? "RESEND" : "SEND CODE"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/*<View style={styles.login}>
          <Text>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate({ routeName: "Login" });
            }}
          >
            <Text style={{ color: Colors.studyFindBlue }}>Login</Text>
          </TouchableOpacity> */}
          <View style={styles.register_wrapper}>
            <TouchableOpacity
              style={valid ? styles.button : styles.button_inactive}
              onPress={register}
            >
              <Text style={styles.button_register}>CREATE</Text>
            </TouchableOpacity>
            <View style={styles.login}>
              <Text>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate({ routeName: "Login" });
                }}
              >
                <Text style={{ color: Colors.studyFindBlue }}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

CreateAccountScreen.navigationOptions = {
  headerTitle: "Create Account",
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
    marginTop: 15,
  },

  picker_wrapper: {
    marginTop: 30,
    height: 50,
    width: 328,
    alignSelf: "center",
    paddingLeft: 8,
    borderRadius: 4,
    borderTopWidth: 1,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 3,
    borderTopColor: ("black", 20),
    borderLeftColor: ("black", 20),
    borderRightColor: ("black", 20),
    borderBottomColor: ("black", 40),
  },

  input_wrapper: {
    width: "80%",
    height: 265,
    marginTop: 20,
    alignSelf: "center",
  },

  input: {
    width: 270,
    height: 45,
    alignSelf: "center",
    marginTop: 20,
  },

  verification: {
    width: 140,
    height: 45,
    marginRight: 14,
  },

  register_wrapper: {
    marginTop: 20,
    height: 60,
  },

  button: {
    backgroundColor: Colors.studyFindDarkBlue,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 4,
    width: 270,
    height: 50,
    alignContent: "center",
  },

  button_inactive: {
    backgroundColor: GRAY,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 4,
    width: 270,
    height: 50,
    alignContent: "center",
  },

  button_register: {
    fontFamily: "Roboto",
    fontSize: 20,
    color: "white",
    alignSelf: "center",
    marginTop: 10,
  },

  send_code: {
    marginTop: 17,
    flexDirection: "row",
    alignSelf: "center",
  },

  send_code_button: {
    backgroundColor: Colors.studyFindDarkBlue,
    borderRadius: 4,
    width: 100,
    height: 33,
    alignContent: "center",
    marginRight: 14,
  },

  resend_button: {
    backgroundColor: GRAY,
    width: 100,
    height: 33,
    alignContent: "center",
    marginRight: 14,
  },

  send_code_text: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "white",
    alignSelf: "center",
    marginTop: 6,
  },

  login: {
    marginTop: 5,
    flexDirection: "row",
    alignSelf: "center",
    alignContent: "center",
  },
});

export default CreateAccountScreen;
