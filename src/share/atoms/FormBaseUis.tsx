import React, { useCallback } from "react";
import * as bs from "react-bootstrap";
import { HtmlComponent, jcn } from "../../misc/misc";
import styles from "./FormBaseUis.module.scss";

interface CommonFormInterface {
  ambiguous?: boolean;
}

// for this, `bs.Button` type may work in the future
// https://stackoverflow.com/questions/63533844
export const Button: React.FC<bs.ButtonProps> = ({
  variant = "outline-secondary",
  ...props
}) => {
  return <bs.Button variant={variant} {...props} />;
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

export const Label: HtmlComponent<"label"> = ({ className, ...props }) => (
  <label className={jcn(styles.Label, className)} {...props} />
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
      className={jcn(styles.Textarea, className)}
      data-ambiguous={ambiguous}
      onFocus={onFocus}
      value={value || ""}
      {...props}
    />
  );
};
