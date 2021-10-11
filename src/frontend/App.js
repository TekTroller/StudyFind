import React from "react";
import { enableScreens } from "react-native-screens";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import NavigationContainer from "./navigation/NavigationContainer";
import authReducer from "./store/reducers/auth";
import registerReducer from "./store/reducers/register";
import patientRecordsReducer from "./store/reducers/patientRecords";
import patientListReducer from "./store/reducers/patientList";

enableScreens();

const rootReducer = combineReducers({
  authentication: authReducer,
  registration: registerReducer,
  patientRecords: patientRecordsReducer,
  patientList: patientListReducer,
});

const store = createStore(rootReducer);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
};

export default App;
