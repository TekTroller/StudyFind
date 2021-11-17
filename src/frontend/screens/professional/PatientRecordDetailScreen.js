import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../assets/Colors";
import * as authActions from "../../store/actions/auth";
import PatientProfile from "../../models/PatientProfile";

import localHost from "../../host";

const PatientRecordDetailScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [ratio, setRatio] = useState(1);

  const patient_email = props.navigation.getParam("patient_email");
  const filename = props.navigation.getParam("title");
  const authenticationInfo = useSelector((state) => state.authentication);
  //console.log(filename, patient_email, authenticationInfo.accountAddress);

  const getUri = async (filename, patient_email) => {
    if (imageUri === "") {
      setLoading(true);
      //console.log("loading");
      try {
        var res = await axios.get(
          localHost + "/professional/view_patient_file",
          {
            params: {
              patient_email: patient_email,
              filename: filename,
              address: authenticationInfo.accountAddress,
            },
          }
        );

        let filedata = res.data.filedata.data.data;
        setImageUri(filedata);
        setLoading(false);
      } catch (err) {
        //setLoading(false);
        Alert.alert("Error", "File loading failed", [
          {
            text: "cancel",
            onPress: () => {
              props.navigation.goBack();
            },
          },
        ]);
      }
    }
  };

  useEffect(() => {
    getUri(filename, patient_email);
  }, [imageUri]);

  let content = null;
  if (loading) {
    content = (
      <ActivityIndicator
        size="large"
        color={Colors.studyFindLightGreen}
        style={styles.loading}
      />
    );
  } else {
    content = (
      <Image
        style={{ width: "100%", height: undefined, aspectRatio: ratio }}
        resizeMode="contain"
        source={{ uri: `data:image/gif;base64,${imageUri}` }}
      />
    );
  }

  return <View style={styles.container}>{content}</View>;
};

PatientRecordDetailScreen.navigationOptions = (navData) => {
  const title = navData.navigation.getParam("title");
  return {
    headerTitle: title,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  loading: {
    width: "100%",
    height: 100,
  },
});

export default PatientRecordDetailScreen;
