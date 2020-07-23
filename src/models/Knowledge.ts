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
