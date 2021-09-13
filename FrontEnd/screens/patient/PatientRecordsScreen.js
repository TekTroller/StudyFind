import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import PatientRecord from "../../components/PatientRecord";
import * as patientRecordsActions from "../../store/actions/patientRecords";
import Colors from "../../assets/Colors";

const PatientRecordsScreen = (props) => {
  const patientRecordsInfo = useSelector((state) => state.patientRecords);
  const dispatch = useDispatch();

  const showAddOptions = () => {
    props.navigation.navigate({ routeName: "NewRecord" });
  };

  const deleteRecordHandler = (index) => {
    //console.log(index);
    Alert.alert("Delete Record", "This record will be deleted. Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: (index) => {
          dispatch(patientRecordsActions.deleteRecord(index));
        },
      },
    ]);
  };

  const records = (
    <ScrollView contentContainerStyle={styles.records_wrapper}>
      {patientRecordsInfo.patientRecords.map((item, index) => (
        <PatientRecord
          key={index}
          index={index}
          record={item}
          deleteRecordHandler={deleteRecordHandler}
        />
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <View style={{ flex: 1, width: "100%" }}>
        <View>{records}</View>
        <TouchableOpacity
          style={styles.add_button_wrapper}
          onPress={showAddOptions}
        >
          <Ionicons
            name="md-add"
            color="white"
            size={40}
            style={styles.add_button}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

PatientRecordsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Records",
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },

  records_wrapper: {
    width: "100%",
    height: 400,
    alignItems: "center",
    marginTop: 30,
  },

  add_button_wrapper: {
    position: "relative",
    marginTop: 170,
    marginLeft: 300,
    backgroundColor: Colors.studyFindBlue,
    height: 70,
    width: 70,
    borderRadius: 35,
    elevation: 2,
  },

  add_button: {
    alignSelf: "center",
    marginTop: 15,
    marginLeft: 2,
  },

  bottom_header: {
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    width: "100%",
    height: 30,
    borderTopWidth: 2,
    borderTopColor: ("#333333", 40),
    justifyContent: "center",
  },

  panel_header: {
    alignItems: "center",
  },
});

export default PatientRecordsScreen;
