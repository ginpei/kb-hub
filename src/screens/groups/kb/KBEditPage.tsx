import NiceMarkdown from "@ginpei/react-nice-markdown";
import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BasicLayout } from "../../../composites/BasicLayout";
import {
  Knowledge,
  knowledgePath,
  saveKnowledge,
} from "../../../models/Knowledge";
import { KBEditForm } from "../../../stables/KBEditForm";
import {
  provideKnowledgePage,
  useKnowledgePageContext,
} from "./KnowledgePageContext";
import { useGroupPageContext } from "../GroupPageContext";

const fs = firebase.firestore();

export const KBEditPage: React.FC = provideKnowledgePage(() => {
  const group = useGroupPageContext();
  const initial = useKnowledgePageContext();
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
    await saveKnowledge(fs, group, knowledge);
    setSaving(false);
    history.push(knowledgePath("view", group, knowledge));
  }, [group, knowledge, history]);

  return (
    <BasicLayout title="View">
      <h1>Edit</h1>
      <p>
        <Link to={knowledgePath("view", group, knowledge)}>Back</Link>
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
});
