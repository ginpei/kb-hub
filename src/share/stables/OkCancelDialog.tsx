import React, { useCallback, useMemo } from "react";
import { Dialog, DialogButtonDescription } from "./Dialog";

export type OkCancelCallback = (result: boolean | null) => void;

export const OkCancelDialog: React.FC<{
  isOpen: boolean;
  onOk: OkCancelCallback;
  title?: string;
}> = ({ children, isOpen, onOk, title }) => {
  const buttons = useMemo<DialogButtonDescription[]>(
    () => [
      {
        callback: () => {
          onOk(false);
        },
        label: "Cancel",
      },
      {
        callback: () => {
          onOk(true);
        },
        label: "OK",
      },
    ],
    [onOk]
  );

  const onRequestClose = useCallback(() => {
    onOk(null);
  }, [onOk]);

  return (
    <Dialog
      buttons={buttons}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title={title}
    >
      {children}
    </Dialog>
  );
};
