import * as firebase from "@firebase/testing";

const defaultProjectId = "my-test-project";

export function prepareFirestore(
  uid: string | undefined,
  projectId = defaultProjectId
): firebase.firestore.Firestore {
  const auth = uid ? { uid } : undefined;
  const app = firebase.initializeTestApp({ projectId, auth });
  const firestore = app.firestore();
  return firestore;
}

export function cleanUpFirestore(projectId = defaultProjectId): Promise<void> {
  return firebase.clearFirestoreData({ projectId });
}

export function prepareAdminFirestore(
  projectId = defaultProjectId
): firebase.firestore.Firestore {
  const adminApp = firebase.initializeAdminApp({ projectId });
  const fs = adminApp.firestore();
  return fs;
}
