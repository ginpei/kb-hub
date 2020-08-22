import React, { useCallback } from "react";
import { Form } from "react-bootstrap";
import { Group } from "../../models/Group";
import { Button } from "../../share/atoms/FormBaseUis";

export const GroupForm: React.FC<{
  disabled: boolean;
  group: Group;
  onChange: (Group: Partial<Group>) => void;
  onSubmit: (Group: Group) => void;
}> = ({ disabled, group, onChange, onSubmit }) => {
  const onFormSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      onSubmit(group);
    },
    [group, onSubmit]
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
          placeholder="e.g. Western Example Co. Ltd."
          required
          type="text"
          value={group.name}
        />
      </Form.Group>
      <Button disabled={disabled} variant="primary">
        {group.id ? "Update" : "Create"}
      </Button>
    </Form>
  );
};
