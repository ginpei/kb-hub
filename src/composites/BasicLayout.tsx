import React, { useEffect } from "react";
import styles from "./BasicLayout.module.scss";
import { jcn } from "../misc/misc";

export const BasicLayout: React.FC<{
  title?: string;
}> = ({ children, title }) => {
  useEffect(() => {
    const baseTitle = "Knowledge Base Hub";
    const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
    document.title = fullTitle;
  }, [title]);

  return (
    <div className="BasicLayout">
      <div className={styles.header}>
        <div className="headerInner ui-container">Knowledge Base Hub</div>
      </div>
      <div className={jcn(styles.main, "ui-container")}>{children}</div>
      <div className={styles.footer}>
        <div className="footerInner ui-container">Footer</div>
      </div>
    </div>
  );
};
