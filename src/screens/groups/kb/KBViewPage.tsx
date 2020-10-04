import NiceMarkdown from "@ginpei/react-nice-markdown";
import React from "react";
import { Link } from "react-router-dom";
import { groupPath } from "../../../models/Group";
import { knowledgePath } from "../../../models/Knowledge";
import { BasicLayout } from "../../../share/composites/BasicLayout";
import { useGroupPageContext } from "../GroupPageContext";
import {
  provideKnowledgePage,
  useKnowledgePageContext,
} from "./KnowledgePageContext";

export const KBViewPage = provideKnowledgePage(() => {
  const group = useGroupPageContext();
  const knowledge = useKnowledgePageContext();

  return (
    <BasicLayout title="View">
      <h1>{knowledge.title || "(No title)"}</h1>
      <p>
        <Link to={groupPath("view", group)}>Back</Link>
        {" | "}
        <Link to={knowledgePath("edit", group, knowledge)}>Edit</Link>
      </p>
      <p>{knowledge.updatedAt.toDate().toLocaleString()}</p>
      <NiceMarkdown content={knowledge.content} />
    </BasicLayout>
  );
});
