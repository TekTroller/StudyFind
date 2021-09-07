import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "../screens/LoginScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";
import PatientRecordsScreen from "../screens/PatientRecordsScreen";
import SuccessScreen from "../screens/SuccessScreen";

const AppNavigator = createStackNavigator({
  Login: LoginScreen,
  CreateAccount: CreateAccountScreen,
  PatientRecords: PatientRecordsScreen,
  Success: SuccessScreen,
});

export default createAppContainer(AppNavigator);
