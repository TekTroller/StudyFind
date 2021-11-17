import { SET_PATIENT_LIST } from "../actions/patientList";

const initialState = {
  patientList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PATIENT_LIST:
      return { ...state, patientList: action.patientList };
    default:
      return state;
  }
};
