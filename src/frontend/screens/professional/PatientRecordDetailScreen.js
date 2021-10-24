import React, { useState, useEffect } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../assets/Colors";
import * as authActions from "../../store/actions/auth";
import PatientProfile from "../../models/PatientProfile";

import localHost from "../../host";

const PatientRecordDetailScreen = (props) => {
  /* TODO 
        professional view patient record details */
};

styles = StyleSheet.create();

export default PatientRecordDetailScreen;
