import { ADD_RECORD, DELETE_RECORD } from "../actions/patientRecords";
import Record from "../../models/PatientRecord";

const initialState = {
  patientRecords: [
    new Record("2021-09-12", ""),
    new Record("2021-09-13", ""),
    new Record("2021-09-11", ""),
    new Record("2021-08-10", ""),
  ],
};

export default (state = initialState, action) => {
  let newRecords = state.patientRecords;
  switch (action.type) {
    case ADD_RECORD:
      newRecords.push(action.newRecord);
      return { patientRecords: newRecords };
    case DELETE_RECORD:
      newRecords.splice(action.targetIndex, 1);
      console.log(newRecords);
      return { patientRecords: newRecords };
    default:
      return state;
  }
};
