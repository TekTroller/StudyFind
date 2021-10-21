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

const ProfessionalProfileScreen = (props) => {
  /*  TODO
    2 steps:
        1. Study React redux, read and edit store/actions/auth.js, store/reducers/auth.js 
        file to explore how to receive professional profile data from processing. 
        Read screens/patient/PatientProfileScreen for a similar example.
        **useEffect hook recommended.**
        2. render professional profile data. Check updateProfile() function in screens/patient/PatientProfileScreen ;
    */

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <View style={styles.body}>
        <Ionicons
          name="person-circle"
          color={Colors.studyFindLightGreen}
          size={100}
          style={styles.icon}
        />
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
    height: 635,
    width: "100%",
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
    alignSelf: "flex-end",
  },
});

export default ProfessionalProfileScreen;
