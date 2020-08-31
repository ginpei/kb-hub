import React, { useCallback, useMemo } from "react";
import { Dialog, DialogButtonDescription } from "./Dialog";

export type OkCallback = () => void;

export const OkDialog: React.FC<{
  isOpen: boolean;
  onOk: OkCallback;
  title?: string;
}> = ({ children, isOpen, onOk, title }) => {
  const buttons = useMemo<DialogButtonDescription[]>(
    () => [
      {
        callback: () => {
          onOk();
        },
        label: "OK",
      },
    ],
    [onOk]
  );

  const onRequestClose = useCallback(() => {
    onOk();
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
