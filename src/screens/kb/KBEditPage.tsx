import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import {
  Knowledge,
  knowledgePath,
  saveKnowledge,
  useKnowledge,
} from "../../models/Knowledge";
import { KBEditForm } from "../../stables/KBEditForm";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { NotFoundScreen } from "../NotFoundScreen";

const fs = firebase.firestore();

export const KBEditPage: React.FC = () => {
  const { id } = useParams();
  const [knowledge, knowledgeReady, knowledgeError] = useKnowledge(fs, id);

  if (!knowledgeReady) {
    return <LoadingScreen />;
  }

  if (knowledgeError) {
    return <ErrorScreen error={knowledgeError} />;
  }

  if (!knowledge) {
    return <NotFoundScreen />;
  }

  return <PageContent knowledge={knowledge} />;
};

const PageContent: React.FC<{ knowledge: Knowledge }> = ({
  knowledge: initial,
}) => {
  const [knowledge, setKnowledge] = useState(initial);
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
    await saveKnowledge(fs, knowledge);
    setSaving(false);
    history.push(knowledgePath("view", knowledge));
  }, [knowledge]);

  return (
    <BasicLayout title="View">
      <h1>Edit</h1>
      <p>
        <Link to={knowledgePath("view", knowledge)}>Back</Link>
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
