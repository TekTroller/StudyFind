import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import Colors from "../assets/Colors";

const CreateAccountScreen = (props) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <KeyboardAwareScrollView style={{ flex: 1, width: "100%" }}>
        <Image
          source={require("../assets/client-logo.png")}
          style={styles.image}
        />
        {/* conbobox here --Liang */}
        {/* text inputs here --Xi */}
      </KeyboardAwareScrollView>
    </View>
  );
};

CreateAccountScreen.navigationOptions = {
  headerTitle: "Create Account",
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

export default CreateAccountScreen;
