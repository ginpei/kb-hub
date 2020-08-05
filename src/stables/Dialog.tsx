import React, { useMemo } from "react";
import ReactModal from "react-modal";
import styles from "./Dialog.module.scss";

export type DialogProps = ReactModal.Props & {
  title?: string;
};

export const Dialog: React.FC<DialogProps> = ({
  children,
  title,
  ...props
}) => {
  const modalProps: React.PropsWithChildren<ReactModal.Props> = useMemo(() => {
    return {
      appElement: document.querySelector("#main") || undefined,
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
      <div className={styles.main}>{children}</div>
    </ReactModal>
  );
};
