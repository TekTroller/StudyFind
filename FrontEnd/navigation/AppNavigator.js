import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "../screens/LoginScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import PatientRecordsScreen from "../screens/PatientRecordsScreen";
import SuccessScreen from "../screens/SuccessScreen";
import Colors from "../assets/Colors";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colors.studyFindDarkBlue,
  },
  headerTintColor: "white",
  headerTintSize: 30,
};

const LoginNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    CreateAccount: CreateAccountScreen,
    Success: SuccessScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const PatientNavigator = createStackNavigator(
  { PatientRecords: PatientRecordsScreen },
  { defaultNavigationOptions: defaultNavOptions }
);

const AppNavigator = createSwitchNavigator({
  Login: LoginNavigator,
  PatientHome: PatientNavigator,
});

export default createAppContainer(AppNavigator);
