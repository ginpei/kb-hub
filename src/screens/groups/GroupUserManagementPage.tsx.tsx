import firebase from "firebase/app";
import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../atoms/FormBaseUis";
import { BasicLayout } from "../../composites/BasicLayout";
import { useCurrentUserContext } from "../../models/CurrentUserProvider";
import { Group, groupPath } from "../../models/Group";
import {
  createGroupUser,
  privilegeToLabel,
  saveGroupUser,
  useGroupUsers,
} from "../../models/GroupUser";
import { createUser, findUserById } from "../../models/User";
import { Dialog } from "../../stables/Dialog";
import { GroupUserForm } from "../../stables/GroupUserForm";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";

const fs = firebase.firestore();

export const GroupUserManagementPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();
  const user = useCurrentUserContext();
  const [gUsers, usersReady, usersError] = useGroupUsers(fs, group);
  const [open, setOpen] = useState(false);

  const isAdmin = useMemo(() => {
    const loggedInGUser = gUsers.find((v) => v.user.id === user.id);
    return loggedInGUser?.privileges.includes("userManagement") ?? false;
  }, [user, gUsers]);

  const onClick = useCallback(() => {
    setOpen(true);
  }, []);

  if (!usersReady) {
    return <LoadingScreen />;
  }

  if (usersError) {
    return <ErrorScreen error={usersError} />;
  }

  return (
    <BasicLayout title={`Manage users - ${group.name}`}>
      <p>
        <Button onClick={onClick}>Dialog</Button>
      </p>
      <h1>{group.name} - Manage users</h1>
      <p>
        <Link to={groupPath("view", group)}>Back</Link>
      </p>
      {isAdmin && <NewGroupUserSection group={group} />}
      <ul>
        {gUsers.map((gUser) => (
          <li key={gUser.id}>
            {gUser.user.name}
            <br />
            <small style={{ color: "var(--color-moderate-fg)" }}>
              {"Privileges: "}
              {gUser.privileges
                .map((privilege) => privilegeToLabel(privilege))
                .join(", ")}
            </small>
          </li>
        ))}
      </ul>
      <Dialog
        appElement={document.body}
        title="Hi"
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        shouldCloseOnOverlayClick={true}
      >
        <p>Hello World!</p>
      </Dialog>
    </BasicLayout>
  );
});

const NewGroupUserSection: React.FC<{ group: Group }> = ({ group }) => {
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

  return (
    <details>
      <summary>[Admin] Add user</summary>
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
  );
};
