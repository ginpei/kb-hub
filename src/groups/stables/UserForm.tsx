import React, { useCallback } from "react";
import { Form } from "react-bootstrap";
import { User } from "../../models/User";
import { Button } from "../../share/atoms/FormBaseUis";

export const UserForm: React.FC<{
  disabled: boolean;
  onChange: (user: Partial<User>) => void;
  onSubmit: (user: User) => void;
  user: User;
}> = ({ disabled, onChange, onSubmit, user }) => {
  const onFormSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      onSubmit(user);
    },
    [onSubmit, user]
  );

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.currentTarget;
      onChange({ name: value });
    },
    [onChange]
  );

  return (
    <Form onSubmit={onFormSubmit}>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          disabled={disabled}
          onChange={onNameChange}
          placeholder="e.g. Alice"
          required
          type="text"
          value={user.name}
        />
      </Form.Group>
      <Button disabled={disabled} type="submit" variant="primary">
        Save
      </Button>
    </Form>
  );
};
