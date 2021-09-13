import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "../screens/authentication/LoginScreen";
import CreateAccountScreen from "../screens/authentication/CreateAccountScreen";
import PatientRecordsScreen from "../screens/patient/PatientRecordsScreen";
import SuccessScreen from "../screens/authentication/SuccessScreen";
import PatientListScreen from "../screens/professional/PatientListScreen";
import NewRecordScreen from "../screens/patient/NewRecordScreen";
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
  { PatientRecords: PatientRecordsScreen, NewRecord: NewRecordScreen },
  { defaultNavigationOptions: defaultNavOptions }
);

const ProfessionalNavigator = createStackNavigator(
  { PatientList: PatientListScreen },
  { defaultNavigationOptions: defaultNavOptions }
);

const AppNavigator = createSwitchNavigator({
  Login: LoginNavigator,
  PatientHome: PatientNavigator,
  ProfessionalHome: ProfessionalNavigator,
});

export default createAppContainer(AppNavigator);
