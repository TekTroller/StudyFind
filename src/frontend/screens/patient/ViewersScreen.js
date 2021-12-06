import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import PatientBottomBar from "../../components/PatientBottomBar";
import Viewer from "../../components/Viewer";
import Colors from "../../assets/Colors";

import localHost from "../../host";

const ViewersScreen = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(true);
  const [viewers, setViewers] = useState(null);
  const authenticationInfo = useSelector((state) => state.authentication);

  const loadViewers = async () => {
    try {
      if (updated) {
        setLoading(true);
        //console.log(authenticationInfo.accountAddress);
        var res = await axios.get(
          localHost + "/patient/get_authorized_professionals",
          {
            params: {
              address: authenticationInfo.accountAddress,
            },
          }
        );
        setViewers(res.data.authorized);
        //console.log(res.data.authorized);
        setLoading(false);
        setUpdated(false);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Error loading authorized viewers", [
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

  const viewMessageHandler = () => {
    props.navigation.navigate({
      routeName: "PatientMessage",
    });
  };

  useEffect(() => {
    loadViewers();
  }, [viewers]);

  let contents = null;
  if (loading || viewers === null) {
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
    if (viewers !== null) {
      if (viewers.length === 0) {
        contents = (
          <View style={styles.body}>
            <Text style={{ marginLeft: 110, marginTop: 20 }}>
              {"You have no viewer."}
            </Text>
          </View>
        );
      } else {
        contents = (
          <View style={styles.body}>
            <ScrollView contentContainerStyle={styles.viewers_wrapper}>
              {viewers.map((item, index) => (
                <Viewer
                  key={index}
                  name={item[0] + ",   " + item[2]}
                  email={item[2]}
                  address={authenticationInfo.accountAddress}
                />
              ))}
            </ScrollView>
          </View>
        );
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={("black", 60)} />
      {contents}
      <PatientBottomBar
        pressFolder={viewFolderHandler}
        pressProfile={viewProfileHandler}
        pressMessage={viewMessageHandler}
        screen={"People"}
        style={styles.bottom_bar}
      />
    </View>
  );
};

ViewersScreen.navigationOptions = () => {
  return {
    headerTitle: "Authorized Viewers",
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
    height: 641,
  },
  viewers_wrapper: {
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

export default ViewersScreen;
