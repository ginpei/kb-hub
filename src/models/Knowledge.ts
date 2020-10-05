import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { createDataRecord, DataRecord, updateTimestamp } from "./DataRecord";
import { useDocument } from "./firebaseHooks";
import { getGroupCollection, Group } from "./Group";

export interface Knowledge extends DataRecord {
  content: string;
  groupId: string;
  title: string;
}

type independentPathType = "new";

type pathType = "view" | "edit";

export function createKnowledge(initial?: Partial<Knowledge>): Knowledge {
  return {
    ...createDataRecord(),
    content: "",
    groupId: "",
    title: "",
    ...initial,
  };
}

export function knowledgePath(
  type: independentPathType,
  group: Group | string
): string;
export function knowledgePath(
  type: pathType,
  group: Group | string,
  knowledge: Knowledge
): string;
export function knowledgePath(
  type: independentPathType | pathType,
  group: Group | string,
  knowledge?: Knowledge
): string {
  const groupId = typeof group === "string" ? group : group.id;
  const index = `/groups/${groupId}/kb`;

  if (type === "new") {
    return `${index}/new`;
  }

  const view = `${index}/${knowledge?.id}`;

  if (type === "view") {
    return view;
  }

  if (type === "edit") {
    return `${view}/edit`;
  }

  throw new Error(`Unknown path type "${type}"`);
}

export function useLatestKnowledges(
  fs: firebase.firestore.Firestore,
  group: Group | null
): [Knowledge[], boolean, Error | null] {
  const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setKnowledges([]);
    setError(null);

    if (!group) {
      setReady(true);
      return noop;
    }

    setReady(false);

    const coll = getKnowledgeCollection(fs, group).orderBy("updatedAt", "desc");
    return coll.onSnapshot(
      (ss) => {
        setError(null);

        const values = ss.docs.map((v) => docToKnowledge(v));
        setKnowledges(values);

        setReady(true);
      },
      (e) => {
        setReady(true);
        setError(e);
      }
    );
  }, [fs, group]);

  return [knowledges, ready, error];
}

export function useKnowledge(
  fs: firebase.firestore.Firestore,
  group: Group | string | null,
  id: string
): [Knowledge | null, boolean, Error | null] {
  const [doc, setDoc] = useState<firebase.firestore.DocumentReference | null>(
    null
  );

  const groupId = typeof group === "string" ? group : group?.id ?? null;
  useEffect(() => {
    if (groupId) {
      setDoc(getKnowledgeCollection(fs, groupId).doc(id));
    } else {
      setDoc(null);
    }
  }, [fs, groupId, id]);

  return useDocument(doc, docToKnowledge);
}

export async function saveKnowledge(
  fs: firebase.firestore.Firestore,
  group: Group | string,
  knowledge: Knowledge
): Promise<Knowledge> {
  const coll = getKnowledgeCollection(fs, group);

  const present = updateTimestamp(knowledge);

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

function getKnowledgeCollection(
  fs: firebase.firestore.Firestore,
  group: Group | string
) {
  const gid = typeof group === "string" ? group : group.id;
  return getGroupCollection(fs).doc(gid).collection("knowledges");
}

function docToKnowledge(
  ss: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): Knowledge {
  const data = ss.data();
  const knowledge: Knowledge = {
    ...createKnowledge(data),
    id: ss.id,
  };
  return knowledge;
}
