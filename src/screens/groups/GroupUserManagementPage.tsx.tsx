import firebase from "firebase/app";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { BasicLayout } from "../../composites/BasicLayout";
import { sleep } from "../../misc/misc";
import { groupPath } from "../../models/Group";
import {
  createGroupUser,
  privilegeToLabel,
  saveGroupUser,
  useGroupUsers,
} from "../../models/GroupUser";
import { createUser, findUserById } from "../../models/User";
import { GroupUserForm } from "../../stables/GroupUserForm";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";

const fs = firebase.firestore();

export const GroupUserManagementPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();
  const [users, usersReady, usersError] = useGroupUsers(fs, group);
  const [groupUser, setGroupUser] = useState(createGroupUser({ group }));
  const [savingGroupUser, setSavingGroupUser] = useState(false);
  const [groupUserError, setGroupUserError] = useState<Error | null>(null);
  const [userId, setUserId] = useState(groupUser.user.id);

  const onUserIdChange = useCallback((newUserId) => {
    setUserId(newUserId);
  }, []);

  const onFindUserClick = useCallback(async () => {
    const user = (await findUserById(fs, userId)) ?? createUser();
    setGroupUser({
      ...groupUser,
      user,
    });
  }, [userId, groupUser]);

  const onGroupUserSubmit = useCallback(async () => {
    setGroupUserError(null);
    setSavingGroupUser(true);
    try {
      await saveGroupUser(fs, { ...groupUser, privileges: ["login"] });
      setUserId("");
      setGroupUser(createGroupUser({ group }));
    } catch (error) {
      setGroupUserError(error);
    } finally {
      setSavingGroupUser(false);
    }
  }, [groupUser, group]);

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
      <details open>
        <summary>Add user</summary>
        {groupUserError && (
          <p style={{ color: "tomato" }}>{groupUserError.message}</p>
        )}
        <GroupUserForm
          disabled={savingGroupUser}
          groupUser={groupUser}
          onFindUserClick={onFindUserClick}
          onSubmit={onGroupUserSubmit}
          onUserIdChange={onUserIdChange}
          userId={userId}
        />
      </details>
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
