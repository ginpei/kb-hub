import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { createDataRecord, DataRecord } from "./DataRecord";

export interface Knowledge extends DataRecord {
  content: string;
  title: string;
}

type independentPathType = "index" | "new";

type pathType = "view" | "edit";

export function createKnowledge(initial?: Partial<Knowledge>): Knowledge {
  return {
    ...createDataRecord(),
    content: "",
    title: "",
    ...initial,
  };
}

export function knowledgePath(type: independentPathType): string;
export function knowledgePath(type: pathType, knowledge: Knowledge): string;
export function knowledgePath(
  type: independentPathType | pathType,
  knowledge?: Knowledge
): string {
  const index = "/kb";

  if (type === "index") {
    return index;
  }

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
  user: firebase.User | null
): [Knowledge[], boolean, Error | null] {
  const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setKnowledges([]);
    setError(null);

    if (!user) {
      setReady(true);
      return noop;
    }

    setReady(false);

    // TODO get latest items for user
    const coll = getCollection(fs);
    return coll.onSnapshot(
      (ss) => {
        setReady(true);
        setError(null);

        const values = ss.docs.map((v) => docToKnowledge(v));
        setKnowledges(values);
      },
      (e) => {
        setReady(true);
        setError(e);
      }
    );
  }, [fs, user]);

  return [knowledges, ready, error];
}

export function useKnowledge(
  fs: firebase.firestore.Firestore,
  id: string
): [Knowledge | null, boolean, Error | null] {
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const doc = getCollection(fs).doc(id);
    return doc.onSnapshot(
      (ss) => {
        setReady(true);
        setError(null);

        if (ss.exists) {
          const values = docToKnowledge(ss);
          setKnowledge(values);
        } else {
          setKnowledge(null);
        }
      },
      (e) => {
        setReady(true);
        setError(e);
      }
    );
  }, [fs, id]);

  return [knowledge, ready, error];
}

export async function saveKnowledge(
  fs: firebase.firestore.Firestore,
  knowledge: Knowledge
): Promise<Knowledge> {
  const coll = getCollection(fs);

  if (knowledge.id) {
    const doc = coll.doc(knowledge.id);
    await doc.set(knowledge);
    return knowledge;
  }

  const doc = await coll.add(knowledge);
  return {
    ...knowledge,
    id: doc.id,
  };
}

function getCollection(fs: firebase.firestore.Firestore) {
  return fs.collection("knowledges");
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
