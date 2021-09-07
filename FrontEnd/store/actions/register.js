export const ENTER_EMAIL = "ENTER_EMAIL";
export const ENTER_PASSWORD = "ENTER_PASSWORD";
export const ENTER_CONFIRMATION_PASSWORD = "ENTER_CONFIRMATION_PASSWORD";
export const SWITCH_ACCOUNT_TYPE = "SWITCCH_ACCOUNT_TYPE";
export const ENTER_VERIFICATION = "ENTER_VERIFICATION";
export const SET_VERIFICATION = "SET_VERIFICATION";
export const SET_VALIDITY = "SET_VALIDITY";

export const enterEmail = (email) => {
  return { type: ENTER_EMAIL, email: email };
};

export const enterPassword = (password) => {
  return { type: ENTER_PASSWORD, password: password };
};

export const enterConfirmationPassword = (confirmation) => {
  return { type: ENTER_CONFIRMATION_PASSWORD, confirmation: confirmation };
};

export const switchAccountType = (accountType) => {
  return { type: SWITCH_ACCOUNT_TYPE, accountType: accountType };
};

export const enterVerification = (verification) => {
  return { type: ENTER_VERIFICATION, verification: verification };
};

export const setVerification = (verification) => {
  return { type: SET_VERIFICATION, verification: verification };
};

export const setValidity = (validity) => {
  return { type: SET_VALIDITY, validAccount: validity };
};
