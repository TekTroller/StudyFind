import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "../screens/authentication/LoginScreen";
import CreateAccountScreen from "../screens/authentication/CreateAccountScreen";
import PatientRecordsScreen from "../screens/patient/PatientRecordsScreen";
import SuccessScreen from "../screens/authentication/SuccessScreen";
import PatientsScreen from "../screens/professional/PatientsScreen";
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

const ProfessionalNavigator = createStackNavigator(
  { Patients: PatientsScreen },
  { defaultNavigationOptions: defaultNavOptions }
);

const AppNavigator = createSwitchNavigator({
  Login: LoginNavigator,
  PatientHome: PatientNavigator,
  ProfessionalHome: ProfessionalNavigator,
});

export default createAppContainer(AppNavigator);
