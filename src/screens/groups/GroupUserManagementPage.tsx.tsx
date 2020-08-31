import firebase from "firebase/app";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, Badge, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PrivilegesDialog } from "../../groups/composites/PrivilegesDialog";
import { GroupUserForm } from "../../groups/stables/GroupUserForm";
import { sleep } from "../../misc/misc";
import { useCurrentUserContext } from "../../models/CurrentUserProvider";
import { Group, groupPath } from "../../models/Group";
import {
  createGroupUser,
  deleteGroupUser,
  GroupUser,
  PrivilegeFlags,
  privilegeToLabel,
  saveGroupUser,
  updatePrivileges,
  useGroupUsers,
} from "../../models/GroupUser";
import { createUser, findUserById, User } from "../../models/User";
import { Details } from "../../share/atoms/Details";
import { Button } from "../../share/atoms/FormBaseUis";
import { BasicLayout } from "../../share/composites/BasicLayout";
import {
  OkCancelCallback,
  OkCancelDialog,
} from "../../share/stables/OkCancelDialog";
import { OkDialog } from "../../share/stables/OkDialog";
import { ErrorScreen } from "../ErrorScreen";
import { LoadingScreen } from "../LoadingScreen";
import { LoginScreen } from "../LoginScreen";
import { provideGroupPage, useGroupPageContext } from "./GroupPageContext";

const fs = firebase.firestore();

export const GroupUserManagementPage: React.FC = provideGroupPage(() => {
  const group = useGroupPageContext();
  const user = useCurrentUserContext();
  const [gUsers, usersReady, usersError] = useGroupUsers(fs, group);

  const isAdmin = useMemo(() => {
    if (!user) {
      return false;
    }

    const loggedInGUser = gUsers.find((v) => v.user.id === user.id);
    return loggedInGUser?.privileges.includes("userManagement") ?? false;
  }, [user, gUsers]);

  if (!usersReady) {
    return <LoadingScreen />;
  }

  if (usersError) {
    return <ErrorScreen error={usersError} />;
  }

  if (!user) {
    return <LoginScreen />;
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
    <Details summary="[Admin] Add user">
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
    </Details>
  );
};

const GroupUserListSection: React.FC<{ gUsers: GroupUser[]; user: User }> = ({
  gUsers,
  user,
}) => {
  const [saving, setSaving] = useState(false);
  const [saveSucceeded, setSaveSucceeded] = useState(false);
  const [managingPrivileges, setManagingPrivileges] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteOwnOpen, setDeleteOwnOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedGUsers: GroupUser[] = useMemo(() => {
    return gUsers.filter((v) => selectedIds.includes(v.id));
  }, [gUsers, selectedIds]);

  const onManagePrivilegesClick = useCallback(() => {
    setManagingPrivileges(true);
  }, []);

  const onDeleteClick = useCallback(async () => {
    if (selectedGUsers.some((v) => v.user.id === user.id)) {
      setDeleteOwnOpen(true);
      return;
    }

    setDeleteConfirmOpen(true);
  }, [selectedGUsers, user]);

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

  const onDeleteOwnClose = useCallback(() => {
    setDeleteOwnOpen(false);
  }, []);

  const onDeleteClose: OkCancelCallback = useCallback(
    async (result) => {
      if (result) {
        setSaving(true);
        await Promise.all(selectedIds.map((v) => deleteGroupUser(fs, v)));
        setSaving(false);
      }

      setDeleteConfirmOpen(false);
    },
    [selectedIds]
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
        <Button disabled={selectedIds.length < 1} onClick={onDeleteClick}>
          Delete
        </Button>
      </p>
      {saveSucceeded && (
        <Alert
          dismissible
          onClose={onCloseSaveSucceedMessageClick}
          variant="success"
        >
          Saved.
        </Alert>
      )}
      {saving ? (
        <Alert variant="primary">Saving...</Alert>
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
      <OkDialog isOpen={deleteOwnOpen} onOk={onDeleteOwnClose}>
        <p>You cannot delete your own access.</p>
      </OkDialog>
      <OkCancelDialog isOpen={deleteConfirmOpen} onOk={onDeleteClose}>
        <>
          <p>
            Are you sure you want to delete access from the following user(s)?
          </p>
          <ul>
            {selectedGUsers.map((gUser) => (
              <li key={gUser.id}>{gUser.user.name}</li>
            ))}
          </ul>
        </>
      </OkCancelDialog>
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
      <Form.Check
        checked={selected}
        id={gUser.id}
        inline
        label={gUser.user.name}
        onChange={onCheckboxChange}
      />
      {isCurrentUser && <Badge variant="info">You</Badge>}
      <br />
      <small className="text-muted">
        {"Privileges: "}
        {gUser.privileges
          .map((privilege) => privilegeToLabel(privilege))
          .join(", ")}
      </small>
    </li>
  );
};
