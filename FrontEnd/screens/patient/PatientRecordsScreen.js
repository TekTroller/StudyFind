import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../../components/HeaderButton";

const PatientRecordsScreen = (props) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <View style={{ flex: 1, width: "100%" }}></View>
    </View>
  );
};

PatientRecordsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Records",
    headerRight: () => {
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="add file"
          iconName="ios-add-circle-outline"
          onPress={() => {
            console.log("add file");
          }}
        />
      </HeaderButtons>;
    },
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

export default PatientRecordsScreen;
