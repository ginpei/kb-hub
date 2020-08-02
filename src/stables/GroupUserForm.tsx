import React, { useCallback } from "react";
import { Button, Input } from "../atoms/FormBaseUis";
import { GroupUser } from "../models/GroupUser";

export const GroupUserForm: React.FC<{
  disabled: boolean;
  groupUser: GroupUser;
  onFindUserClick: (userId: string) => void;
  onSubmit: (groupUser: GroupUser) => void;
  onUserIdChange: (userId: string) => void;
  userId: string;
}> = ({
  disabled,
  onFindUserClick,
  onSubmit,
  onUserIdChange,
  groupUser,
  userId,
}) => {
  const onFormSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      onFindUserClick(userId);
    },
    [onFindUserClick, userId]
  );

  const onUserIdInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newUserId = event.currentTarget.value;
      onUserIdChange(newUserId);
    },
    [onUserIdChange]
  );

  const onSaveClick = useCallback(() => {
    onSubmit(groupUser);
  }, [onSubmit, groupUser]);

  return (
    <form className="GroupUserForm" onSubmit={onFormSubmit}>
      <p>
        <label>
          User ID:
          <Input
            disabled={disabled}
            name="name"
            onChange={onUserIdInputChange}
            type="text"
            value={userId}
          />
          <Button disabled={disabled}>Find user</Button>
        </label>
      </p>
      <p>
        <label>
          User Name:
          <Input readOnly type="text" value={groupUser.user.name} />
          {groupUser.user.id ? "✔" : "✘"}
        </label>
      </p>
      <p>
        <label>Group Name:</label>
        <Input readOnly type="text" value={groupUser.group.name} />
      </p>
      <p>
        <Button
          disabled={disabled || !groupUser.user.id}
          onClick={onSaveClick}
          type="button"
        >
          {groupUser.id ? "Update" : "Create"}
        </Button>
      </p>
    </form>
  );
};
