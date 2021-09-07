import {
  ENTER_EMAIL,
  ENTER_PASSWORD,
  ENTER_CONFIRMATION_PASSWORD,
  SWITCH_ACCOUNT_TYPE,
  ENTER_VERIFICATION,
  SET_VERIFICATION,
  SET_VALIDITY,
} from "../actions/register";

const initialState = {
  accountType: "Patient",
  email: "",
  password: "",
  confirmation: "",
  verification: "",
  correctVerification: "",
  verificationCode: "",
};

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ENTER_EMAIL:
      return { ...state, email: action.email };
    case ENTER_PASSWORD:
      return { ...state, password: action.password };
    case ENTER_CONFIRMATION_PASSWORD:
      return { ...state, confirmation: action.confirmation };
    case SWITCH_ACCOUNT_TYPE:
      return { ...state, accountType: action.accountType };
    case ENTER_VERIFICATION:
      return { ...state, verification: action.verification };
    case SET_VERIFICATION:
      return { ...state, correctVerification: action.verification };
    case SET_VALIDITY:
      return { ...state, validAccount: action.validAccount };
    default:
      return state;
  }
};

export default registerReducer;
