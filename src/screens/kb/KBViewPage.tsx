import NiceMarkdown from "@ginpei/react-nice-markdown";
import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { knowledgePath } from "../../models/Knowledge";
import {
  provideKnowledgePage,
  useKnowledgePageContext,
} from "./KnowledgePageContext";

export const KBViewPage = provideKnowledgePage(() => {
  const knowledge = useKnowledgePageContext();

  return (
    <BasicLayout title="View">
      <h1>{knowledge.title || "(No title)"}</h1>
      <p>
        <Link to={knowledgePath("index")}>Index</Link>
        {" | "}
        <Link to={knowledgePath("edit", knowledge)}>Edit</Link>
      </p>
      <p>{knowledge.updatedAt.toDate().toLocaleString()}</p>
      <NiceMarkdown content={knowledge.content} />
    </BasicLayout>
  );
});
