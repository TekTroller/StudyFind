import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import Colors from "../assets/Colors";

const PatientRecordsScreen = (props) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
      ></KeyboardAwareScrollView>
    </View>
  );
};

PatientRecordsScreen.navigationOptions = {
  headerTitle: "Records",
  headerStyle: {
    backgroundColor: Colors.studyFindDarkBlue,
  },
  headerTintColor: "white",
  headerTintSize: 30,
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

export default PatientRecordsScreen;
