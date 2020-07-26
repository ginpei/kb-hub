import React, { useCallback } from "react";
import { Button, Input, Textarea } from "../atoms/FormBaseUis";
import { Knowledge } from "../models/Knowledge";

export const KBEditForm: React.FC<{
  disabled: boolean;
  knowledge: Knowledge;
  onChange: (Knowledge: Partial<Knowledge>) => void;
  onSubmit: (Knowledge: Knowledge) => void;
}> = ({ disabled, knowledge, onChange, onSubmit }) => {
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
          <Input
            disabled={disabled}
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
          <Textarea
            disabled={disabled}
            name="content"
            onChange={onTextChange}
            value={knowledge.content}
          />
        </label>
      </p>
      <p>
        <Button disabled={disabled}>
          {knowledge.id ? "Update" : "Create"}
        </Button>
      </p>
    </form>
  );
};
