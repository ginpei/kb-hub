import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { jcn } from "../../misc/misc";
import styles from "./BasicLayout.module.scss";

export type BasicLayoutProps = {
  title?: string;
};

export const BasicLayout: React.FC<BasicLayoutProps> = ({
  children,
  title,
}) => {
  useEffect(() => {
    const baseTitle = "Knowledge Base Hub";
    const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
    document.title = fullTitle;
  }, [title]);

  return (
    <div className="BasicLayout">
      <div className={styles.header}>
        <div className="headerInner container">
          <Link to="/">Knowledge Base Hub</Link>
        </div>
      </div>
      <div className={jcn(styles.main, "container")}>{children}</div>
      <div className={styles.footer}>
        <div className="footerInner container">Footer</div>
      </div>
    </div>
  );
};
