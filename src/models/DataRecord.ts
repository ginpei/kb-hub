import firebase from "firebase/app";

export interface DataRecord {
  createdAt: firebase.firestore.Timestamp;
  id: string;
}

const zeroTimestamp = new firebase.firestore.Timestamp(0, 0);

export function createDataRecord(initial?: Partial<DataRecord>): DataRecord {
  return {
    createdAt: zeroTimestamp,
    id: "",
    ...initial,
  };
}
