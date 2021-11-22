import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import PatientBottomBar from "../../components/PatientBottomBar";
import Request from "../../components/Request";
import Colors from "../../assets/Colors";
import * as authActions from "../../store/actions/auth";

import localHost from "../../host";

const PatientMessageScreen = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(true);
  const [requests, setRequests] = useState(null);
  const authenticationInfo = useSelector((state) => state.authentication);

  const loadRequests = async () => {
    try {
      if (updated) {
        setLoading(true);
        console.log(authenticationInfo.accountAddress);
        var res = await axios.get(
          localHost + "/patient/get_unprocessed_requests",
          {
            params: {
              address: authenticationInfo.accountAddress,
            },
          }
        );
        setRequests(res.data.requests);
        console.log(res.data.requests);
        setLoading(false);
        setUpdated(false);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Error loading messages", [
        {
          text: "cancel",
        },
      ]);
    }
  };

  const viewProfileHandler = () => {
    props.navigation.navigate({
      routeName: "PatientProfile",
    });
  };

  const viewFolderHandler = () => {
    props.navigation.navigate({
      routeName: "PatientFolder",
    });
  };

  useEffect(() => {
    loadRequests();
  }, [requests]);

  let messages = null;
  if (requests !== null) {
    if (requests.length === 0) {
      messages = (
        <View style={styles.messages_wrapper}>
          <Text style={{ marginLeft: 110 }}>{"You have no messages"}</Text>
        </View>
      );
    } else {
      messages = (
        <ScrollView contentContainerStyle={styles.messages_wrapper}>
          {requests.map((item, index) => (
            <Request
              key={index}
              name={item[0] + ",   " + item[2]}
              email={item[2]}
              address={authenticationInfo.accountAddress}
            />
          ))}
        </ScrollView>
      );
    }
  }

  let prompt = null;
  if (requests !== null && requests.length !== 0) {
    prompt = (
      <View style={{ marginTop: 10, flexDirection: "row", marginLeft: 25 }}>
        <Ionicons name="notifications" color={"orange"} size={25} />
        <Text style={styles.prompt}>you have the following new requests</Text>
      </View>
    );
  }

  let contents = null;
  if (loading) {
    contents = (
      <View style={styles.body}>
        <ActivityIndicator
          size="large"
          color={Colors.studyFindLightBlue}
          style={styles.loading}
        />
      </View>
    );
  } else {
    contents = (
      <View style={styles.body}>
        {prompt}
        {messages}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      {contents}
      <PatientBottomBar
        pressFolder={viewFolderHandler}
        pressProfile={viewProfileHandler}
        screen={"Message"}
        style={styles.bottom_bar}
      />
    </View>
  );
};

PatientMessageScreen.navigationOptions = () => {
  return {
    headerTitle: "Messages",
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  body: {
    width: "100%",
    height: 635,
  },
  messages_wrapper: {
    width: "100%",
    height: 350,
    marginTop: 20,
  },
  icon: {
    marginTop: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  text_wrapper: {
    alignSelf: "flex-start",
    marginLeft: 50,
    flexDirection: "row",
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 16,
    marginTop: 2,
  },
  text_title: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottom_bar: {
    marginTop: 635,
  },
  loading: {
    marginTop: 50,
  },
  prompt: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default PatientMessageScreen;
