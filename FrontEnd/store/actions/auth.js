import { acc } from "react-native-reanimated";
import AccountType from "../../components/AccountType";

export const ENTER_EMAIL = "ENTER_EMAIL";
export const ENTER_PASSWORD = "ENTER_PASSWORD";
export const SWITCH_ACCOUNT_TYPE = "SWITCCH_ACCOUNT_TYPE";
export const AUTHENTICATE = "AUTHENTICATE";

export const enterEmail = (email) => {
  return { type: ENTER_EMAIL, email: email };
};

export const enterPassword = (password) => {
  return { type: ENTER_PASSWORD, password: password };
};

export const switchAccountType = (accountType) => {
  return { type: SWITCH_ACCOUNT_TYPE, accountType: accountType };
};

//Must modify when integrating with the backend
export const authenticate = () => {
  return { type: AUTHENTICATE, authenticated: true };
};
