import React, { useCallback } from "react";
import { Col, Form } from "react-bootstrap";
import { GroupUser } from "../../models/GroupUser";
import { Button } from "../../share/atoms/FormBaseUis";

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
    <Form onSubmit={onFormSubmit}>
      <Form.Group controlId="userId">
        <Form.Label>Search user by user ID</Form.Label>
        <Form.Control
          onChange={onUserIdInputChange}
          placeholder="e.g. qOOzPw5eUVHjg6JP9jYj"
          type="search"
          value={userId}
        />
      </Form.Group>
      <Button type="submit">Search</Button>
      <Form.Group as={Form.Row}>
        <Form.Label column sm={3}>
          User name
        </Form.Label>
        <Col>
          <Form.Control readOnly value={groupUser.user.name} />
        </Col>
      </Form.Group>
      <Form.Group as={Form.Row}>
        <Form.Label column sm={3}>
          Target group name
        </Form.Label>
        <Col>
          <Form.Control readOnly value={groupUser.group.name} />
        </Col>
      </Form.Group>
      <Button
        disabled={disabled || !groupUser.user.id}
        onClick={onSaveClick}
        variant="primary"
      >
        {groupUser.id ? "Update" : "Create"}
      </Button>
    </Form>
  );
};
