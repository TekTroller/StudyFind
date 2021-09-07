import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import Colors from "../assets/Colors";

const SuccessScreen = (props) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <KeyboardAwareScrollView style={{ flex: 1, width: "100%" }}>
        <Text style={{ marginTop: 80, alignSelf: "center" }}>
          Account Created! Click to "RETURN" to Login screen.
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate({ routeName: "Login" });
          }}
          style={{
            width: 300,
            height: 50,
            marginTop: 30,
            backgroundColor: Colors.studyFindDarkBlue,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              marginTop: 10,
              alignSelf: "center",
              color: "white",
              fontSize: 20,
            }}
          >
            RETURN
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

SuccessScreen.navigationOptions = {
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

export default SuccessScreen;
