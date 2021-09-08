export const ENTER_EMAIL_REGISTER = "ENTER_EMAIL_REGISTER";
export const ENTER_PASSWORD_REGISTER = "ENTER_PASSWORD_REGISTER";
export const ENTER_CONFIRMATION_PASSWORD_REGISTER =
  "ENTER_CONFIRMATION_PASSWORD_REGISTER";
export const SWITCH_ACCOUNT_TYPE_REGISTER = "SWITCCH_ACCOUNT_TYPE_REGISTER";
export const ENTER_NAME_REGISTER = "ENTER_NAME_REGISTER";
export const ENTER_INSTITUTE_REGISTER = "ENTER_INSTITUTE_REGISTER";
export const ENTER_BIRTHDAY_REGISTER = "ENTER_BIRTHDAY_REGISTER";
export const ENTER_GENDER_REGISTER = "ENTER_GENDER_REGISTER";
export const ENTER_VERIFICATION_REGISTER = "ENTER_VERIFICATION_REGISTER";
export const SET_VERIFICATION_REGISTER = "SET_VERIFICATION_REGISTER";
export const RESET_REGISTER = "RESET_REGISTER";

export const enterEmail = (email) => {
  return { type: ENTER_EMAIL_REGISTER, email: email };
};

export const enterPassword = (password) => {
  return { type: ENTER_PASSWORD_REGISTER, password: password };
};

export const enterConfirmationPassword = (confirmation) => {
  return {
    type: ENTER_CONFIRMATION_PASSWORD_REGISTER,
    confirmation: confirmation,
  };
};

export const enterName = (name) => {
  return { type: ENTER_NAME_REGISTER, name: name };
};

export const enterInstitute = (institute) => {
  return { type: ENTER_INSTITUTE_REGISTER, institute: institute };
};

export const enterBirthday = (birthday) => {
  return { type: ENTER_BIRTHDAY_REGISTER, birthday: birthday };
};

export const enterGender = (gender) => {
  return { type: ENTER_GENDER_REGISTER, gender: gender };
};

export const switchAccountType = (accountType) => {
  return { type: SWITCH_ACCOUNT_TYPE_REGISTER, accountType: accountType };
};

export const enterVerification = (verification) => {
  return { type: ENTER_VERIFICATION_REGISTER, verification: verification };
};

export const setVerification = (correctVerification) => {
  return {
    type: SET_VERIFICATION_REGISTER,
    correctVerification: correctVerification,
  };
};

export const reset = () => {
  return { type: RESET_REGISTER };
};
