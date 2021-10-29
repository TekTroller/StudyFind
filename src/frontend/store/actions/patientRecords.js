import { State } from "react-native-gesture-handler";

export const ADD_RECORD = "ADD_RECORD";
export const UPDATE_RECORD = "UPDATE_RECORD";
export const DELETE_RECORD = "DELETE_RECORD";

export const addRecord = (record) => {
  return { type: ADD_RECORD, newRecord: record };
};

export const updateRecord = (filename, filedata) => {
  return { type: UPDATE_RECORD, filename: filename, filedata: filedata };
};

export const deleteRecord = (index) => {
  return { type: DELETE_RECORD, targetIndex: index };
};
