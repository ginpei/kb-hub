import NiceMarkdown from "@ginpei/react-nice-markdown";
import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { KBEditForm } from "../../../groups/stables/KBEditForm";
import { groupPath } from "../../../models/Group";
import {
  createKnowledge,
  Knowledge,
  knowledgePath,
  saveKnowledge,
} from "../../../models/Knowledge";
import { Details } from "../../../share/atoms/Details";
import { BasicLayout } from "../../../share/composites/BasicLayout";
import { provideGroupPage, useGroupPageContext } from "../GroupPageContext";

const fs = firebase.firestore();

export const KBNewPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();
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
    const savedKnowledge = await saveKnowledge(fs, group, knowledge);
    setSaving(false);
    history.push(knowledgePath("view", group, savedKnowledge));
  }, [group, knowledge, history]);

  return (
    <BasicLayout title="New knowledge">
      <h1>New knowledge</h1>
      <p>
        <Link to={groupPath("view", group)}>Back</Link>
      </p>
      <KBEditForm
        disabled={saving}
        knowledge={knowledge}
        onChange={onChange}
        onSubmit={onSubmit}
      />
      <Details summary="Preview">
        <NiceMarkdown content={knowledge.content} />
      </Details>
    </BasicLayout>
  );
});
