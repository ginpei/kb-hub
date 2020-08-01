import { useEffect, useState } from "react";
import { createDataRecord, DataRecord } from "./DataRecord";
import { createGroup, docToGroup, Group, getGroupDoc } from "./Group";
import { createUser, getUserDoc, User, ssToUser } from "./User";

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

const privilegeLabels: Record<GroupUserPrivilege, string> = {
  login: "Login",
  userManagement: "User management",
};

export function createGroupUser(initial?: Partial<GroupUser>): GroupUser {
  return {
    ...createDataRecord(),
    group: createGroup(),
    privileges: [],
    user: createUser(),
    ...initial,
  };
}

/**
 * Returns all groups where the specified user belongs to.
 */
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

/**
 * Returns all users who belong to the specified group.
 */
export function useGroupUsers(
  fs: firebase.firestore.Firestore,
  group: Group
): [GroupUser[], boolean, Error | null] {
  const [users, setUsers] = useState<GroupUser[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setUsers([]);
    setError(null);
    setReady(false);

    const docGroup = getGroupDoc(fs, group);
    const coll = getCollection(fs).where("group", "==", docGroup);
    coll
      .get()
      .then((ss) => Promise.all(ss.docs.map((v) => docToResolvedGroupUser(v))))
      .then((newUsers) => {
        setUsers(newUsers);
      })
      .catch((e) => setError(e))
      .finally(() => setReady(true));
  }, [fs, group]);

  return [users, ready, error];
}

export function privilegeToLabel(privilege: GroupUserPrivilege): string {
  const label = privilegeLabels[privilege];
  if (!label) {
    throw new Error(`Unknown privilege "${privilege}"`);
  }
  return label;
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

async function docToResolvedGroupUser(
  ss: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): Promise<GroupUser> {
  const raw = docToRawGroupUser(ss);
  const [ssGroup, ssUser] = await Promise.all([
    raw.group.get(),
    raw.user.get(),
  ]);

  const groupUser: GroupUser = {
    ...raw,
    group: docToGroup(ssGroup),
    user: ssToUser(ssUser),
  };
  return groupUser;
}
