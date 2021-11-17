import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../assets/Colors";
import PatientRecord from "../../components/PatientRecord";
import * as authActions from "../../store/actions/auth";
import PatientProfile from "../../models/PatientProfile";
import Record from "../../models/PatientRecord";

import localHost from "../../host";

const PatientDetailScreen = (props) => {
  const patientInfo = props.navigation.getParam("patient");

  const showPatientRecordDetailHandler = (record) => {
    props.navigation.navigate({
      routeName: "PatientRecordDetail",
      params: { title: record.title, patient_email: patientInfo.email },
    });
  };

  let records = (
    <View style={styles.records_wrapper}>
      <Text style={styles.text}>This patient has no record yet.</Text>
    </View>
  );

  if (patientInfo.filenames.length > 0) {
    records = (
      <ScrollView contentContainerStyle={styles.records_wrapper}>
        {patientInfo.filenames.map((item, index) => (
          <PatientRecord
            key={index}
            index={index}
            canDelete={false}
            record={new Record(item, "")}
            showRecordDetailHandler={showPatientRecordDetailHandler}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.patient_info_container}>
        <Ionicons
          name="person-circle"
          color={Colors.studyFindBlue}
          size={50}
          style={styles.icon}
        />
        <View style={styles.text_wrapper}>
          <View style={styles.text_element_wrapper}>
            <Text style={styles.text_title}>{"Name:  "}</Text>
            <Text style={styles.text}>{patientInfo.name}</Text>
          </View>
          <View style={styles.text_element_wrapper}>
            <Text style={styles.text_title}>{"Gender:  "}</Text>
            <Text style={styles.text}>{patientInfo.gender}</Text>
          </View>
          <View style={styles.text_element_wrapper}>
            <Text style={styles.text_title}>{"Birthday:  "}</Text>
            <Text style={styles.text}>{patientInfo.birthday}</Text>
          </View>
        </View>
      </View>
      {records}
    </View>
  );
};

PatientDetailScreen.navigationOptions = () => {
  return {
    headerTitle: "Patient Records",
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  icon: {
    marginTop: 20,
    marginLeft: 10,
  },

  text_title: {
    fontFamily: "Roboto",
    fontSize: 18,
    marginTop: 2,
    fontWeight: "bold",
  },

  text: {
    fontFamily: "Roboto",
    fontSize: 16,
    marginTop: 4,
  },

  text_wrapper: {
    marginTop: 8,
    marginLeft: 20,
    height: "100%",
  },

  text_element_wrapper: {
    flexDirection: "row",
  },

  patient_info_container: {
    width: "80%",
    height: 100,
    marginTop: 30,
    borderRadius: 4,
    flexDirection: "row",
    elevation: 1,
    backgroundColor: "rgba(11, 249, 192, 0.8)",
  },

  records_wrapper: {
    width: "100%",
    height: 350,
    alignItems: "center",
    marginTop: 30,
  },
});

export default PatientDetailScreen;
