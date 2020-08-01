import firebase from "firebase/app";
import React from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { groupPath } from "../../models/Group";
import { privilegeToLabel, useGroupUsers } from "../../models/GroupUser";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";

const fs = firebase.firestore();

export const GroupUserManagementPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();
  const [users, usersReady, usersError] = useGroupUsers(fs, group);

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
                .map((privilege) => privilegeToLabel(privilege))
                .join(", ")}
            </small>
          </li>
        ))}
      </ul>
    </BasicLayout>
  );
});
