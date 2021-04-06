import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import TopBar from "../components/TopBar";
import TopNagation from "../components/TopNavigation";

const BLUE = "#2C98F0";
const GRAY = ("#ffffff", 42);

const Login = (props) => {
  return (
    <View style={styles.container}>
      <TopBar title={props.title} />
      <TopNagation />
      <Image
        source={require("../assets/client-logo.png")}
        style={styles.logo}
      />
      <TextInput
        nativeID="user"
        textAlign="left"
        placeholder="Email/Phone"
        sectionColor={"#2C98F0"}
        underlineColorAndroid={GRAY}
        style={styles.user}
      />
      <TextInput
        nativeID="user"
        textAlign="left"
        placeholder="Password"
        sectionColor={"#2C98F0"}
        underlineColorAndroid={GRAY}
        style={styles.passsword}
      />
      <TouchableOpacity style={styles.login}>
        <Text style={styles.title}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },

  logo: {
    width: 244,
    height: 75,
    alignSelf: "center",
    top: 80,
  },

  user: {
    width: 328,
    height: 45,
    alignSelf: "center",
    top: 100,
    fontSize: 16,
    fontFamily: "Roboto",
    paddingLeft: 6,
  },

  passsword: {
    width: 328,
    height: 45,
    alignSelf: "center",
    top: 140,
    fontSize: 16,
    fontFamily: "Roboto",
    paddingLeft: 6,
  },

  login: {
    top: 190,
    alignItems: "center",
    backgroundColor: "#23395D",
    width: 320,
    height: 53,
    alignSelf: "center",
  },

  title: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    alignSelf: "center",
    top: 16,
  },
});

export default Login;
