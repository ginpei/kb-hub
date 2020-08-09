import { action } from "@storybook/addon-actions";
import React from "react";
import { Radio } from "./FormUis";

export default {
  title: "FormUIs/Radio",
  component: Radio,
};

export const Basic: React.FC = () => {
  return (
    <p>
      <Radio name="number" label="One" onChange={action("One changed")} />
      <Radio name="number" label="Two" onChange={action("Two changed")} />
      <Radio name="number" label="Three" onChange={action("Three changed")} />
    </p>
  );
};
