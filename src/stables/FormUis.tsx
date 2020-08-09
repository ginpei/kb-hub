import React from "react";
import { Input, Label } from "../atoms/FormBaseUis";
import { HtmlComponent } from "../misc/misc";
import styles from "./FormUis.module.scss";

export const Checkbox: HtmlComponent<
  "input",
  {
    label: string;
  }
> = ({ label, type, ...inputProps }) => (
  <Label className={styles.Checkbox}>
    <Input type="checkbox" {...inputProps} />
    {label}
  </Label>
);

export const Radio: HtmlComponent<
  "input",
  {
    label: string;
    name: string;
  }
> = ({ label, type, ...inputProps }) => (
  <Label className={styles.Radio} data-hoge={styles.Radio}>
    <Input type="radio" {...inputProps} />
    {label}
  </Label>
);
