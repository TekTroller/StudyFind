import {
  ENTER_EMAIL,
  ENTER_PASSWORD,
  SWITCH_ACCOUNT_TYPE,
} from "../actions/auth";

const initialState = {
  loginEmail: "",
  loginPassword: "",
  loginAccountType: "Patient",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ENTER_EMAIL:
      return { ...state, loginEmail: action.email };
    case ENTER_PASSWORD:
      return { ...state, loginPassword: action.password };
    case SWITCH_ACCOUNT_TYPE:
      return { ...state, loginAccountType: action.accountType };
    default:
      return state;
  }
};
