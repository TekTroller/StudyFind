import React from "react";
import { enableScreens } from "react-native-screens";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import AppNavigator from "./navigation/AppNavigator";
import authReducer from "./store/reducers/auth";
import registerReducer from "./store/reducers/register";

enableScreens();

const rootReducer = combineReducers({
  authentication: authReducer,
  registration: registerReducer,
});

const store = createStore(rootReducer);

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
