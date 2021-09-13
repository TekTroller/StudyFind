import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Colors from "../../assets/Colors";
import AccountType from "../../components/AccountType";
import * as authActions from "../../store/actions/auth";
//import { setValidity } from "../../store/actions/register";
//import auth from "../../store/reducers/auth";

const LoginScreen = (props) => {
  const authenticationInfo = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const [valid, setValid] = useState(false);

  //console.log(authenticationInfo);

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const checkValidity = () => {
    let isValid = true;
    if (!emailRegex.test(authenticationInfo.loginEmail.toLowerCase())) {
      isValid = false;
    }
    if (authenticationInfo.loginPassword.length < 8) {
      isValid = false;
    }
    //console.log(isValid);
    setValid(isValid);
  };

  const enterEmailHandler = (email) => {
    dispatch(authActions.enterEmail(email));
  };

  const enterPasswordHandler = (password) => {
    dispatch(authActions.enterPassword(password));
  };

  const setPatientAccountHandler = () => {
    dispatch(authActions.switchAccountType("Patient"));
  };

  const setProfessionalAccountHandler = () => {
    dispatch(authActions.switchAccountType("Professional"));
  };

  const logIn = async () => {
    if (valid) {
      await dispatch(authActions.authenticate());
      if (authenticationInfo.loginAccountType === "Patient") {
        props.navigation.navigate({ routeName: "PatientRecords" });
      } else {
        props.navigation.navigate({ routeName: "PatientList" });
      }
    }
  };

  let error = null;
  if (
    (authenticationInfo.loginEmail !== "" ||
      authenticationInfo.loginPassword !== "") &&
    !valid
  ) {
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
          accountType={authenticationInfo.loginAccountType}
          setPatientAccountHandler={setPatientAccountHandler}
          setProfessionalAccountHandler={setProfessionalAccountHandler}
        />
        <View style={styles.input_wrapper}>
          <TextInput
            nativeID="user"
            textAlign="left"
            placeholder={
              authenticationInfo.loginAccountType === "Patient"
                ? "Email"
                : "Institute Email"
            }
            sectionColor={Colors.studyFindDarkBlue}
            underlineColorAndroid={Colors.studyFindGray}
            style={styles.input}
            keyboardType={"email-address"}
            value={authenticationInfo.loginEmail}
            onChangeText={enterEmailHandler}
            onPress={() => {
              dispatch(authActions.enterPassword(""));
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
              Create an account
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
