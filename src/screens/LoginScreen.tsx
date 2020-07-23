import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import React, { useCallback } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { BasicLayout } from "../composites/BasicLayout";
import { useUser } from "../misc/firebaseHooks";
import { LoadingScreen } from "./LoadingScreen";
import { ErrorScreen } from "./ErrorScreen";

const auth = firebase.auth();

const uiConfig: firebaseui.auth.Config = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE, // disable AccountChooser.com
  signInOptions: [
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

export const LoginScreen: React.FC = () => {
  const [user, userReady, userError] = useUser(auth);

  const onLogOutClick = useCallback(async () => {
    await auth.signOut();
  }, []);

  if (!userReady) {
    return <LoadingScreen />;
  }

  if (userError) {
    return <ErrorScreen error={userError} />;
  }

  if (user) {
    return (
      <BasicLayout title="Logout">
        <h1>✔ Logged in</h1>
        <p>
          <button onClick={onLogOutClick}>Log out</button>
        </p>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout title="Login">
      <h1>Login</h1>
      <StyledFirebaseAuth firebaseAuth={firebase.auth()} uiConfig={uiConfig} />
    </BasicLayout>
  );
};