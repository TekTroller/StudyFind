import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import PatientBottomBar from "../../components/PatientBottomBar";
import Colors from "../../assets/Colors";
import * as authActions from "../../store/actions/auth";
import PatientProfile from "../../models/PatientProfile";

import localHost from "../../host";

const PatientProfileScreen = (props) => {
  const authenticationInfo = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  let patientProfile = authenticationInfo.patientProfile;

  const updateProfile = async () => {
    if (patientProfile === null) {
      var res = await axios.get(localHost + "/patient/get_profile", {
        params: {
          address: authenticationInfo.accountAddress,
        },
      });

      patientProfile = new PatientProfile(
        res.data.name,
        res.data.birthday,
        res.data.gender
      );
      dispatch(authActions.setPatientProfile(patientProfile));
      dispatch(authActions.setAccountRetrieved(true));
    }
  };

  const viewFolderHandler = () => {
    props.navigation.navigate({
      routeName: "PatientFolder",
    });
  };

  useEffect(() => {
    updateProfile();
  });

  let info = null;
  if (patientProfile !== null) {
    info = (
      <View>
        <View style={styles.text_wrapper}>
          <Text style={styles.text}>{"Name: " + patientProfile.name}</Text>
        </View>
        <View style={styles.text_wrapper}>
          <Text style={styles.text}>
            {"Birthday: " + patientProfile.birthday}
          </Text>
        </View>
        <View style={styles.text_wrapper}>
          <Text style={styles.text}>{"Gender: " + patientProfile.gender}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <View style={styles.body}>
        <Ionicons
          name="person-circle"
          color={Colors.studyFindBlue}
          size={100}
          style={styles.icon}
        />
        {info}
      </View>
      <PatientBottomBar
        screen={"Profile"}
        pressFolder={viewFolderHandler}
        style={styles.bottom_bar}
      />
    </View>
  );
};

PatientProfileScreen.navigationOptions = () => {
  return {
    headerTitle: "Patient Profile",
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  body: {
    height: 599,
    width: "100%",
    height: 635,
  },
  icon: {
    marginTop: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  text_wrapper: {
    alignSelf: "center",
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 20,
  },
  bottom_bar: {
    top: 10,
    //alignSelf: "flex-end",
  },
});

export default PatientProfileScreen;
