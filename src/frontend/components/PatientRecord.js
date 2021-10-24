import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../assets/Colors";

const PatientRecord = (props) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.file_wrapper}
        onPress={() => props.showRecordDetailHandler(props.record)}
      >
        <Ionicons
          name="document-outline"
          color={Colors.studyFindDarkBlue}
          size={25}
          style={styles.file_icon}
        />
        <Text style={styles.title}>{props.record.title}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.trash_wrapper}
        onPress={() => props.deleteRecordHandler(props.index)}
      >
        <Ionicons
          name="trash-outline"
          color={Colors.studyFindRed}
          size={25}
          style={styles.trash_icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "80%",
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
    width: 270,
  },

  file_icon: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },

  trash_icon: {
    marginTop: 10,
  },

  trash_wrapper: {
    width: 30,
    height: "100%",
    marginLeft: 10,
  },

  title: {
    marginTop: 13,
    fontSize: 16,
  },
});

export default PatientRecord;
