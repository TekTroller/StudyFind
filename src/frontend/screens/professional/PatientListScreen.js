import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import ProfessionalBottomBar from "../../components/ProfessionalBottomBar";
import Colors from "../../assets/Colors";
import PatientProfileRow from "../../components/PatientProfileRow";
import ProfessionalProfile from "../../models/ProfessionalProfile";
import * as patientListActions from "../../store/actions/patientList";
import * as authActions from "../../store/actions/auth";

import localHost from "../../host";

const PatientListScreen = (props) => {
  const patientListInfo = useSelector((state) => state.patientList);

  const [origin, setOrigin] = useState([]);
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState("");

  const authenticationInfo = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  let professionalProfile = authenticationInfo.professionalProfile;

  const updateProfile = async () => {
    //if (professionalProfile === null) {
    var res = await axios.get(localHost + "/professional/get_profile", {
      params: {
        address: authenticationInfo.accountAddress,
      },
    });

    professionalProfile = new ProfessionalProfile(
      res.data.name,
      res.data.institution
    );

    var newPatientList = [];
    for (var i = 0; i < res.data.patients.length; i++) {
      newPatientList.push(res.data.patients[i]);
    }
    newPatientList.sort(compare);
    setFilter(newPatientList);
    setOrigin(newPatientList);

    dispatch(patientListActions.setPatientList(newPatientList));
    //console.log(res.data);
    dispatch(authActions.setProfessionalProfile(professionalProfile));
    dispatch(authActions.setAccountRetrieved(true));
    //}
  };

  const compare = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  const searchFilter = (text) => {
    if (text) {
      const newData = origin.filter((item) => {
        const itemData = item.name ? item.name : "";
        return itemData.indexOf(text) > -1;
      });
      setFilter(newData);
      setSearch(text);
    } else {
      setFilter(origin);
      setSearch(text);
    }
  };

  const viewProfileHandler = () => {
    props.navigation.navigate({
      routeName: "ProfessionalProfileScreen",
    });
  };

  const viewPatientDetailHandler = (patientItem) => {
    //console.log(patientItem);
    props.navigation.navigate({
      routeName: "PatientDetail",
      params: { patient: patientItem },
    });
  };

  const patients = (
    <ScrollView contentContainerStyle={styles.patient_list_wrapper}>
      {filter.map((item, index) => (
        <PatientProfileRow
          key={index}
          name={item.name}
          item={item}
          viewPatientDetailHandler={viewPatientDetailHandler}
        />
      ))}
    </ScrollView>
  );

  useEffect(() => {
    updateProfile();
    //userList();
    return () => {};
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <StatusBar backgroundColor={("black", 60)} />
        <View style={{ flex: 1, width: "100%" }}>
          <View style={styles.input_wrapper}>
            <Ionicons
              name="search-outline"
              color={Colors.studyFindGray}
              size={20}
              style={styles.search_icon}
            />
            <TextInput
              style={styles.input_text}
              value={search}
              placeholder="search patient name"
              onChangeText={(text) => searchFilter(text)}
            />
          </View>
          {patients}
        </View>
        <ProfessionalBottomBar
          pressProfile={viewProfileHandler}
          screen={"Folder"}
          style={styles.bottom_bar}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

PatientListScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Patients",
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },

  input_wrapper: {
    height: 45,
    width: "90%",
    alignSelf: "center",
    borderBottomWidth: 2,
    borderBottomColor: Colors.studyFindGray,
    flexDirection: "row",
  },

  search_icon: {
    marginLeft: 10,
    marginTop: 20,
  },

  input_text: {
    marginLeft: 10,
    marginTop: 18,
    fontSize: 18,
  },

  inputLocation: {
    width: "90%",
    marginLeft: "5",
  },

  image: {
    width: 244,
    height: 75,
    alignSelf: "center",
    marginTop: 20,
  },

  patient_list_wrapper: {
    width: "80%",
    marginTop: 10,
    alignSelf: "center",
  },
});

export default PatientListScreen;
