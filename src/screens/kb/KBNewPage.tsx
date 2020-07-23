import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import {
  createKnowledge,
  Knowledge,
  knowledgePath,
  saveKnowledge,
} from "../../models/Knowledge";
import { KBEditForm } from "../../stables/KBEditForm";

const fs = firebase.firestore();

export const KBNewPage: React.FC = () => {
  const [knowledge, setKnowledge] = useState(createKnowledge());
  const [saving, setSaving] = useState(false);
  const history = useHistory();

  const onChange = useCallback(
    (values: Partial<Knowledge>) => {
      setKnowledge({ ...knowledge, ...values });
    },
    [knowledge]
  );

  const onSubmit = useCallback(async () => {
    setSaving(true);
    const savedKnowledge = await saveKnowledge(fs, knowledge);
    setSaving(false);
    history.push(knowledgePath("view", savedKnowledge));
  }, [knowledge]);

  return (
    <BasicLayout title="New knowledge">
      <h1>New knowledge</h1>
      <p>
        <Link to={knowledgePath("index")}>Back</Link>
      </p>
      <KBEditForm
        disabled={saving}
        knowledge={knowledge}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </BasicLayout>
  );
};
