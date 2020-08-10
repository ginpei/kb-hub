import firebase from "firebase/app";
import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PrivilegesDialog } from "../../groups/composites/PrivilegesDialog";
import { GroupUserForm } from "../../groups/stables/GroupUserForm";
import { useCurrentUserContext } from "../../models/CurrentUserProvider";
import { Group, groupPath } from "../../models/Group";
import {
  createGroupUser,
  GroupUser,
  PrivilegeFlags,
  privilegeToLabel,
  saveGroupUser,
  useGroupUsers,
  updatePrivileges,
} from "../../models/GroupUser";
import { createUser, findUserById, User } from "../../models/User";
import { Button } from "../../share/atoms/FormBaseUis";
import { BasicLayout } from "../../share/composites/BasicLayout";
import { Checkbox } from "../../share/stables/FormUis";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";
import { sleep } from "../../misc/misc";
import { SuccessMessage, InfoMessage } from "../../share/atoms/Message";

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
  const [saving, setSaving] = useState(false);
  const [saveSucceeded, setSaveSucceeded] = useState(false);
  const [managingPrivileges, setManagingPrivileges] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedGUsers, setSelectedGUsers] = useState<GroupUser[]>([]);

  const onManagePrivilegesClick = useCallback(() => {
    setSelectedGUsers(gUsers.filter((v) => selectedIds.includes(v.id)));
    setManagingPrivileges(true);
  }, [gUsers, selectedIds]);

  const onCloseSaveSucceedMessageClick = useCallback(() => {
    setSaveSucceeded(false);
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

  const onDialogClose = useCallback(
    async (pFlags: PrivilegeFlags[] | null) => {
      setManagingPrivileges(false);

      if (pFlags) {
        const newGUsers = selectedGUsers.map((gUser) =>
          updatePrivileges(gUser, pFlags)
        );
        setSaving(true);
        setSaveSucceeded(false);
        try {
          await Promise.all<GroupUser | void>([
            ...newGUsers.map((v) => saveGroupUser(fs, v)),
            sleep(1000),
          ]);
          setSaveSucceeded(true);
        } catch (error) {
          // TODO create shared error handler
          console.error(error);
        } finally {
          setSaving(false);
        }
      }
    },
    [selectedGUsers]
  );

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
      {saveSucceeded && (
        <SuccessMessage>
          {/* TODO prepare .btn-link */}
          <span
            className="btn-link"
            onClick={onCloseSaveSucceedMessageClick}
            style={{ cursor: "pointer", float: "right" }}
          >
            ×
          </span>
          Saved.
        </SuccessMessage>
      )}
      {saving ? (
        <InfoMessage>Saving...</InfoMessage>
      ) : (
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
      )}
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
