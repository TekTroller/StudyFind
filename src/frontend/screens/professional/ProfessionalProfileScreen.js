import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import ProfessionalBottomBar from "../../components/ProfessionalBottomBar";

import Colors from "../../assets/Colors";
import * as authActions from "../../store/actions/auth";
import ProfessionalProfile from "../../models/ProfessionalProfile";

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
  const authenticationInfo = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  let professionalProfile = authenticationInfo.professionalProfile;

  const updateProfile = async () => {
    //console.log(professionalProfile);
    if (professionalProfile === null) {
      var res = await axios.get(localHost + "/professional/get_profile", {
        params: {
          address: authenticationInfo.accountAddress,
        },
      });

      professionalProfile = new ProfessionalProfile(
        res.data.name,
        res.data.institution
      );
      //console.log(res.data.institution);
      dispatch(authActions.setProfessionalProfile(professionalProfile));
      dispatch(authActions.setAccountRetrieved(true));
    }
  };

  // const viewFolderHandler = () => {
  //   props.navigation.navigate({
  //     routeName: "ProfessionalFolder",
  //   });
  // };

  useEffect(() => {
    updateProfile();
  });

  let info = null;
  if (professionalProfile !== null) {
    info = (
      <View>
        <View style={styles.text_wrapper}>
          <Text style={styles.text_title}>{"Name:  "}</Text>
          <Text style={styles.text}>{professionalProfile.name}</Text>
        </View>
        <View style={styles.text_wrapper}>
          <Text style={styles.text_title}>{"Institute:  "}</Text>
          <Text style={styles.text}>{professionalProfile.institute}</Text>
        </View>
      </View>
    );
  }

  const viewFolderHandler = () => {
    props.navigation.navigate({
      routeName: "PatientList",
    });
  };

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
        {info}
        <TouchableOpacity
          onPress={() => {
            dispatch(authActions.setAccountRetrieved(false));
            dispatch(authActions.setProfessionalProfile(null));
            dispatch(authActions.enterAccountEmail(""));
            dispatch(authActions.enterAccountAddress(""));
            props.navigation.navigate({ routeName: "Login" });
          }}
          style={{
            width: 300,
            height: 50,
            marginTop: 300,
            backgroundColor: Colors.studyFindRed,
            alignSelf: "center",
            borderRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            style={{
              marginTop: 10,
              alignSelf: "center",
              color: "white",
              fontSize: 20,
            }}
          >
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
      <ProfessionalBottomBar
        screen={"Profile"}
        pressFolder={viewFolderHandler}
        style={styles.bottom_bar}
      />
    </View>
  );
};

ProfessionalProfileScreen.navigationOptions = () => {
  return {
    headerTitle: "Profile",
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
    alignSelf: "flex-start",
    marginLeft: 50,
    flexDirection: "row",
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 16,
    marginTop: 2,
  },
  text_title: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottom_bar: {
    alignSelf: "center",
  },
});

export default ProfessionalProfileScreen;
