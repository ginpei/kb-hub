import React, { useCallback, useMemo } from "react";
import { Label } from "../atoms/FormBaseUis";
import styles from "./TriCheckbox.module.scss";

export type OnTriCheckboxChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  checked: boolean | null
) => void;

export const TriCheckbox: React.FC<{
  checked: boolean | null;
  label?: string;
  name?: string;
  onChange?: OnTriCheckboxChange;
}> = ({ checked, label = "", name, onChange }) => {
  const symbol = useMemo(() => {
    if (checked === null) {
      return "―";
    }

    return checked ? "✔" : "";
  }, [checked]);

  const onCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event, checked === false);
      }
    },
    [onChange, checked]
  );

  return (
    <Label className={styles.root}>
      <span className={styles.outer} tabIndex={0}>
        <input
          className={styles.checkbox}
          name={name}
          type="checkbox"
          checked={!!checked}
          onChange={onCheckboxChange}
        />
        <span className={styles.text}>{symbol}</span>
      </span>
      {label}
    </Label>
  );
};
