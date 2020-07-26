import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../composites/BasicLayout";
import { useCurrentUserContext } from "../models/CurrentUserProvider";
import { saveUser, User } from "../models/User";
import { UserForm } from "../stables/UserForm";

const fs = firebase.firestore();

export const MyPage: React.FC = () => {
  const initial = useCurrentUserContext();
  const [user, setUser] = useState(initial);
  const [saving, setSaving] = useState(false);

  const onChange = useCallback(
    (values: Partial<User>) => {
      setUser({ ...user, ...values });
    },
    [user]
  );

  const onSubmit = useCallback(async () => {
    setSaving(true);
    await saveUser(fs, user);
    setSaving(false);
  }, [user]);

  return (
    <BasicLayout title="MyPage">
      <h1>My Page: {initial.name}</h1>
      <p>
        <Link to="/">Back</Link>
      </p>
      <h2>Edit profile</h2>
      <UserForm
        disabled={saving}
        user={user}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </BasicLayout>
  );
};
