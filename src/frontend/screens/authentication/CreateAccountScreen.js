import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RadioButton } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";

import AccountType from "../../components/AccountType";
import RegisterInput from "../../components/RegisterInput";
import Colors from "../../assets/Colors";
import INSTITUTES from "../../data/dummy-data";

import localHost from "../../host";

const initialState = {
  email: "",
  password: "",
  confirmation: "",
  name: "",
  accountType: "Patient",
  birthday: "",
  gender: "",
  institute: "",
  verification: "",
  codeSent: false,
  valid: false,
  complete: false,
};

const CreateAccountScreen = (props) => {
  const [email, setEmail] = useState(initialState.email);
  const [password, setPassword] = useState(initialState.password);
  const [confirmation, setConfirmation] = useState(initialState.confirmation);
  const [name, setName] = useState(initialState.name);
  const [accountType, setAccountType] = useState(initialState.accountType);
  const [birthday, setBirthday] = useState(initialState.birthday);
  const [gender, setGender] = useState(initialState.gender);
  const [institute, setInstitute] = useState(initialState.institute);
  const [verification, setVerification] = useState(initialState.verification);

  const [codeSent, setCodeSent] = useState(initialState.codeSent);
  const [valid, setValid] = useState(initialState.valid);
  const [complete, setComplete] = useState(initialState.complete);

  const [loading, setLoading] = useState(false);

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const birthdayRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

  const reset = () => {
    setEmail(initialState.email);
    setPassword(initialState.password);
    setConfirmation(initialState.confirmation);
    setName(initialState.name);
    setAccountType(initialState.accountType);
    setBirthday(initialState.birthday);
    setGender(initialState.gender);
    setInstitute(initialState.institute);
    setVerification(initialState.verification);
    setCodeSent(initialState.codeSent);
    setValid(initialState.valid);
    setComplete(initialState.complete);
  };

  const checkValidity = () => {
    let isValid = true;
    if (!emailRegex.test(email.toLowerCase())) {
      //console.log(1);
      isValid = false;
    }
    if (password.length < 8) {
      //console.log(2);
      isValid = false;
    }
    if (confirmation !== password) {
      //console.log(3);
      isValid = false;
    }
    if (name.length === 0) {
      //console.log(4);
      isValid = false;
    }
    if (accountType === "Patient") {
      if (!birthdayRegex.test(birthday)) {
        //console.log(5);
        isValid = false;
      }
      if (gender === "") {
        //console.log(6);
        isValid = false;
      }
    } else {
      if (!INSTITUTES.includes(institute)) {
        //console.log(7);
        isValid = false;
      }
      if (email.substring(email.length - 4, email.length) !== ".edu") {
        //console.log(8);
        isValid = false;
      }
    }
    setValid(isValid);
  };

  const checkCompleteness = () => {
    let completeness = valid && verification.length === 6;
    setComplete(completeness);
  };

  const setPatientAccountHandler = () => {
    if (accountType === "Professional") {
      //console.log("here");
      setCodeSent(false);
      reset();
    }
    setAccountType("Patient");
    checkValidity();
    checkCompleteness();
  };

  const setProfessionalAccountHandler = () => {
    if (accountType === "Patient") {
      setCodeSent(false);
      reset();
    }
    setAccountType("Professional");
    checkValidity();
    checkCompleteness();
  };

  const enterEmail = (email) => {
    setEmail(email);
    checkValidity();
    checkCompleteness();
  };

  const enterPassword = (password) => {
    setPassword(password);
    checkValidity();
    checkCompleteness();
  };

  const enterConfirmation = (confirmation) => {
    setConfirmation(confirmation);
    checkValidity();
    checkCompleteness();
  };

  const enterName = (name) => {
    setName(name);
    checkValidity();
    checkCompleteness();
  };

  const enterInstitute = (institute) => {
    setInstitute(institute);
    checkValidity();
    checkCompleteness();
  };

  const enterBirthday = (birthday) => {
    setBirthday(birthday);
    checkValidity();
    checkCompleteness();
  };

  const enterGender = (gender) => {
    setGender(gender);
    checkValidity();
    checkCompleteness();
  };

  const enterVerification = (verification) => {
    setVerification(verification);
    checkValidity();
    checkCompleteness();
  };

  const getCode = async () => {
    if (valid) {
      var res = await axios.get(localHost + "/get_code", {
        params: { email: email },
      });
    } else {
      Alert.alert(
        "Insufficient information",
        "Make sure all blanks are filled",
        [{ text: "cancel" }]
      );
    }

    //console.log(res.data.code);

    setCodeSent(true);
    checkValidity();
    checkCompleteness();
  };

  const register = async () => {
    var res = await axios.get(localHost + "/verify", {
      params: { email: email, code: verification },
    });

    if (res.data.verified) {
      try {
        if (accountType === "Patient") {
          setLoading(true);
          var res1 = await axios.post(localHost + "/register", {
            email: email,
            password: password,
            usertype: false,
            name: name,
            birthday: birthday,
            gender: gender,
            institution: "",
          });
        } else {
          setLoading(true);
          var res1 = await axios.post(localHost + "/register", {
            email: email,
            password: password,
            usertype: true,
            name: name,
            birthday: "",
            gender: "",
            institution: institute,
          });
        }
        setLoading(false);

        if (!res1.data.success) {
          Alert.alert("Error", "Registration failed", [{ text: "cancel" }]);
        }
      } catch (err) {
        Alert.alert("Error", "Something went Wrong", [{ text: "cancel" }]);
      }
      props.navigation.navigate({ routeName: "Success" });
    } else {
      setLoading(false);
      Alert.alert(
        "Incorrect veriification code",
        "Wrong 6-digit verification code",
        [{ text: "cancel" }]
      );
    }
  };

  const registerWrapper = async () => {
    Alert.alert(
      "Alert",
      "This operation might take over 15 seconds. Are you sure to proceed?",
      [
        { text: "cancel" },
        {
          text: "proceed",
          onPress: () => {
            register();
          },
        },
      ]
    );
  };

  useEffect(() => {
    checkValidity();
    checkCompleteness();
  });

  let instituteSelector = null;
  let genderSpecify = null;
  let birthdayInput = null;
  let genderInput = null;

  if (gender) {
    if (gender.substring(0, 5) === "other") {
      genderSpecify = (
        <RegisterInput
          text="(please specify)"
          placeholder=""
          onChangeText={(entered) => {
            enterGender("other: " + entered);
          }}
          value={gender.substring(7)}
          password
        />
      );
    }
  }

  if (accountType === "Patient") {
    birthdayInput = (
      <RegisterInput
        text="birthday"
        placeholder="mm/dd/yyyy"
        onChangeText={enterBirthday}
        value={birthday}
      />
    );
  }

  if (accountType === "Patient") {
    genderInput = (
      <View>
        <Text
          style={{
            fontSize: 12,
            color: "gray",
            marginTop: 10,
            alignSelf: "center",
            width: 270,
          }}
        >
          gender
        </Text>
        <View style={styles.radio_input_wrapper}>
          <RadioButton
            value="male"
            status={gender === "male" ? "checked" : "unchecked"}
            onPress={() => {
              enterGender("male");
            }}
            color={Colors.studyFindBlue}
          />
          <Text
            style={{
              fontSize: 11,
              color: "gray",
              alignSelf: "center",
            }}
          >
            male
          </Text>
          <RadioButton
            value="female"
            status={gender === "female" ? "checked" : "unchecked"}
            onPress={() => {
              enterGender("female");
            }}
            color={Colors.studyFindBlue}
          />
          <Text
            style={{
              fontSize: 11,
              color: "gray",
              alignSelf: "center",
            }}
          >
            female
          </Text>
          <RadioButton
            value="other"
            status={
              gender && gender.substring(0, 5) === "other"
                ? "checked"
                : "unchecked"
            }
            onPress={() => {
              enterGender("other: ");
            }}
            color={Colors.studyFindBlue}
          />
          <Text
            style={{
              fontSize: 11,
              color: "gray",
              alignSelf: "center",
            }}
          >
            other
          </Text>
        </View>
        {genderSpecify}
      </View>
    );
  }

  if (accountType === "Professional") {
    instituteSelector = (
      <View style={{ width: 270, alignSelf: "center", marginTop: 20 }}>
        <Text
          style={{
            fontSize: 11,
            color: "gray",
            marginBottom: 5,
          }}
        >
          institute of affiliation
        </Text>
        <SelectDropdown
          data={INSTITUTES}
          defaultButtonText={
            institute === "" ? "(select an institute)" : institute
          }
          buttonStyle={styles.institute_selector}
          buttonTextStyle={styles.institute_selector_text}
          dropdownStyle={styles.institute_selecter_dropdown}
          rowTextStyle={styles.institute_selector_text}
          onSelect={(selectedItem) => enterInstitute(selectedItem)}
        />
      </View>
    );
  }

  let create = <Text style={styles.button_register}>REGISTER</Text>;
  if (loading) {
    create = (
      <ActivityIndicator
        size="small"
        color={Colors.studyFindLightGreen}
        style={styles.loading}
      />
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={{ justifyContent: "center" }}
      >
        <View style={styles.container}>
          <StatusBar backgroundColor={("black", 60)} />
          <View style={{ justifyContent: "center" }}>
            <ScrollView>
              <View style={styles.input_wrapper}>
                <AccountType
                  accountType={accountType}
                  setPatientAccountHandler={setPatientAccountHandler}
                  setProfessionalAccountHandler={setProfessionalAccountHandler}
                />
                {instituteSelector}
                <RegisterInput
                  text={
                    accountType === "Patient" ? "e-mail" : "institute e-mail"
                  }
                  placeholder=""
                  onChangeText={enterEmail}
                  value={email}
                />
                <RegisterInput
                  text="password"
                  placeholder="(at least 8 characters)"
                  onChangeText={enterPassword}
                  value={password}
                  password
                />
                <RegisterInput
                  text="confirm password"
                  placeholder="(at least 8 characters)"
                  onChangeText={enterConfirmation}
                  value={confirmation}
                  password
                />
                <RegisterInput
                  text="full name"
                  placeholder=""
                  onChangeText={enterName}
                  value={name}
                />
                {birthdayInput}
                {genderInput}
                <View style={styles.send_code}>
                  <TextInput
                    nativeID="verification"
                    textAlign="left"
                    placeholder="verification code"
                    sectionColor={Colors.studyFindBlue}
                    underlineColorAndroid={Colors.studyFindGray}
                    style={styles.verification}
                    onChangeText={enterVerification}
                    value={verification}
                  />
                  <TouchableOpacity
                    style={
                      codeSent || !valid
                        ? styles.resend_button
                        : styles.send_code_button
                    }
                    onPress={getCode}
                  >
                    <Text style={styles.send_code_text}>
                      {codeSent ? "RESEND" : "SEND CODE"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.register_wrapper}>
                <TouchableOpacity
                  style={complete ? styles.button : styles.button_inactive}
                  onPress={registerWrapper}
                >
                  {create}
                </TouchableOpacity>
                <View style={styles.login}>
                  <Text>Already have an account? </Text>
                  <TouchableOpacity
                    onPress={() => {
                      reset();
                      props.navigation.navigate({ routeName: "Login" });
                    }}
                  >
                    <Text style={{ color: Colors.studyFindBlue }}>sign in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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

  institute_selector: {
    borderRadius: 4,
    height: 30,
    width: 250,
    backgroundColor: Colors.studyFindGray,
    marginBottom: 10,
  },

  institute_selecter_dropdown: {
    borderRadius: 4,
  },

  institute_selector_text: {
    fontFamily: "Roboto",
    fontSize: 14,
  },

  input_wrapper: {
    marginTop: 20,
    alignSelf: "center",
  },

  input: {
    width: 270,
    height: 45,
    alignSelf: "center",
    marginTop: 20,
  },

  radio_input_wrapper: {
    width: 270,
    flexDirection: "row",
    alignSelf: "center",
  },

  verification: {
    width: 140,
    height: 45,
    marginRight: 14,
  },

  register_wrapper: {
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
    backgroundColor: Colors.studyFindDarkBlue,
    borderRadius: 4,
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

  loading: {
    alignSelf: "center",
    marginTop: 10,
  },
});

export default CreateAccountScreen;
