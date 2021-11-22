import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import PatientBottomBar from "../../components/PatientBottomBar";
import Colors from "../../assets/Colors";
import * as authActions from "../../store/actions/auth";
import * as patientRecordsActions from "../../store/actions/patientRecords";
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

  const viewViewerHandler = () => {
    props.navigation.navigate({
      routeName: "PatientViewers",
    });
  };

  const viewMessageHandler = () => {
    props.navigation.navigate({
      routeName: "PatientMessage",
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
          <Text style={styles.text_title}>{"Name:  "}</Text>
          <Text style={styles.text}>{patientProfile.name}</Text>
        </View>
        <View style={styles.text_wrapper}>
          <Text style={styles.text_title}>{"Birthday:  "}</Text>
          <Text style={styles.text}>{patientProfile.birthday}</Text>
        </View>
        <View style={styles.text_wrapper}>
          <Text style={styles.text_title}>{"Gender:  "}</Text>
          <Text style={styles.text}>{patientProfile.gender}</Text>
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
        {/* <View style={styles.viewers_wrapper}></View> */}
        <TouchableOpacity
          onPress={() => {
            dispatch(authActions.setAccountRetrieved(false));
            dispatch(authActions.setPatientProfile(null));
            dispatch(authActions.enterAccountEmail(""));
            dispatch(authActions.enterAccountAddress(""));
            dispatch(patientRecordsActions.clearRecords());
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
      <PatientBottomBar
        screen={"Profile"}
        pressFolder={viewFolderHandler}
        pressMessage={viewMessageHandler}
        pressViewer={viewViewerHandler}
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
    width: "100%",
    height: 635,
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
  viewers_wrapper: {
    width: 300,
    height: 50,
    marginTop: 20,
    backgroundColor: Colors.studyFindRed,
    alignSelf: "center",
    //borderRadius: 4,
    //elevation: 2,
  },
  bottom_bar: {
    top: 10,
    //alignSelf: "flex-end",
  },
});

export default PatientProfileScreen;
