import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

// Authorization
import LoginScreen from "../screens/authentication/LoginScreen";
import CreateAccountScreen from "../screens/authentication/CreateAccountScreen";
import SuccessScreen from "../screens/authentication/SuccessScreen";

// Patients
import PatientRecordsScreen from "../screens/patient/PatientRecordsScreen";
import NewRecordScreen from "../screens/patient/NewRecordScreen";
import RecordDetailScreen from "../screens/patient/RecordDetailScreen";

// Professionals
import PatientListScreen from "../screens/professional/PatientListScreen";

// Other imports
import Colors from "../assets/Colors";
import Record from "../models/PatientRecord";

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
  {
    PatientRecords: PatientRecordsScreen,
    NewRecord: NewRecordScreen,
    RecordDetail: RecordDetailScreen,
  },
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
