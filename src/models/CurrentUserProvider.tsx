import firebase from "firebase/app";
import React, { createContext, useContext } from "react";
import { ErrorScreen } from "../screens/ErrorScreen";
import { LoadingScreen } from "../screens/LoadingScreen";
import { useCurrentUser, User } from "./User";

const CurrentUserContext = createContext<User | null>({} as User);

export const CurrentUserProvider: React.FC<{
  auth: firebase.auth.Auth;
  fs: firebase.firestore.Firestore;
}> = ({ auth, children, fs }) => {
  const [user, userReady, userError] = useCurrentUser(auth, fs);

  if (!userReady) {
    return <LoadingScreen />;
  }

  if (userError) {
    return <ErrorScreen error={userError} />;
  }

  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = (): User | null => {
  return useContext(CurrentUserContext);
};
