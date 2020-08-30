import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { UserForm } from "../groups/stables/UserForm";
import { useCurrentUserContext } from "../models/CurrentUserProvider";
import { saveUser, User } from "../models/User";
import { BasicLayout } from "../share/composites/BasicLayout";
import { LoginScreen } from "./LoginScreen";

const fs = firebase.firestore();

export const MyPage: React.FC = () => {
  const initial = useCurrentUserContext();
  const [user, setUser] = useState(initial);
  const [saving, setSaving] = useState(false);

  const onChange = useCallback(
    (values: Partial<User>) => {
      if (!user) {
        return;
      }

      setUser({ ...user, ...values });
    },
    [user]
  );

  const onSubmit = useCallback(async () => {
    if (!user) {
      return;
    }

    setSaving(true);
    await saveUser(fs, user);
    setSaving(false);
  }, [user]);

  if (!user || !initial) {
    return <LoginScreen />;
  }

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
