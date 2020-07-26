import React, { useCallback } from "react";
import { HtmlComponent } from "../misc/misc";
import styles from "./FormUIs.module.scss";

interface CommonFormInterface {
  ambiguous?: boolean;
}

export const Button: HtmlComponent<
  "button",
  {
    kind?: "primary" | "normal";
  }
> = (props) => {
  const { className, kind, ...restProps } = props;

  return (
    <button
      {...restProps}
      className={`${styles.Button} ${className}`}
      data-kind={kind}
    />
  );
};

export const Input: HtmlComponent<"input", CommonFormInterface> = (props) => {
  const { ambiguous, className, ...restProps } = props;

  const onFocus = useCallback((v: React.ChangeEvent<HTMLInputElement>) => {
    v.currentTarget.select();
  }, []);

  return (
    <input
      {...restProps}
      className={`${styles.Input} ${className}`}
      data-ambiguous={ambiguous}
      onFocus={onFocus}
    />
  );
};

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

export const Label: HtmlComponent<"label"> = ({ className, ...props }) => (
  <label className={c([styles.Label, className])} role="label" {...props} />
);

export const Select: HtmlComponent<"select", CommonFormInterface> = ({
  ambiguous,
  children,
  className,
  value,
  ...restProps
}) => {
  return (
    <select
      {...restProps}
      className={`${styles.Select} ${className}`}
      data-ambiguous={ambiguous}
      value={value || ""}
    >
      {ambiguous && <option value=""></option>}
      {children}
    </select>
  );
};

export const Textarea: HtmlComponent<"textarea", CommonFormInterface> = ({
  ambiguous,
  className,
  value,
  ...props
}) => {
  const onFocus = useCallback((v: React.ChangeEvent<HTMLTextAreaElement>) => {
    v.currentTarget.select();
  }, []);

  return (
    <textarea
      className={c([styles.Textarea, className])}
      data-ambiguous={ambiguous}
      onFocus={onFocus}
      value={value || ""}
      {...props}
    />
  );
};

/**
 * Combine class names into one string.
 */
function c(classNames: (string | undefined | null)[]) {
  return classNames.filter((v) => v).join(" ");
}
