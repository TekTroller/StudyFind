import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import Colors from "../assets/Colors";

const RegisterInput = (props) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.prompt}>{props.text}</Text>
      <TextInput
        nativeID={props.text}
        textAlign="left"
        placeholder={props.placeholder}
        sectionColor={Colors.studyFindBlue}
        underlineColorAndroid={Colors.studyFindGray}
        style={styles.input}
        secureTextEntry={props.password}
        onChangeText={props.onChangeText}
        value={props.value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    alignSelf: "center",
  },
  prompt: {
    fontSize: 12,
    color: "gray",
  },
  input: {
    width: 270,
    height: 37,
    alignSelf: "center",
  },
});

export default RegisterInput;
