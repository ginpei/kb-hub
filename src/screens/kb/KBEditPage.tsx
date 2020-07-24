import NiceMarkdown from "@ginpei/react-nice-markdown";
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
import { useCurrentUser } from "../../models/User";
import { KBEditForm } from "../../stables/KBEditForm";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { LoginScreen } from "../LoginScreen";
import { NotFoundScreen } from "../NotFoundScreen";

const auth = firebase.auth();
const fs = firebase.firestore();

export const KBEditPage: React.FC = () => {
  const { id } = useParams();
  const [user, userReady, userError] = useCurrentUser(auth, fs);
  const [knowledge, knowledgeReady, knowledgeError] = useKnowledge(
    fs,
    user,
    id
  );

  if (!userReady || !knowledgeReady) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  const error = userError || knowledgeError;
  if (error) {
    return <ErrorScreen error={error} />;
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
  }, [knowledge, history]);

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
      <details>
        <summary>Preview</summary>
        <NiceMarkdown content={knowledge.content} />
      </details>
    </BasicLayout>
  );
};
