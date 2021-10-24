export const ENTER_EMAIL = "ENTER_EMAIL";
export const ENTER_ADDRESS = "ENTER_ADDRESS";
export const SET_ACCOUNT_RETRIEVED = "SET_ACCOUNT_RETRIEVED";
export const SET_PATIENT_PROFILE = "SET_PATIENT_PROFILE";

export const enterAccountEmail = (accountEmail) => {
  return { type: ENTER_EMAIL, accountEmail: accountEmail };
};

export const enterAccountAddress = (accountAddress) => {
  return { type: ENTER_ADDRESS, accountAddress: accountAddress };
};

export const setAccountRetrieved = (accountRetrieved) => {
  return { type: SET_ACCOUNT_RETRIEVED, accountRetrieved: accountRetrieved };
};

export const setPatientProfile = (patientProfile) => {
  return { type: SET_PATIENT_PROFILE, patientProfile: patientProfile };
};
