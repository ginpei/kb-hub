import React, { useCallback, useState } from "react";
import { Form } from "react-bootstrap";
import { Button } from "../atoms/FormBaseUis";
import { TriCheckbox, TriState } from "./TriCheckbox";

export default {
  title: "TriCheckbox",
  component: TriCheckbox,
};

export const Basic: React.FC = () => {
  const [c1, setC1] = useState<TriState>(true);
  const [c2, setC2] = useState<TriState>(null);
  const [c3, setC3] = useState<TriState>(false);

  const onChange1 = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setC1(event.currentTarget.checked);
    },
    []
  );

  const onChange2 = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setC2(event.currentTarget.checked);
    },
    []
  );

  const onChange3 = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setC3(event.currentTarget.checked);
    },
    []
  );

  const onResetClick = useCallback(() => {
    setC1(true);
    setC2(null);
    setC3(false);
  }, []);

  return (
    <div className="ui-container">
      <TriCheckbox checked={c1} id="c1" label="Checked" onChange={onChange1} />
      <TriCheckbox
        checked={c2}
        id="c2"
        label="Intermediate"
        onChange={onChange2}
      />
      <TriCheckbox
        checked={c3}
        id="c3"
        label="Not checked"
        onChange={onChange3}
      />
      <hr />
      {[c1, c2, c3].map((v) => String(v)).join(", ")}
      {" : "}
      <Button onClick={onResetClick}>Reset</Button>
    </div>
  );
};

export const BootstrapCheck: React.FC = () => {
  const [on, setOn] = useState(false);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const el = event.currentTarget;
    setOn(el.checked);
  }, []);

  return (
    <div className="ui-container">
      <Form.Check
        checked={on}
        id="checkbox"
        label="Checkbox"
        onChange={onChange}
      />
      {on ? "ON" : "OFF"}
    </div>
  );
};
