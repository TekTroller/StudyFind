import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../assets/Colors";

const PatientProfileRow = (props) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.file_wrapper}
        onPress={() => props.viewPatientDetailHandler(props.item)}
      >
        <Ionicons
          name="person-circle"
          color={Colors.studyFindBlue}
          size={25}
          style={styles.profile_icon}
        />
        <Text style={styles.title}>{props.name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: Colors.studyFindGray,
    flexDirection: "row",
    marginBottom: 5,
  },

  file_wrapper: {
    flexDirection: "row",
    height: "100%",
  },

  profile_icon: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },

  title: {
    marginTop: 13,
    fontSize: 16,
  },
});

export default PatientProfileRow;
