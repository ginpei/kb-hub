import { useEffect, useState } from "react";
import { createDataRecord, DataRecord, updateTimestamp } from "./DataRecord";
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

export type GroupUserPrivilege = typeof GroupUserPrivilege[number];

/**
 * The second value becomes `null` if some of group users are `true` while the
 * others are `false`.
 */
export type PrivilegeFlags = [GroupUserPrivilege, boolean | null];

export const GroupUserPrivilege = ["login", "userManagement"] as const;

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

export async function saveGroupUser(
  fs: firebase.firestore.Firestore,
  groupUser: GroupUser
): Promise<GroupUser> {
  const coll = getCollection(fs);

  const present = updateTimestamp(groupUser);
  const raw = groupUserToRow(fs, present);

  if (present.id) {
    const doc = coll.doc(present.id);
    await doc.set(raw);
    return present;
  }

  const doc = await coll.add(raw);
  return {
    ...present,
    id: doc.id,
  };
}

export function groupUserToRow(
  fs: firebase.firestore.Firestore,
  groupUser: GroupUser
): RawGroupUser {
  const raw: RawGroupUser = {
    ...groupUser,
    group: getGroupDoc(fs, groupUser.group),
    user: getUserDoc(fs, groupUser.user),
  };
  return raw;
}

export function privilegeToLabel(privilege: GroupUserPrivilege): string {
  const label = privilegeLabels[privilege];
  if (!label) {
    throw new Error(`Unknown privilege "${privilege}"`);
  }
  return label;
}

export function isPrivilegeString(s: string): s is GroupUserPrivilege {
  return (GroupUserPrivilege as readonly string[]).includes(s);
}

export function getPrivilegeFlagsOf(gUsers: GroupUser[]): PrivilegeFlags[] {
  const [first, ...rest] = gUsers;

  const firstFlags: PrivilegeFlags[] = GroupUserPrivilege.map((v) => [
    v,
    first?.privileges.includes(v) ?? false,
  ]);

  const result: PrivilegeFlags[] = firstFlags.map(([privilege, flag]) => {
    const newFlag = rest.reduce((lastFlag, v) => {
      if (v === null) {
        return null;
      }

      const curFlag = v.privileges.includes(privilege);
      const mergedFlag = curFlag === lastFlag ? lastFlag : null;
      return mergedFlag;
    }, flag);
    return [privilege, newFlag];
  });

  return result;
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
