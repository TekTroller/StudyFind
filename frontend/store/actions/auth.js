import { acc } from "react-native-reanimated";
import AccountType from "../../components/AccountType";

export const ENTER_EMAIL = "ENTER_EMAIL";
export const ENTER_PASSWORD = "ENTER_PASSWORD";
export const SWITCH_ACCOUNT_TYPE = "SWITCCH_ACCOUNT_TYPE";
export const SET_VALIDITY = "SET_VALIDITY";

export const enterEmail = (email) => {
  return { type: ENTER_EMAIL, email: email };
};

export const enterPassword = (password) => {
  return { type: ENTER_PASSWORD, password: password };
};

export const switchAccountType = (accountType) => {
  return { type: SWITCH_ACCOUNT_TYPE, accountType: accountType };
};

export const setValidity = (validity) => {
  return { type: SET_VALIDITY, validAccount: validity };
};
