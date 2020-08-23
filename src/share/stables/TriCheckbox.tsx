import React, { useEffect, useRef } from "react";
import * as bs from "react-bootstrap";
import { BootstrapComponentProps, Overwrite } from "../../types/util";

export type TriState = boolean | null;

export type TriCheckboxProps = Overwrite<
  BootstrapComponentProps<"input", bs.FormCheckProps>,
  {
    checked: TriState;
  }
>;

export const TriCheckbox: React.FC<TriCheckboxProps> = ({
  checked,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.indeterminate = checked === null;
  }, [checked]);

  return <bs.Form.Check checked={!!checked} ref={ref} {...props} />;
};
