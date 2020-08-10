import firebase from "firebase/app";
import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../share/composites/BasicLayout";
import { useCurrentUserContext } from "../../models/CurrentUserProvider";
import { groupPath } from "../../models/Group";
import { useUserGroups } from "../../models/GroupUser";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";

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

  return (
    <BasicLayout title="Groups">
      <h1>Groups</h1>
      <p>
        <Link to={groupPath("new")}>Create a new group</Link>
      </p>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link to={groupPath("view", group)}>{group.name}</Link>
          </li>
        ))}
      </ul>
    </BasicLayout>
  );
};
