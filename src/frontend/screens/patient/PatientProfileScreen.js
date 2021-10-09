import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import PatientBottomBar from "../../components/PatientBottomBar";
import Colors from "../../assets/Colors";

const PatientProfileScreen = (props) => {
  const viewFolderHandler = () => {
    props.navigation.navigate({
      routeName: "PatientFolder",
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <View style={styles.body} />
      <PatientBottomBar
        screen={"Profile"}
        pressFolder={viewFolderHandler}
        style={styles.bottom_bar}
      />
    </View>
  );
};

PatientProfileScreen.navigationOptions = () => {
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
  bottom_bar: {
    alignSelf: "flex-end",
  },
});

export default PatientProfileScreen;
