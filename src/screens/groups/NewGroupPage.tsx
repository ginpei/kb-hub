import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BasicLayout } from "../../share/composites/BasicLayout";
import { createGroup, Group, groupPath, saveGroup } from "../../models/Group";
import { GroupForm } from "../../groups/stables/GroupForm";

const fs = firebase.firestore();

export const NewGroupPage: React.FC = () => {
  const [group, setGroup] = useState(createGroup());
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
    <BasicLayout title="New group">
      <h1>New Group</h1>
      <p>
        <Link to={groupPath("index")}>Back</Link>
      </p>
      <GroupForm
        disabled={saving}
        group={group}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </BasicLayout>
  );
};
