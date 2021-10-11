import {
  ENTER_EMAIL,
  ENTER_ADDRESS,
  SET_ACCOUNT_RETRIEVED,
  SET_PATIENT_PROFILE,
} from "../actions/auth";

const initialState = {
  accountEmail: "",
  accountAddress: "",
  accountRetrieved: false,
  patientProfile: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ENTER_EMAIL:
      return { ...state, accountEmail: action.accountEmail };
    case ENTER_ADDRESS:
      return { ...state, accountAddress: action.accountAddress };
    case SET_ACCOUNT_RETRIEVED:
      return { ...state, accountRetrieved: action.accountRetrieved };
    case SET_PATIENT_PROFILE:
      return { ...state, patientProfile: action.patientProfile };
    default:
      return state;
  }
};
