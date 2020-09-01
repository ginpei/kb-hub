import * as firebase from "@firebase/testing";

export type FirestoreEmu = firebase.firestore.Firestore & {
  admin: firebase.firestore.Firestore;
  cleanUp: () => void;
};

export function prepareFirestore(
  uid: string | undefined,
  projectId = randomName()
): FirestoreEmu {
  const auth = uid ? { uid } : undefined;
  const app = firebase.initializeTestApp({ projectId, auth });
  const firestore = app.firestore() as FirestoreEmu;

  firestore.admin = prepareAdminFirestore(projectId);
  firestore.cleanUp = () => cleanUpFirestore(projectId);

  return firestore;
}

export function cleanUpFirestore(projectId = randomName()): Promise<void> {
  return firebase.clearFirestoreData({ projectId });
}

export function prepareAdminFirestore(
  projectId = randomName()
): firebase.firestore.Firestore {
  const adminApp = firebase.initializeAdminApp({ projectId });
  const fs = adminApp.firestore();
  return fs;
}

function randomName() {
  const n = Math.random().toString().slice(2);
  return `project-${n}`;
}
