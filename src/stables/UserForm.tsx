import React, { useCallback } from "react";
import { User } from "../models/User";

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
          <input
            disabled={disabled}
            name="name"
            onChange={onTextChange}
            type="text"
            value={user.name}
          />
        </label>
      </p>
      <p>
        <button disabled={disabled}>Save</button>
      </p>
    </form>
  );
};
