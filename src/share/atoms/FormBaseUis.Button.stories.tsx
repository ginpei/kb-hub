import { action } from "@storybook/addon-actions";
import React from "react";
import { Button } from "./FormBaseUis";

export default {
  title: "FormBaseUis/Button",
  component: Button,
};

export const Basic: React.FC = () => (
  <Button onClick={action("clicked")}>Click me!</Button>
);
