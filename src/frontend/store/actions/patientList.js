import { State } from "react-native-gesture-handler";

// export const GET_PATIENT_LIST = "GET_PATIENT_LIST";
export const SET_PATIENT_LIST = "SET_PATIENT_LIST";

// export const getPatientList = (patientList) => {
//   return { type: GET_PATIENT_LIST, patientList: patientList };
// };

export const setPatientList = (patientList) => {
  return { type: SET_PATIENT_LIST, patientList: patientList };
};
