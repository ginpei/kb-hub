import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { GroupForm } from "../../groups/stables/GroupForm";
import { useCurrentUserContext } from "../../models/CurrentUserProvider";
import { createGroup, Group, groupPath, saveGroup } from "../../models/Group";
import { BasicLayout } from "../../share/composites/BasicLayout";
import { LoginScreen } from "../LoginScreen";

const fs = firebase.firestore();

export const NewGroupPage: React.FC = () => {
  const user = useCurrentUserContext();
  const [group, setGroup] = useState(createGroup());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const history = useHistory();

  const onChange = useCallback(
    (values: Partial<Group>) => {
      setGroup({ ...group, ...values });
    },
    [group]
  );

  const onSubmit = useCallback(async () => {
    setSaveError(null);
    setSaving(true);
    try {
      const savedGroup = await saveGroup(fs, group);
      history.push(groupPath("view", savedGroup));
    } catch (e) {
      setSaveError(e);
    } finally {
      setSaving(false);
    }
  }, [group, history]);

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <BasicLayout title="New group">
      <h1>New Group</h1>
      <p>
        <Link to={groupPath("index")}>Back</Link>
      </p>
      {saveError && <Alert variant="danger">{saveError.message}</Alert>}
      <GroupForm
        disabled={saving}
        group={group}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </BasicLayout>
  );
};
