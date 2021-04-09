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
    height: 94,
    backgroundColor: "#23395D",
    justifyContent: "center",
  },

  title: {
    fontFamily: "Roboto",
    fontSize: 24,
    color: "white",
    paddingLeft: 20,
    top: 10,
  },
});

export default Header;
