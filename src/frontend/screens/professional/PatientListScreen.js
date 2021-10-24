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

import ProfessionalBottomBar from "../../components/ProfessionalBottomBar";
import Colors from "../../assets/Colors";
import PatientProfileRow from "../../components/PatientProfileRow";
import * as patientListActions from "../../store/actions/patientList";

const PatientListScreen = (props) => {
  const patientListInfo = useSelector((state) => state.patientList);
  const dispatch = useDispatch();

  const [origin, setOrigin] = useState([]);
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    userList();
    return () => {};
  }, []);

  const compare = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  };

  const userList = async () => {
    const url = "https://jsonplaceholder.typicode.com/users";
    await fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson.sort(compare);
        setFilter(responseJson);
        setOrigin(responseJson);
        dispatch(patientListActions.getPatientList(responseJson));
      })
      .catch((error) => {
        console.log(error);
      });
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

  const patients = (
    <ScrollView contentContainerStyle={styles.patient_list_wrapper}>
      {filter.map((item, index) => (
        <PatientProfileRow key={index} name={item.name} />
      ))}
    </ScrollView>
  );

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
