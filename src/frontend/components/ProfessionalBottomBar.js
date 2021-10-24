import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../assets/Colors";

const ProfessionalBottomBar = (props) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.icon_wrapper} onPress={props.pressFolder}>
        <Ionicons
          name={props.screen === "Folder" ? "folder" : "folder-outline"}
          color={props.screen === "Folder" ? Colors.studyFindBlue : "white"}
          size={40}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.icon_wrapper}
        onPress={props.pressProfile}
      >
        <Ionicons
          name={
            props.screen === "Profile"
              ? "person-circle"
              : "person-circle-outline"
          }
          color={props.screen === "Profile" ? Colors.studyFindBlue : "white"}
          size={40}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    height: 60,
    width: "100%",
    backgroundColor: Colors.studyFindDarkBlue,
  },
  icon_wrapper: {
    width: 60,
    height: 60,
    marginTop: 10,
    marginLeft: 100,
  },
});

export default ProfessionalBottomBar;
