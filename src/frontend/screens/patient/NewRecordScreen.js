import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Colors from "../../assets/Colors";
import ImgPicker from "../../components/ImgPicker";
import * as patientRecordsActions from "../../store/actions/patientRecords";
import Record from "../../models/PatientRecord";
import localHost from "../../host";

const NewRecordScreen = (props) => {
  const [titleValue, setTitleValue] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const authenticationInfo = useSelector((state) => state.authentication);
  const patientRecordsInfo = useSelector((state) => state.patientRecords);
  const dispatch = useDispatch();

  const titleChangeHandler = (text) => {
    //console.log(titleValue, selectedImage);
    setTitleValue(text);
    if (text.length > 1 && selectedImage !== null) {
      setValid(true);
    }
  };

  const imageTakenHandler = (imageUri) => {
    setSelectedImage(imageUri);
  };

  const checkValidity = () => {
    setValid(titleValue.length > 1 && selectedImage !== null);
  };

  const saveRecordHandler = async () => {
    if (valid) {
      var duplicate = false;
      if (patientRecordsInfo.patientRecords.length > 0) {
        for (var i = 0; i < patientRecordsInfo.patientRecords.length; i++) {
          if (patientRecordsInfo.patientRecords[i].title === titleValue) {
            duplicate = true;
            break;
          }
        }
      }

      if (duplicate) {
        Alert.alert(
          "Duplicate record name",
          "This record name has been used. Use a new one.",
          [{ text: "cancel" }]
        );
      } else {
        const newRecord = new Record(titleValue, selectedImage);
        setLoading(true);
        try {
          var res = await axios.post(
            localHost + "/patient/upload_file",
            {
              filename: titleValue,
              filedata: selectedImage,
              address: authenticationInfo.accountAddress,
            },
            { timeout: 30000 }
          );
          setLoading(false);
          if (res.data.success) {
            dispatch(patientRecordsActions.addRecord(newRecord));
            props.navigation.goBack();
          } else {
            Alert.alert("Error", "Record upload failed", [{ text: "cancel" }]);
          }
        } catch (err) {
          setLoading(false);
          Alert.alert("Error", "Record upload failed", [{ text: "cancel" }]);
        }
      }
    }
  };

  useEffect(() => checkValidity());
  let activityIndication = null;
  if (loading) {
    activityIndication = (
      <ActivityIndicator
        size="large"
        color={Colors.studyFindLightGreen}
        style={styles.loading}
      />
    );
  } else {
    activityIndication = (
      <Text style={styles.save_record_text}>Save Record</Text>
    );
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <ImgPicker
          titleValue={titleValue}
          titleChangeHandler={titleChangeHandler}
          onImageTaken={imageTakenHandler}
        />
        <TouchableOpacity
          style={
            valid
              ? styles.save_record_button
              : styles.save_record_button_inactive
          }
          onPress={saveRecordHandler}
        >
          {activityIndication}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

NewRecordScreen.navigationOptions = {
  headerTitle: "New Record",
};

const styles = StyleSheet.create({
  form: {
    margin: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  save_record_button_inactive: {
    alignContent: "center",
    alignSelf: "center",
    borderRadius: 4,
    backgroundColor: Colors.studyFindGray,
    width: 270,
    height: 50,
  },
  save_record_button: {
    alignContent: "center",
    alignSelf: "center",
    elevation: 2,
    borderRadius: 4,
    backgroundColor: Colors.studyFindDarkBlue,
    width: 270,
    height: 50,
  },
  save_record_text: {
    fontFamily: "Roboto",
    fontSize: 20,
    color: "white",
    alignSelf: "center",
    marginTop: 10,
  },
  textInput: {
    borderBottomColor: Colors.studyFindGray,
    borderBottomWidth: 2,
    marginBottom: 15,
  },
  loading: {
    marginTop: 5,
  },
});

export default NewRecordScreen;
