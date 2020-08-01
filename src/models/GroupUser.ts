import { useEffect, useState } from "react";
import { createDataRecord, DataRecord } from "./DataRecord";
import { createGroup, docToGroup, Group } from "./Group";
import { createUser, getUserDoc, User } from "./User";

export interface GroupUser extends DataRecord {
  group: Group;
  privileges: GroupUserPrivilege[];
  user: User;
}

export type RawGroupUser = Omit<GroupUser, "group" | "user"> & {
  group: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  user: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
};

type GroupUserPrivilege = "login" | "userManagement";

export function createGroupUser(initial?: Partial<GroupUser>): GroupUser {
  return {
    ...createDataRecord(),
    group: createGroup(),
    privileges: [],
    user: createUser(),
    ...initial,
  };
}

export function useUserGroups(
  fs: firebase.firestore.Firestore,
  user: User | null
): [Group[], boolean, Error | null] {
  const [groups, setGroups] = useState<Group[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setGroups([]);
    setError(null);

    if (!user) {
      setReady(true);
      return;
    }

    setReady(false);

    const docUser = getUserDoc(fs, user);
    const coll = getCollection(fs).where("user", "==", docUser);
    coll
      .get()
      .then((ss) => {
        const records = ss.docs.map((v) => docToRawGroupUser(v));
        return Promise.all(records.map((v) => v.group.get()));
      })
      .then((ssList) => {
        const newGroups = ssList.map((v) => docToGroup(v));
        setGroups(newGroups);
      })
      .catch((e) => setError(e))
      .finally(() => setReady(true));
  }, [fs, user]);

  return [groups, ready, error];
}

function getCollection(fs: firebase.firestore.Firestore) {
  return fs.collection("groupUsers");
}

function docToRawGroupUser(
  ss: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): RawGroupUser {
  const data = ss.data();
  if (!data) {
    throw new Error();
  }

  const groupUser: RawGroupUser = {
    ...createGroupUser(data),
    group: data.group,
    id: ss.id,
    user: data.user,
  };
  return groupUser;
}
