import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
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
        for (var i = 0; i < res.data.files; i++) {
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

        var res = await axios.post(localHost + "/patient/upload_file", {
          params: {
            filename: titleValue,
            filedata: selectedImage.toString(),
            address: authenticationInfo.accountAddress,
          },
        });
        dispatch(patientRecordsActions.addRecord(newRecord));
        props.navigation.goBack();

        //props.navigation.goBack();
      }
    }
  };

  useEffect(() => checkValidity());

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
          <Text style={styles.save_record_text}>Save Record</Text>
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
});

export default NewRecordScreen;
