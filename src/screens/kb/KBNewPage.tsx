import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import {
  createKnowledge,
  Knowledge,
  knowledgePath,
} from "../../models/Knowledge";
import { KBEditForm } from "../../stables/KBEditForm";

export const KBNewPage: React.FC = () => {
  const [knowledge, setKnowledge] = useState(createKnowledge());

  const onChange = useCallback(
    (values: Partial<Knowledge>) => {
      setKnowledge({ ...knowledge, ...values });
    },
    [knowledge]
  );

  const onSubmit = useCallback(() => {
    console.log("# knowledge", knowledge);
  }, [knowledge]);

  return (
    <BasicLayout title="New knowledge">
      <h1>New knowledge</h1>
      <p>
        <Link to={knowledgePath("index")}>Back</Link>
      </p>
      <KBEditForm
        knowledge={knowledge}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </BasicLayout>
  );
};
