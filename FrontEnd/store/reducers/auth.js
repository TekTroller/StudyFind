import {
  ENTER_EMAIL,
  ENTER_PASSWORD,
  SWITCH_ACCOUNT_TYPE,
  SET_VALIDITY,
} from "../actions/auth";

const initialState = {
  email: "",
  password: "",
  accountType: "Patient",
  validAccount: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ENTER_EMAIL:
      return { ...state, email: action.email };
    case ENTER_PASSWORD:
      return { ...state, password: action.password };
    case SWITCH_ACCOUNT_TYPE:
      return { ...state, accountType: action.accountType };
    case SET_VALIDITY:
      return { ...state, validAccount: action.validAccount };
    default:
      return state;
  }
};

export default authReducer;
