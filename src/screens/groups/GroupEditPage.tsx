import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BasicLayout } from "../../share/composites/BasicLayout";
import { Group, groupPath, saveGroup } from "../../models/Group";
import { GroupForm } from "../../groups/stables/GroupForm";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";

const fs = firebase.firestore();

export const GroupEditPage: React.FC = provideGroupPage(() => {
  const initial = useGroupPageContext();
  const [group, setGroup] = useState(initial);
  const [saving, setSaving] = useState(false);
  const history = useHistory();

  const onChange = useCallback(
    (values: Partial<Group>) => {
      setGroup({ ...group, ...values });
    },
    [group]
  );

  const onSubmit = useCallback(async () => {
    setSaving(true);
    const savedGroup = await saveGroup(fs, group);
    setSaving(false);
    history.push(groupPath("view", savedGroup));
  }, [group, history]);

  return (
    <BasicLayout title={`Edit ${initial.name}`}>
      <h1>Edit {initial.name}</h1>
      <p>
        <Link to={groupPath("view", initial)}>Back</Link>
      </p>
      <GroupForm
        disabled={saving}
        group={group}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </BasicLayout>
  );
});
