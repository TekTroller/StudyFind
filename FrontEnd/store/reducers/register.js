import { bindActionCreators } from "redux";
import {
  ENTER_EMAIL_REGISTER,
  ENTER_PASSWORD_REGISTER,
  ENTER_CONFIRMATION_PASSWORD_REGISTER,
  SWITCH_ACCOUNT_TYPE_REGISTER,
  ENTER_NAME_REGISTER,
  ENTER_BIRTHDAY_REGISTER,
  ENTER_GENDER_REGISTER,
  ENTER_INSTITUTE_REGISTER,
  ENTER_VERIFICATION_REGISTER,
  SET_VERIFICATION_REGISTER,
  SET_VALIDITY_REGISTER,
  SET_COMPLETENESS_REGISTER,
  RESET_REGISTER,
} from "../actions/register";

const initialState = {
  accountType: "Patient",
  email: "",
  password: "",
  confirmation: "",
  name: "",
  institute: "",
  birthday: "",
  gender: "",
  verification: "",
  correctVerification: "",
  validAccount: false,
  complete: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ENTER_EMAIL_REGISTER:
      return { ...state, email: action.email };
    case ENTER_PASSWORD_REGISTER:
      return { ...state, password: action.password };
    case ENTER_CONFIRMATION_PASSWORD_REGISTER:
      return { ...state, confirmation: action.confirmation };
    case ENTER_NAME_REGISTER:
      return { ...state, name: action.name };
    case ENTER_INSTITUTE_REGISTER:
      return { ...state, institute: action.institute };
    case ENTER_BIRTHDAY_REGISTER:
      return { ...state, birthday: action.birthday };
    case ENTER_GENDER_REGISTER:
      return { ...state, gender: action.gender };
    case SWITCH_ACCOUNT_TYPE_REGISTER:
      return { ...state, accountType: action.accountType };
    case ENTER_VERIFICATION_REGISTER:
      return { ...state, verification: action.verification };
    case SET_VERIFICATION_REGISTER:
      return { ...state, correctVerification: action.correctVerification };
    case SET_VALIDITY_REGISTER:
      return { ...state, validAccount: action.validAccount };
    case SET_COMPLETENESS_REGISTER:
      return { ...state, complete: action.complete };
    case RESET_REGISTER:
      return {
        accountType: initialState.accountType,
        email: initialState.email,
        password: initialState.password,
        confirmation: initialState.confirmation,
        name: initialState.name,
        institute: initialState.institute,
        birthday: initialState.birthday,
        gender: initialState.gender,
        verification: initialState.verification,
        correctVerification: initialState.correctVerification,
        validAccount: initialState.validAccount,
        complete: initialState.complete,
      };
    default:
      return state;
  }
};
