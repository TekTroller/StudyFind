import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import PatientRecord from "../../components/PatientRecord";
import PatientBottomBar from "../../components/PatientBottomBar";
import * as patientRecordsActions from "../../store/actions/patientRecords";
import * as authActions from "../../store/actions/auth";
import PatientProfile from "../../models/PatientProfile";
import Record from "../../models/PatientRecord";
import Colors from "../../assets/Colors";

import localHost from "../../host";

const PatientRecordsScreen = (props) => {
  const patientRecordsInfo = useSelector((state) => state.patientRecords);
  const authenticationInfo = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  const [deleting, setDeleting] = useState(false);

  let patientProfile = authenticationInfo.patientProfile;
  //console.log("patientProfile: ", patientProfile);
  //console.log("address: ", authenticationInfo.accountAddress);
  //console.log("records: ", patientRecordsInfo.patientRecords);
  //console.log("accountStatus: ", authenticationInfo.accountRetrieved);

  const updateProfile = async () => {
    if (patientProfile === null) {
      //console.log("loading patient profile");
      try {
        var res = await axios.get(localHost + "/patient/get_profile", {
          params: {
            address: authenticationInfo.accountAddress,
          },
        });

        patientProfile = new PatientProfile(
          res.data.name,
          res.data.birthday,
          res.data.gender
        );

        dispatch(authActions.setPatientProfile(patientProfile));
        dispatch(authActions.setAccountRetrieved(true));

        // load file names
        if (!authenticationInfo.accountRetrieved) {
          for (var i = 0; i < res.data.files.length; i++) {
            //console.log("here");
            const newRecord = new Record(res.data.files[i], "");
            //console.log(newRecord);
            dispatch(patientRecordsActions.addRecord(newRecord));
          }
        }
        dispatch(authActions.setAccountRetrieved(true));
      } catch (err) {
        console.log("error");
      }
    }
  };

  const showAddOptions = () => {
    props.navigation.navigate({ routeName: "NewRecord" });
  };

  const showRecordDetailHandler = (record) => {
    props.navigation.navigate({
      routeName: "RecordDetail",
      params: { title: record.title, imageUri: record.imageUri },
    });
  };

  const deleteRecordHandler = async (index) => {
    Alert.alert(
      "Delete Record",
      "File deletion can take up to 15 seconds. Are you sure?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setDeleting(true);
              //console.log("record: ", patientRecordsInfo.patientRecords[index]);
              //console.log("address: ", authenticationInfo.accountAddress);
              var res = await axios.post(
                localHost + "/patient/delete_file",
                {
                  filename: patientRecordsInfo.patientRecords[index].title,
                  address: authenticationInfo.accountAddress,
                },
                { timeout: 20000 }
              );
              dispatch(patientRecordsActions.deleteRecord(index));
              setDeleting(false);
            } catch (err) {
              setDeleting(false);
              Alert.alert("Error", "Record deletion failed", [
                { text: "cancel" },
              ]);
            }
          },
        },
      ]
    );
  };

  const viewProfileHandler = () => {
    props.navigation.navigate({
      routeName: "PatientProfile",
    });
  };

  useEffect(() => {
    updateProfile();
  });

  const records = (
    <ScrollView contentContainerStyle={styles.records_wrapper}>
      {patientRecordsInfo.patientRecords.map((item, index) => (
        <PatientRecord
          key={index}
          index={index}
          record={item}
          showRecordDetailHandler={showRecordDetailHandler}
          deleteRecordHandler={deleteRecordHandler}
        />
      ))}
    </ScrollView>
  );

  let loading = null;
  if (deleting) {
    loading = <ActivityIndicator size="large" color={Colors.studyFindRed} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      <View style={{ flex: 1, width: "100%" }}>
        <View>{records}</View>
        <View style={styles.loading}>{loading}</View>
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
      <PatientBottomBar
        pressProfile={viewProfileHandler}
        screen={"Folder"}
        style={styles.bottom_bar}
      />
    </View>
  );
};

PatientRecordsScreen.navigationOptions = () => {
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
    height: 350,
    alignItems: "center",
    marginTop: 30,
  },

  add_button_wrapper: {
    position: "relative",
    marginTop: 150,
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

  bottom_bar: {
    alignSelf: "flex-end",
  },

  panel_header: {
    alignItems: "center",
  },

  loading: {
    width: "100%",
    height: 20,
  },
});

export default PatientRecordsScreen;
