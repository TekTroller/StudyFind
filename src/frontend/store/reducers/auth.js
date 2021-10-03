import {
  ENTER_EMAIL,
  ENTER_PASSWORD,
  SWITCH_ACCOUNT_TYPE,
  AUTHENTICATE,
} from "../actions/auth";

const initialState = {
  loginEmail: "",
  loginPassword: "",
  loginAccountType: "Patient",
  authenticated: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ENTER_EMAIL:
      return { ...state, loginEmail: action.email };
    case ENTER_PASSWORD:
      return { ...state, loginPassword: action.password };
    case SWITCH_ACCOUNT_TYPE:
      return { ...state, loginAccountType: action.accountType };
    case AUTHENTICATE:
      return { ...state, authenticated: action.authenticated };
    default:
      return state;
  }
};
