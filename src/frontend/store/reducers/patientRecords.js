import {
  ADD_RECORD,
  UPDATE_RECORD,
  DELETE_RECORD,
  CLEAR_RECORDS,
} from "../actions/patientRecords";
import { Image } from "react-native";
import Record from "../../models/PatientRecord";

import record_1 from "../../assets/sample_records/record_1.png";
import record_2 from "../../assets/sample_records/record_2.png";

const initialState = {
  patientRecords: [
    //new Record("record_1", Image.resolveAssetSource(record_1).uri),
    //new Record("record_2", Image.resolveAssetSource(record_2).uri),
  ],
};

export default (state = initialState, action) => {
  let newRecords = state.patientRecords;
  switch (action.type) {
    case ADD_RECORD:
      var flag = false;
      for (var i = 0; i < state.patientRecords.length; i++) {
        if (state.patientRecords[i].title === action.newRecord.title) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        newRecords.push(action.newRecord);
      }
      return { patientRecords: newRecords };
    case UPDATE_RECORD:
      for (var i = 0; i < newRecords.length; i++) {
        if (newRecords[i].title === action.filename) {
          newRecords[i].imageUri = action.filedata;
          break;
        }
      }
      return { patientRecords: newRecords };
    case DELETE_RECORD:
      newRecords.splice(action.targetIndex, 1);
      //console.log(newRecords);
      return { patientRecords: newRecords };
    case CLEAR_RECORDS:
      return { patientRecords: [] };
    default:
      return state;
  }
};
