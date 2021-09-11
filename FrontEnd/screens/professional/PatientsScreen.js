import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

const PatientsScreen = (props) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <View style={{ flex: 1, width: "100%" }}></View>
    </View>
  );
};

PatientsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Patients",
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  image: {
    width: 244,
    height: 75,
    alignSelf: "center",
    marginTop: 20,
  },
});

export default PatientsScreen;
