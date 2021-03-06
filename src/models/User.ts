import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { createDataRecord, DataRecord, updateTimestamp } from "./DataRecord";

export interface User extends DataRecord {
  name: string;
}

export function createUser(initial?: Partial<User>): User {
  return {
    ...createDataRecord(),
    name: "",
    ...initial,
  };
}

export function useUser(
  fs: firebase.firestore.Firestore,
  id: string | undefined
): [User | null, boolean, Error | null] {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setUser(null);
    setError(null);
    if (id === undefined) {
      setReady(true);
      return noop;
    }

    setReady(false);

    const doc = getCollection(fs).doc(id);
    return doc.onSnapshot(
      (ss) => {
        // it's ok if not exists
        const newUser = ssToUser(ss);
        setUser(newUser);

        setError(null);
        setReady(true);
      },
      (e) => {
        setError(e);
        setReady(true);
      }
    );
  }, [fs, id]);

  return [user, ready, error];
}

export function useCurrentUser(
  auth: firebase.auth.Auth,
  fs: firebase.firestore.Firestore
): [User | null, boolean, Error | null] {
  const [fbUser, setFbUser] = useState<firebase.User | null>(auth.currentUser);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [user, userReady, userError] = useUser(fs, fbUser?.uid);

  useEffect(
    () =>
      auth.onAuthStateChanged(
        (currentUser) => {
          setFbUser(currentUser);
          setReady(true);
        },
        (newError) => {
          if (newError instanceof Error) {
            setError(newError);
          } else {
            console.error(newError);
            setError(new Error("Unknown auth error"));
          }
          setReady(true);
        }
      ),
    [auth]
  );

  return [user, ready && userReady, error || userError];
}

export async function saveUser(
  fs: firebase.firestore.Firestore,
  user: User
): Promise<User> {
  const coll = getCollection(fs);

  const present = updateTimestamp(user);

  if (present.id) {
    const doc = coll.doc(present.id);
    await doc.set(present);
    return present;
  }

  const doc = await coll.add(present);
  return {
    ...present,
    id: doc.id,
  };
}

export async function findUserById(
  fs: firebase.firestore.Firestore,
  id: string
): Promise<User | null> {
  if (!id) {
    return null;
  }

  const coll = getCollection(fs);
  const ss = await coll.doc(id).get();
  if (!ss.exists) {
    return null;
  }
  const user = ssToUser(ss);
  return user;
}

export function getUserDoc(
  fs: firebase.firestore.Firestore,
  user: User | string
): firebase.firestore.DocumentReference<firebase.firestore.DocumentData> {
  const id = typeof user === "string" ? user : user.id;
  return getCollection(fs).doc(id);
}

export function ssToUser(
  ss: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): User {
  const data = ss.data();
  const knowledge: User = {
    ...createUser(data),
    id: ss.id,
  };
  return knowledge;
}

function getCollection(fs: firebase.firestore.Firestore) {
  return fs.collection("users");
}
