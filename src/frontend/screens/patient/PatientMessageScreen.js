import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import PatientBottomBar from "../../components/PatientBottomBar";
import Colors from "../../assets/Colors";
import * as authActions from "../../store/actions/auth";

import localHost from "../../host";

const PatientMessageScreen = (props) => {

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
        <View style={styles.container}>
            <StatusBar backgroundColor={("black", 60)} />
            <View style={styles.body}>
            </View>
            <PatientBottomBar
               pressFolder={viewFolderHandler}
               pressProfile={viewProfileHandler}
               screen={"Message"}
               style={styles.bottom_bar}
            />
        </View>
    );
}

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
});

export default PatientMessageScreen;