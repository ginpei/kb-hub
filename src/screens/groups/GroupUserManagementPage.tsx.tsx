import firebase from "firebase/app";
import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../atoms/FormBaseUis";
import { BasicLayout } from "../../composites/BasicLayout";
import { PrivilegesDialog } from "../../groups/composites/PrivilegesDialog";
import { useCurrentUserContext } from "../../models/CurrentUserProvider";
import { Group, groupPath } from "../../models/Group";
import {
  createGroupUser,
  GroupUser,
  PrivilegeFlags,
  privilegeToLabel,
  saveGroupUser,
  useGroupUsers,
} from "../../models/GroupUser";
import { createUser, findUserById, User } from "../../models/User";
import { Checkbox } from "../../stables/FormUIs";
import { GroupUserForm } from "../../stables/GroupUserForm";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";

const fs = firebase.firestore();

export const GroupUserManagementPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();
  const user = useCurrentUserContext();
  const [gUsers, usersReady, usersError] = useGroupUsers(fs, group);

  const isAdmin = useMemo(() => {
    const loggedInGUser = gUsers.find((v) => v.user.id === user.id);
    return loggedInGUser?.privileges.includes("userManagement") ?? false;
  }, [user, gUsers]);

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
      {isAdmin && <NewGroupUserSection group={group} />}
      <GroupUserListSection gUsers={gUsers} user={user} />
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

const GroupUserListSection: React.FC<{ gUsers: GroupUser[]; user: User }> = ({
  gUsers,
  user,
}) => {
  const [managingPrivileges, setManagingPrivileges] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedGUsers = useMemo(
    () => gUsers.filter((v) => selectedIds.includes(v.id)),
    [gUsers, selectedIds]
  );

  const onManagePrivilegesClick = useCallback(() => {
    setManagingPrivileges(true);
  }, []);

  const onGUserCheckChange = useCallback(
    (gUser: GroupUser) => {
      const { id } = gUser;
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((v) => v !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    },
    [selectedIds]
  );

  const onDialogClose = useCallback((pFlags: PrivilegeFlags[] | null) => {
    console.log("# dialog", pFlags?.map(([v, u]) => `${v}=${u}`).join(", "));
    setManagingPrivileges(false);
  }, []);

  return (
    <section className="GroupUserListSection">
      <p>
        <Button
          disabled={selectedIds.length < 1}
          onClick={onManagePrivilegesClick}
        >
          Manage privileges...
        </Button>
        <Button disabled={selectedIds.length < 1}>Suspend</Button>
        <Button disabled={selectedIds.length < 1}>Delete</Button>
      </p>
      <ul>
        {gUsers.map((gUser) => (
          <GUserItem
            gUser={gUser}
            isCurrentUser={gUser.user.id === user.id}
            key={gUser.id}
            onCheckChange={onGUserCheckChange}
            selected={selectedIds.includes(gUser.id)}
          />
        ))}
      </ul>
      <PrivilegesDialog
        gUsers={selectedGUsers}
        isOpen={managingPrivileges}
        onOk={onDialogClose}
      />
    </section>
  );
};

const GUserItem: React.FC<{
  gUser: GroupUser;
  isCurrentUser: boolean;
  onCheckChange: (gUser: GroupUser) => void;
  selected: boolean;
}> = ({ isCurrentUser, gUser, onCheckChange, selected }) => {
  const onCheckboxChange = useCallback(() => {
    onCheckChange(gUser);
  }, [onCheckChange, gUser]);

  return (
    <li>
      <Checkbox
        checked={selected}
        label={gUser.user.name}
        onChange={onCheckboxChange}
      />
      {isCurrentUser && (
        <>
          {" "}
          <small style={{ color: "var(--color-moderate-fg)" }}>(You)</small>
        </>
      )}
      <br />
      <small style={{ color: "var(--color-moderate-fg)" }}>
        {"Privileges: "}
        {gUser.privileges
          .map((privilege) => privilegeToLabel(privilege))
          .join(", ")}
      </small>
    </li>
  );
};
