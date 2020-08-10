import React, { useCallback } from "react";
import { Button, Input } from "../../share/atoms/FormBaseUis";
import { Group } from "../../models/Group";

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

  const onTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.currentTarget;
      onChange({ [name]: value });
    },
    [onChange]
  );

  return (
    <form className="GroupForm" onSubmit={onFormSubmit}>
      <p>
        <label>
          Name:
          <Input
            disabled={disabled}
            name="name"
            onChange={onTextChange}
            type="text"
            value={group.name}
          />
        </label>
      </p>
      <p>
        <Button disabled={disabled}>{group.id ? "Update" : "Create"}</Button>
      </p>
    </form>
  );
};
