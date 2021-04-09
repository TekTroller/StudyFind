import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = (props) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#23395D",
    height: 70,
    justifyContent: "center",
  },

  title: {
    fontFamily: "Roboto",
    fontSize: 24,
    color: "white",
    top: 10,
    paddingLeft: 20,
  },
});

export default Header;
