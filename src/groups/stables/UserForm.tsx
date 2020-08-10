import React, { useCallback } from "react";
import { User } from "../../models/User";
import { Button, Input } from "../../share/atoms/FormBaseUis";

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

  const onTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.currentTarget;
      onChange({ [name]: value });
    },
    [onChange]
  );

  return (
    <form className="UserForm" onSubmit={onFormSubmit}>
      <p>
        <label>
          Name:
          <Input
            disabled={disabled}
            name="name"
            onChange={onTextChange}
            type="text"
            value={user.name}
          />
        </label>
      </p>
      <p>
        <Button disabled={disabled}>Save</Button>
      </p>
    </form>
  );
};
