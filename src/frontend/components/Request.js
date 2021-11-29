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
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import localHost from "../host";

const Request = (props) => {
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const acceptWrapperHandler = async () => {
    Alert.alert(
      "Accept Request",
      "Accepting this request might take over 15 seconds. Are you sure to proceed?",
      [
        { text: "cancel" },
        {
          text: "proceed",
          onPress: () => {
            acceptHandler();
          },
        },
      ]
    );
  };

  const rejectWrapperHandler = async () => {
    Alert.alert(
      "Reject Request",
      "Rejecting this request might take over 15 seconds. Are you sure to proceed?",
      [
        { text: "cancel" },
        {
          text: "proceed",
          onPress: () => {
            rejectHandler();
          },
        },
      ]
    );
  };

  const acceptHandler = async () => {
    try {
      setLoadingAccept(true);
      var res = await axios.post(localHost + "/patient/process_request", {
        professional_email: props.email,
        approve: true,
        address: props.address,
      });

      if (!res.data.success) {
        Alert.alert("Error", "An error occured", [{ text: "cancel" }]);
      }
      setLoadingAccept(false);
      setAccepted(true);
    } catch (err) {
      Alert.alert("Error", "An error occured", [{ text: "cancel" }]);
      setLoadingAccept(false);
    }
  };

  const rejectHandler = async () => {
    try {
      setLoadingReject(true);
      var res = await axios.post(localHost + "/patient/process_request", {
        professional_email: props.email,
        approve: false,
        address: props.address,
      });

      if (!res.data.success) {
        Alert.alert("Error", "An error occured", [{ text: "cancel" }]);
      }
      setLoadingReject(false);
      setRejected(true);
    } catch (err) {
      Alert.alert("Error", "An error occured", [{ text: "cancel" }]);
      setLoadingReject(false);
    }
  };

  let rejectIcon = (
    <Ionicons
      name="close-circle"
      color={Colors.studyFindRed}
      size={30}
      style={styles.icon}
    />
  );

  if (loadingReject) {
    rejectIcon = (
      <ActivityIndicator
        size="small"
        color={Colors.studyFindRed}
        style={styles.loading}
      />
    );
  }

  let acceptIcon = (
    <Ionicons
      name="checkmark-circle"
      color={"green"}
      size={30}
      style={styles.icon}
    />
  );
  if (loadingAccept) {
    acceptIcon = (
      <ActivityIndicator size="small" color={"green"} style={styles.loading} />
    );
  }

  let status = (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={styles.icon_wrapper}
        onPress={loadingAccept ? null : rejectWrapperHandler}
      >
        {rejectIcon}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.icon_wrapper}
        onPress={loadingReject ? null : acceptWrapperHandler}
      >
        {acceptIcon}
      </TouchableOpacity>
    </View>
  );

  if (accepted) {
    status = (
      <View style={styles.accepted}>
        <Text style={{ color: "green", marginLeft: 8, marginTop: 2 }}>
          accepted
        </Text>
      </View>
    );
  } else if (rejected) {
    status = (
      <View style={styles.rejected}>
        <Text
          style={{ color: Colors.studyFindRed, marginLeft: 11, marginTop: 2 }}
        >
          rejected
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
    marginLeft: 5,
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

  accepted: {
    height: "60%",
    width: 80,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "green",
  },

  rejected: {
    height: "60%",
    width: 80,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.studyFindRed,
  },
});

export default Request;
