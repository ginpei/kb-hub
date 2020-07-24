import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../composites/BasicLayout";
import { saveUser, useCurrentUser, User } from "../models/User";
import { UserForm } from "../stables/UserForm";
import { ErrorScreen } from "./ErrorScreen";
import { LoadingScreen } from "./LoadingScreen";
import { LoginScreen } from "./LoginScreen";

const auth = firebase.auth();
const fs = firebase.firestore();

export const MyPage: React.FC = () => {
  const [user, userReady, userError] = useCurrentUser(auth, fs);

  if (!userReady) {
    return <LoadingScreen />;
  }

  if (!user) {
    // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    return <LoginScreen />;
  }

  if (userError) {
    return <ErrorScreen error={userError} />;
  }

  return <PageContent user={user} />;
};

const PageContent: React.FC<{ user: User }> = ({ user: initial }) => {
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
