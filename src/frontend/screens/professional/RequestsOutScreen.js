import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text,
  Keyboard,
  Alert,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Colors from "../../assets/Colors";
import localHost from "../../host";

const RequestsOutScreen = (props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const authenticationInfo = useSelector((state) => state.authentication);
  //console.log(authenticationInfo);

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const checkValidity = () => {
    let isValid = true;

    if (!emailRegex.test(email.toLowerCase())) {
      isValid = false;
    }
    setValid(isValid);
  };

  const setEmailHandler = (entry) => {
    setEmail(entry);
  };

  const addPatientWrapper = () => {
    Alert.alert(
      "Alert",
      "This operation might take over 15 seconds. Are you sure to proceed?",
      [
        { text: "cancel" },
        {
          text: "proceed",
          onPress: () => {
            addPatient();
          },
        },
      ]
    );
  };

  const addPatient = async () => {
    try {
      setLoading(true);
      var res = await axios.post(localHost + "/professional/request_access", {
        patient_email: email,
        address: authenticationInfo.accountAddress,
      });

      if (!res.data.success) {
        Alert.alert("Request failed", "You have sent this request before", [
          { text: "cancel" },
        ]);
      }
      setLoading(false);
    } catch (err) {
      Alert.alert("Error", "An error occured", [{ text: "cancel" }]);
      setLoading(false);
    }
  };

  let error = null;
  if (email !== "" && !valid) {
    error = (
      <Text style={{ color: "red", marginLeft: 60, fontSize: 10 }}>
        invalid email
      </Text>
    );
  }

  let loadingIndicator = <Text style={styles.addText}>Add Patient</Text>;
  if (loading) {
    loadingIndicator = (
      <ActivityIndicator
        size="large"
        color={Colors.studyFindLightGreen}
        style={styles.loading}
      />
    );
  }

  let addButton = (
    <TouchableOpacity style={styles.addButtonInactive}>
      {loadingIndicator}
    </TouchableOpacity>
  );

  if (valid) {
    addButton = (
      <TouchableOpacity style={styles.addButton} onPress={addPatientWrapper}>
        {loadingIndicator}
      </TouchableOpacity>
    );
  }

  useEffect(() => checkValidity());

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.prompt}>Patient email</Text>
          <TextInput
            nativeID={props.text}
            textAlign="left"
            placeholder={"valid patient email"}
            sectionColor={Colors.studyFindBlue}
            underlineColorAndroid={Colors.studyFindGray}
            style={styles.input}
            onChangeText={setEmailHandler}
            value={email}
          />
        </View>
        {error}
        {addButton}
      </View>
    </TouchableWithoutFeedback>
  );
};

RequestsOutScreen.navigationOptions = {
  headerTitle: "Add Patient",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    marginTop: 30,
    alignSelf: "center",
  },
  prompt: {
    fontSize: 16,
    color: "gray",
  },
  input: {
    width: 270,
    height: 37,
    alignSelf: "center",
  },
  loading: {
    width: "100%",
    height: 40,
  },
  addButton: {
    width: 250,
    height: 40,
    marginTop: 20,
    backgroundColor: Colors.studyFindDarkBlue,
    alignSelf: "center",
    borderRadius: 4,
    elevation: 2,
  },
  addText: {
    color: "white",
    alignSelf: "center",
    fontSize: 20,
    marginTop: 5,
  },
  addButtonInactive: {
    width: 250,
    height: 40,
    marginTop: 20,
    backgroundColor: Colors.studyFindGray,
    alignSelf: "center",
    borderRadius: 4,
  },
});

export default RequestsOutScreen;
