import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { createKnowledge, knowledgePath } from "../../models/Knowledge";

export const KBEditPage: React.FC = () => {
  const { id } = useParams();

  // TODO
  const knowledge = useMemo(() => createKnowledge({ id }), [id]);

  return (
    <BasicLayout title="View">
      <h1>Edit {id}</h1>
      <p>
        <Link to={knowledgePath("view", knowledge)}>Back</Link>
      </p>
    </BasicLayout>
  );
};
