import { useState, useEffect } from "react";
import { DataRecord, createDataRecord } from "./DataRecord";

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
  fs: firebase.firestore.Firestore
): [Knowledge[], boolean, Error | null] {
  const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO
    const ref = fs.collection("knowledges");
    return ref.onSnapshot(
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
  }, [fs]);

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
    const ref = fs.collection("knowledges").doc(id);
    return ref.onSnapshot(
      (ss) => {
        setReady(true);
        setError(null);

        const values = docToKnowledge(ss);
        setKnowledge(values);
      },
      (e) => {
        setReady(true);
        setError(e);
      }
    );
  }, [fs, id]);

  return [knowledge, ready, error];
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
