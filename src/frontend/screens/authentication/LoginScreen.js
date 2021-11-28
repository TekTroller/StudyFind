import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Keyboard,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import * as authActions from "../../store/actions/auth";
import Colors from "../../assets/Colors";
import AccountType from "../../components/AccountType";

import localHost from "../../host";

const LoginScreen = (props) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginAccountType, setLoginAccountType] = useState("Patient");
  const [valid, setValid] = useState(false);

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const authenticationInfo = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  const checkValidity = () => {
    let isValid = true;
    if (!emailRegex.test(loginEmail.toLowerCase())) {
      isValid = false;
    }
    if (loginPassword.length < 8) {
      isValid = false;
    }
    setValid(isValid);
  };

  const enterEmailHandler = (email) => {
    setLoginEmail(email);
  };

  const enterPasswordHandler = (password) => {
    setLoginPassword(password);
  };

  const setPatientAccountHandler = () => {
    setLoginAccountType("Patient");
  };

  const setProfessionalAccountHandler = () => {
    setLoginAccountType("Professional");
  };

  const logIn = async () => {
    var res = await axios.get(localHost + "/login", {
      params: {
        email: loginEmail,
        password: loginPassword,
        usertype: loginAccountType === "Professional",
      },
    });

    //console.log(!res.data.verifies);

    if (!res.data.verified) {
      Alert.alert("Wrong Credentials", "Incorrect username or password", [
        { text: "cancel" },
      ]);
    } else {
      if (loginAccountType === "Patient") {
        dispatch(authActions.enterAccountEmail(loginEmail));
        dispatch(authActions.enterAccountAddress(res.data.address));
        props.navigation.navigate({ routeName: "PatientHome" });
      } else {
        dispatch(authActions.enterAccountEmail(loginEmail));
        dispatch(authActions.enterAccountAddress(res.data.address));
        props.navigation.navigate({ routeName: "ProfessionalHome" });
      }
    }
  };

  let error = null;
  if ((loginEmail !== "" || loginPassword !== "") && !valid) {
    error = (
      <Text style={{ color: "red", marginLeft: "2%", fontSize: 10 }}>
        Invalid Email or Password
      </Text>
    );
  }

  useEffect(() => checkValidity());

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.inner}>
        <StatusBar backgroundColor={("black", 60)} />
        <Image
          source={require("../../assets/client-logo.png")}
          style={styles.image}
        />
        <AccountType
          accountType={loginAccountType}
          setPatientAccountHandler={setPatientAccountHandler}
          setProfessionalAccountHandler={setProfessionalAccountHandler}
        />
        <View style={styles.input_wrapper}>
          <TextInput
            nativeID="user"
            textAlign="left"
            placeholder={
              loginAccountType === "Patient" ? "Email" : "Institute Email"
            }
            sectionColor={Colors.studyFindDarkBlue}
            underlineColorAndroid={Colors.studyFindGray}
            style={styles.input}
            keyboardType={"email-address"}
            value={loginEmail}
            onChangeText={enterEmailHandler}
            onPress={() => {
              setLoginPassword("");
            }}
          />
          <TextInput
            nativeID="password"
            textAlign="left"
            placeholder="Password"
            sectionColor={Colors.studyFindDarkBlue}
            underlineColorAndroid={Colors.studyFindGray}
            style={styles.input}
            onChangeText={enterPasswordHandler}
            secureTextEntry={true}
          />
          {error}
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
              create an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

LoginScreen.navigationOptions = {
  headerTitle: "Login",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
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
    backgroundColor: Colors.studyFindGray,
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
