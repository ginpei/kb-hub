// TODO follow Group update

import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { createDataRecord, DataRecord, updateTimestamp } from "./DataRecord";
import { Group } from "./Group";
import { createUser, ssToUser, User } from "./User";

export interface GroupUser extends DataRecord {
  groupId: string;
  privileges: GroupUserPrivilege[];
  user: User;
}

type GroupUserPrivilege = "login" | "userManagement";

type independentPathType = "index" | "new" | "manage";

type pathType = "view" | "edit";

export function createGroupUser(initial?: Partial<GroupUser>): GroupUser {
  return {
    ...createDataRecord(),
    groupId: "",
    privileges: [],
    user: createUser(),
    ...initial,
  };
}

export function groupUserPath(
  group: Group | string,
  type: independentPathType
): string;
export function groupUserPath(
  group: Group | string,
  type: pathType,
  groupUser: GroupUser
): string;
export function groupUserPath(
  group: Group | string,
  type: pathType,
  id: string
): string;
export function groupUserPath(
  group: Group | string,
  type: independentPathType | pathType,
  groupUser?: GroupUser | string
): string {
  const gid = typeof group === "string" ? group : group.id;

  const index = `${gid}/users`;

  if (type === "index") {
    return index;
  }

  if (type === "new") {
    return `${index}/new`;
  }

  if (type === "manage") {
    return `${index}/manage`;
  }

  const id = typeof groupUser === "string" ? groupUser : groupUser?.id;
  const view = `${index}/${id}`;

  if (type === "view") {
    return view;
  }

  if (type === "edit") {
    return `${view}/edit`;
  }

  throw new Error(`Unknown path type "${type}"`);
}

export function useAllGroupUsers(
  fs: firebase.firestore.Firestore,
  user: User | null,
  group: Group | string
): [GroupUser[], boolean, Error | null] {
  const [groupUsers, setGroupUsers] = useState<GroupUser[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setGroupUsers([]);
    setError(null);

    if (!user) {
      setReady(true);
      return noop;
    }

    setReady(false);

    // TODO get items for user
    const coll = getCollection(fs, group).orderBy("updatedAt", "desc");
    return coll.onSnapshot(
      async (ss) => {
        const values = await Promise.all(
          ss.docs.map((v) => docWithRefToGroupUser(v))
        );

        setReady(true);
        setError(null);
        setGroupUsers(values);
      },
      (e) => {
        setReady(true);
        setError(e);
      }
    );
  }, [fs, user, group]);

  return [groupUsers, ready, error];
}

export function useGroupUser(
  fs: firebase.firestore.Firestore,
  user: User | null,
  group: Group | string,
  id: string
): [GroupUser | null, boolean, Error | null] {
  const [groupUser, setGroupUser] = useState<GroupUser | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setGroupUser(null);
    setError(null);

    if (!user) {
      setReady(true);
      return noop;
    }

    setReady(false);

    const doc = getCollection(fs, group).doc(id);
    return doc.onSnapshot(
      (ss) => {
        setReady(true);
        setError(null);

        if (ss.exists) {
          const values = docToGroupUser(ss);
          setGroupUser(values);
        } else {
          setGroupUser(null);
        }
      },
      (e) => {
        setReady(true);
        setError(e);
      }
    );
  }, [fs, user, group, id]);

  return [groupUser, ready, error];
}

export async function saveGroupUser(
  fs: firebase.firestore.Firestore,
  groupUser: GroupUser
): Promise<GroupUser> {
  const coll = getCollection(fs, groupUser.groupId);

  const present = updateTimestamp(groupUser);

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

export function privilegeToString(privilege: GroupUserPrivilege): string {
  if (privilege === "login") {
    return "Login";
  }

  if (privilege === "userManagement") {
    return "User management";
  }

  throw new Error(`Unknown privilege type "${privilege}`);
}

function getCollection(
  fs: firebase.firestore.Firestore,
  group: Group | string
) {
  const gid = typeof group === "string" ? group : group.id;
  return fs.collection("groups").doc(gid).collection("users");
}

/**
 * Convert Firestore doc data to GroupUser object.
 *
 * Note this does not resolve `user` reference.
 * Use `docWithRefToGroupUser()` for the purpose.
 */
function docToGroupUser(
  ss: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): GroupUser {
  const data = ss.data();
  const groupUser: GroupUser = {
    ...createGroupUser(data),
    id: ss.id,
  };
  return groupUser;
}

async function docWithRefToGroupUser(
  ss: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): Promise<GroupUser> {
  const data = ss.data();

  const refUser = data?.user as firebase.firestore.DocumentReference<
    firebase.firestore.DocumentData
  >;
  const user = ssToUser(await refUser.get());

  const groupUser: GroupUser = {
    ...createGroupUser({ ...data, user }),
    id: ss.id,
  };
  return groupUser;
}
