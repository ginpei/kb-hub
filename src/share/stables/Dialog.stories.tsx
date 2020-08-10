import { action } from "@storybook/addon-actions";
import React, { useCallback, useState } from "react";
import { Button } from "../atoms/FormBaseUis";
import { Dialog, DialogButton, DialogButtonFooter } from "./Dialog";

export default {
  title: "Dialog",
  component: Button,
};

export const Basic: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="ui-container">
        <p>
          <Button onClick={() => setOpen(true)}>Open</Button>
        </p>
        <p>
          Using{" "}
          <a href="http://reactcommunity.org/react-modal/" target="_blank">
            react-modal 🚀
          </a>
        </p>
      </div>
      <Dialog isOpen={open} onRequestClose={() => setOpen(false)}>
        <p style={{ textAlign: "center" }}>Hello World!</p>
      </Dialog>
    </>
  );
};

export const TitleAndButtons: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="ui-container">
        <p>
          <Button onClick={() => setOpen(true)}>Open</Button>
        </p>
      </div>
      <Dialog
        buttons={[
          {
            callback: () => {
              action(`# Cancel`)();
              setOpen(false);
            },
            label: "Cancel",
          },
          {
            callback: () => {
              action(`# OK`)();
              setOpen(false);
            },
            label: "OK",
          },
        ]}
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        title="Hello World!"
      >
        <p>You are going to do something nice in this world.</p>
        <p>Are you sure it's OK?</p>
      </Dialog>
    </>
  );
};

export const CustomFooter: React.FC = () => {
  const [open, setOpen] = useState(false);

  const onOkClick = useCallback(() => {
    action("Make decision")();
    setOpen(false);
  }, []);

  return (
    <>
      <div className="ui-container">
        <p>
          <Button onClick={() => setOpen(true)}>Open</Button>
        </p>
      </div>
      <Dialog
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        shouldCloseOnOverlayClick={false}
        title="Important decision"
      >
        <p>You are going to change the whole world by this decision.</p>
        <p>Please make sure you truly understand what is going on.</p>
        <DialogButtonFooter style={{ justifyContent: "space-between" }}>
          <span>
            ⚠️
            <em style={{ color: "tomato" }}>You cannot revert this action.</em>
          </span>
          <DialogButton onClick={onOkClick}>Make decision</DialogButton>
        </DialogButtonFooter>
      </Dialog>
    </>
  );
};
