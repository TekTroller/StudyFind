import { GET_PATIENT_LIST } from "../actions/patientList";

const initialState = {
  patientList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PATIENT_LIST:
      return { patientList: action.patientList };
    default:
      return state;
  }
};
