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
import PatientProfileScreen from "../screens/patient/PatientProfileScreen";
import PatientMessageScreen from "../screens/patient/PatientMessageScreen";
import PatientViewersScreen from "../screens/patient/ViewersScreen";

// Professionals
import PatientListScreen from "../screens/professional/PatientListScreen";
import ProfessionalProfileScreen from "../screens/professional/ProfessionalProfileScreen";
import PatientDetailScreen from "../screens/professional/PatientDetailScreen";
import PatientRecordDetailScreen from "../screens/professional/PatientRecordDetailScreen";
import RequestsOutScreen from "../screens/professional/RequestsOutScreen";

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

const PatientRecordNavigator = createStackNavigator(
  {
    PatientRecords: PatientRecordsScreen,
    NewRecord: NewRecordScreen,
    RecordDetail: RecordDetailScreen,
  },
  { defaultNavigationOptions: defaultNavOptions }
);

const PatientViewersNavigator = createStackNavigator(
  {
    PatientViewers: PatientViewersScreen,
  },
  { defaultNavigationOptions: defaultNavOptions }
);

const PatientMessageNavigator = createStackNavigator(
  {
    PatientMessage: PatientMessageScreen,
  },
  { defaultNavigationOptions: defaultNavOptions }
);

const PatientProfileNavigator = createStackNavigator(
  {
    PatientProfileScreen: PatientProfileScreen,
  },
  { defaultNavigationOptions: defaultNavOptions }
);

const PatientNavigator = createSwitchNavigator(
  {
    PatientFolder: PatientRecordNavigator,
    PatientProfile: PatientProfileNavigator,
    PatientMessage: PatientMessageNavigator,
    PatientViewers: PatientViewersNavigator,
  },
  { defaultNavigationOptions: defaultNavOptions }
);

const ProfessionalFolderNavigator = createStackNavigator(
  {
    PatientList: PatientListScreen,
    PatientDetail: PatientDetailScreen,
    PatientRecordDetail: PatientRecordDetailScreen,
    RequestsOut: RequestsOutScreen,
  },
  { defaultNavigationOptions: defaultNavOptions }
);

const ProfessionalProfileNavigator = createStackNavigator(
  {
    ProfessionalProfileScreen: ProfessionalProfileScreen,
  },
  { defaultNavigationOptions: defaultNavOptions }
);

const ProfessionalNavigator = createSwitchNavigator(
  {
    ProfessionalFolder: ProfessionalFolderNavigator,
    ProfessionalProfile: ProfessionalProfileNavigator,
  },
  { defaultNavigationOptions: defaultNavOptions }
);

const AppNavigator = createSwitchNavigator({
  Login: LoginNavigator,
  PatientHome: PatientNavigator,
  ProfessionalHome: ProfessionalNavigator,
});

export default createAppContainer(AppNavigator);
