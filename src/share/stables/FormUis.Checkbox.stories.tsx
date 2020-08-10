import { action } from "@storybook/addon-actions";
import React from "react";
import { Checkbox } from "./FormUis";

export default {
  title: "FormUIs/Checkbox",
  component: Checkbox,
};

export const Basic: React.FC = () => {
  return (
    <p>
      <Checkbox label="One" onChange={action("One changed")} />
      <Checkbox label="Two" onChange={action("Two changed")} />
      <Checkbox label="Three" onChange={action("Three changed")} />
    </p>
  );
};
