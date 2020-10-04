import React from "react";
import { useCurrentUserContext } from "../models/CurrentUserProvider";
import { User } from "../models/User";
import { LoginScreen } from "./LoginScreen";

/**
 * Force user to have logged in.
 * If logged in, show the component, giving it user.
 * If not logged in, show login page.
 */
export function provideLoggedInUser(
  Component: React.FC<{ user: User }>
): React.FC {
  return () => {
    const user = useCurrentUserContext();

    if (!user) {
      return <LoginScreen />;
    }

    return <Component user={user} />;
  };
}
