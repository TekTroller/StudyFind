import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TopBar = (props) => {
  return (
    <View style={styles.topbar}>
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: "#23395D",
    height: 70,
  },

  title: {
    fontFamily: "Roboto",
    fontSize: 24,
    color: "white",
    paddingLeft: 20,
    paddingTop: 20,
  },
});

export default TopBar;
