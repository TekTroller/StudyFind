import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Colors from "../assets/Colors";

const AccountType = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={
          props.accountType === "Patient"
            ? styles.option_selected_blue
            : styles.option
        }
        onPress={props.setPatientAccountHandler}
      >
        <Text
          style={
            props.accountType === "Patient"
              ? styles.option_title_selected
              : styles.option_title
          }
        >
          PATIENT
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={
          props.accountType === "Professional"
            ? styles.option_selected_green
            : styles.option
        }
        onPress={props.setProfessionalAccountHandler}
      >
        <Text
          style={
            props.accountType === "Professional"
              ? styles.option_title_selected
              : styles.option_title
          }
        >
          PROFESSIONAL
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: 300,
    borderRadius: 4,
    flexDirection: "row",
    backgroundColor: "white",
  },

  option: {
    width: 140,
    backgroundColor: Colors.studyFindGray,
    borderRadius: 4,
    alignContent: "center",
    marginLeft: 6,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
  },

  option_selected_blue: {
    width: 140,
    height: 32,
    backgroundColor: Colors.studyFindLightBlue,
    borderRadius: 4,
    alignContent: "center",
    marginLeft: 6,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    elevation: 3,
  },

  option_selected_green: {
    width: 140,
    height: 32,
    backgroundColor: Colors.studyFindLightGreen,
    borderRadius: 4,
    alignContent: "center",
    marginLeft: 6,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    elevation: 3,
  },

  option_title: {
    fontFamily: "Roboto",
    color: "white",
    fontSize: 12,
    paddingTop: 5,
    alignSelf: "center",
  },

  option_title_selected: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: Colors.studyFindDarkBlue,
    fontSize: 14,
    paddingTop: 6,
    alignSelf: "center",
  },
});

export default AccountType;
