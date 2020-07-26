import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { createDataRecord, DataRecord, updateTimestamp } from "./DataRecord";
import { GroupUser } from "./GroupUser";
import { User } from "./User";

export interface Group extends DataRecord {
  name: string;
  users: GroupUser[];
}

type independentPathType = "index" | "new";

type pathType = "view" | "edit" | "manageUsers";

export function createGroup(initial?: Partial<Group>): Group {
  return {
    ...createDataRecord(),
    name: "",
    users: [],
    ...initial,
  };
}

export function groupPath(type: independentPathType): string;
export function groupPath(type: pathType, group: Group): string;
export function groupPath(type: pathType, id: string): string;
export function groupPath(
  type: independentPathType | pathType,
  group?: Group | string
): string {
  const index = "/groups";

  if (type === "index") {
    return index;
  }

  if (type === "new") {
    return `${index}/new`;
  }

  const id = typeof group === "string" ? group : group?.id;
  const view = `${index}/${id}`;

  if (type === "view") {
    return view;
  }

  if (type === "edit") {
    return `${view}/edit`;
  }

  throw new Error(`Unknown path type "${type}"`);
}

export function useLatestGroups(
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
      return noop;
    }

    setReady(false);

    // TODO get items for user
    const coll = getCollection(fs).orderBy("updatedAt", "desc");
    return coll.onSnapshot(
      (ss) => {
        setReady(true);
        setError(null);

        const values = ss.docs.map((v) => docToGroup(v));
        setGroups(values);
      },
      (e) => {
        setReady(true);
        setError(e);
      }
    );
  }, [fs, user]);

  return [groups, ready, error];
}

export function useGroup(
  fs: firebase.firestore.Firestore,
  user: User | null,
  id: string
): [Group | null, boolean, Error | null] {
  const [group, setGroup] = useState<Group | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setGroup(null);
    setError(null);

    if (!user) {
      setReady(true);
      return noop;
    }

    setReady(false);

    const doc = getCollection(fs).doc(id);
    return doc.onSnapshot(
      (ss) => {
        setReady(true);
        setError(null);

        if (ss.exists) {
          const values = docToGroup(ss);
          setGroup(values);
        } else {
          setGroup(null);
        }
      },
      (e) => {
        setReady(true);
        setError(e);
      }
    );
  }, [fs, user, id]);

  return [group, ready, error];
}

export async function saveGroup(
  fs: firebase.firestore.Firestore,
  group: Group
): Promise<Group> {
  const coll = getCollection(fs);

  const present = updateTimestamp(group);

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

function getCollection(fs: firebase.firestore.Firestore) {
  return fs.collection("groups");
}

function docToGroup(
  ss: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): Group {
  const data = ss.data();
  const group: Group = {
    ...createGroup(data),
    id: ss.id,
  };
  return group;
}