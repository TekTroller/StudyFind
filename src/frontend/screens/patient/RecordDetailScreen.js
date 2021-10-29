import React, { useState, useEffect } from "react";
import { Image, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import * as patientRecordsActions from "../../store/actions/patientRecords";
import localHost from "../../host";

const RecordDetailScreen = (props) => {
  const patientRecordsInfo = useSelector((state) => state.patientRecords);
  const [ratio, setRatio] = useState(1);
  const dispatch = useDispatch();
  const title = props.navigation.getParam("title");

  let imageUri = props.navigation.getParam("imageUri");
  const getUri = async (filename, imageUri) => {
    try {
      if (imageUri === "") {
        var res = await axios.get(localHost + "/patient/view", {
          params: {
            filename: filename,
          },
        });

        let filedata = res.data.filedata;
        dispatch(patientRecordsActions.updateRecord(filename, filedata));
      }
    } catch (err) {
      console.log("error");
    }
  };
  //const imageUri = props.navigation.getParam("imageUri");

  Image.getSize(imageUri, (width, height) => {
    setRatio(width / height);
  });

  useEffect(() => {
    getUri(title, imageUri);
    if (imageUri === "") {
      for (var i = 0; i < patientRecordsInfo.patientRecords.length; i++) {
        if (patientRecordsInfo.patientRecords[i].title === title) {
          imageUri = patientRecordsInfo.patientRecords[i].imageUri;
          break;
        }
      }
    }
  });

  return (
    <View>
      <Image
        style={{ width: "100%", height: undefined, aspectRatio: ratio }}
        resizeMode="contain"
        source={{ uri: imageUri }}
      />
    </View>
  );
};

RecordDetailScreen.navigationOptions = (navData) => {
  const title = navData.navigation.getParam("title");
  return {
    headerTitle: title,
  };
};

export default RecordDetailScreen;
