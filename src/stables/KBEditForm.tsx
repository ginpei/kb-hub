import React, { useCallback } from "react";
import { Knowledge } from "../models/Knowledge";

export const KBEditForm: React.FC<{
  knowledge: Knowledge;
  onChange: (Knowledge: Partial<Knowledge>) => void;
  onSubmit: (Knowledge: Knowledge) => void;
}> = ({ knowledge, onChange, onSubmit }) => {
  const onFormSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      onSubmit(knowledge);
    },
    [knowledge, onSubmit]
  );

  const onTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.currentTarget;
      onChange({ [name]: value });
    },
    [onChange]
  );

  return (
    <form className="KBEditForm" onSubmit={onFormSubmit}>
      <p>
        <label>
          Title:
          <input
            name="title"
            onChange={onTextChange}
            type="text"
            value={knowledge.title}
          />
        </label>
      </p>
      <p>
        <label>
          Content:
          <br />
          <textarea
            name="content"
            onChange={onTextChange}
            value={knowledge.content}
          />
        </label>
      </p>
      <p>
        <button>{knowledge.id ? "Update" : "Create"}</button>
      </p>
    </form>
  );
};
