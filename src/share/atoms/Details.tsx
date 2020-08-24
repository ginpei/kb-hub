import React from "react";
import { HtmlComponent, jcn } from "../../misc/misc";
import styles from "./Details.module.scss";

export const Details: HtmlComponent<
  "details",
  {
    summary: string;
  }
> = ({ children, className, summary, ...props }) => {
  return (
    <details {...props} className={jcn(styles.root, className)}>
      <summary className={styles.summary}>{summary}</summary>
      {children}
    </details>
  );
};
