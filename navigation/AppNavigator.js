import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "../screens/LoginScreen";
import CreateAccountScreen from "../screens/CreateAccountScreen";

const AppNavigator = createStackNavigator({
  Login: LoginScreen,
  CreateAccount: CreateAccountScreen,
});

export default createAppContainer(AppNavigator);
