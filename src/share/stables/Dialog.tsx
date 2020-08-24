import React, { useMemo } from "react";
import ReactModal from "react-modal";
import styles from "./Dialog.module.scss";
import { Button } from "../atoms/FormBaseUis";
import { jcn, HtmlProps } from "../../misc/misc";

export type DialogProps = ReactModal.Props & {
  buttons?: DialogButtonDescription[];
  title?: string;
};

export interface DialogButtonDescription {
  callback: () => void;
  label: string;
}

export const Dialog: React.FC<DialogProps> = ({
  buttons,
  children,
  title,
  ...props
}) => {
  const modalProps: React.PropsWithChildren<ReactModal.Props> = useMemo(() => {
    return {
      appElement: document.querySelector("#root") || undefined,
      className: styles.root,
      closeTimeoutMS: 150, // var(--animation-duration-closing)
      contentLabel: title,
      overlayClassName: styles.overlay,
      ...props,
    };
  }, [title, props]);

  return (
    <ReactModal {...modalProps}>
      <header className={styles.header}>{title}</header>
      <div className={styles.main}>
        {children}
        {buttons && (
          <DialogButtonFooter>
            {buttons.map(({ label, callback }) => (
              <DialogButton onClick={callback} key={label}>
                {label}
              </DialogButton>
            ))}
          </DialogButtonFooter>
        )}
      </div>
    </ReactModal>
  );
};

export const DialogButtonFooter: React.FC<HtmlProps<"div">> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={jcn(styles.DialogButtonFooter, "alert-secondary", className)}
      {...props}
    />
  );
};

export const DialogButton: typeof Button = ({ className, ...props }) => {
  return <Button className={jcn(className, styles.DialogButton)} {...props} />;
};
