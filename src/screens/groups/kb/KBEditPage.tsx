import NiceMarkdown from "@ginpei/react-nice-markdown";
import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { KBEditForm } from "../../../groups/stables/KBEditForm";
import {
  Knowledge,
  knowledgePath,
  saveKnowledge,
} from "../../../models/Knowledge";
import { Details } from "../../../share/atoms/Details";
import { BasicLayout } from "../../../share/composites/BasicLayout";
import { useGroupPageContext } from "../GroupPageContext";
import {
  provideKnowledgePage,
  useKnowledgePageContext,
} from "./KnowledgePageContext";

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
      <Details summary="Preview!!">
        <NiceMarkdown content={knowledge.content} />
      </Details>
    </BasicLayout>
  );
});
