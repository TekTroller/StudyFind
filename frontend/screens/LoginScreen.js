import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Platform,
  Text,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Colors from "../assets/Colors";
import AccountType from "../components/AccountType";
import {
  enterEmail,
  enterPassword,
  switchAccountType,
  setValidity,
} from "../store/actions/auth";

const GRAY = Colors.studyFindGray;

const LoginScreen = (props) => {
  const authenticationInfo = useSelector((state) => state.authentication);

  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const dispatch = useDispatch();

  const enterEmailHandler = (enteredText) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (enteredText.trim().length === 0) {
      isValid = false;
    }
    if (!emailRegex.test(enteredText.toLowerCase())) {
      isValid = false;
    }
    if (authenticationInfo.password.length < 8) {
      isValid = false;
    }
    dispatch(enterEmail(enteredText));
    dispatch(setValidity(isValid));
  };

  const enterPasswordHandler = (enteredText) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (authenticationInfo.email.trim().length === 0) {
      isValid = false;
    }
    if (!emailRegex.test(authenticationInfo.email.toLowerCase())) {
      isValid = false;
    }
    if (enteredText.length < 8) {
      isValid = false;
    }
    dispatch(enterPassword(enteredText));
    dispatch(setValidity(enteredText.length >= 8));
  };

  const setPatientAccountHandler = () => {
    dispatch(switchAccountType("Patient"));
  };

  const setProfessionalAccountHandler = () => {
    dispatch(switchAccountType("Professional"));
  };

  const logIn = () => {
    if (authenticationInfo.validAccount) {
      props.navigation.navigate({ routeName: "PatientRecords" });
    }
  };

  let error = null;
  if (
    (authenticationInfo.email !== "" || authenticationInfo.password !== "") &&
    !authenticationInfo.validAccount
  ) {
    error = (
      <Text style={{ color: "red", marginLeft: "2%", fontSize: 10 }}>
        Invalid Email or Password
      </Text>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.inner}>
        <StatusBar backgroundColor={("black", 60)} />
        <Image
          source={require("../assets/client-logo.png")}
          style={styles.image}
        />
        <AccountType
          accountType={authenticationInfo.accountType}
          setPatientAccountHandler={setPatientAccountHandler}
          setProfessionalAccountHandler={setProfessionalAccountHandler}
        />
        <View style={styles.input_wrapper}>
          <TextInput
            nativeID="user"
            textAlign="left"
            placeholder={
              authenticationInfo.accountType === "Patient"
                ? "Email"
                : "Institute Email"
            }
            sectionColor={Colors.studyFindDarkBlue}
            underlineColorAndroid={GRAY}
            style={styles.input}
            keyboardType={"email-address"}
            value={authenticationInfo.email}
            onChangeText={enterEmailHandler}
          />
          <TextInput
            nativeID="password"
            textAlign="left"
            placeholder="Password"
            sectionColor={Colors.studyFindDarkBlue}
            underlineColorAndroid={GRAY}
            style={styles.input}
            onChangeText={enterPasswordHandler}
            secureTextEntry={true}
          />
          {error}
        </View>
        <TouchableOpacity
          style={
            authenticationInfo.validAccount
              ? styles.button
              : styles.button_inactive
          }
          onPress={logIn}
        >
          <Text style={styles.button_login}>LOGIN</Text>
        </TouchableOpacity>
        <View style={styles.create_account}>
          <Text>New user? </Text>
          <TouchableCmp
            onPress={() => {
              props.navigation.navigate({ routeName: "CreateAccount" });
            }}
          >
            <Text style={{ color: Colors.studyFindBlue }}>
              Create an account
            </Text>
          </TouchableCmp>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  },
  inner: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    //justifyContent: "center",
  },

  image: {
    width: 240,
    height: 75,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 30,
  },

  input_wrapper: {
    width: "80%",
    height: 150,
    marginTop: 20,
  },

  input: {
    width: 300,
    height: 45,
    alignSelf: "center",
    marginTop: 20,
  },

  button: {
    backgroundColor: Colors.studyFindDarkBlue,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 4,
    width: 270,
    height: 50,
    alignContent: "center",
    elevation: 2,
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
    marginBottom: 170,
  },
});

export default LoginScreen;
