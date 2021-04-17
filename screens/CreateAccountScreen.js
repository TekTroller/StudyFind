import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { Picker } from '@react-native-picker/picker';

import Colors from "../assets/Colors";

const CreateAccountScreen = (props) => {
  const [selectedValue, setSelectedValue] = useState("Patient");
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <KeyboardAwareScrollView style={{ flex: 1, width: "100%" }}>
        <Image
          source={require("../assets/client-logo.png")}
          style={styles.image}
        />
        {/* conbobox here --Liang */}
        <Picker style={{padding: 50 }}
          selectedValue={selectedValue}
          style={{ height: 50, width: 300}}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
          <Picker.Item label="Patient" value="Patient" />
          <Picker.Item label="Doctor/Researcher" value="Doctor/Researcher" />
        </Picker>
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
