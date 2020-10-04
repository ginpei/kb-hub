import firebase from "firebase/app";
import React from "react";
import { Link } from "react-router-dom";
import { useCurrentUserContext } from "../../models/CurrentUserProvider";
import { groupPath } from "../../models/Group";
import { useUserGroups } from "../../models/GroupUser";
import { BasicLayout } from "../../share/composites/BasicLayout";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { LoginScreen } from "../LoginScreen";

const fs = firebase.firestore();

export const GroupIndexPage: React.FC = () => {
  const user = useCurrentUserContext();
  const [groups, groupsReady, groupsError] = useUserGroups(fs, user);

  if (!groupsReady) {
    return <LoadingScreen />;
  }

  if (groupsError) {
    return <ErrorScreen error={groupsError} />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <BasicLayout title="Groups">
      <h1>Groups</h1>
      <p>
        <Link to={groupPath("new")}>Create a new group</Link>
      </p>
      <ul>
        {groups.length < 1 && (
          <li>
            <small>(No items)</small>
          </li>
        )}
        {groups.map((group) => (
          <li key={group.id}>
            <Link to={groupPath("view", group)}>{group.name}</Link>
          </li>
        ))}
      </ul>
    </BasicLayout>
  );
};
