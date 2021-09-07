import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const TopNavigation = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.option_title}>PATIENT</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.option_title}>DOCTOR / RESEARCHER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#23395D",
    height: 65,
    flexDirection: "row",
  },

  option: {
    width: "50%",
    backgroundColor: "#23395D",
    alignContent: "center",
  },

  option_title: {
    fontFamily: "Roboto",
    color: "white",
    fontSize: 14,
    paddingTop: 30,
    alignSelf: "center",
  },
});

export default TopNavigation;
