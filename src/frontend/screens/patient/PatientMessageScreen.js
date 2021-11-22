import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import PatientBottomBar from "../../components/PatientBottomBar";
import Colors from "../../assets/Colors";
import * as authActions from "../../store/actions/auth";

import localHost from "../../host";

import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { Entypo } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PatientMessageScreen = (props) => {
  // **************************** deletable code **********************************//
  const [items, setItems] = useState([
    { id: 0, name: "Otto Primitivo", decided: false, accepted: false },
    { id: 1, name: "Arkadiusz Guido", decided: false, accepted: false },
    { id: 2, name: "Suibne Abd al-Majid", decided: false, accepted: false },
    { id: 3, name: "Divya Hrodohaidis", decided: false, accepted: false },
  ]);

  const personSeparatorView = () => {
    return <View style={styles.seperator} />;
  };
  const personView = ({ item }) => {
    return (
      <View style={styles.component}>
        <Text>
          {item.name} {"wants to view your records"}
        </Text>
        {item.decided == false ? (
          <View style={styles.iconDuo}>
            <AntDesign
              style={styles.check}
              name="checkcircle"
              size={20}
              color="black"
            />
            <Entypo
              style={styles.cross}
              name="circle-with-cross"
              size={24}
              color="black"
            />
          </View>
        ) : (
          <View>
            {accepted == true ? <Text>Accepted</Text> : <Text>Rejected</Text>}
          </View>
        )}
      </View>
    );
  };
  //on press function
  const acceptedFunction = (item) => {
    let newArr = [...items];
    newArr.forEach((d) => {
      {
        d.name == item.name ? (d.accepted = true) : d.name;
      }
    });
    console.log(newArr);
    setItems(newArr);
  };
  // **************************** new code **********************************//

  const dispatch = useDispatch();

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

  return (
    <View>

      <View style={styles.container}>
        <StatusBar backgroundColor={("black", 60)} />
        <View style={styles.body}>
        <View style={styles.container1}>
        <View style={styles.headerContainer}>
          <View style={styles.htextContainer}>
            <Text style={styles.headerText}>Requests</Text>
          </View>
          <View style={styles.secondLayer}>
            <View style={styles.icon1}>
              <FontAwesome
                style={styles.innericon1}
                name="bars"
                size={27}
                color="black"
              />
            </View>
            <TextInput
              style={styles.inputContainer}
              placeholder="Search the name"
            />
          </View>
        </View>
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={personSeparatorView}
          renderItem={personView}
        />
      </View>
        </View>
        <PatientBottomBar
          pressFolder={viewFolderHandler}
          pressProfile={viewProfileHandler}
          screen={"Message"}
          style={styles.bottom_bar}
        />
      </View>
    </View>
  );
};

PatientMessageScreen.navigationOptions = () => {
  return {
    headerTitle: "Patient Message",
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  body: {
    height: 599,
    width: "100%",
    height: 635,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  bottom_bar: {
    top: 10,
  },
  container1: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },

  headerContainer: {
    justifyContent: "space-between",
    backgroundColor: "#23395D",
    height: windowHeight * 0.2,
  },

  headerText: {
    color: "white",
    fontSize: 30,
  },

  htextContainer: {
    paddingLeft: 15,
    paddingTop: 25,
  },

  secondLayer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    paddingLeft: 15,
  },

  inputContainer: {
    backgroundColor: "white",
    fontSize: 15,
    height: 35,
    width: 350,
    paddingLeft: 20,
  },

  icon1: {
    backgroundColor: "#f2f2f2",
    height: 35,
    width: 35,
    alignItems: "center",
  },

  innericon1: {
    paddingTop: 5,
  },

  seperator: {
    height: 2,
    width: "30%",
    backgroundColor: "#808080",
    marginLeft: "35%",
  },

  component: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  iconDuo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cross: {
    color: "red",
    paddingLeft: 6,
  },

  check: {
    color: "green",
  },
});

export default PatientMessageScreen;
