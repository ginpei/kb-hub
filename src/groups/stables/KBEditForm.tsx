import React, { useCallback } from "react";
import { Form } from "react-bootstrap";
import { Knowledge } from "../../models/Knowledge";
import { Button } from "../../share/atoms/FormBaseUis";

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
    <Form onSubmit={onFormSubmit}>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          disabled={disabled}
          name="title"
          onChange={onTextChange}
          type="text"
          value={knowledge.title}
        />
      </Form.Group>
      <Form.Group controlId="content">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          disabled={disabled}
          name="content"
          onChange={onTextChange}
          type="text"
          value={knowledge.content}
        />
      </Form.Group>
      <Button disabled={disabled} type="submit" variant="primary">
        {knowledge.id ? "Update" : "Create"}
      </Button>
    </Form>
  );
};
