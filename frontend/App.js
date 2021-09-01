import React from "react";
import { enableScreens } from "react-native-screens";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import AppNavigator from "./navigation/AppNavigator";
import authReducer from "./store/reducers/auth";

enableScreens();

const rootReducer = combineReducers({
  authentication: authReducer,
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
