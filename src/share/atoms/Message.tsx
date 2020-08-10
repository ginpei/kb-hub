import React from "react";
import { HtmlComponent, jcn } from "../../misc/misc";
import styles from "./Message.module.scss";

export const SuccessMessage: HtmlComponent<"div"> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={jcn(styles.message, styles.SuccessMessage, className)}
      {...props}
    />
  );
};

export const InfoMessage: HtmlComponent<"div"> = ({ className, ...props }) => {
  return (
    <div
      className={jcn(styles.message, styles.InfoMessage, className)}
      {...props}
    />
  );
};
