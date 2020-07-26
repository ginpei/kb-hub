import firebase from "firebase/app";
import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { useCurrentUserContext } from "../../models/CurrentUserProvider";
import { groupPath } from "../../models/Group";
import { useAllGroupUsers, privilegeToString } from "../../models/GroupUser";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";

const fs = firebase.firestore();

export const GroupUserManagementPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();
  const user = useCurrentUserContext();
  const [users, usersReady, usersError] = useAllGroupUsers(fs, user, group);

  if (!usersReady) {
    return <LoadingScreen />;
  }

  if (usersError) {
    return <ErrorScreen error={usersError} />;
  }

  return (
    <BasicLayout title={`Manage users - ${group.name}`}>
      <h1>{group.name} - Manage users</h1>
      <p>
        <Link to={groupPath("view", group)}>Back</Link>
      </p>
      <ul>
        {users.map((gUser) => (
          <li key={gUser.id}>
            {gUser.user.name}
            <br />
            <small style={{ color: "var(--color-moderate)" }}>
              {"Privileges: "}
              {gUser.privileges
                .map((privilege) => privilegeToString(privilege))
                .join(", ")}
            </small>
          </li>
        ))}
      </ul>
    </BasicLayout>
  );
});
