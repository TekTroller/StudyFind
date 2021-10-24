import { State } from "react-native-gesture-handler";

export const GET_PATIENT_LIST = "GET_PATIENT_LIST";

export const getPatientList = (patientList) => {
  return { type: GET_PATIENT_LIST, patientList: patientList };
};
