import React, { useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../assets/Colors";
import localHost from "../host";

const Viewer = (props) => {
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [blocked, setBlocked] = useState(false);
  //console.log(props.address);

  const blockWrapperHandler = async () => {
    Alert.alert(
      "Block viewer",
      "Blocking this user from viewing your records might take over 15 seconds. Are you sure to proceed?",
      [
        { text: "cancel" },
        {
          text: "Proceed",
          onPress: () => {
            blockHandler();
          },
        },
      ]
    );
  };

  const blockHandler = async () => {
    try {
      setLoadingBlock(true);
      var res = await axios.post(localHost + "/patient/ban_professional", {
        professional_email: props.email,
        address: props.address,
      });

      if (!res.data.success) {
        Alert.alert("Error", "An error occured", [{ text: "cancel" }]);
        setBlocked(false);
      } else {
        setBlocked(true);
      }
      setLoadingBlock(false);
    } catch (err) {
      Alert.alert("Error", "An error occured", [{ text: "cancel" }]);
      setBlocked(false);
    }
  };

  let blockIcon = (
    <Ionicons
      name="close-circle"
      color={Colors.studyFindRed}
      size={30}
      style={styles.icon}
    />
  );

  if (loadingBlock) {
    blockIcon = (
      <ActivityIndicator
        size="small"
        color={Colors.studyFindRed}
        style={styles.loading}
      />
    );
  }

  let status = (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={styles.icon_wrapper}
        onPress={blockWrapperHandler}
      >
        {blockIcon}
      </TouchableOpacity>
    </View>
  );

  if (blocked) {
    status = (
      <View style={styles.blocked}>
        <Text
          style={{ color: Colors.studyFindRed, marginLeft: 9, marginTop: 2 }}
        >
          blocked
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.title_wrapper}>
        <Text style={styles.title}>{props.name}</Text>
      </View>
      {status}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: Colors.studyFindGray,
    flexDirection: "row",
    marginBottom: 5,
    alignSelf: "center",
  },

  icon: {
    marginTop: 8,
  },

  icon_wrapper: {
    width: 30,
    height: "100%",
    marginLeft: 35,
  },

  title_wrapper: {
    height: "100%",
    width: 260,
    marginLeft: 10,
  },

  loading: {
    marginTop: 13,
    marginLeft: 10,
  },

  title: {
    marginTop: 16,
    fontSize: 12,
  },

  blocked: {
    height: "60%",
    width: 70,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.studyFindRed,
  },
});

export default Viewer;
