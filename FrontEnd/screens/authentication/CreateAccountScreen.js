import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RadioButton } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";

import AccountType from "../../components/AccountType";
import RegisterInput from "../../components/RegisterInput";
import Colors from "../../assets/Colors";
import INSTITUTES from "../../data/dummy-data";
import * as registrationActions from "../../store/actions/register";

const CreateAccountScreen = (props) => {
  const registrationInfo = useSelector((state) => state.registration);
  const dispatch = useDispatch();
  //console.log(registrationInfo);

  const [codeSent, setCodeSent] = useState(false);
  const [valid, setValid] = useState(false);
  const [complete, setComplete] = useState(false);

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const birthdayRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

  const checkValidity = () => {
    let isValid = true;
    if (!emailRegex.test(registrationInfo.email.toLowerCase())) {
      //console.log(1);
      isValid = false;
    }
    if (registrationInfo.password.length < 8) {
      //console.log(2);
      isValid = false;
    }
    if (registrationInfo.confirmation !== registrationInfo.password) {
      //console.log(3);
      isValid = false;
    }
    if (registrationInfo.name.length === 0) {
      //console.log(4);
      isValid = false;
    }
    if (registrationInfo.accountType === "Patient") {
      if (!birthdayRegex.test(registrationInfo.birthday)) {
        //console.log(5);
        isValid = false;
      }
      if (registrationInfo.gender === "") {
        //console.log(6);
        isValid = false;
      }
    } else {
      if (!INSTITUTES.includes(registrationInfo.institute)) {
        //console.log(7);
        isValid = false;
      }
      if (
        registrationInfo.email.substring(
          registrationInfo.email.length - 4,
          registrationInfo.email.length
        ) !== ".edu"
      ) {
        //console.log(8);
        isValid = false;
      }
    }
    setValid(isValid);
  };

  const checkCompleteness = () => {
    let completeness = false;
    if (
      valid &&
      registrationInfo.correctVerification !== "" &&
      registrationInfo.verification === registrationInfo.correctVerification
    ) {
      completeness = true;
    }
    setComplete(completeness);
  };

  const setPatientAccountHandler = () => {
    if (registrationInfo.accountType === "Professional") {
      console.log("here");
      setCodeSent(false);
      registrationActions.reset();
    }
    dispatch(registrationActions.switchAccountType("Patient"));
    checkValidity();
    checkCompleteness();
  };

  const setProfessionalAccountHandler = () => {
    if (registrationInfo.accountType === "Patient") {
      setCodeSent(false);
      registrationActions.reset();
    }
    dispatch(registrationActions.switchAccountType("Professional"));
    checkValidity();
    checkCompleteness();
  };

  const enterEmail = (email) => {
    dispatch(registrationActions.enterEmail(email));
    checkValidity();
    checkCompleteness();
  };

  const enterPassword = (password) => {
    dispatch(registrationActions.enterPassword(password));
    checkValidity();
    checkCompleteness();
  };

  const enterConfirmation = (confirmation) => {
    dispatch(registrationActions.enterConfirmationPassword(confirmation));
    //console.log(
    //  "check: " + registrationInfo.password + registrationInfo.confirmation
    //);
    checkValidity();
    checkCompleteness();
  };

  const enterName = (name) => {
    dispatch(registrationActions.enterName(name));
    checkValidity();
    checkCompleteness();
  };

  const enterInstitute = (institute) => {
    dispatch(registrationActions.enterInstitute(institute));
    checkValidity();
    checkCompleteness();
  };

  const enterBirthday = (birthday) => {
    dispatch(registrationActions.enterBirthday(birthday));
    checkValidity();
    checkCompleteness();
  };

  const enterGender = (gender) => {
    dispatch(registrationActions.enterGender(gender));
    checkValidity();
    checkCompleteness();
  };

  const enterVerification = (verification) => {
    dispatch(registrationActions.enterVerification(verification));
    checkValidity();
    checkCompleteness();
  };

  const sendCode = () => {
    setCodeSent(true);
    const dummyCode = "000000";
    dispatch(registrationActions.setVerification(dummyCode));
    checkValidity();
    checkCompleteness();
  };

  const register = () => {
    if (registrationInfo.complete) {
      props.navigation.navigate({ routeName: "Success" });
    }
  };

  useEffect(() => {
    checkValidity();
    checkCompleteness();
  });

  let instituteSelector = null;
  let genderSpecify = null;
  let birthdayInput = null;
  let genderInput = null;

  if (registrationInfo.gender) {
    if (registrationInfo.gender.substring(0, 5) === "other") {
      genderSpecify = (
        <RegisterInput
          text="(please specify)"
          placeholder=""
          onChangeText={(entered) => {
            enterGender("other: " + entered);
          }}
          value={registrationInfo.gender.substring(7)}
          password
        />
      );
    }
  }

  if (registrationInfo.accountType === "Patient") {
    birthdayInput = (
      <RegisterInput
        text="birthday"
        placeholder="mm/dd/yyyy"
        onChangeText={enterBirthday}
        value={registrationInfo.birthday}
      />
    );
  }

  if (registrationInfo.accountType === "Patient") {
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
            status={
              registrationInfo.gender === "male" ? "checked" : "unchecked"
            }
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
            status={
              registrationInfo.gender === "female" ? "checked" : "unchecked"
            }
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
              registrationInfo.gender &&
              registrationInfo.gender.substring(0, 5) === "other"
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

  if (registrationInfo.accountType === "Professional") {
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
            registrationInfo.institute === ""
              ? "(select an institute)"
              : registrationInfo.institute
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
                  accountType={registrationInfo.accountType}
                  setPatientAccountHandler={setPatientAccountHandler}
                  setProfessionalAccountHandler={setProfessionalAccountHandler}
                />
                {instituteSelector}
                <RegisterInput
                  text={
                    registrationInfo.accountType === "Patient"
                      ? "e-mail"
                      : "institute e-mail"
                  }
                  placeholder=""
                  onChangeText={enterEmail}
                  value={registrationInfo.email}
                />
                <RegisterInput
                  text="password"
                  placeholder="(at least 8 characters)"
                  onChangeText={enterPassword}
                  value={registrationInfo.password}
                  password
                />
                <RegisterInput
                  text="confirm password"
                  placeholder="(at least 8 characters)"
                  onChangeText={enterConfirmation}
                  value={registrationInfo.confirmation}
                  password
                />
                <RegisterInput
                  text="full name"
                  placeholder=""
                  onChangeText={enterName}
                  value={registrationInfo.name}
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
                    value={registrationInfo.verification}
                  />
                  <TouchableOpacity
                    style={
                      codeSent || !valid
                        ? styles.resend_button
                        : styles.send_code_button
                    }
                    onPress={sendCode}
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
                  onPress={register}
                >
                  <Text style={styles.button_register}>CREATE</Text>
                </TouchableOpacity>
                <View style={styles.login}>
                  <Text>Already have an account? </Text>
                  <TouchableOpacity
                    onPress={() => {
                      registrationActions.reset();
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
    backgroundColor: Colors.studyFindGray,
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
