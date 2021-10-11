import { ADD_RECORD, DELETE_RECORD } from "../actions/patientRecords";
import { Image } from "react-native";
import Record from "../../models/PatientRecord";

import record_1 from "../../assets/sample_records/record_1.png";
import record_2 from "../../assets/sample_records/record_2.png";

const initialState = {
  patientRecords: [
    new Record("record_1", Image.resolveAssetSource(record_1).uri),
    new Record("record_2", Image.resolveAssetSource(record_2).uri),
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
