import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { createKnowledge, knowledgePath } from "../../models/Knowledge";

export const KBViewPage: React.FC = () => {
  const { id } = useParams();

  // TODO
  const knowledge = useMemo(() => createKnowledge({ id }), [id]);

  return (
    <BasicLayout title="View">
      <h1>View {id}</h1>
      <p>
        <Link to={knowledgePath("index")}>Index</Link>
        {" | "}
        <Link to={knowledgePath("edit", knowledge)}>Edit</Link>
      </p>
    </BasicLayout>
  );
};
